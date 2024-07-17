<?php

namespace App\Http\Controllers\accounts;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\accounts\Account;
use Illuminate\Support\Facades\DB;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Tymon\JWTAuth\Exceptions\JWTException;
use Carbon\Carbon;
use Google_Client;
use Throwable;
use Illuminate\Support\Facades\Mail;
use App\Mail\MarkDownMail;

class AccountController extends Controller
{
    public function get_account_list()
    {
        $customer_list = Account::where('role_id', 5)->where('status', 1)->orderBy('deactivated', 'asc')->get();
        foreach ($customer_list as $customer) {
            $customer->role = DB::table('role')->where('id', $customer->role_id)->first();
            unset($customer->role_id);
            $customer->order_count = (int) DB::table('orders')->where('account_id', $customer->id)->count();
        }
        $customer_list->map(function ($account) {
            //modify account imageUrl
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id .  "/" . $account->imageUrl;
            }
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            return $account;
        });
        $staff_list = Account::whereNot('role_id', 5)->whereNot('role_id', 1)->orderBy('deactivated', 'asc')->get();
        foreach ($staff_list as $staff) {
            if ($staff->role_id == 2) {
                $staff->order_count = (int) DB::table('orders')->where('saleStaff_id', $staff->id)->count();
            } else if ($staff->role_id == 3) {
                $staff->order_count = (int) DB::table('orders')->where('designStaff_id', $staff->id)->count();
            } else if ($staff->role_id == 4) {
                $staff->order_count = (int) DB::table('orders')->where('productionStaff_id', $staff->id)->count();
            }
            $staff->role = DB::table('role')->where('id', $staff->role_id)->first();
            unset($staff->role_id);
        }
        $staff_list->map(function ($account) {
            //modify account imageUrl
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
            }
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            return $account;
        });
        return response()->json([
            'customer_list' => $customer_list,
            'staff_list' => $staff_list
        ]);
    }
    public function get_account_detail(Request $request)
    {
        //input
        $input = json_decode($request->input('account_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
        //find account
        $account = Account::where('id', $input)->first();
        if (!isset($account)) {
            return response()->json([
                'error' => 'Account not found'
            ], 403);
        }
        $account->role = DB::table('role')->where('id', $account->role_id)->first();
        unset($account->role_id);
        $account->order_count = (int) DB::table('orders')->where('account_id', $account->id)->count();
        //modify account imageUrl
        $OGurl = env('ORIGIN_URL');
        $url = env('ACCOUNT_URL');
        //https://fast-scorpion-strictly.ngrok-free.app/image/account/{$account->id}/{$account->imageUrl}
        if (!$account->google_id) {
            $account->imageUrl = $OGurl . $url . $account->id .  "/" . $account->imageUrl;
        }
        $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
        $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');

        //append order history to account
        $order_history = DB::table('orders')->where('account_id', $account->id)->get();
        $order_history->map(function ($order) {
            //modify order type and order status
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            unset($order->order_status_id);
            unset($order->order_type_id);
            $order->created = Carbon::parse($order->created)->format('H:i:s d/m/Y');
            if ($order->delivery_date != null) {
                $order->delivery_date = Carbon::parse($order->delivery_date)->format('H:i:s d/m/Y');
            }
            if ($order->guarantee_expired_date != null) {
                $order->guarantee_expired_date = Carbon::parse($order->guarantee_expired_date)->format('H:i:s d/m/Y');
            }
            return $order;
        });
        $account->order_history = $order_history;

        return response()->json([
            'account_detail' => $account
        ]);
    }
    public function update_self(Request $request)
    {
        //input
        $input = json_decode($request->input('new_account'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
        //check token
        $authorizationHeader = $request->header('Authorization');
        $token = null;

        if ($authorizationHeader && strpos($authorizationHeader, 'Bearer ') === 0) {
            $token = substr($authorizationHeader, 7); // Extract the token part after 'Bearer '
            try {
                $decodedToken = JWTAuth::decode(new \Tymon\JWTAuth\Token($token));
            } catch (JWTException $e) {
                try {
                    $decodedToken = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Invalid Token'], 401);
                }
            }
        }
        try {
            $id = $decodedToken['id'];
        } catch (Throwable $e) {
            $id = $decodedToken->id;
        }


        //find account
        $account = Account::find($id);
        if ($account->email == $input['email'] && $account->phone == $input['phone']) {
            // Both email and phone match, skip uniqueness validation
            $rules = [
                'email' => 'required|string|email|max:255',
                'phone' => 'nullable|string|max:20',
            ];
        } else {
            // Check if only email matches
            if ($account->email == $input['email']) {
                $rules = [
                    'email' => 'required|string|email|max:255',
                    'phone' => 'nullable|string|max:20|unique:account,phone',
                ];
            }
            // Check if only phone matches
            else if ($account->phone == $input['phone']) {
                $rules = [
                    'email' => 'required|string|email|max:255|unique:account,email',
                    'phone' => 'nullable|string|max:20',
                ];
            }
            // Neither email nor phone match, apply full uniqueness validation
            else {
                $rules = [
                    'email' => 'required|string|email|max:255|unique:account,email',
                    'phone' => 'nullable|string|max:20|unique:account,phone',
                ];
            }
        }
        $validatedData = validator($input, $rules);
        if ($validatedData->fails()) {
            $errors = $validatedData->errors();
            $errorString = '';

            foreach ($errors->all() as $message) {
                $errorString .= $message . "\n";
            }

            return response()->json(['error' => $errorString], 400);
        }
        DB::beginTransaction();
        try {
            $updateData = [];
            if (!empty($input['username'])) {
                $updateData['username'] = $input['username'];
            }
            if (!empty($input['password'])) {
                $updateData['password'] = Hash::make($input['password']);
            }
            if (!empty($input['fullname'])) {
                $updateData['fullname'] = $input['fullname'];
            }
            if (!empty($input['email'])) {
                $updateData['email'] = $input['email'];
            }
            if (!empty($input['phone'])) {
                $updateData['phone'] = $input['phone'];
            }
            if (!empty($input['dob'])) {
                $updateData['dob'] = Carbon::parse($input['dob'])->format('Y-m-d');
            }
            if (!empty($input['address'])) {
                $updateData['address'] = $input['address'];
            }
            if (isset($input['imageUrl']) && isset($input['imageUrl']) != null) {
                //update account image
                $accountId = (int) $account->id;
                $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['imageUrl']));
                $destinationPath = public_path('image/Account/' . $accountId);
                //check destination path if not create one
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                $fileName = Carbon::now()->timestamp . '_' . $accountId . '.jpg';
                //delete all files in the account directory
                File::cleanDirectory($destinationPath);
                //input filedata through destination path with fileName 
                file_put_contents($destinationPath . '/' . $fileName, $fileData);

                $account->imageUrl = $fileName;
            }

            //update the account
            $account->update($updateData);
            $payload = [
                'id' => $account->id, // Subject of the token
                'exp' => Carbon::now()->addYears(100)->timestamp, // Expiration time
                'email' => $account->email,
                'fullname' => $account->fullname,
                'role_id' => $account->role_id,
                'imageUrl' => $account->imageUrl,
                'phone' => $account->phone,
                'address' => $account->address
                // Thêm các claims khác nếu cần
            ];

            $jwt = JWT::encode($payload, env('JWT_SECRET'), 'HS256');

            DB::commit();
            return response()->json([
                'token' => $jwt,
                'success' => "Update successfully",
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
    }
    // public function get_image(Request $request)
    // {
    //     $fileData = file_get_contents('php://input');
    //     $base64Data = base64_encode($fileData);
    //     return response()->json([
    //         $base64Data
    //     ]);
    // }

    // public function decode(Request $request)
    // {
    //     $input = $request->imageUrl;
    //     if (!isset($input) || $input == null) {
    //         return response()->json([
    //             'error' => 'No input received'
    //         ], 403);
    //     }
    //     $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input));
    //     $destinationPath = public_path('image/');
    //     if (!file_exists($destinationPath)) {
    //         mkdir($destinationPath, 0755, true);
    //     }
    //     $fileName = 'cc.jpg';
    //     file_put_contents($destinationPath . '/' . $fileName, $fileData);
    //     return response()->json([
    //         'success'
    //     ]);
    // }

    public function set_deactivate(Request $request)
    {
        //input
        $input = json_decode($request->input('deactivate'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
        DB::beginTransaction();
        try {
            $tf = false;
            //check input deactivate
            if ($input['deactivate']) {
                DB::table('account')->where('id', $input['account_id'])->update([
                    'deactivated' => true,
                    'deactivated_date' => Carbon::now()->format('Y-m-d H:i:s')
                ]);
                $tf = true;
            } else if ($input['deactivate'] == false) {
                DB::table('account')->where('id', $input['account_id'])->update([
                    'deactivated' => false,
                    'deactivated_date' => null
                ]);
                $tf = false;
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        if ($tf) {
            return response()->json([
                'success' => 'Deactivate account successfully'
            ], 200);
        } else {
            return response()->json([
                'success' => 'Activate account successfully'
            ], 200);
        }
    }
    public function sendMail($toEmail, $subject, $messageContent, $security_code)
    {
        $data = [
            'subject' => $subject,
            'messageContent' => $messageContent,
            'security_code' => $security_code
        ];
        try {
            Mail::to($toEmail)->send(new MarkDownMail($data));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to send email: ' . $e->getMessage()], 500);
        }
    }
}
