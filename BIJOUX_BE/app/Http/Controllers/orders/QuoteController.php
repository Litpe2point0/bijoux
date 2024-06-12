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
    public function get_final_template(Request $request)
    {
        $input = json_decode($request->input('template_information'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $model_id = $input['model_id'];
        if (isset($input['metal_1_id']) && $input['metal_1_id'] != null) {
            $metal_1_id = $input['metal_1_id'];
        } else $metal_1_id = 0;
        if (isset($input['metal_2_id']) && $input['metal_2_id'] != null) {
            $metal_2_id = $input['metal_2_id'];
        } else $metal_2_id = 0;
        $shape_id = $input['diamond_shape_id'];
        $destinationPath = public_path('image/Final_templates/' . $model_id . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $shape_id);
        if (!file_exists($destinationPath)) {
            return response()->json([
                'error' => 'Template doesn\'t exist'
            ], 404);
        }
        $OGurl = env('ORIGIN_URL');
        $url = env('FINAL_TEMPLATE_URL');
        $files = File::allFiles($destinationPath);
        $imageCount = count($files) - 1;
        $main_image = $OGurl . $url . $model_id . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $shape_id . '/main.jpg';
        $related_image = [];
        for ($i = 1; $i <= $imageCount; $i++) {
            $related_image[] = $OGurl . $url . $model_id . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $shape_id . '/related_' . $i . '.jpg';
        }
        return response()->json([
            'main_image' => $main_image,
            'related_image' => $related_image
        ]);
    }
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
            unset($account->password);
            $quote->account = $account;

            $quote->quote_status = DB::table('quote_status')->where('id', $quote->quote_status_id)->first();
            unset($quote->quote_status_id);
            return $quote;
        });

        return response()->json([
            $quote_list
        ]);
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
            unset($account->password);
            $quote->account = $account;

            $quote->quote_status = DB::table('quote_status')->where('id', $quote->quote_status_id)->first();
            unset($quote->quote_status_id);
            return $quote;
        });
        return response()->json([
            'quote_list' => $quote_list,
        ]);
    }
    public function get_quote_status_list()
    {
        return response()->json([
            DB::table('quote_status')->get()
        ]);
    }
    public function add_quote(Request $request)
    {
        $input = json_decode($request->input('new_quote'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Receive'
            ], 404);
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
            if($account == null){
                return response()->json([
                    'error' => 'The selected Customer account doesn\'t exist'
                ],403);
            }
            if($account->deactivated){
                return response()->json([
                    'error' => 'The selected Customer account has been deactivated'
                ],403);
            }

            $product = new Product();
            $product->mounting_type_id = $type_id;
            $product->imageUrl = "";
            $product->save();

            $productId = (int) $product->id;

            $fileName = 'main.jpg';
            $destinationPath = public_path('image/Orders/' . $productId);
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $destinationFilePath = public_path('image/Orders/' . $productId . '/' . $fileName);
            $sourceFilePath = public_path('image/Orders/unknown.jpg');
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
            'Success' => 'Quote Create Successfully'
        ], 201);
    }
    public function assign_quote(Request $request)
    {
        $input = json_decode($request->input('assigned_information'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        DB::beginTransaction();
        try {
            $quote = DB::table('quote')->where('id', $input['quote_id'])->first();
            if($quote->quote_status_id == 5){
                DB::rollBack();
                return response()->json([
                    'error' => 'The selected Quote has been cancelled'
                ],403);
            }

            $validator = Validator::make($input, [
                'saleStaff_id' => 'required',
                'designStaff_id' => 'required',
                'productionStaff_id' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'error' => $validator->errors()->first(),
                ], 403);
            }
            
            $sale_staff = DB::table('account')->where('id', $input['saleStaff_id'])->first();
            $design_staff = DB::table('account')->where('id', $input['designStaff_id'])->first();
            $production_staff = DB::table('account')->where('id', $input['productionStaff_id'])->first();
            if($sale_staff != null){
                if($sale_staff->role_id != '2'){
                    return response()->json([
                        'error' => 'The selected Sale Staff Account is not a sale staff'
                    ],403);
                } else if($sale_staff->deactivated){
                    return response()->json([
                        'error' => 'The selected Sale Staff Account has been deactivated'
                    ],403);
                }
            }
            if($design_staff != null){
                if($design_staff->role_id != '3'){
                    return response()->json([
                        'error' => 'The selected Sale Staff Account is not a design staff'
                    ],403);
                } else if($design_staff->deactivated){
                    return response()->json([
                        'error' => 'The selected Sale Staff Account has been deactivated'
                    ],403);
                }
            }
            if($production_staff != null){
                if($production_staff->role_id != '4'){
                    return response()->json([
                        'error' => 'The selected Sale Staff Account is not a production staff'
                    ],403);
                } else if($production_staff->deactivated){
                    return response()->json([
                        'error' => 'The selected Sale Staff Account has been deactivated'
                    ],403);
                }
            }
            if(isset($input['note']) && $input['note'] != null){
                DB::table('quote')->where('id', $input['quote_id'])->update([
                    'note' => $input['note']
                ]);
            } 
            DB::table('quote')->where('id', $input['quote_id'])->update([
                'saleStaff_id' => $input['saleStaff_id'],
                'designStaff_id' => $input['designStaff_id'],
                'productionStaff_id' => $input['productionStaff_id'],
                'quote_status_id' => 2
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Assign Complete'
        ], 201);
    }
    public function pricing_quote(Request $request)
    {
        $input = json_decode($request->input('priced_quote'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $quote = DB::table('quote')->where('id', $input['quote_id'])->first();
        $product_price = 0;

        DB::beginTransaction();
        try {
            $quote = DB::table('quote')->where('id', $input['quote_id'])->first();
            if($quote->quote_status_id < 2){
                DB::rollBack();
                return response()->json([
                    'error' => 'The selected Quote hasn\'t been assigned'
                ],403);
            }
            if($quote->quote_status_id == 5){
                DB::rollBack();
                return response()->json([
                    'error' => 'The selected Quote has been cancelled'
                ],403);
            }
            DB::table('quote')->where('id', $input['quote_id'])->update([
                'note' => $input['note']
            ]);
            if (isset($input['mounting_type_id']) && $input['mounting_type_id'] != null) {
                DB::table('product')->where('id', $quote->product_id)->update([
                    'mounting_type_id' => $input['mounting_type_id']
                ]);
            }
            if (isset($input['imageUrl']) && $input['imageUrl'] != null) {
                $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['imageUrl']));
                $destinationPath = public_path('image/Orders/' . $quote->product_id);
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                $fileName = time() . '_' . $quote->product_id . '.jpg';
                $files = File::allFiles($destinationPath);
                foreach ($files as $file) {
                    File::delete(public_path('image/Orders/' . $quote->product_id) . '/' . $file->getBaseName());
                }
                file_put_contents($destinationPath . '/' . $fileName, $fileData);
                $imageUrl = $fileName;
                DB::table('product')->where('id', $quote->product_id)->update([
                    'imageUrl' => $imageUrl
                ]);
            }
            if (isset($input['diamond_list']) && $input['diamond_list'] != null) {
                foreach ($input['diamond_list'] as $diamond1) {
                    $product_diamond = new Product_Diamond();
                    $diamond = DB::table('diamond')->where('id', $diamond1['diamond']['id'])->first();
                    if ($diamond->deactivated == true) {
                        DB::rollBack();
                        return response()->json([
                            'error' => 'An items that is include in this model is currently deactivated'
                        ]);
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
                        'error' => 'An items that is include in this model is currently deactivated'
                    ]);
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
                'total_price' => $product_price * ($input['profit_rate'] + 100) / 100 + $input['production_price']
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }

        return response()->json([
            'success' => 'Process Complete'
        ], 201);
    }
    public function approve_quote(Request $request)
    {
        $input = json_decode($request->input('approval'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }

        DB::beginTransaction();
        try {
            $quote = DB::table('quote')->where('id', $input['quote_id'])->first();
            if($quote->quote_status_id < 3){
                DB::rollBack();
                return response()->json([
                    'error' => 'The selected Quote hasn\'t been priced'
                ],403);
            }
            if($quote->quote_status_id == 5){
                DB::rollBack();
                return response()->json([
                    'error' => 'The selected Quote has been cancelled'
                ],403);
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
            } else if(!$input['approve'] || $input['approve'] == 0){
                DB::table('quote')->where('id', $input['quote_id'])->update([
                    'quote_status_id' => 2,
                    'note' => $input['note']
                ]);
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'Success' => 'Approve Successfully'
        ], 201);
    }
    public function cancel(Request $request)
    {
        $input = json_decode($request->input('cancel'), true);
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
                    'error' => 'Quote has already been complete, action can\'t be perform'
                ],403);
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
            'Success' => 'Cancel Successfully'
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
            unset($account->password);
            $quote->account = $account;

            $quote->quote_status = DB::table('quote_status')->where('id', $quote->quote_status_id)->first();
            unset($quote->quote_status_id);
            return $quote;
        });
        return response()->json([
            $quote
        ]);
    }
    public function get_quote_detail(Request $request)
    {
        $input = json_decode($request->input('quote_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $quote = DB::table('quote')->where('id', $input)->first();

        $product = DB::table('product')->where('id', $quote->product_id)->first();
        $OGurl = env('ORIGIN_URL');
        $url = env('ORDER_URL');
        $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
        $product->mounting_type = DB::table('mounting_type')->where('id', $product->mounting_type_id)->first();
        unset($product->mounting_type_id);

        $product_diamond = DB::table('product_diamond')->where('product_id', $product->id)->get();
        $product_diamond->map(function ($product_diamond) {
            $diamond = DB::table('diamond')->where('id', $product_diamond->diamond_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('DIAMOND_URL');
            $diamond->imageUrl = $OGurl . $url . $diamond->id . "/" . $diamond->imageUrl;
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
        unset($account->password);
        $quote->account = $account;
        unset($quote->account_id);

        $sale_staff = DB::table('account')->where('id', $quote->saleStaff_id)->first();
        $sale_staff->order_count = DB::table('orders')->where('saleStaff_id',$sale_staff->id)->whereNot('order_status_id',1)->whereNot('order_status_id',2)->count();
        $sale_staff->role = DB::table('role')->where('id', $sale_staff->role_id)->first();
        unset($sale_staff->role_id);
        if (!$sale_staff->google_id) {
            $OGurl = env('ORIGIN_URL');
            $url = env('ACCOUNT_URL');
            $sale_staff->imageUrl = $OGurl . $url . $sale_staff->id . "/" . $sale_staff->imageUrl;
        }
        unset($sale_staff->password);
        $quote->sale_staff = $sale_staff;
        unset($quote->saleStaff_id);

        $design_staff = DB::table('account')->where('id', $quote->designStaff_id)->first();
        $design_staff->order_count = DB::table('orders')->where('designStaff_id',$design_staff->id)->whereNot('order_status_id',1)->whereNot('order_status_id',2)->count();
        $design_staff->role = DB::table('role')->where('id', $design_staff->role_id)->first();
        unset($design_staff->role_id);
        if (!$design_staff->google_id) {
            $OGurl = env('ORIGIN_URL');
            $url = env('ACCOUNT_URL');
            $design_staff->imageUrl = $OGurl . $url . $design_staff->id . "/" . $design_staff->imageUrl;
        }
        unset($design_staff->password);
        $quote->design_staff = $design_staff;
        unset($quote->designStaff_id);

        $production_staff = DB::table('account')->where('id', $quote->productionStaff_id)->first();
        $production_staff->order_count = DB::table('orders')->where('productionStaff_id',$production_staff->id)->whereNot('order_status_id',1)->whereNot('order_status_id',2)->whereNot('order_status_id',3)->count();
        $production_staff->role = DB::table('role')->where('id', $production_staff->role_id)->first();
        unset($production_staff->role_id);
        if (!$production_staff->google_id) {
            $OGurl = env('ORIGIN_URL');
            $url = env('ACCOUNT_URL');
            $production_staff->imageUrl = $OGurl . $url . $production_staff->id . "/" . $production_staff->imageUrl;
        }
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
