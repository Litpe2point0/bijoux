<?php

namespace App\Http\Controllers\accounts;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\accounts\Account;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Google_Client;
use Firebase\JWT\JWT;

class AccountController extends Controller
{
    public function login(Request $request)
    {
        $input = json_decode($request->input('login_information'), true);
        // $credentials = $input(['username', 'password']);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $credentials = [
            //'email' => $request->email,
            'username' => $input['username'],
            'password' => $input['password'],
        ];

        $account = DB::table('account')->where('username', $input['username'])->first();

        if ($account && Hash::check($input['password'], $account->password)) {
            $deactivated = (bool) $account->deactivated;
        } else {
            $deactivated = false;
        }
        if ($deactivated) {
            return response()->json(['error' => 'Your account has been deactivated'], 401);
        }

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json([
            'access_token' => $token,
            'success' => 'Login successfully',
        ]);
    }
    public function login_with_google(Request $request)
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

            $jwt = JWT::encode($payload, env('JWT_SECRET'), 'HS256');



            return response()->json(['success' => 'User logged in', 'token' => $jwt]);
        } else {
            return response()->json(['error' => 'Invalid token'], 401);
        }
    }
    public function get_account_list()//chưa test
    {
        $customer_list = Account::where('role_id', 5)->orderBy('deactivated', 'asc')->get();
        $customer_list->map(function ($account) {
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id .  "/" . $account->imageUrl;
            }
            return $account;
        });
        $staff_list = Account::whereNot('role_id', 5)->whereNot('role_id', 1)->orderBy('deactivated', 'asc')->get();
        $staff_list->map(function ($account) {
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
    public function get_staff_list()//chưa test
    {
        $sale_staff_list = Account::where('role_id', 2)->orderBy('deactivated', 'asc')->get();
        $sale_staff_list->map(function ($account) {
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id .  "/" . $account->imageUrl;
            }
            return $account;
        });
        $design_staff_list = Account::where('role_id', 3)->orderBy('deactivated', 'asc')->get();
        $design_staff_list->map(function ($account) {
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id .  "/" . $account->imageUrl;
            }
            return $account;
        });
        $production_staff_list = Account::where('role_id', 4)->orderBy('deactivated', 'asc')->get();
        $production_staff_list->map(function ($account) {
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
    public function get_account_detail(Request $request)//chưa test
    {
        $input = json_decode($request->input('account_infomation'), true);
        // $input = request(['account_id']);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $account = Account::where('id', $input['account_id'])->first();
        $account->role = DB::table('role')->where('id', $account->role_id)->first();
        unset($account->role_id);
        $account->order_count = (int) DB::table('orders')->where('account_id', $account->id)->count();
        $OGurl = env('ORIGIN_URL');
        $url = env('ACCOUNT_URL');
        $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;

        $order_history = DB::table('orders')->where('account_id', $account->id)->get();
        $order_history->map(function ($order) {
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            unset($order->order_status_id);
            unset($order->order_type_id);
            return $order;
        });
        $account->order_history = $order_history;

        // $account = Account::where('id', $input['account_id'])->get();
        // $account->map(function ($account) {
        //     $account->role = DB::table('role')->where('id',$account->role_id)->get();
        //     unset($account->role_id);
        //     $account->order_count = (int) DB::table('orders')->where('account_id', $account->id)->count();
        //     $account->order_history = DB::table('orders')->where('account_id', $account->id)->get();
        //     return $account;
        // });

        return response()->json([
            'account_infomation' => $account
        ]);
    }
    public function update(Request $request)
    {
        // $input = json_decode($request->input('new_account'), true);

        // $input = request(['account_id', 'username', 'fullname', 'email', 'phone', 'dob']);

        // if (isset($input['account_id']) && $input['account_id'] != null) {
        //     $id = $input['account_id'];

        //     DB::beginTransaction();
        //     try {
        //         $account = Account::find($id);
        //         if (isset($input['username']) && $input['username'] != null) {
        //             $account->username = $input['username'];
        //         }
        //         if (isset($input['fullname']) && $input['fullname'] != null) {
        //             $account->fullname = $input['fullname'];
        //         }
        //         if (isset($input['imageUrl']) && isset($input['imageUrl']) != null) {
        //             $accountId = (int) $account->id;
        //             $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['imageUrl']));
        //             $destinationPath = public_path('image/Accounts/' . $accountId);
        //             if (!file_exists($destinationPath)) {
        //                 mkdir($destinationPath, 0755, true);
        //             }
        //             $fileName = time() . '_' . $accountId . '.jpg';
        //             $files = File::allFiles($destinationPath);
        //             foreach ($files as $file) {
        //                 File::delete(public_path('image/Accounts/' . $accountId) . '/' . $file->getBaseName());
        //             }
        //             file_put_contents($destinationPath . '/' . $fileName, $fileData);

        //             $url = env('URL');
        //             $account->imageUrl = $url . 'Accounts/' . $accountId . '/' . $accountId . time() . '_' . $accountId . '.jpg';
        //         }
        //         if (isset($input['email']) && $input['email'] != null) {
        //             $account->email = $input['email'];
        //         }
        //         if (isset($input['phone']) && $input['phone'] != null) {
        //             $account->phone = $input['phone'];
        //         }
        //         if (isset($input['dob']) && $input['dob'] != null) {
        //             $carbonDate = Carbon::parse($input['dob']);
        //             $formattedDate = $carbonDate->format('Y-m-d');
        //             $account->dob = $formattedDate;
        //         }
        //         if (isset($input['address']) && $input['address'] != null) {
        //             $account->address = $input['address'];
        //         }
        //         Account::where('id', $id)->update([
        //             'username' => $account->username,
        //             'fullname' => $account->fullname,
        //             'imageUrl' => $account->imageUrl,
        //             'address' => $account->address,
        //             'email' => $account->email,
        //             'phone' => $account->phone,
        //             'dob' => $account->dob
        //         ]);

        //         DB::commit();
        //         return response()->json([
        //             'success' => "Update Successfully",
        //         ], 201);
        //     } catch (\Exception $e) {
        //         DB::rollBack();
        //         return response()->json($e->getMessage(), 500);
        //     }
        // } else {
        //     return response()->json([
        //         'error' => "No Account id Received",
        //     ], 500);
        // }

        $input = json_decode($request->input('new_account'), true);

        if (!isset($input['account_id']) || $input['account_id'] == null) {
            return response()->json(['error' => 'No Account id Received'], 400);
        }

        $id = $input['account_id'];
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
                $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['imageUrl']));
                $destinationPath = public_path('image/Accounts/' . $id);

                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }

                $fileName = time() . '_' . $id . '.jpg';
                File::cleanDirectory($destinationPath); // Delete all files in the directory
                file_put_contents($destinationPath . '/' . $fileName, $fileData);

                $updateData['imageUrl'] = $fileName;
            }

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
        $input = json_decode($request->input('new_account'), true);
        // $input = request(['account_id', 'username', 'fullname', 'email', 'phone', 'dob']);

        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
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
            $account = Account::find($id);
            if (isset($input['username']) && $input['username'] != null) {
                $account->username = $input['username'];
            }
            if (isset($input['fullname']) && $input['fullname'] != null) {
                $account->fullname = $input['fullname'];
            }
            if (isset($input['imageUrl']) && isset($input['imageUrl']) != null) {
                $accountId = (int) $account->id;
                $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['imageUrl']));
                $destinationPath = public_path('image/Accounts/' . $accountId);
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                $fileName = time() . '_' . $accountId . '.jpg';
                $files = File::allFiles($destinationPath);
                foreach ($files as $file) {
                    File::delete(public_path('image/Accounts/' . $accountId) . '/' . $file->getBaseName());
                }
                file_put_contents($destinationPath . '/' . $fileName, $fileData);

                $account->imageUrl = $fileName;
            }
            if (isset($input['email']) && $input['email'] != null) {
                $account->email = $input['email'];
            }
            if (isset($input['phone']) && $input['phone'] != null) {
                $account->phone = $input['phone'];
            }
            if (isset($input['dob']) && $input['dob'] != null) {
                $carbonDate = Carbon::parse($input['dob']);
                $formattedDate = $carbonDate->format('Y-m-d');
                $account->dob = $formattedDate;
            }
            if (isset($input['address']) && $input['address'] != null) {
                $account->address = $input['address'];
            }
            Account::where('id', $id)->update([
                'username' => $account->username,
                'fullname' => $account->fullname,
                'imageUrl' => $account->imageUrl,
                'address' => $account->address,
                'email' => $account->email,
                'phone' => $account->phone,
                'dob' => $account->dob
            ]);

            DB::commit();
            return response()->json([
                'id' => $id,
                'lit pe' => $input,
                'success' => "Update Successfully",
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
    }
    public function register(Request $request)
    {
        // json_decode($request->input('new_product'), true);
        $input = json_decode($request->input('account_information'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        DB::beginTransaction();
        try {
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


            $account->save();
            $accountId = (int) $account->id;
            if (isset($input['imageUrl']) && $input['imageUrl'] != null) {

                $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['imageUrl']));
                $destinationPath = public_path('image/Accounts/' . $accountId);
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                $fileName = time() . '_' . $accountId . '.jpg';
                file_put_contents($destinationPath . '/' . $fileName, $fileData);


                $account->imageUrl = $fileName;
                $account->save();
            } else {
                $fileName = time() . '_' . $accountId . '.jpg';
                $destinationPath = public_path('image/Accounts/' . $accountId);
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                $destinationFilePath = public_path('image/Accounts/' . $accountId . '/' . $fileName);
                $sourceFilePath = public_path('image/Accounts/unknown.jpg');
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
    public function get_image(Request $request)
    {
        $fileData = file_get_contents('php://input');
        $base64Data = base64_encode($fileData);
        return response()->json([
            $base64Data
        ]);
    }
    public function set_deactivate(Request $request)//chưa test
    {
        $input = json_decode($request->input('deactivate'),true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        if($input['deactivate']){
            DB::table('account')->where('id', $input['account_id'] )->update([
                'deactivated' => true,
                'deactivated_date' => Carbon::createFromTimestamp(time())->format('Y-m-d H:i:s')
            ]);
        } else if($input['deactivate'] == false){
            $now = Carbon::now();
            $time = $now->startOfDay();
            DB::table('account')->where('id', $input['account_id'] )->update([
                'deactivated' => false,
                'deactivated_date' => $time
            ]);
        } else {
            return response()->json([
                'error' => 'Something Happened'
            ],404);
        }
        return response()->json([
            'success' => 'Deactivate Account Success'
        ], 200);
    }
}
