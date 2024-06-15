<?php

namespace App\Http\Controllers\orders;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use App\Models\orders\Quote;
use App\Models\items\Product_Diamond;
use App\Models\items\Product_Metal;
use App\Models\items\Product;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\accounts\Account;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class QuoteController extends Controller
{
    public function get_quote_list_admin()
    {
        $quote_list = DB::table('quote')->orderBy('quote_status_id', 'ASC')->get();
        $quote_list->map(function ($quote) {
            $product = DB::table('product')->where('id', $quote->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            $quote->product = $product;
            unset($quote->product_id);

            $account = DB::table('account')->where('id', $quote->account_id)->first();
            $account->role = DB::table('role')->where('id', $account->role_id)->first();
            unset($account->role_id);
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
            }
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
            $quote->account = $account;
            unset($quote->account_id);

            $quote->quote_status = DB::table('quote_status')->where('id', $quote->quote_status_id)->first();
            unset($quote->quote_status_id);
            return $quote;
        });

        return response()->json(
            $quote_list
        );
    }
    public function get_priced_quote_list()
    {
        $quote_list = DB::table('quote')->where('quote_status_id', 3)->get();
        $quote_list->map(function ($quote) {
            $product = DB::table('product')->where('id', $quote->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            $quote->product = $product;
            unset($quote->product_id);

            $account = DB::table('account')->where('id', $quote->account_id)->first();
            $account->role = DB::table('role')->where('id', $account->role_id)->first();
            unset($account->role_id);
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
            }
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
            $quote->account = $account;
            unset($quote->account_id);

            $quote->quote_status = DB::table('quote_status')->where('id', $quote->quote_status_id)->first();
            unset($quote->quote_status_id);
            return $quote;
        });

        return response()->json(
            $quote_list
        );
    }
    public function get_quote_list_customer(Request $request)
    {
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
        $input = (int) $decodedToken['id'];

        $quote_list = DB::table('quote')->where('account_id', $input)->orderBy('quote_status_id', 'ASC')->get();
        $quote_list->map(function ($quote) {
            $product = DB::table('product')->where('id', $quote->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $quote->created = Carbon::parse($quote->created)->format('H:i:s d/m/Y');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            if ($product->mounting_type_id != null) {
                $product->mounting_type = DB::table('mounting_type')->where('id', $product->mounting_type_id)->first();
            } else {
                $product->mounting_type = null;
            }
            unset($product->mounting_type_id);
            $quote->product = $product;
            unset($quote->product_id);

            $account = DB::table('account')->where('id', $quote->account_id)->first();
            $account->role = DB::table('role')->where('id', $account->role_id)->first();
            unset($account->role_id);
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
            }
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
            $quote->account = $account;
            unset($quote->account_id);

            $quote->quote_status = DB::table('quote_status')->where('id', $quote->quote_status_id)->first();
            unset($quote->quote_status_id);
            return $quote;
        });
        return response()->json(
            $quote_list,
        );
    }
    public function get_quote_status_list()
    {
        return response()->json(
            DB::table('quote_status')->get()
        );
    }
    public function add_quote(Request $request)
    {
        $input = json_decode($request->input('new_quote'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Receive'
            ], 403);
        }
        if (isset($input['mounting_type_id']) && $input['mounting_type_id'] != null) {
            $type_id = $input['mounting_type_id'];
        } else $type_id = null;
        if (isset($input['note']) && $input['note'] != null) {
            $note = $input['note'];
        } else $note = null;
        DB::beginTransaction();
        try {
            $account_id = $input['account']['id'];
            $account = DB::table('account')->where('id', $account_id)->first();
            if ($account == null) {
                return response()->json([
                    'error' => 'The Selected Customer Account Doesn\'t Exist'
                ], 403);
            }
            if ($account->deactivated) {
                return response()->json([
                    'error' => 'The Selected Customer Account Has Been Deactivated'
                ], 403);
            }

            $product = new Product();
            $product->mounting_type_id = $type_id;
            $product->imageUrl = "";
            $product->save();

            $productId = (int) $product->id;

            $fileName = 'main.jpg';
            $destinationPath = public_path('image/Order/' . $productId);
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $destinationFilePath = public_path('image/Order/' . $productId . '/' . $fileName);
            $sourceFilePath = public_path('image/Order/unknown.jpg');
            File::copy($sourceFilePath, $destinationFilePath);
            $product->imageUrl = $fileName;
            $product->save();

            $quote = new Quote();
            $quote->product_id = $product->id;
            $quote->account_id = $account_id;
            $quote->quote_status_id = 1;
            $quote->product_price = 0;
            $quote->production_price = 0;
            $quote->profit_rate = 0;
            $quote->total_price = 0;
            $quote->note = $note;
            $quote->created = Carbon::createFromTimestamp(time())->format('Y-m-d H:i:s');
            $quote->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Quote Create Successfully'
        ], 201);
    }
    public function assign_quote(Request $request) //
    {
        $input = json_decode($request->input('assigned_information'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 403);
        }
        DB::beginTransaction();
        try {
            $quote = DB::table('quote')->where('id', $input['quote_id'])->first();
            if ($quote->quote_status_id == 4) {
                DB::rollBack();
                return response()->json([
                    'error' => 'The Selected Quote Has Been Completed'
                ], 403);
            }
            if ($quote->quote_status_id == 5) {
                DB::rollBack();
                return response()->json([
                    'error' => 'The Selected Quote Has Been Cancelled'
                ], 403);
            }
            $saleStaff_id = isset($input['saleStaff_id']) ? $input['saleStaff_id'] : null;
            $designStaff_id = isset($input['designStaff_id']) ? $input['designStaff_id'] : null;
            $productionStaff_id = isset($input['productionStaff_id']) ? $input['productionStaff_id'] : null;
            if ($saleStaff_id != null) $sale_staff = DB::table('account')->where('id', $input['saleStaff_id'])->first();
            else {
                return response()->json([
                    'error' => 'The Selected Sale Staff Account Can\'t Be Null'
                ], 403);
            }
            if ($designStaff_id != null) $design_staff = DB::table('account')->where('id', $input['designStaff_id'])->first();
            else {
                return response()->json([
                    'error' => 'The Selected Sale Staff Account Can\'t Be Null'
                ], 403);
            }
            if ($productionStaff_id != null) $production_staff = DB::table('account')->where('id', $input['productionStaff_id'])->first();
            else {
                return response()->json([
                    'error' => 'The Selected Production Staff Account Can\'t Be Null'
                ], 403);
            }
            if ($sale_staff != null) {
                if ($sale_staff->role_id != '2') {
                    return response()->json([
                        'error' => 'The Selected Sale Staff Account Is Not a Sale Staff'
                    ], 403);
                } else if ($sale_staff->deactivated) {
                    return response()->json([
                        'error' => 'The Selected Sale Staff Account Has Been Deactivated'
                    ], 403);
                }
            }
            if ($design_staff != null) {
                if ($design_staff->role_id != '3') {
                    return response()->json([
                        'error' => 'The Selected Design Staff Account Is Not a Design Staff'
                    ], 403);
                } else if ($design_staff->deactivated) {
                    return response()->json([
                        'error' => 'The Selected Design Staff Account Has Been Deactivated'
                    ], 403);
                }
            }
            if ($production_staff != null) {
                if ($production_staff->role_id != '4') {
                    return response()->json([
                        'error' => 'The Selected Production Staff Account Is Not a Production Staff'
                    ], 403);
                } else if ($production_staff->deactivated) {
                    return response()->json([
                        'error' => 'The Selected Production Staff Account Has Been Deactivated'
                    ], 403);
                }
            }
            if (isset($input['note']) && $input['note'] != null) {
                DB::table('quote')->where('id', $input['quote_id'])->update([
                    'note' => $input['note']
                ]);
            }
            DB::table('quote')->where('id', $input['quote_id'])->update([
                'saleStaff_id' => $saleStaff_id,
                'designStaff_id' => $designStaff_id,
                'productionStaff_id' => $productionStaff_id,
            ]);
            if ($quote->quote_status_id == 1) {
                DB::table('quote')->where('id', $input['quote_id'])->update([
                    'quote_status_id' => 2
                ]);
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Assign Quote Succesfully'
        ], 201);
    }
    public function pricing_quote(Request $request)
    {
        $input = json_decode($request->input('priced_quote'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 403);
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
        $quote = DB::table('quote')->where('id', $input['quote_id'])->first();
        if ($quote->saleStaff_id != $id) {
            return response()->json([
                'error' => 'Your Account Isn\'t Assigned To This Quote'
            ], 403);
        }
        $product_price = 0;

        DB::beginTransaction();
        try {
            $quote = DB::table('quote')->where('id', $input['quote_id'])->first();
            if ($quote->quote_status_id < 2) {
                DB::rollBack();
                return response()->json([
                    'error' => 'The Selected Quote Hasn\'t Been Assigned'
                ], 403);
            }
            if ($quote->quote_status_id == 3) {
                DB::rollBack();
                return response()->json([
                    'error' => 'The Selected Quote Has Already Been Priced'
                ], 403);
            }
            if ($quote->quote_status_id == 4) {
                DB::rollBack();
                return response()->json([
                    'error' => 'The Selected Quote Has Already Been Completed'
                ], 403);
            }
            if ($quote->quote_status_id >= 5) {
                DB::rollBack();
                return response()->json([
                    'error' => 'The Selected Quote Has Already Been Cancelled'
                ], 403);
            }
            DB::table('quote')->where('id', $input['quote_id'])->update([
                'note' => $input['note']
            ]);
            if (isset($input['mounting_type_id']) && $input['mounting_type_id'] != null) {
                DB::table('product')->where('id', $quote->product_id)->update([
                    'mounting_type_id' => $input['mounting_type_id'],
                    'mounting_size' => $input['mounting_size']
                ]);
            }
            if (isset($input['imageUrl']) && $input['imageUrl'] != null) {
                $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['imageUrl']));
                $destinationPath = public_path('image/Order/' . $quote->product_id);
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                $fileName = 'main.jpg';
                $files = File::allFiles($destinationPath);
                foreach ($files as $file) {
                    File::delete(public_path('image/Order/' . $quote->product_id) . '/' . $file->getBaseName());
                }
                file_put_contents($destinationPath . '/' . $fileName, $fileData);
                $imageUrl = $fileName;
                DB::table('product')->where('id', $quote->product_id)->update([
                    'imageUrl' => $imageUrl
                ]);
            }
            DB::table('product_diamond')->where('product_id', $quote->product_id)->delete();
            DB::table('product_metal')->where('product_id', $quote->product_id)->delete();
            if (isset($input['diamond_list']) && $input['diamond_list'] != null) {
                foreach ($input['diamond_list'] as $diamond1) {
                    $product_diamond = new Product_Diamond();
                    $diamond = DB::table('diamond')->where('id', $diamond1['diamond']['id'])->first();
                    if ($diamond->deactivated == true) {
                        DB::rollBack();
                        return response()->json([
                            'error' => 'One Of The Selected Diamond Is Currently Deactivated'
                        ],403);
                    }
                    $product_diamond->product_id = $quote->product_id;
                    $product_diamond->diamond_id = $diamond1['diamond']['id'];
                    $product_diamond->count = $diamond1['count'];
                    $product_diamond->price = $diamond1['price'];
                    $product_diamond->diamond_shape_id = $diamond1['diamond_shape']['id'];
                    $product_diamond->status = true;
                    $product_price += $product_diamond->price;
                    $product_diamond->save();
                }
            }
            foreach ($input['metal_list'] as $metal1) {
                $product_metal = new Product_Metal();
                $metal = DB::table('metal')->where('id', $metal1['metal']['id'])->first();
                if ($metal->deactivated == true) {
                    DB::rollBack();
                    return response()->json([
                        'error' => 'One Of The Selected Metal Is Currently Deactivated'
                    ],403);
                }
                $product_metal->product_id = $quote->product_id;
                $product_metal->metal_id = $metal1['metal']['id'];
                $product_metal->price = $metal1['price'];
                $product_metal->volume = $metal1['volume'];
                $product_metal->weight = $metal1['weight'];
                $product_metal->status = true;
                $product_price += $product_metal->price;
                $product_metal->save();
            }

            Quote::where('id', $input['quote_id'])->update([
                'production_price' => $input['production_price'],
                'profit_rate' => $input['profit_rate'],
                'product_price' => $product_price,
                'quote_status_id' => 3,
                'total_price' => ($product_price + $input['production_price']) * ($input['profit_rate'] + 100) / 100
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }

        return response()->json([
            'success' => 'Successfully Price Quote'
        ], 201);
    }
    public function approve_quote(Request $request)
    {
        $input = json_decode($request->input('approval'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 403);
        }

        DB::beginTransaction();
        try {
            $quote = DB::table('quote')->where('id', $input['quote_id'])->first();
            if ($quote->quote_status_id < 3) {
                DB::rollBack();
                return response()->json([
                    'error' => 'The Selected Quote Hasn\'t Been Priced'
                ], 403);
            }
            if ($quote->quote_status_id == 4) {
                DB::rollBack();
                return response()->json([
                    'error' => 'The Selected Quote Has Already Been Approved'
                ], 403);
            }
            if ($quote->quote_status_id == 5) {
                DB::rollBack();
                return response()->json([
                    'error' => 'The Selected Quote Has Already Been Cancelled'
                ], 403);
            }
            if ($input['approve'] || $input['approve'] == 1) {
                DB::table('quote')->where('id', $input['quote_id'])->update([
                    'quote_status_id' => 4,
                    'note' => $input['note']
                ]);
                DB::table('orders')->insert([
                    'product_id' => $quote->product_id,
                    'account_id' => $quote->account_id,
                    'deposit_has_paid' => 0,
                    'product_price' => $quote->product_price,
                    'profit_rate' => $quote->profit_rate,
                    'production_price' => $quote->production_price,
                    'total_price' => $quote->total_price,
                    'order_type_id' => 2,
                    'order_status_id' => 1,
                    'note' => $quote->note,
                    'saleStaff_id' => $quote->saleStaff_id,
                    'designStaff_id' => $quote->designStaff_id,
                    'productionStaff_id' => $quote->productionStaff_id,
                    'created' => Carbon::createFromTimestamp(time())->format('Y-m-d H:i:s')
                ]);
            } else if (!$input['approve'] || $input['approve'] == 0) {
                DB::table('quote')->where('id', $input['quote_id'])->update([
                    'quote_status_id' => 2,
                    'note' => $input['note']
                ]);
                DB::commit();
                return response()->json([
                    'success' => 'Decline Quote Successfully'
                ], 201);
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Approve Quote Successfully'
        ], 201);
    }
    public function cancel(Request $request)
    {
        $input = json_decode($request->input('cancel'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 403);
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
        $account = Account::find($id);
        if ($account->role_id != 1 && $account->role_id != 5) {
            return response()->json([
                'error' => 'Invalid User (User is Unauthorized)'
            ], 500);
        }
        DB::beginTransaction();
        try {
            $quote = DB::table('quote')->where('id', $input['quote_id'])->first();
            if ($quote->quote_status_id == 4) {
                return response()->json([
                    'error' => 'Quote Has Already Been Completed, Action Can\'t Be Performed'
                ], 403);
            }
            if ($quote->quote_status_id == 5) {
                return response()->json([
                    'error' => 'Quote Has Already Been Cancelled, Action Can\'t Be Performed'
                ], 403);
            }
            DB::table('quote')->where('id', $input['quote_id'])->update([
                'quote_status_id' => 5,
                'note' => $input['note']
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Cancel Successfully'
        ], 201);
    }
    public function get_assigned_quote_sale(Request $request)
    {
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
        $input = (int) $decodedToken['id'];
        $account = Account::find($input);
        if ($account->role_id != 2) {
            return response()->json([
                'error' => 'Invalid User (User is Unauthorized)'
            ], 500);
        }

        $quote = DB::table('quote')->where('saleStaff_id', $input)->get();
        $quote->map(function ($quote) {
            $product = DB::table('product')->where('id', $quote->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            $quote->product = $product;
            unset($quote->product_id);

            $account = DB::table('account')->where('id', $quote->account_id)->first();
            $account->role = DB::table('role')->where('id', $account->role_id)->first();
            unset($account->role_id);
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . '/' . $account->id . "/" . $account->imageUrl;
            }
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
            $quote->account = $account;

            $quote->quote_status = DB::table('quote_status')->where('id', $quote->quote_status_id)->first();
            unset($quote->quote_status_id);
            return $quote;
        });
        return response()->json(
            $quote
        );
    }
    public function get_quote_detail(Request $request)
    {
        $input = json_decode($request->input('quote_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 403);
        }
        $quote = DB::table('quote')->where('id', $input)->first();
        $quote->created = Carbon::parse($quote->created)->format('H:i:s d/m/Y');
        $product = DB::table('product')->where('id', $quote->product_id)->first();
        $OGurl = env('ORIGIN_URL');
        $url = env('ORDER_URL');
        $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
        $product->mounting_type = DB::table('mounting_type')->where('id', $product->mounting_type_id)->first();
        unset($product->mounting_type_id);

        $product_diamond = DB::table('product_diamond')->where('product_id', $product->id)->get();
        $product_diamond->map(function ($product_diamond) {
            $diamond = DB::table('diamond')->where('id', $product_diamond->diamond_id)->first();
            $diamond->created = Carbon::parse($diamond->created)->format('H:i:s d/m/Y');
            $OGurl = env('ORIGIN_URL');
            $url = env('DIAMOND_URL');
            $diamond->imageUrl = $OGurl . $url . $diamond->imageUrl;
            $diamond->diamond_color = DB::table('diamond_color')->where('id', $diamond->diamond_color_id)->first();
            $diamond->diamond_origin = DB::table('diamond_origin')->where('id', $diamond->diamond_origin_id)->first();
            $diamond->diamond_clarity = DB::table('diamond_clarity')->where('id', $diamond->diamond_clarity_id)->first();
            $diamond->diamond_cut = DB::table('diamond_cut')->where('id', $diamond->diamond_cut_id)->first();
            unset($diamond->diamond_color_id);
            unset($diamond->diamond_origin_id);
            unset($diamond->diamond_clarity_id);
            unset($diamond->diamond_cut_id);
            $product_diamond->diamond = $diamond;

            $product_diamond->diamond_shape = DB::table('diamond_shape')->where('id', $product_diamond->diamond_shape_id)->first();
            unset($product_diamond->diamond_id);
            unset($product_diamond->diamond_shape_id);
            return $product_diamond;
        });
        $product->product_diamond = $product_diamond;

        $product_metal = DB::table('product_metal')->where('product_id', $product->id)->get();
        $product_metal->map(function ($product_metal) {
            $metal = DB::table('metal')->where('id', $product_metal->metal_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('METAL_URL');
            $metal->created = Carbon::parse($metal->created)->format('H:i:s d/m/Y');
            $metal->imageUrl = $OGurl . $url . $metal->id . '/' . $metal->imageUrl;
            $product_metal->metal = $metal;
            unset($product_metal->metal_id);
            return $product_metal;
        });
        $product->product_metal = $product_metal;

        $quote->product = $product;
        unset($quote->product_id);

        $account = DB::table('account')->where('id', $quote->account_id)->first();
        $account->role = DB::table('role')->where('id', $account->role_id)->first();
        unset($account->role_id);
        if (!$account->google_id) {
            $OGurl = env('ORIGIN_URL');
            $url = env('ACCOUNT_URL');
            $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
        }
        $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
        $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
        unset($account->password);
        $quote->account = $account;
        unset($quote->account_id);

        $sale_staff = DB::table('account')->where('id', $quote->saleStaff_id)->first();
        $sale_staff->order_count = DB::table('orders')->where('saleStaff_id', $sale_staff->id)->whereNot('order_status_id', 1)->whereNot('order_status_id', 2)->count();
        $sale_staff->role = DB::table('role')->where('id', $sale_staff->role_id)->first();
        unset($sale_staff->role_id);
        if (!$sale_staff->google_id) {
            $OGurl = env('ORIGIN_URL');
            $url = env('ACCOUNT_URL');
            $sale_staff->imageUrl = $OGurl . $url . $sale_staff->id . "/" . $sale_staff->imageUrl;
        }
        $sale_staff->dob = Carbon::parse($sale_staff->dob)->format('d/m/Y');
        $sale_staff->deactivated_date = Carbon::parse($sale_staff->deactivated_date)->format('d/m/Y');
        unset($sale_staff->password);
        $quote->sale_staff = $sale_staff;
        unset($quote->saleStaff_id);

        $design_staff = DB::table('account')->where('id', $quote->designStaff_id)->first();
        $design_staff->order_count = DB::table('orders')->where('designStaff_id', $design_staff->id)->whereNot('order_status_id', 1)->whereNot('order_status_id', 2)->count();
        $design_staff->role = DB::table('role')->where('id', $design_staff->role_id)->first();
        unset($design_staff->role_id);
        if (!$design_staff->google_id) {
            $OGurl = env('ORIGIN_URL');
            $url = env('ACCOUNT_URL');
            $design_staff->imageUrl = $OGurl . $url . $design_staff->id . "/" . $design_staff->imageUrl;
        }
        $design_staff->dob = Carbon::parse($design_staff->dob)->format('d/m/Y');
        $design_staff->deactivated_date = Carbon::parse($design_staff->deactivated_date)->format('d/m/Y');
        unset($design_staff->password);
        $quote->design_staff = $design_staff;
        unset($quote->designStaff_id);

        $production_staff = DB::table('account')->where('id', $quote->productionStaff_id)->first();
        $production_staff->order_count = DB::table('orders')->where('productionStaff_id', $production_staff->id)->whereNot('order_status_id', 1)->whereNot('order_status_id', 2)->whereNot('order_status_id', 3)->count();
        $production_staff->role = DB::table('role')->where('id', $production_staff->role_id)->first();
        unset($production_staff->role_id);
        if (!$production_staff->google_id) {
            $OGurl = env('ORIGIN_URL');
            $url = env('ACCOUNT_URL');
            $production_staff->imageUrl = $OGurl . $url . $production_staff->id . "/" . $production_staff->imageUrl;
        }
        $production_staff->dob = Carbon::parse($production_staff->dob)->format('d/m/Y');
        $production_staff->deactivated_date = Carbon::parse($production_staff->deactivated_date)->format('d/m/Y');
        unset($production_staff->password);
        $quote->production_staff = $production_staff;
        unset($quote->productionStaff_id);

        $quote->quote_status = DB::table('quote_status')->where('id', $quote->quote_status_id)->first();
        unset($quote->quote_status_id);

        return response()->json([
            'quote_detail' => $quote
        ]);
    }
}
