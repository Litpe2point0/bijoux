<?php

namespace App\Http\Controllers\accounts;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\accounts\Account;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Google_Client;
use Firebase\JWT\JWT;
use Illuminate\Database\Eloquent\Builder;

class AccountController extends Controller
{
    public function login(Request $request)
    {
        $credentials = json_decode($request->input('login_information'), true);
        // $credentials = [
        //     //'email' => $request->email,
        //     'username' => $request->username,
        //     'password' => $request->password,
        // ];

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
    public function get_staff_list()
    {
        $data = [
            'sale_list' => [],
            'design_list' => [],
            'production_list' => [],
        ];

        $sale_staff = Account::where('role_id', 2)->get();
        $sale_staff->map(function ($sale_staff) {
            $sale_staff->order_count = (int) DB::table('orders')->where('saleStaff_id', $sale_staff->id)->count();
            return $sale_staff;
        });

        $design_staff = Account::where('role_id', 3)->get();
        $design_staff->map(function ($design_staff) {
            $design_staff->order_count = (int) DB::table('orders')->where('designStaff_id', $design_staff->id)->count();
            return $design_staff;
        });

        $production_staff = Account::where('role_id', 4)->get();
        $production_staff->map(function ($production_staff) {
            $production_staff->order_count = (int) DB::table('orders')->where('productionStaff_id', $production_staff->id)->count();
            return $production_staff;
        });

        $data['sale_list'] = $sale_staff;
        $data['design_list'] = $design_staff;
        $data['production_list'] = $production_staff;

        return $data;
    }
    public function get_account_list()
    {
        $data = [
            'customer_list' => [],
            'staff_list' => []
        ];

        $data['customer_list'] = Account::where('role_id', 1)->get();
        $data['staff_list'] = $this->get_staff_list();

        return response()->json(
            $data
        );
    }
    public function get_account_detail(Request $request)
    {
        json_decode($request->input('new_product'), true);

        $input = request(['account_id']);
        if (isset($input['account_id']) && $input['account_id'] != null) {
            $account = Account::where('id', $input['account_id'])->get();
            $order_history = DB::table('orders')->where('account_id', $input['account_id'])->get();
            $account->map(function ($account) {
                $account->order_count = (int) DB::table('orders')->where('account_id', $account->id)->count();
                $account->order_history = $order_history = DB::table('orders')->where('account_id', $account->id)->get();
                return $account;
            });

            $data = [
                $account,
            ];
            return response()->json([
                $data,
            ]);
        } else return response()->json([
            'error' => 'No Input Receive!'
        ]);
    }
    public function update(Request $request)
    {
        $input = request(['account_id', 'username', 'fullname', 'email', 'phone', 'dob']);

        if (!isset($input['account_id']) || $input['account_id'] == null) {
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
        } else $id = $input['account_id'];

        DB::beginTransaction();
        try {
            $account = Account::find($id);
            if (isset($input['username'])) {
                $account->username = $input['username'];
            }
            if (isset($input['fullname'])) {
                $account->fullname = $input['fullname'];
            }
            if (isset($input['email'])) {
                $account->email = $input['email'];
            }
            if (isset($input['phone'])) {
                $account->phone = $input['phone'];
            }
            if (isset($input['dob'])) {
                $account->dob = $input['dob'];
            };
            Account::where('id', $id)->update([
                'username' => $account->username,
                'fullname' => $account->fullname,
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

        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:200|unique:account',
            'fullname' => 'required|string|max:200',
            'email' => 'required|string|email|max:255|unique:account',
            'password' => 'required|string',
            'role_id' => 'required|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        DB::beginTransaction();
        try {
            $account = new Account();
            $account->username = $request->username;
            $account->fullname = $request->fullname;
            $account->email = $request->email;
            $account->password = Hash::make($request->password);
            $account->deactivated = false;
            $account->role_id = $request->role_id;
            $account->save();

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
        $data = DB::table('role')->whereNot('id', 1)->whereNot('id', 5)->get();

        return response()->json(
            $data
        );
    }
}
