<?php

namespace App\Http\Controllers\orders;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\items\Product_Diamond;
use App\Models\items\Product_Metal;
use App\Models\items\Product;
use App\Models\orders\Order;
use App\Models\accounts\Account;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;

class OrderController extends Controller
{
    public function get_order_list_admin()
    {
        $customize_order_list = DB::table('orders')->where('order_type_id', 2)->orderBy('order_status_id', 'asc')->get();
        $customize_order_list->map(function ($order) {
            $product = DB::table('product')->where('id', $order->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            $order->product = $product;

            $account = DB::table('account')->where('id', $order->account_id)->first();
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
            }
            unset($account->password);
            $order->account = $account;
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            unset($order->order_status_id);
            unset($order->order_type_id);
            unset($order->account_id);
            unset($order->product_id);
            return $order;
        });
        $template_order_list = DB::table('orders')->where('order_type_id', 1)->orderBy('order_status_id', 'asc')->get();
        $template_order_list->map(function ($order) {
            $product = DB::table('product')->where('id', $order->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            $order->product = $product;

            $account = DB::table('account')->where('id', $order->account_id)->first();
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
            }
            unset($account->password);
            $order->account = $account;
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            unset($order->order_status_id);
            unset($order->order_type_id);
            unset($order->account_id);
            unset($order->product_id);
            return $order;
        });
        return response()->json([
            'customize_order_list' => $customize_order_list,
            'template_order_list' => $template_order_list
        ]);
    }
    public function get_order_list_customer(Request $request)
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

        $customize_order_list = DB::table('orders')->where('account_id', $input)->where('order_type_id', 1)->orderBy('order_status_id', 'asc')->get();
        $customize_order_list->map(function ($order) {
            $product = DB::table('product')->where('id', $order->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            $order->product = $product;

            $account = DB::table('account')->where('id', $order->account_id)->first();
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
            }
            unset($account->password);
            $order->account = $account;
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            unset($order->order_status_id);
            unset($order->order_type_id);
            unset($order->account_id);
            unset($order->product_id);
            return $order;
        });
        
        $template_order_list = DB::table('orders')->where('account_id', $input)->where('order_type_id', 2)->orderBy('order_status_id', 'asc')->get();
        $template_order_list->map(function ($order) {
            $product = DB::table('product')->where('id', $order->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            $order->product = $product;

            $account = DB::table('account')->where('id', $order->account_id)->first();
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
            }
            unset($account->password);
            $order->account = $account;
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            unset($order->order_status_id);
            unset($order->order_type_id);
            unset($order->account_id);
            unset($order->product_id);
            return $order;
        });
        return response()->json([
            'customize_order_list' => $customize_order_list,
            'template_order_list' => $template_order_list
        ]);
    }
    public function add_order_template(Request $request)
    {
        $input = json_decode($request->input('new_order'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $account_id = $input['account']['id'];
        $count = 1;
        $product_price = 0;
        DB::beginTransaction();
        try {
            $model = DB::table('model')->where('id', $input['model_id'])->first();
            $model_diamond = DB::table('model_diamond')->where('model_id', $model->id)->get();

            $metal_list = $input['metal_list'];
            foreach ($metal_list as $metalO) {
                ${'metal_' . $count . '_id'} = $metalO['metal']['id'];
                $count++;
            }
            if ($count < 3) {
                $metal_2_id = 0;
            }
            $destinationPath = public_path('image/Final_templates/' . $input['model_id'] . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $input['diamond_shape_id']);
            if (!file_exists($destinationPath)) {
                return response()->json([
                    'error' => 'Product is not available'
                ], 404);
            }
            $imageUrl = 'main.jpg';

            $mounting_type_id = $model->mounting_type_id;

            $product = new Product();
            $product->imageUrl = $imageUrl;
            $product->mounting_type_id = $mounting_type_id;
            $product->model_id = $input['model_id'];
            $product->mounting_size = $input['mounting_size'];
            $product->save();

            foreach ($metal_list as $metalO) {
                $product_metal = new Product_Metal();
                $metal = DB::table('metal')->where('id', $metalO['metal']['id'])->first();
                if ($metal->deactivated == true) {
                    DB::rollBack();
                    return response()->json([
                        'error' => 'An items that is include in this model is currently deactivated'
                    ], 403);
                }
                $product_metal->product_id = $product->id;
                $product_metal->metal_id = $metalO['metal']['id'];
                $product_metal->volume = $metalO['volume'];
                $product_metal->weight = $metalO['weight'];
                $product_metal->price = $metalO['price'];
                $product_metal->status = 1;
                $product_metal->save();
                $product_price += $metalO['price'];
            }

            foreach ($model_diamond as $diamond0) {
                $product_diamond = new Product_Diamond();
                if ($diamond0->is_editable == 1) {
                    $diamond = DB::table('diamond')->where('size', $input['size'])->where('diamond_color_id', $input['diamond_color_id'])->where('diamond_clarity_id', $input['diamond_clarity_id'])->where('diamond_cut_id', $input['diamond_cut_id'])->where('diamond_origin_id', $input['diamond_origin_id'])->first();
                    if ($diamond == null) {
                        DB::rollBack();
                        return response()->json([
                            'error' => 'The selected diamond doesn\'t exist'
                        ], 403);
                    }
                    if ($diamond->deactivated == true) {
                        DB::rollBack();
                        return response()->json([
                            'error' => 'An items that is include in this model is currently deactivated'
                        ], 403);
                    }
                    $product_diamond->product_id = $product->id;
                    $product_diamond->diamond_id = $diamond->id;
                    $product_diamond->diamond_shape_id = $input['diamond_shape_id'];
                    $product_diamond->count = $diamond0->count;
                    $product_diamond->price = $diamond->price * $diamond0->count;
                    $product_diamond->status = 1;
                    $product_diamond->save();
                } else if ($diamond0->is_editable == 0) {
                    $diamond = DB::table('diamond')->where('size', $diamond0->diamond_size_max)->where('diamond_color_id', $input['diamond_color_id'])->where('diamond_clarity_id', $input['diamond_clarity_id'])->where('diamond_cut_id', $input['diamond_cut_id'])->where('diamond_origin_id', $input['diamond_origin_id'])->first();
                    if ($diamond == null) {
                        DB::rollBack();
                        return response()->json([
                            'error' => 'The selected diamond doesn\'t exist'
                        ], 403);
                    }
                    if ($diamond->deactivated == true) {
                        DB::rollBack();
                        return response()->json([
                            'error' => 'An items that is include in this model is currently deactivated'
                        ], 403);
                    }
                    $product_diamond->product_id = $product->id;
                    $product_diamond->diamond_id = $diamond->id;
                    $product_diamond->diamond_shape_id = $diamond0->diamond_shape_id;
                    $product_diamond->count = $diamond0->count;
                    $product_diamond->price = $diamond->price * $diamond0->count;
                    $product_diamond->status = 1;
                    $product_diamond->save();
                }
            }

            $order = new Order();
            $order->product_id = $product->id;
            $order->account_id = $account_id;
            $order->deposit_has_paid = 0;
            $order->product_price = $product_price;
            $order->profit_rate = $model->profit_rate;
            $order->production_price = $model->production_price;
            $order->total_price = ($product_price + $model->production_price) * ($model->profit_rate + 100) / 100;
            $order->order_type_id = 2;
            $order->order_status_id = 1;
            $order->note = $input['note'];
            $order->saleStaff_id = 4;
            $order->productionStaff_id = 2;
            $order->created = Carbon::createFromTimestamp(time())->format('Y-m-d H:i:s');
            $order->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Order Succesfully Created',
        ]);
    }
    public function reassign_order(Request $request)
    {
        $input = json_decode($request->input('assigned_information'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        DB::beginTransaction();
        try {
            $order = DB::table('orders')->where('id', $input['order_id'])->first();
            if($order->order_status_id == 7){
                DB::rollback();
                return response()->json([
                    'error' => 'The selected Order has been cancelled'
                ],403);
            }
            $saleStaff_id = isset($input['saleStaff_id']) ? $input['saleStaff_id'] : null;
            $designStaff_id = isset($input['designStaff_id']) ? $input['designStaff_id'] : null;
            $productionStaff_id = isset($input['productionStaff_id']) ? $input['productionStaff_id'] : null;
            if(isset($input['note']) && $input['note'] != null){
                DB::table('quote')->where('id', $input['quote_id'])->update([
                    'note' => $input['note']
                ]);
            } 
            DB::table('orders')->where('id', $input['order_id'])->update([
                'saleStaff_id' => $saleStaff_id,
                'designStaff_id' => $designStaff_id,
                'productionStaff_id' => $productionStaff_id
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Successfully reassign'
        ], 201);
    }
    public function cancel_order(Request $request)
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
            $order = DB::table('orders')->where('id', $input['order_id'])->first();
            if ($order->order_status_id == 6) {
                return response()->json([
                    'error' => 'Order has already been complete, action can\'t be perform'
                ],403);
            }
            DB::table('orders')->where('id', $input['order_id'])->update([
                'order_status_id' => 7,
                'note' => $input['note']
            ]);
            DB::table('design_process')->where('order_id', $input['order_id'])->update([
                'design_process_status_id' => 4,
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
    public function get_order_status_list()
    {
        return response()->json([
            DB::table('order_status')->get()
        ]);
    }
    public function get_order_type_list()
    {
        return response()->json([
            DB::table('order_type')->get()
        ]);
    }
    public function get_detail(Request $request) //chưa test
    {
        $input = json_decode($request->input('order_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $order = DB::table('order')->where('id', $input)->first();

        $product = DB::table('product')->where('id', $order->product_id)->first();
        $model = DB::table('model')->where('id', $product->model_id)->first();
        if ($model != null) {
            $model->mounting_type = DB::table('mounting_type')->where('id', $model->mounting_type_id)->first();
            $model->mounting_style = DB::table('mounting_style')->where('id', $model->mounting_style_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('MODEL_URL');
            $model->imageUrl = $OGurl . $url . $model->id . "/" . $model->imageUrl;
            unset($model->mounting_type_id);
            unset($model->mounting_style_id);
        }

        $product->mounting_type = DB::table('mounting_type')->where('id', $product->mounting_type_id)->first();
        unset($product->mounting_type_id);
        $product->model = $model;
        unset($product->model_id);
        $OGurl = env('ORIGIN_URL');
        $url = env('ORDER_URL');
        $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;

        $product_diamond = DB::table('product_diamond')->where('product_id', $product->id)->get();
        $product_diamond->map(function ($product_diamond) {
            $diamond = DB::table('diamond')->where('id', $product_diamond->diamond_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('DIAMOND_URL');
            $diamond->imageUrl = $OGurl . $url . $diamond->id . "/" . $diamond->imageUrl;
            $product_diamond->diamond = $diamond;

            $product_diamond->diamond_shape_id = DB::table('diamond_shape_id')->where('id', $product_diamond->diamond_shape_id)->first();
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
        $product->product_diamond = $product_metal;

        $order->product = $product;
        unset($order->product_id);

        $account = DB::table('account')->where('id', $order->account_id)->first();
        $account->role = DB::table('role')->where('id', $account->role_id)->first();
        unset($account->role_id);
        if (!$account->google_id) {
            $OGurl = env('ORIGIN_URL');
            $url = env('ACCOUNT_URL');
            $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
        }
        $order->account = $account;
        unset($order->account_id);

        $sale_staff = DB::table('account')->where('id', $order->saleStaff_id)->first();
        $sale_staff->role = DB::table('role')->where('id', $sale_staff->role_id)->first();
        unset($sale_staff->role_id);
        if (!$sale_staff->google_id) {
            $OGurl = env('ORIGIN_URL');
            $url = env('ACCOUNT_URL');
            $sale_staff->imageUrl = $OGurl . $url . $sale_staff->id . "/" . $sale_staff->imageUrl;
        }
        $order->sale_staff = $sale_staff;
        unset($order->saleStaff_id);

        $design_staff = DB::table('account')->where('id', $order->designStaff_id)->first();
        $design_staff->role = DB::table('role')->where('id', $design_staff->role_id)->first();
        unset($design_staff->role_id);
        if (!$design_staff->google_id) {
            $OGurl = env('ORIGIN_URL');
            $url = env('ACCOUNT_URL');
            $design_staff->imageUrl = $OGurl . $url . $design_staff->id . "/" . $design_staff->imageUrl;
        }
        $order->design_staff = $design_staff;
        unset($order->designStaff_id);

        $production_staff = DB::table('account')->where('id', $order->productionStaff_id)->first();
        $production_staff->role = DB::table('role')->where('id', $production_staff->role_id)->first();
        unset($production_staff->role_id);
        if (!$production_staff->google_id) {
            $OGurl = env('ORIGIN_URL');
            $url = env('ACCOUNT_URL');
            $production_staff->imageUrl = $OGurl . $url . $production_staff->id . "/" . $production_staff->imageUrl;
        }
        $order->production_staff = $production_staff;
        unset($order->productionStaff_id);

        $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
        unset($order->order_status_id);
        $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
        unset($order->order_type_id);

        $OGurl = env('ORIGIN_URL');
        $url = env('ORDER_URL');
        $order->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;

        return response()->json([
            'order_detail' => $order
        ]);
    }
    public function confirm_payment(Request $request)
    {
    }
    public function get_assigned_staff(Request $request)
    {
        $input = json_decode($request->input('order_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $order = DB::table('orders')->where('id', $input)->first();
        if ($order->saleStaff_id != null) {
            $current_sale_staff = DB::table('account')->where('id', $order->saleStaff_id)->first();
            if (!$current_sale_staff->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $current_sale_staff->imageUrl = $OGurl . $url . $current_sale_staff->id . '/' . $current_sale_staff->id . "/" . $current_sale_staff->imageUrl;
            }
            $current_sale_staff->role = DB::table('role')->where('id', $current_sale_staff->role_id)->first();
            unset($current_sale_staff->role_id);
        } else $current_sale_staff = null;

        if ($order->designStaff_id != null) {
            $current_design_staff = DB::table('account')->where('id', $order->designStaff_id)->first();
            if (!$current_design_staff->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $current_design_staff->imageUrl = $OGurl . $url . $current_design_staff->id . '/' . $current_design_staff->id . "/" . $current_design_staff->imageUrl;
            }
            $current_design_staff->role = DB::table('role')->where('id', $current_design_staff->role_id)->first();
            unset($current_design_staff->role_id);
        } else $current_design_staff = null;

        if ($order->productionStaff_id != null) {
            $current_production_staff = DB::table('account')->where('id', $order->productionStaff_id)->first();
            if (!$current_production_staff->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $current_production_staff->imageUrl = $OGurl . $url . $current_production_staff->id . '/' . $current_production_staff->id . "/" . $current_production_staff->imageUrl;
            }
            $current_production_staff->role = DB::table('role')->where('id', $current_production_staff->role_id)->first();
            unset($current_production_staff->role_id);
        } else $current_production_staff = null;

        $sale_query = Account::query();
        $design_query = Account::query();
        $production_query = Account::query();
        if ($current_sale_staff != null) {
            $sale_query->where('id', $current_sale_staff->id);
        }
        if ($current_design_staff != null) {
            $design_query->where('id', $current_design_staff->id);
        }
        if ($current_production_staff != null) {
            $production_query->where('id', $current_production_staff->id);
        }

        $sale_list = $sale_query->where('role_id', 2)->get();
        $sale_list->map(function ($sale) {
            $sale->role = DB::table('role')->where('id', $sale->role_id)->first();
            if (!$sale->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $sale->imageUrl = $OGurl . $url . $sale->id . '/' . $sale->id . "/" . $sale->imageUrl;
            }
            unset($sale->role_id);
            return $sale;
        });
        $design_list = $design_query->where('role_id', 3)->get();
        $design_list->map(function ($design) {
            $design->role = DB::table('role')->where('id', $design->role_id)->first();
            if (!$design->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $design->imageUrl = $OGurl . $url . $design->id . '/' . $design->id . "/" . $design->imageUrl;
            }
            unset($design->role_id);
            return $design;
        });
        $production_list = $production_query->where('role_id', 4)->get();
        $production_list->map(function ($production) {
            $production->role = DB::table('role')->where('id', $production->role_id)->first();
            if (!$production->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $production->imageUrl = $OGurl . $url . $production->id . '/' . $production->id . "/" . $production->imageUrl;
            }
            unset($production->role_id);
            return $production;
        });

        return response()->json([
            'current_sale_staff' => $current_sale_staff,
            'current_design_staff' => $current_design_staff,
            'current_production_staff' => $current_production_staff,
            'sale_staff_list' => $sale_list,
            'design_staff_list' => $design_list,
            'production_staff_list' => $production_list
        ]);
    }
    public function get_assigned_orders_sale(Request $request)
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
        $order_list = DB::table('orders')->where('saleStaff_id', $input)->get();
        $order_list->map(function ($order) {
            $product = DB::table('product')->where('id', $order->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            $order->product = $product;

            $account = DB::table('account')->where('id', $order->account_id)->first();
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . '/' . $account->id . "/" . $account->imageUrl;
            }
            $order->account = $account;
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            unset($order->order_status_id);
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            unset($order->order_type_id);
            unset($order->product_id);
            unset($order->account_id);
            return $order;
        });
        return response()->json([
            $order_list
        ]);
    }
    public function get_assigned_order_design(Request $request)
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
        if ($account->role_id != 3) {
            return response()->json([
                'error' => 'Invalid User (User is Unauthorized)'
            ], 500);
        }
        $order_list = DB::table('orders')->where('designStaff_id', $input)->get();
        $order_list->map(function ($order) {
            $product = DB::table('product')->where('id', $order->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            $order->product = $product;

            $account = DB::table('account')->where('id', $order->account_id)->first();
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . '/' . $account->id . "/" . $account->imageUrl;
            }
            $order->account = $account;
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            unset($order->order_status_id);
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            unset($order->order_type_id);
            unset($order->product_id);
            unset($order->account_id);
            return $order;
        });
        return response()->json([
            $order_list
        ]);
    }
    public function get_assigned_order_production(Request $request)
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
        if ($account->role_id != 4) {
            return response()->json([
                'error' => 'Invalid User (User is Unauthorized)'
            ], 500);
        }
        $order_list = DB::table('orders')->where('productionStaff_id', $input)->get();
        $order_list->map(function ($order) {
            $product = DB::table('product')->where('id', $order->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            $order->product = $product;

            $account = DB::table('account')->where('id', $order->account_id)->first();
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . '/' . $account->id . "/" . $account->imageUrl;
            }
            $order->account = $account;
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            unset($order->order_status_id);
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            unset($order->order_type_id);
            unset($order->product_id);
            unset($order->account_id);
            return $order;
        });
        return response()->json([
            $order_list
        ]);
    }
    public function request_design_process(Request $request) //chưa test
    {
        $input = json_decode($request->input('new_design_process'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $order = DB::table('order')->where('id', $input['order_id'])->first();

        DB::beginTransaction();
        try { //check nếu imageUrl có localhost, thì không thêm j cả còn nếu là base64 thì thêm name vào
            DB::table('design_process')->insert([
                'order_id' => $input['order_id'],
                'imageUrl' => $input['imageUrl'],
                'note' => $input['note'],
                'mounting_type_id' => $input['mounting_type_id'],
                'mounting_size' => $input['mounting_size'],
                'design_process_status_id' => 1,
                'production_price' => 0,
                'profit_rate' => 0,
                'created' => Carbon::createFromTimestamp(time())->format('Y-m-d H:i:s'),
            ]);

            if (isset($input['diamond_list']) && $input['diamond_list'] != null) {
                foreach ($input['diamond_list'] as $diamond1) {
                    $product_diamond = new Product_Diamond();
                    $product_diamond->product_id = $order->product_id;
                    $product_diamond->diamond_id = $diamond1['diamond']['id'];
                    $product_diamond->count = $diamond1['count'];
                    $product_diamond->price = $diamond1['price'];
                    $product_diamond->diamond_shape = $diamond1['diamond_shape']['id'];
                    $product_diamond->status = false;
                    $product_diamond->save();
                }
            }

            if (isset($input['metal_list']) && $input['metal_list'] != null) {
                foreach ($input['metal_list'] as $metal1) {
                    $product_metal = new Product_Metal();
                    $product_metal->product_id = $order->product_id;
                    $product_metal->metal_id = $metal1['metal']['id'];
                    $product_metal->price = $metal1['price'];
                    $product_metal->volume = $metal1['volume'];
                    $product_metal->weight = $metal1['weight'];
                    $product_metal->status = false;
                    $product_metal->save();
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Request Design Process Complete'
        ], 404);
    }
    public function repricing_design_process(Request $request) //chưa test
    {
        $input = json_decode($request->input('repricing_design_process'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $design_process = DB::table('design_process')->where('id', $input['design_process_id'])->first();
        DB::beginTransaction();
        try {
            DB::table('design_process')->where('id', $input['design_process_id'])->update([
                'note' => $input['note'],
                'production_price' => $input['production_price'],
                'design_process_status_id' => 2
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
    }
    public function approve_design_process(Request $request) //chưa test
    {
        $input = json_decode($request->input('approval'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        DB::beginTransaction();
        try {
            $design_process = DB::table('design_process')->where('id', $input['design_process_id'])->first();
            $order = DB::table('orders')->where('id', $design_process->order_id)->first();
            if ($input['approve']) {
                if (DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 0) != null) {
                    DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 1)->update([
                        'status' => 2
                    ]);
                    DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 0)->update([
                        'status' => 1
                    ]);
                    $product_diamond = DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 4)->get();
                    if ($product_diamond) {
                        foreach ($product_diamond as $product) {
                            DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 3)->where('diamond_id', $product_diamond->diamond_id)->delete();
                            DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 4)->where('diamond_id', $product_diamond->diamond_id)->update([
                                'status' => 3
                            ]);
                        }
                    }
                }
                if (DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 0) != null) {
                    DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 1)->update([
                        'status' => 2
                    ]);
                    DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 0)->update([
                        'status' => 1
                    ]);
                    $product_metal = DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 4)->get();
                    if ($product_metal) {
                        foreach ($product_metal as $product) {
                            DB::table('productproduct_metal_diamond')->where('product_id', $order->product_id)->where('status', 3)->where('metal_id', $product_metal->metal_id)->delete();
                            DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 4)->where('metal_id', $product_metal->metal_id)->update([
                                'status' => 3
                            ]);
                        }
                    }
                }

                DB::table('design_process')->where('id', $input['design_process_id'])->update([
                    'design_process_status_id' => 3
                ]);

                DB::table('orders')->where('id', $design_process->order_id)->update([
                    'production_price' => $design_process->production_price,
                    'profit_rate' => $design_process->profit_rate,
                    'mounting_type_id' => $design_process->mounting_type_id,
                    'mounting_size' => $design_process->mounting_size,
                    'imageUrl' => $design_process->imageUrl,
                ]);

                $product_price = 0;
                $product_diamond = DB::table('product_diamond')->where('product_id', $order->product_id)->get();
                $product_metal = DB::table('product_metal')->where('product_id', $order->product_id)->get();
                foreach ($product_diamond as $diamond) {
                    $product_price += $diamond->price;
                }
                foreach ($product_metal as $metal) {
                    $product_price += $metal->metal;
                }
                if (($product_price * ($order->profit_rate + 100) / 100 + $design_process->production_price) > ($order->total_price) * 50 / 100) {
                    DB::table('orders')->where('id', $design_process->order_id)->update([
                        'order_status_id' => 1
                    ]);
                } else {
                    DB::table('orders')->where('id', $design_process->order_id)->update([
                        'order_status_id' => 3
                    ]);
                }
            } else {
                DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 0)->delete();
                DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 0)->delete();
                DB::table('design_process')->where('id', $input['design_process_id'])->update([
                    'design_process_status_id' => 4
                ]);
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
    }
    public function cancel_design_process(Request $request) //chưa test
    {
        $input = json_decode($request->input('design_process_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $design_process = DB::table('design_process')->where('id', $input)->first();
        $order = DB::table('orders')->where('id', $design_process->order_id)->first();
        DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 0)->delete();
        DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 0)->delete();
        DB::table('design_process')->where('id', $input['design_process_id'])->update([
            'design_process_status_id' => 4
        ]);
        return response()->json([
            'success' => 'Cancel Successfully'
        ], 201);
    }
    public function get_design_process_status_list(Request $request) //chưa test
    {
        return response()->json([
            DB::table('desing_process_status')->get()
        ]);
    }
    public function get_design_process_list(Request $request) //chưa xong, cần chỉnh sửa
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
        $id = (int) $decodedToken['id'];
        $account = Account::find($id);

        $input = json_decode($request->input('order_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }

        if ($account->role_id == 1) {
            $design_list = DB::table('design_process')->whereNot('design_process_status_id', 1)->orderBy('design_process_status_id', 'asc')->get();
        } else if ($account->role_id == 2) {
            $order_list = DB::table('orders')->where('saleStaff_id', $account->id)->whereNot('order_status_id', 7)->orderby('order_status_id', 'asc')->get();
            foreach ($order_list as $order) {
                $design_list = DB::table('design_process')->where('order_id', $order->id)->orderBy('design_process_status_id', 'asc')->get();
            }
        } else if ($account->role_id == 3) {
            $order_list = DB::table('orders')->where('designStaff_id', $account->id)->whereNot('order_status_id', 7)->orderby('order_status_id', 'asc')->get();
            foreach ($order_list as $order) {
                $design_list = DB::table('design_process')->where('order_id', $order->id)->orderBy('design_process_status_id', 'asc')->get();
            }
        } else {
            return response()->json([
                'error' => 'Invalid User (User is Unauthorized)'
            ], 500);
        }
        $design_list->map(function ($design) {
            $design->mounting_type = DB::table('mounting_type')->where('id', $design->mounting_type_id)->first();
            $design->design_process_status = DB::table('design_process_status')->where('id', $design->design_process_status_id)->first();
            unset($design->mounting_type_id);
            unset($design->design_process_status_id);
            return $design;
        });
        return response()->json([
            $design_list
        ]);
    }
    public function get_design_process_detail(Request $request) //chưa test
    {
        $input = json_decode($request->input('design_process_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $design_process = DB::table('design_process')->where('id', $input)->first();
        $order = DB::table('order')->where('id', $design_process->order_id)->first();

        $product = DB::table('product')->where('id', $order->product_id)->first();

        $product->mounting_type = DB::table('mounting_type')->where('id', $product->mounting_type_id)->first();
        unset($product->mounting_type_id);


        $product_diamond = DB::table('product_diamond')->where('product_id', $product->id)->get();
        $product_diamond->map(function ($product_diamond) {
            $product_diamond->diamond = DB::table('diamond')->where('id', $product_diamond->diamond_id)->first();
            $product_diamond->diamond_shape_id = DB::table('diamond_shape_id')->where('id', $product_diamond->diamond_shape_id)->first();
            unset($product_diamond->diamond_id);
            unset($product_diamond->diamond_shape_id);
            return $product_diamond;
        });
        $product->product_diamond = $product_diamond;

        $product_metal = DB::table('product_metal')->where('product_id', $product->id)->get();
        $product_metal->map(function ($product_metal) {
            $product_metal->metal = DB::table('metal')->where('id', $product_metal->metal_id)->first();
            unset($product_metal->metal_id);
            return $product_metal;
        });
        $product->product_diamond = $product_metal;

        $order->product = $product;
        unset($order->product_id);

        $account = DB::table('account')->where('id', $order->account_id)->first();
        $account->role = DB::table('role')->where('id', $account->role_id)->first();
        unset($account->role_id);
        $order->account = $account;
        unset($order->account_id);

        $sale_staff = DB::table('account')->where('id', $order->saleStaff_id)->first();
        $sale_staff->role = DB::table('role')->where('id', $sale_staff->role_id)->first();
        unset($sale_staff->role_id);
        $order->sale_staff = $sale_staff;
        unset($order->saleStaff_id);

        $design_staff = DB::table('account')->where('id', $order->designStaff_id)->first();
        $design_staff->role = DB::table('role')->where('id', $design_staff->role_id)->first();
        unset($design_staff->role_id);
        $order->design_staff = $design_staff;
        unset($order->designStaff_id);

        $production_staff = DB::table('account')->where('id', $order->productionStaff_id)->first();
        $production_staff->role = DB::table('role')->where('id', $production_staff->role_id)->first();
        unset($production_staff->role_id);
        $order->production_staff = $production_staff;
        unset($order->productionStaff_id);

        $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
        unset($order->order_status_id);
        $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
        unset($order->order_type_id);

        $design_process->order = $order;
        $design_process->mounting_type = DB::table('mounting_type')->where('id', $design_process->mounting_type_id)->first();
        $design_process->design_process_status = DB::table('design_process_status')->where('id', $design_process->design_process_status_id)->first();
        unset($design_process->mounting_type_id);
        unset($design_process->design_process_status_id);
        unset($design_process->order_id);

        $product_price = 0;
        $product_diamond_current = DB::table('product_diamond')->where('id', $order->product_id)->get();
        foreach ($product_diamond_current as $product) {
            if ($product->status == 0) {
                $product_price += $product->price;
            }
            if ($product->status == 1) {
                $check = DB::table('product_diamond')->where('diamond_id', $product->diamond_id)->where('status', 0)->get();
                if ($check == null) {
                    $product_price += $product->price;
                }
            }
        }
        $product_metal_current = DB::table('product_metal')->where('id', $order->product_id)->get();
        foreach ($product_metal_current as $product) {
            if ($product->status == 0) {
                $product_price += $product->price;
            }
            if ($product->status == 1) {
                $check = DB::table('product_metal')->where('metal_id', $product->metal_id)->where('status', 0)->get();
                if ($check == null) {
                    $product_price += $product->price;
                }
            }
        }
        $design_process->total_price = $product_price * ($design_process->profit_rate + 100) / 100 + $design_process->production_price;
        $design_process->product_price = $product_price;

        return response()->json([
            'design_process' => $design_process
        ]);
    }
    public function add_design_updating(Request $request) //chưa test
    {
        $input = json_decode($request->input('new_design_updating'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        DB::beginTransaction();
        try {
            DB::table('design_updating')->insert([
                'order_id' => $input['order_id'],
                'imageUrl' => $input['imageUrl'],
                'content' => $input['content'],
                'created' => Carbon::createFromTimestamp(time())->format('Y-m-d H:i:s')
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'Success' => 'Successfully added'
        ]);
    }
    public function get_design_updating_list(Request $request) //chưa test
    {
        $input = json_decode($request->input('order_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        return response()->json([
            DB::table('design_updating')->where('order_id', $input)->get()
        ]);
    }
    public function get_production_status_list() //chưa test
    {
        return response()->json([
            DB::table('production_status')->get()
        ]);
    }
    public function add_production_process(Request $request) //chưa test
    {
        $input = json_decode($request->input('new_production_process'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $production_process = DB::table('production_process')->where('order_id', $input)->orderBy('created', 'desc')->first();
        $previous_status = 0;
        DB::beginTransaction();
        try {
            if ($production_process != null) {
                $previous_status = $production_process->production_status_id;
            }
            if ($input['production_status'] - $previous_status == 1) {
                DB::table('production_updating')->insert([
                    'order_id' => $input['order_id'],
                    'production_status_id' => $input['production_status']['id'],
                    'imageUrl' => $input['imageUrl'],
                    'created' => Carbon::createFromTimestamp(time())->format('Y-m-d H:i:s')
                ]);
            } else {
                return response()->json([
                    'error' => 'Production Status Can\'t be 2 status higher than the previous status'
                ], 0);
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'Success' => 'Production Process Added'
        ], 201);
    }
    public function get_production_process_list(Request $request) //chưa test
    {
        $input = json_decode($request->input('order_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        return response()->json([
            DB::table('production_process')->where('order_id', $input)->orderBy('created', 'asc')->get()
        ]);
    }
    public function production_complete(Request $request) //chưa test
    {
        $input = json_decode($request->input('order_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $production_process = DB::table('production_process')->where('order_id', $input)->orderBy('created', 'asc')->get();
        $previous_status = 0;
        $complete = true;
        foreach ($production_process as $production) {
            $current_status = $production->production_status_id;
            if ($current_status - $previous_status == 1) {
                $previous_status = $current_status;
            } elseif ($current_status <= $previous_status) {
                $previous_status = $current_status;
            } else {
                $complete = false;
                break;
            }
        }
        if ($complete) {
            DB::table('order')->where('id', $input)->update([
                'order_status_id' => 4
            ]);
        } else {
            return response()->json([
                'error' => 'The condition to complete the Order hasn\'t met'
            ], 0);
        }
    }
    public function get_product_detail(Request $request) //chưa test
    {
        $input = json_decode($request->input('product_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $product = DB::table('product')->where('id', $input)->first();
        $model = DB::table('model')->where('id', $product->model_id)->first();
        if ($model != null) {
            $model->mounting_type = DB::table('mounting_type')->where('id', $model->mounting_type_id)->first();
            $model->mounting_style = DB::table('mounting_style')->where('id', $model->mounting_style_id)->first();
            unset($model->mounting_type_id);
            unset($model->mounting_style_id);

            $model_shape = DB::table('model_diamondshape')->where('model_id', $model->id)->get();
            $model_shape->map(function ($model_shape) {
                $model_shape->diamond_shape = DB::table('diamond_shape')->where('id', $model_shape->diamond_shape_id)->first();
                unset($model_shape->diamond_shape_id);
                return $model_shape;
            });
            $model->model_diamond_shape = $model_shape;

            $model_diamond = DB::table('model_diamond')->where('model_id', $model->id)->get();
            $model_diamond->map(function ($model_diamond) {
                $model_diamond->diamond_shape = DB::table('diamond_shape')->where('id', $model_diamond->diamond_shape_id)->first();
                unset($model_diamond->diamond_shape_id);
                return $model_diamond;
            });
            $model->model_diamond = $model_diamond;

            $model_metal = DB::table('model_metal')->where('model_id', $model->id)->get();
            $model_metal->map(function ($model_metal) {
                $metal = DB::table('metal')->where('id', $model_metal->metal_id)->first();
                $OGurl = env('ORIGIN_URL');
                $url = env('METAL_URL');
                $metal->imageUrl = $OGurl . $url . $metal->id . '/' . $metal->imageUrl;
                $model_metal->metal = $metal;
                unset($model_metal->metal_id);
                return $model_metal;
            });
            $model->model_metal = $model_metal;
            $OGurl = env('ORIGIN_URL');
            $url = env('MODEL_URL');
            $model->imageUrl = $OGurl . $url . $model->id . '/' . $model->imageUrl;
        }


        $product->mounting_type = DB::table('mounting_type')->where('id', $product->mounting_type_id)->first();
        unset($product->mounting_type_id);
        $product->model = $model;
        unset($product->model_id);

        $product_diamond = DB::table('product_diamond')->where('product_id', $product->id)->get();
        $product_diamond->map(function ($product_diamond) {
            $diamond = DB::table('diamond')->where('id', $product_diamond->diamond_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('DIAMOND_URL');
            $diamond->imageUrl = $OGurl . $url . $diamond->id . '/' . $diamond->imageUrl;
            $product_diamond->diamond = $diamond;
            $product_diamond->diamond_shape_id = DB::table('diamond_shape_id')->where('id', $product_diamond->diamond_shape_id)->first();
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
        $product->product_diamond = $product_metal;
        $OGurl = env('ORIGIN_URL');
        $url = env('ORDER_ID');
        $product->imageUrl = $OGurl . $url . $product->id . '/' . $product->imageUrl;

        return response()->json([
            $product
        ]);
    }
}
