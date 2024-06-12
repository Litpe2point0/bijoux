<?php

namespace App\Http\Controllers\accounts;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\accounts\Account;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTFactory;
use Carbon\Carbon;
use Google_Client;

class AccountController extends Controller
{
    public function login(Request $request)
    {
        //input
        $input = json_decode($request->input('login_information'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }

        //check account existed (case sensitive)
        $account = DB::table('account')->whereRaw('BINARY username = ?', $input['username'])->first();
        $OGurl = env('ORIGIN_URL');
        $url = env('ACCOUNT_URL');
        
        //check account password
        if ($account && Hash::check($input['password'], $account->password)) {
            $user = Account::find($account->id);

            //set expired date
            if ($user->role_id == 5) {
                $expiration = Carbon::now()->addYears(100)->timestamp;
            } else {
                $expiration = Carbon::now()->addHours(5)->timestamp;
            }
            $customClaims = [
                'exp' => $expiration,
                'imageUrl' => $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl
            ];

            //create jwt token
            $jwt = JWTAuth::claims($customClaims)->fromUser($user);
        } else {
            return response()->json(['error' => 'Unauthorized'], 500);
        }

        //check account deactivate
        $deactivated = (bool) $account->deactivated;
        if ($deactivated) {
            return response()->json(['error' => 'Your Account Has Been Deactivated'], 401);
        }

        return response()->json([
            'access_token' => $jwt,
            'success' => 'Login Successfully',
        ]);
    }
    public function login_with_google(Request $request) //chưa test
    {
        $token = $request->input('tokenId');

        $client = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]);
        $payload = $client->verifyIdToken($token);

        if ($payload) {
            $googleId = $payload['sub'];
            $email = $payload['email'];
            $name = $payload['name'];


            // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa
            $account = Account::where('email', $email)->first();

            if (!$account) {
                // Tạo người dùng mới nếu chưa tồn tại
                $account = Account::create([
                    'fullname' => $name,
                    'email' => $email,
                    'google_id' => $googleId,
                    'role_id'  => 1,
                    'deactivated' => 0,
                    'created' => date('Y-m-d H:i:s'),
                ]);
            } else if (!$account->google_id) {
                // Cập nhật google_id cho người dùng nếu đã tồn tại email này nhưng chưa có google_id
                $account->update(['google_id' => $googleId]);
            }

            // Tạo JWT token
            $payload = [
                'iss' => "your-issuer", // Issuer of the token
                'sub' => $account->id, // Subject of the token
                'iat' => time(), // Time when JWT was issued.
                'exp' => time() + 60 * 60 // Expiration time
            ];

            $account = Account::where('email', $email)->first();
            $payload = [

                'id' => $account->id, // Subject of the token
                'exp' => Carbon::now()->addHours(2)->timestamp, // Expiration time
                'email' => $account->email,
                'fullname' => $account->fullname,
                'role_id' => $account->role_id,
                // Thêm các claims khác nếu cần
            ];

            $jwt = JWTAuth::encode($payload, env('JWT_SECRET'), 'HS256');



            return response()->json(['success' => 'User logged in', 'token' => $jwt]);
        } else {
            return response()->json(['error' => 'Invalid token'], 401);
        }
    }
    public function get_account_list()
    {
        $customer_list = Account::where('role_id', 5)->orderBy('deactivated', 'asc')->get();
        $customer_list->map(function ($account) {
            //modify account imageUrl
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id .  "/" . $account->imageUrl;
            }
            return $account;
        });
        $staff_list = Account::whereNot('role_id', 5)->whereNot('role_id', 1)->orderBy('deactivated', 'asc')->get();
        $staff_list->map(function ($account) {
            //modify account imageUrl
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
            }
            return $account;
        });
        return response()->json([
            'customer_list' => $customer_list,
            'staff_list' => $staff_list
        ]);
    }
    public function get_staff_list()
    {
        $sale_staff_list = Account::where('role_id', 2)->orderBy('deactivated', 'asc')->get();
        $sale_staff_list->map(function ($account) {
            //modify account imageUrl
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id .  "/" . $account->imageUrl;
            }
            return $account;
        });
        $design_staff_list = Account::where('role_id', 3)->orderBy('deactivated', 'asc')->get();
        $design_staff_list->map(function ($account) {
            //modify account imageUrl
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id .  "/" . $account->imageUrl;
            }
            return $account;
        });
        $production_staff_list = Account::where('role_id', 4)->orderBy('deactivated', 'asc')->get();
        $production_staff_list->map(function ($account) {
            //modify account imageUrl
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id .  "/" . $account->imageUrl;
            }
            return $account;
        });
        return response()->json([
            'sale_staff_list' => $sale_staff_list,
            'design_staff_list' => $design_staff_list,
            'production_staff_list' => $production_staff_list
        ]);
    }
    public function get_account_detail(Request $request) //chưa test
    {
        //input
        $input = json_decode($request->input('account_infomation'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        //find account
        $account = Account::where('id', $input['account_id'])->first();
        $account->role = DB::table('role')->where('id', $account->role_id)->first();
        unset($account->role_id);
        $account->order_count = (int) DB::table('orders')->where('account_id', $account->id)->count();
        //modify account imageUrl
        $OGurl = env('ORIGIN_URL');
        $url = env('ACCOUNT_URL');
        $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;

        //append order history to account
        $order_history = DB::table('orders')->where('account_id', $account->id)->get();
        $order_history->map(function ($order) {
            //modify order type and order status
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            unset($order->order_status_id);
            unset($order->order_type_id);
            $order->created = Carbon::parse($order->created)->format('H:i:s d/m/Y');
            return $order;
        });
        $account->order_history = $order_history;

        return response()->json([
            'account_infomation' => $account
        ]);
    }
    public function update(Request $request)
    {
        //input
        $input = json_decode($request->input('new_account'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }

        if (!isset($input['account_id']) || $input['account_id'] == null) {
            return response()->json(['error' => 'No Account id Received'], 400);
        }

        $id = $input['account_id'];
        //find account
        $account = Account::find($id);

        if (!$account) {
            return response()->json(['error' => 'Account not found'], 404);
        }

        DB::beginTransaction();
        try {
            $updateData = [];

            if (!empty($input['username'])) {
                $updateData['username'] = $input['username'];
            }
            if (!empty($input['password'])) {
                $updateData['password'] = $input['password'];
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
            if (!empty($input['imageUrl'])) {
                //update account image
                $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['imageUrl']));
                $destinationPath = public_path('image/Accounts/' . $id);
                //check destination path if not create one
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }

                $fileName = time() . '_' . $id . '.jpg';
                //delete all files in the account directory
                File::cleanDirectory($destinationPath);
                //input filedata through destination path with fileName 
                file_put_contents($destinationPath . '/' . $fileName, $fileData);

                $updateData['imageUrl'] = $fileName;
            }

            //update the account
            $account->update($updateData);

            DB::commit();
            return response()->json(['success' => 'Update Successfully'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function update_self(Request $request)
    {
        //input
        $input = json_decode($request->input('new_account'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        //check token
        $authorizationHeader = $request->header('Authorization');
        $token = null;

        if ($authorizationHeader && strpos($authorizationHeader, 'Bearer ') === 0) {
            $token = substr($authorizationHeader, 7); // Extract the token part after 'Bearer '
            try {
                $decodedToken = JWTAuth::decode(new \Tymon\JWTAuth\Token($token));
            } catch (\Exception $e) {
                return response()->json(['error' => 'Invalid Token'], 401);
            }
        }
        $id = (int) $decodedToken['id'];

        DB::beginTransaction();
        try {
            //find account
            $account = Account::find($id);
            $updateData = [];

            if (!empty($input['username'])) {
                $updateData['username'] = $input['username'];
            }
            if (!empty($input['password'])) {
                $updateData['password'] = $input['password'];
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
                $destinationPath = public_path('image/Accounts/' . $accountId);
                //check destination path if not create one
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                $fileName = time() . '_' . $accountId . '.jpg';
                //delete all files in the account directory
                File::cleanDirectory($destinationPath);
                //input filedata through destination path with fileName 
                file_put_contents($destinationPath . '/' . $fileName, $fileData);

                $account->imageUrl = $fileName;
            }

            //update the account
            $account->update($updateData);

            DB::commit();
            return response()->json([
                'success' => "Update Successfully",
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
    }
    public function register(Request $request)
    {
        //input
        $input = json_decode($request->input('account_information'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        DB::beginTransaction();
        try {
            //create new account
            $account = new Account();
            $account->username = $input['username'];
            $account->fullname = $input['fullname'];
            $account->email = $input['email'];
            $account->password = Hash::make($input['password']);
            if (isset($input['deactivated']) && $input['deactivated'] != null) {
                $account->deactivated = $input['deactivated'];
            } else {
                $account->deactivated = false;
            }
            $account->role_id = $input['role_id'];
            $account->address = $input['address'];
            if (isset($input['dob']) && $input['dob'] != null) {
                $carbonDate = Carbon::parse($input['dob']);
                $formattedDate = $carbonDate->format('Y-m-d');
                $account->dob = $formattedDate;
            } else {
                $account->dob = null;
            }
            if (isset($input['deactivated_date']) && $input['deactivated_date'] != null) {
                $carbonDate = Carbon::parse($input['deactivated_date']);
                $formattedDate = $carbonDate->format('Y-m-d');
                $account->deactivated_date = $formattedDate;
            } else {
                $account->deactivated_date = null;
            }

            //save new account
            $account->save();
            //get account id
            $accountId = (int) $account->id;
            if (isset($input['imageUrl']) && $input['imageUrl'] != null) {
                //input account image if have
                $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['imageUrl']));
                $destinationPath = public_path('image/Accounts/' . $accountId);
                //check destination path if not create one
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                $fileName = time() . '_' . $accountId . '.jpg';
                //input filedata through destination path with fileName 
                file_put_contents($destinationPath . '/' . $fileName, $fileData);
                $account->imageUrl = $fileName;
                $account->save();
            } else {
                //input unknown.jpg into account image
                $fileName = time() . '_' . $accountId . '.jpg';
                $destinationPath = public_path('image/Accounts/' . $accountId);
                //check destination path if not create one
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                $destinationFilePath = public_path('image/Accounts/' . $accountId . '/' . $fileName);
                $sourceFilePath = public_path('image/Accounts/unknown.jpg');
                //copy unknown.jpg to the created directory
                File::copy($sourceFilePath, $destinationFilePath);
                $account->imageUrl = $fileName;
                $account->save();
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }

        return response()->json([
            'success' => "Register Successfully",
        ], 201);
    }
    public function get_staff_role_list()
    {
        return response()->json([
            DB::table('role')->where('id', 2)->first(),
            DB::table('role')->where('id', 3)->first(),
            DB::table('role')->where('id', 4)->first(),
        ]);
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
    //             'error' => 'No Input Received'
    //         ], 404);
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

    public function set_deactivate(Request $request) //chưa test
    {
        //input
        $input = json_decode($request->input('deactivate'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        //check input deactivate
        if ($input['deactivate']) {
            DB::table('account')->where('id', $input['account_id'])->update([
                'deactivated' => true,
                'deactivated_date' => Carbon::createFromTimestamp(time())->format('Y-m-d H:i:s')
            ]);
        } else if ($input['deactivate'] == false) {
            $now = Carbon::now();
            $time = $now->startOfDay();
            DB::table('account')->where('id', $input['account_id'])->update([
                'deactivated' => false,
                'deactivated_date' => $time
            ]);
        } else {
            return response()->json([
                'error' => 'Something Happened'
            ], 403);
        }
        return response()->json([
            'success' => 'Set Account Deactivate Successfully'
        ], 200);
    }
}
