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
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use App\Mail\Email;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Tymon\JWTAuth\Exceptions\JWTException;
use Throwable;
use PayOS\PayOS;
use Barryvdh\DomPDF\Facade\Pdf;

use function Pest\Laravel\json;

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
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
            $order->account = $account;
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            unset($order->order_status_id);
            unset($order->order_type_id);
            unset($order->account_id);
            unset($order->product_id);
            $order->created = Carbon::parse($order->created)->format('H:i:s d/m/Y');
            if ($order->delivery_date != null) {
                $order->delivery_date = Carbon::parse($order->delivery_date)->format('H:i:s d/m/Y');
            }
            if ($order->guarantee_expired_date != null) {
                $order->guarantee_expired_date = Carbon::parse($order->guarantee_expired_date)->format('H:i:s d/m/Y');
            }
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
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
            $order->account = $account;
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            unset($order->order_status_id);
            unset($order->order_type_id);
            unset($order->account_id);
            unset($order->product_id);
            $order->created = Carbon::parse($order->created)->format('H:i:s d/m/Y');
            if ($order->delivery_date != null) {
                $order->delivery_date = Carbon::parse($order->delivery_date)->format('H:i:s d/m/Y');
            }
            if ($order->guarantee_expired_date != null) {
                $order->guarantee_expired_date = Carbon::parse($order->guarantee_expired_date)->format('H:i:s d/m/Y');
            }
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
            } catch (JWTException $e) {
                try {
                    $decodedToken = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Invalid token'], 401);
                }
            }
        }
        try {
            $input = $decodedToken['id'];
        } catch (Throwable $e) {
            $input = $decodedToken->id;
        }

        $customize_order_list = DB::table('orders')->where('account_id', $input)->where('order_type_id', 2)->orderBy('order_status_id', 'asc')->get();
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
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
            $order->account = $account;
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            unset($order->order_status_id);
            unset($order->order_type_id);
            unset($order->account_id);
            unset($order->product_id);
            $order->created = Carbon::parse($order->created)->format('H:i:s d/m/Y');
            if ($order->delivery_date != null) {
                $order->delivery_date = Carbon::parse($order->delivery_date)->format('H:i:s d/m/Y');
            }
            if ($order->guarantee_expired_date != null) {
                $order->guarantee_expired_date = Carbon::parse($order->guarantee_expired_date)->format('H:i:s d/m/Y');
            }

            $sale_staff = DB::table('account')->where('id', $order->saleStaff_id)->first();
            if ($sale_staff != null) {
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
            }

            $order->sale_staff = $sale_staff;
            unset($order->saleStaff_id);

            $design_staff = DB::table('account')->where('id', $order->designStaff_id)->first();
            if ($design_staff != null) {
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
            }
            $order->design_staff = $design_staff;
            unset($order->designStaff_id);

            $production_staff = DB::table('account')->where('id', $order->productionStaff_id)->first();
            if ($production_staff != null) {
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
            }
            $order->production_staff = $production_staff;
            unset($order->productionStaff_id);
            return $order;
        });

        $template_order_list = DB::table('orders')->where('account_id', $input)->where('order_type_id', 1)->orderBy('order_status_id', 'asc')->get();
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
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
            $order->account = $account;
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            unset($order->order_status_id);
            unset($order->order_type_id);
            unset($order->account_id);
            unset($order->product_id);
            $order->created = Carbon::parse($order->created)->format('H:i:s d/m/Y');
            if ($order->delivery_date != null) {
                $order->delivery_date = Carbon::parse($order->delivery_date)->format('H:i:s d/m/Y');
            }
            if ($order->guarantee_expired_date != null) {
                $order->guarantee_expired_date = Carbon::parse($order->guarantee_expired_date)->format('H:i:s d/m/Y');
            }

            $sale_staff = DB::table('account')->where('id', $order->saleStaff_id)->first();
            if ($sale_staff != null) {
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
            }

            $order->sale_staff = $sale_staff;
            unset($order->saleStaff_id);

            $design_staff = DB::table('account')->where('id', $order->designStaff_id)->first();
            if ($design_staff != null) {
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
            }
            $order->design_staff = $design_staff;
            unset($order->designStaff_id);

            $production_staff = DB::table('account')->where('id', $order->productionStaff_id)->first();
            if ($production_staff != null) {
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
            }
            $order->production_staff = $production_staff;
            unset($order->productionStaff_id);
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
                'error' => 'No input received'
            ], 403);
        }
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
                    return response()->json(['error' => 'Invalid token'], 401);
                }
            }
        }
        try {
            $account_id = $decodedToken['id'];
        } catch (Throwable $e) {
            $account_id = $decodedToken->id;
        }
        $account = DB::table('account')->where('id', $account_id)->first();
        if ($account->deactivated) {
            return response()->json([
                'error' => 'The selected customer account has been deactivated'
            ], 403);
        } else {
            if (!$account->status) {
                return response()->json([
                    'error' => 'The selected customer account hasn\'t been activated'
                ], 403);
            }
        }
        $product_price = 0;
        DB::beginTransaction();
        try {
            $model = DB::table('model')->where('id', $input['model_id'])->first();
            if ($model == null) {
                return response()->json([
                    'error' => 'The selected model doesn\'t exist'
                ], 403);
            }
            if ($model->deactivated == 1) {
                return response()->json([
                    'error' => 'The selected model has been deactivate'
                ], 403);
            }
            $model_diamond = DB::table('model_diamond')->where('model_id', $model->id)->get();
            $metal_1 = DB::table('metal')->where('id', $input['metal_1_id'])->first();
            if ($metal_1 == null) {
                DB::rollBack();
                return response()->json([
                    'error' => 'Unsuccessful (no main metal found)'
                ], 403);
            } else if ($metal_1->deactivated == true) {
                DB::rollBack();
                return response()->json([
                    'error' => 'An items that is include in this model is currently deactivated'
                ], 403);
            } else {
                $metal_1_id = $metal_1->id;
            }
            $metal_2 = DB::table('metal')->where('id', $input['metal_2_id'])->first();
            if ($metal_2 == null) {
                $metal_2_id = 0;
            } else if ($metal_2->deactivated == true) {
                DB::rollBack();
                return response()->json([
                    'error' => 'An items that is include in this model is currently deactivated'
                ], 403);
            } else {
                $metal_2_id = $metal_2->id;
            }
            $destinationPath = public_path('image/Final_Template/' . $input['model_id'] . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $input['diamond_shape_id']);
            if (!file_exists($destinationPath)) {
                return response()->json([
                    'error' => 'Product is not available'
                ], 403);
            }
            $imageUrl = 'main.jpg';

            $mounting_type_id = $model->mounting_type_id;

            $product = new Product();
            $product->imageUrl = $imageUrl;
            $product->mounting_type_id = $mounting_type_id;
            $product->model_id = $input['model_id'];
            $product->mounting_size = $input['mounting_size'];
            $product->save();

            $fileName = 'main.jpg';
            $productPath = public_path('image/Order/' . $product->id);
            if (!file_exists($productPath)) {
                mkdir($productPath, 0755, true);
            }
            $destinationFilePath = public_path('image/Order/' . $product->id . '/' . $fileName);
            $sourceFilePath = public_path('image/Final_Template/' . $input['model_id'] . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $input['diamond_shape_id'] . '/' . $fileName);
            File::copy($sourceFilePath, $destinationFilePath);
            DB::table('product')->where('id', $product->id)->update([
                'imageUrl' => $fileName
            ]);

            $size_to_volume = DB::table('size_to_volume')->where('size', $input['mounting_size'])->first();
            $model_metal1 = DB::table('model_metal')->where('metal_id', $metal_1->id)->where('model_id', $input['model_id'])->where('is_main', 1)->first();
            if ($model_metal1 == null) {
                return response()->json([
                    'error' => 'The selected template doesn\'t contain the selected main metal'
                ], 403);
            }
            if ($metal_2 != null) {
                $model_metal2 = DB::table('model_metal')->where('metal_id', $metal_2->id)->where('model_id', $input['model_id'])->where('is_main', 0)->first();
                if ($model_metal2 == null) {
                    return response()->json([
                        'error' => 'The selected template doesn\'t contain the selected secondary metal'
                    ], 403);
                }
            }


            $product_metal1 = new Product_Metal();
            $product_metal1->product_id = $product->id;
            $product_metal1->metal_id = $metal_1->id;
            if ($model->mounting_type_id != 3) {
                $product_metal1->volume = ceil($size_to_volume->volume * $model_metal1->percentage / 100);
                $product_metal1->weight = ceil($size_to_volume->volume * $model_metal1->percentage / 100 * $metal_1->specific_weight);
                $product_metal1->price = ceil($size_to_volume->volume * $model_metal1->percentage / 100 * $metal_1->specific_weight * $metal_1->sale_price_per_gram);
            } else {
                $product_metal1->volume = ceil($model->volume * $model_metal1->percentage / 100);
                $product_metal1->weight = ceil($model->volume * $model_metal1->percentage / 100 * $metal_1->specific_weight);
                $product_metal1->price = ceil($model->volume * $model_metal1->percentage / 100 * $metal_1->specific_weight * $metal_1->sale_price_per_gram);
            }
            $product_metal1->status = 1;
            $product_metal1->save();
            $product_price += $product_metal1->price;

            if ($metal_2 != null) {
                $product_metal2 = new Product_Metal();
                $product_metal2->product_id = $product->id;
                $product_metal2->metal_id = $metal_2->id;
                if ($model->mounting_type_id != 3) {
                    $product_metal2->volume = ceil($size_to_volume->volume * $model_metal2->percentage / 100);
                    $product_metal2->weight = ceil($size_to_volume->volume * $model_metal2->percentage / 100 * $metal_2->specific_weight);
                    $product_metal2->price = ceil($size_to_volume->volume * $model_metal2->percentage / 100 * $metal_2->specific_weight * $metal_2->sale_price_per_gram);
                } else {
                    $product_metal2->volume = ceil($model->volume * $model_metal2->percentage / 100);
                    $product_metal2->weight = ceil($model->volume * ($model_metal2->percentage / 100) * $metal_2->specific_weight);
                    $product_metal2->price = ceil($model->volume * ($model_metal2->percentage / 100) * $metal_2->specific_weight * $metal_2->sale_price_per_gram);
                }
                $product_metal2->status = 1;
                $product_metal2->save();
                $product_price += $product_metal2->price;
            }

            foreach ($model_diamond as $diamond0) {
                $product_diamond = new Product_Diamond();
                if ($diamond0->is_editable == 1) {
                    $diamond = DB::table('diamond')->where('size', $input['diamond_size'])->where('diamond_color_id', $input['diamond_color_id'])->where('diamond_clarity_id', $input['diamond_clarity_id'])->where('diamond_cut_id', $input['diamond_cut_id'])->where('diamond_origin_id', $input['diamond_origin_id'])->first();
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
                    $product_diamond->price = ceil($diamond->price * $diamond0->count);
                    $product_diamond->status = 1;
                    $product_price += $diamond->price * $diamond0->count;
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
                    $product_diamond->price = ceil($diamond->price * $diamond0->count);
                    $product_diamond->status = 1;
                    $product_price += $diamond->price * $diamond0->count;
                    $product_diamond->save();
                }
            }

            $order = new Order();
            $order->product_id = $product->id;
            $order->account_id = $account_id;
            $order->deposit_has_paid = 0;
            $order->product_price = ceil($product_price);
            $order->profit_rate = $model->profit_rate;
            $order->production_price = ceil($model->production_price);
            $order->total_price = ceil(($product_price) * ($model->profit_rate + 100) / 100 + $model->production_price);
            $order->order_type_id = 1;
            $order->order_status_id = 1;
            $order->note = $input['note'];
            $order->created = Carbon::now()->format('Y-m-d H:i:s');
            $order->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
        return response()->json([
            'success' => 'Order succesfully created',
        ]);
    }
    public function reassign_order(Request $request) //
    {
        $input = json_decode($request->input('assigned_information'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
        DB::beginTransaction();
        try {
            $order = DB::table('orders')->where('id', $input['order_id'])->first();
            if ($order->order_status_id >= 4 && $order->order_status_id < 6) {
                DB::rollback();
                return response()->json([
                    'error' => 'The selected order can no longer be reassigned'
                ], 403);
            }
            if ($order->order_status_id == 6) {
                DB::rollback();
                return response()->json([
                    'error' => 'The selected order has already been completed'
                ], 403);
            }
            if ($order->order_status_id == 7) {
                DB::rollback();
                return response()->json([
                    'error' => 'The selected order has already been cancelled'
                ], 403);
            }
            $saleStaff_id = isset($input['saleStaff_id']) ? $input['saleStaff_id'] : $order->saleStaff_id;
            $designStaff_id = isset($input['designStaff_id']) ? $input['designStaff_id'] : $order->designStaff_id;
            $productionStaff_id = isset($input['productionStaff_id']) ? $input['productionStaff_id'] : $order->productionStaff_id;
            $sale_staff = null;
            $design_staff = null;
            $production_staff = null;
            if ($saleStaff_id != null) {
                $sale_staff = DB::table('account')->where('id', $saleStaff_id)->first();
            }
            if ($designStaff_id != null) {
                $design_staff = DB::table('account')->where('id', $designStaff_id)->first();
            }
            if ($productionStaff_id != null) {
                $production_staff = DB::table('account')->where('id', $productionStaff_id)->first();
            }
            if ($sale_staff != null) {
                if ($sale_staff->role_id != '2') {
                    return response()->json([
                        'error' => 'The selected sale staff account is not a sale staff'
                    ], 403);
                } else if ($sale_staff->deactivated) {
                    return response()->json([
                        'error' => 'The selected sale staff account has been deactivated'
                    ], 403);
                }
            }
            if ($design_staff != null) {
                if ($design_staff->role_id != '3') {
                    return response()->json([
                        'error' => 'The selected design staff account is not a design staff'
                    ], 403);
                } else if ($design_staff->deactivated) {
                    return response()->json([
                        'error' => 'The selected design staff account has been deactivated'
                    ], 403);
                }
            }
            if ($production_staff != null) {
                if ($production_staff->role_id != '4') {
                    return response()->json([
                        'error' => 'The selected production staff account is not a production staff'
                    ], 403);
                } else if ($production_staff->deactivated) {
                    return response()->json([
                        'error' => 'The selected production staff account has been deactivated'
                    ], 403);
                }
            }
            DB::table('orders')->where('id', $input['order_id'])->update([
                'note' => $input['note']
            ]);
            DB::table('orders')->where('id', $input['order_id'])->update([
                'saleStaff_id' => $saleStaff_id,
                'designStaff_id' => $designStaff_id,
                'productionStaff_id' => $productionStaff_id
            ]);
            DB::table('quote')->where('product_id', $order->product_id)->update([
                'saleStaff_id' => $saleStaff_id,
                'designStaff_id' => $designStaff_id,
                'productionStaff_id' => $productionStaff_id
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
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
                'error' => 'No input received'
            ], 403);
        }

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
                    return response()->json(['error' => 'Invalid token'], 401);
                }
            }
        }
        try {
            $id = $decodedToken['id'];
        } catch (Throwable $e) {
            $id = $decodedToken->id;
        }
        $account = Account::find($id);
        if ($account->role_id != 1 && $account->role_id != 5) {
            return response()->json([
                'error' => 'Invalid user (User is unauthorized)'
            ], 500);
        }
        DB::beginTransaction();
        try {
            $order = DB::table('orders')->where('id', $input['order_id'])->first();
            if ($order->order_status_id == 6) {
                return response()->json([
                    'error' => 'Order has already been completed, action can\'t be performed'
                ], 403);
            }
            if ($order->order_status_id == 7) {
                return response()->json([
                    'error' => 'Order has already been cancelled, action can\'t be performed'
                ], 403);
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
            return response()->json(['error' => $e->getMessage()], 500);
        }
        return response()->json([
            'success' => 'Cancel successfully'
        ], 201);
    }
    public function get_order_status_list()
    {
        return response()->json(
            DB::table('order_status')->get()
        );
    }
    public function get_order_type_list()
    {
        return response()->json(
            DB::table('order_type')->get()
        );
    }
    public function get_order_detail(Request $request)
    {
        $input = json_decode($request->input('order_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
        $OGurl = env('ORIGIN_URL');
        $Murl = env('MODEL_URL');
        $Ourl = env('ORDER_URL');
        $order = DB::table('orders')->where('id', $input)->first();
        if ($order == null) {
            return response()->json([
                'error' => 'The selected doesn\'t exist'
            ], 403);
        }
        $order->created = Carbon::parse($order->created)->format('H:i:s d/m/Y');
        if ($order->delivery_date != null) {
            $order->delivery_date = Carbon::parse($order->delivery_date)->format('H:i:s d/m/Y');
        }
        if ($order->guarantee_expired_date != null) {
            $order->guarantee_expired_date = Carbon::parse($order->guarantee_expired_date)->format('H:i:s d/m/Y');
        }
        $product = DB::table('product')->where('id', $order->product_id)->first();
        $model = DB::table('model')->where('id', $product->model_id)->first();
        if ($model != null) {
            $OGurl = env('ORIGIN_URL');
            $Surl = env('STYLE_URL');
            $model->mounting_type = DB::table('mounting_type')->where('id', $model->mounting_type_id)->first();
            $model->mounting_style = DB::table('mounting_style')->where('id', $model->mounting_style_id)->first();
            $model->mounting_style->imageUrl = $OGurl . $Surl . $model->mounting_style->id . $model->mounting_style->imageUrl;

            $model->imageUrl = $OGurl . $Murl . $model->id . "/" . $model->imageUrl;
            unset($model->mounting_type_id);
            unset($model->mounting_style_id);
        }

        $product->mounting_type = DB::table('mounting_type')->where('id', $product->mounting_type_id)->first();
        unset($product->mounting_type_id);
        $product->model = $model;
        unset($product->model_id);
        $product_url = $product->imageUrl;
        $product->imageUrl = $OGurl . $Ourl . $product->id . "/" . $product->imageUrl;


        $product_diamond = DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 1)->get();
        if ($order->order_status_id == 2) {
            $new_product_diamond = collect();

            foreach ($product_diamond as $tempp) {
                $copy1 = DB::table('product_diamond')
                    ->where('product_id', $order->product_id)
                    ->where('status', 3)
                    ->where('diamond_id', $tempp->diamond_id)
                    ->where('count', $tempp->count)
                    ->first();

                if ($copy1 != null) {
                    $copy1->status = 1;
                    $new_product_diamond->push($copy1);
                } else {
                    $new_product_diamond->push($tempp);
                }
            }

            $product_diamond = $new_product_diamond;
        } else if ($order->order_status_id == 1 && $order->deposit_has_paid != 0) {
            $new_product_diamond = collect();
            $product_diamond1 = DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 3)->get();
            foreach ($product_diamond as $diamond1) {
                $check = false;
                foreach ($product_diamond1 as $diamond2) {
                    if ($diamond1->diamond_id == $diamond2->diamond_id && $diamond1->count == $diamond2->count) {
                        $check = true;
                    }
                }
                if (!$check) {
                    $new_product_diamond->push($diamond1);
                } else {
                    $copy11 = DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 3)->where('diamond_id', $diamond1->diamond_id)->where('count', $diamond1->count)->first();
                    if ($copy11 != null) {
                        $copy11->status = 1;
                        $new_product_diamond->push($copy11);
                    } else {
                        $new_product_diamond->push($diamond1);
                    }
                }
            }
            $product_diamond = $new_product_diamond;
        }
        $product_diamond->map(function ($product_diamond) {
            $diamond = DB::table('diamond')->where('id', $product_diamond->diamond_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('DIAMOND_URL');
            $diamond->imageUrl = $OGurl . $url . $diamond->imageUrl;
            $diamond->diamond_color = DB::table('diamond_color')->where('id', $diamond->diamond_color_id)->first();
            $diamond->diamond_origin = DB::table('diamond_origin')->where('id', $diamond->diamond_origin_id)->first();
            $diamond->diamond_clarity = DB::table('diamond_clarity')->where('id', $diamond->diamond_clarity_id)->first();
            $diamond->diamond_cut = DB::table('diamond_cut')->where('id', $diamond->diamond_cut_id)->first();
            $diamond->created = Carbon::parse($diamond->created)->format('H:i:s d/m/Y');
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

        $product_metal = DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 1)->get();
        if ($order->order_status_id == 2) {
            $new_product_metal = collect();

            foreach ($product_metal as $temp) {
                $copy2 = DB::table('product_metal')
                    ->where('product_id', $order->product_id)
                    ->where('status', 3)
                    ->where('metal_id', $temp->metal_id)
                    ->where('volume', $temp->volume)
                    ->first();

                if ($copy2 != null) {
                    $copy2->status = 1;
                    $new_product_metal->push($copy2);
                } else {
                    $new_product_metal->push($temp);
                }
            }

            $product_metal = $new_product_metal;
        } else if ($order->order_status_id == 1 && $order->deposit_has_paid != 0) {
            $new_product_metal = collect();
            $product_metal1 = DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 3)->get();
            foreach ($product_metal as $metal1) {
                $check = false;
                foreach ($product_metal1 as $metal2) {
                    if ($metal1->metal_id == $metal2->metal_id && $metal1->volume == $metal2->volume) {
                        $check = true;
                    }
                }
                if (!$check) {
                    $new_product_metal->push($metal1);
                } else {
                    $copy22 = DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 3)->where('metal_id', $metal1->metal_id)->where('volume', $metal1->volume)->first();
                    if ($copy22 != null) {
                        $copy22->status = 1;
                        $new_product_metal->push($copy22);
                    } else {
                        $new_product_metal->push($metal1);
                    }
                }
            }
            $product_metal = $new_product_metal;
        }
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
        $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
        $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
        unset($account->password);
        $order->account = $account;
        unset($order->account_id);


        $sale_staff = DB::table('account')->where('id', $order->saleStaff_id)->first();
        if ($sale_staff != null) {
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
        }

        $order->sale_staff = $sale_staff;
        unset($order->saleStaff_id);

        $design_staff = DB::table('account')->where('id', $order->designStaff_id)->first();
        if ($design_staff != null) {
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
        }
        $order->design_staff = $design_staff;
        unset($order->designStaff_id);

        $production_staff = DB::table('account')->where('id', $order->productionStaff_id)->first();
        if ($production_staff != null) {
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
        }
        $order->production_staff = $production_staff;
        unset($order->productionStaff_id);

        $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
        unset($order->order_status_id);
        $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
        unset($order->order_type_id);

        $design_process = DB::table('design_process')->where('order_id', $order->id)->orderby('created', 'desc')->first();
        if ($design_process == null) {
            $order->design_process_status = null;
        } else if ($design_process->design_process_status_id == 4) {
            $order->design_process_status = null;
        } else {
            $order->design_process_status = DB::table('design_process_status')->where('id', $design_process->design_process_status_id)->first();
        }

        $order->imageUrl = $OGurl . $Ourl . $product->id . "/" . $product_url;

        return response()->json([
            'order_detail' => $order
        ]);
    }
    public function get_order_detail_customer(Request $request)
    {
        $input = json_decode($request->input('order_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
        $OGurl = env('ORIGIN_URL');
        $Murl = env('MODEL_URL');
        $Ourl = env('ORDER_URL');
        $Durl = env('DESIGN_PROCESS_URL');
        $order = DB::table('orders')->where('id', $input)->first();
        if ($order == null) {
            return response()->json([
                'error' => 'The selected doesn\'t exist'
            ], 403);
        }
        $order->created = Carbon::parse($order->created)->format('H:i:s d/m/Y');
        if ($order->delivery_date != null) {
            $order->delivery_date = Carbon::parse($order->delivery_date)->format('H:i:s d/m/Y');
        }
        if ($order->guarantee_expired_date != null) {
            $order->guarantee_expired_date = Carbon::parse($order->guarantee_expired_date)->format('H:i:s d/m/Y');
        }
        $product = DB::table('product')->where('id', $order->product_id)->first();
        $model = DB::table('model')->where('id', $product->model_id)->first();
        if ($model != null) {
            $OGurl = env('ORIGIN_URL');
            $Surl = env('STYLE_URL');
            $model->mounting_type = DB::table('mounting_type')->where('id', $model->mounting_type_id)->first();
            $model->mounting_style = DB::table('mounting_style')->where('id', $model->mounting_style_id)->first();
            $model->mounting_style->imageUrl = $OGurl . $Surl . $model->mounting_style->id . $model->mounting_style->imageUrl;

            $model->imageUrl = $OGurl . $Murl . $model->id . "/" . $model->imageUrl;
            unset($model->mounting_type_id);
            unset($model->mounting_style_id);
        }

        $product->mounting_type = DB::table('mounting_type')->where('id', $product->mounting_type_id)->first();
        unset($product->mounting_type_id);
        $product->model = $model;
        unset($product->model_id);
        $product_url = $product->imageUrl;
        $product->imageUrl = $OGurl . $Ourl . $product->id . "/" . $product->imageUrl;

        $product_diamond = DB::table('product_diamond')->where('product_id', $product->id)->whereIn('status', [1, 2, 3])->get();
        $product_diamond->map(function ($product_diamond) {
            $diamond = DB::table('diamond')->where('id', $product_diamond->diamond_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('DIAMOND_URL');
            $diamond->imageUrl = $OGurl . $url . $diamond->imageUrl;
            $diamond->diamond_color = DB::table('diamond_color')->where('id', $diamond->diamond_color_id)->first();
            $diamond->diamond_origin = DB::table('diamond_origin')->where('id', $diamond->diamond_origin_id)->first();
            $diamond->diamond_clarity = DB::table('diamond_clarity')->where('id', $diamond->diamond_clarity_id)->first();
            $diamond->diamond_cut = DB::table('diamond_cut')->where('id', $diamond->diamond_cut_id)->first();
            $diamond->created = Carbon::parse($diamond->created)->format('H:i:s d/m/Y');
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

        $product_metal = DB::table('product_metal')->where('product_id', $product->id)->whereIn('status', [1, 2, 3])->get();
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
        $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
        $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
        unset($account->password);
        $order->account = $account;
        unset($order->account_id);


        $sale_staff = DB::table('account')->where('id', $order->saleStaff_id)->first();
        if ($sale_staff != null) {
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
        }

        $order->sale_staff = $sale_staff;
        unset($order->saleStaff_id);

        $design_staff = DB::table('account')->where('id', $order->designStaff_id)->first();
        if ($design_staff != null) {
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
        }
        $order->design_staff = $design_staff;
        unset($order->designStaff_id);

        $production_staff = DB::table('account')->where('id', $order->productionStaff_id)->first();
        if ($production_staff != null) {
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
        }
        $order->production_staff = $production_staff;
        unset($order->productionStaff_id);

        $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
        unset($order->order_status_id);
        $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
        unset($order->order_type_id);

        $design_process = DB::table('design_process')->where('order_id', $order->id)->orderby('created', 'desc')->first();
        if ($design_process != null) {
            $design_process->mounting_type = DB::table('mounting_type')->where('id', $design_process->mounting_type_id)->first();
            $design_process->design_process_status = DB::table('design_process_status')->where('id', $design_process->design_process_status_id)->first();
            $design_process->imageUrl = $OGurl . $Durl . $design_process->id . '/' . $design_process->imageUrl;
            unset($design_process->mounting_type_id);
            unset($design_process->design_process_status_id);
        }
        $order->design_process = $design_process;

        $order->imageUrl = $OGurl . $Ourl . $product->id . "/" . $product_url;

        return response()->json([
            'order_detail' => $order
        ]);
    }
    public function get_assigned_staff(Request $request)
    {
        $input = json_decode($request->input('order_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
        $order = DB::table('orders')->where('id', $input)->first();
        if ($order->saleStaff_id != null) {
            $current_sale_staff = DB::table('account')->where('id', $order->saleStaff_id)->first();
            if (!$current_sale_staff->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $current_sale_staff->imageUrl = $OGurl . $url . $current_sale_staff->id . "/" . $current_sale_staff->imageUrl;
            }
            $current_sale_staff->dob = Carbon::parse($current_sale_staff->dob)->format('d/m/Y');
            $current_sale_staff->deactivated_date = Carbon::parse($current_sale_staff->deactivated_date)->format('d/m/Y');
            $current_sale_staff->role = DB::table('role')->where('id', $current_sale_staff->role_id)->first();
            unset($current_sale_staff->password);
            unset($current_sale_staff->role_id);
        } else $current_sale_staff = null;

        if ($order->designStaff_id != null) {
            $current_design_staff = DB::table('account')->where('id', $order->designStaff_id)->first();
            if (!$current_design_staff->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $current_design_staff->imageUrl = $OGurl . $url . $current_design_staff->id . "/" . $current_design_staff->imageUrl;
            }
            $current_design_staff->dob = Carbon::parse($current_design_staff->dob)->format('d/m/Y');
            $current_design_staff->deactivated_date = Carbon::parse($current_design_staff->deactivated_date)->format('d/m/Y');
            $current_design_staff->role = DB::table('role')->where('id', $current_design_staff->role_id)->first();
            unset($current_design_staff->password);
            unset($current_design_staff->role_id);
        } else $current_design_staff = null;

        if ($order->productionStaff_id != null) {
            $current_production_staff = DB::table('account')->where('id', $order->productionStaff_id)->first();
            if (!$current_production_staff->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $current_production_staff->imageUrl = $OGurl . $url . $current_production_staff->id . "/" . $current_production_staff->imageUrl;
            }
            $current_production_staff->dob = Carbon::parse($current_production_staff->dob)->format('d/m/Y');
            $current_production_staff->deactivated_date = Carbon::parse($current_production_staff->deactivated_date)->format('d/m/Y');
            $current_production_staff->role = DB::table('role')->where('id', $current_production_staff->role_id)->first();
            unset($current_production_staff->password);
            unset($current_production_staff->role_id);
        } else $current_production_staff = null;

        $sale_query = Account::query();
        $design_query = Account::query();
        $production_query = Account::query();
        if ($current_sale_staff != null) {
            $sale_query->whereNot('id', $current_sale_staff->id);
        }
        if ($current_design_staff != null) {
            $design_query->whereNot('id', $current_design_staff->id);
        }
        if ($current_production_staff != null) {
            $production_query->whereNot('id', $current_production_staff->id);
        }

        $sale_list = $sale_query->where('role_id', 2)->get();
        $sale_list->map(function ($sale) {
            $sale->role = DB::table('role')->where('id', $sale->role_id)->first();
            if (!$sale->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $sale->imageUrl = $OGurl . $url . $sale->id . "/" . $sale->imageUrl;
            }
            $sale->dob = Carbon::parse($sale->dob)->format('d/m/Y');
            $sale->deactivated_date = Carbon::parse($sale->deactivated_date)->format('d/m/Y');
            unset($sale->password);
            unset($sale->role_id);
            return $sale;
        });
        $design_list = $design_query->where('role_id', 3)->get();
        $design_list->map(function ($design) {
            $design->role = DB::table('role')->where('id', $design->role_id)->first();
            if (!$design->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $design->imageUrl = $OGurl . $url . $design->id . "/" . $design->imageUrl;
            }
            $design->dob = Carbon::parse($design->dob)->format('d/m/Y');
            $design->deactivated_date = Carbon::parse($design->deactivated_date)->format('d/m/Y');
            unset($design->password);
            unset($design->role_id);
            return $design;
        });
        $production_list = $production_query->where('role_id', 4)->get();
        $production_list->map(function ($production) {
            $production->role = DB::table('role')->where('id', $production->role_id)->first();
            if (!$production->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $production->imageUrl = $OGurl . $url . $production->id . "/" . $production->imageUrl;
            }
            $production->dob = Carbon::parse($production->dob)->format('d/m/Y');
            $production->deactivated_date = Carbon::parse($production->deactivated_date)->format('d/m/Y');
            unset($production->password);
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
    public function get_assigned_orders_sale(Request $request) //
    {
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
                    return response()->json(['error' => 'Invalid token'], 401);
                }
            }
        }
        try {
            $input = $decodedToken['id'];
        } catch (Throwable $e) {
            $input = $decodedToken->id;
        }

        $account = Account::find($input);
        if ($account->role_id != 2) {
            return response()->json([
                'error' => 'Invalid user (User is unauthorized)'
            ], 500);
        }
        $template_order_list = DB::table('orders')->where('order_type_id', 1)->orderby('order_status_id', 'asc')->get();
        $template_order_list->map(function ($order) {
            $product = DB::table('product')->where('id', $order->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            $order->product = $product;
            $order->created = Carbon::parse($order->created)->format('H:i:s d/m/Y');
            if ($order->delivery_date != null) {
                $order->delivery_date = Carbon::parse($order->delivery_date)->format('H:i:s d/m/Y');
            }
            if ($order->guarantee_expired_date != null) {
                $order->guarantee_expired_date = Carbon::parse($order->guarantee_expired_date)->format('H:i:s d/m/Y');
            }
            $account = DB::table('account')->where('id', $order->account_id)->first();
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
            }
            $account->role = DB::table('role')->where('id', $account->role_id)->first();
            unset($account->role_id);
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
            $order->account = $account;
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            unset($order->order_status_id);
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            unset($order->order_type_id);
            unset($order->product_id);
            unset($order->account_id);
            return $order;
        });
        $customize_order_list = DB::table('orders')->whereNotNull('saleStaff_id')->where('saleStaff_id', $input)->where('order_type_id', 2)->orderby('order_status_id', 'asc')->get();
        $customize_order_list->map(function ($order) {
            $product = DB::table('product')->where('id', $order->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            $order->product = $product;
            $order->created = Carbon::parse($order->created)->format('H:i:s d/m/Y');
            if ($order->delivery_date != null) {
                $order->delivery_date = Carbon::parse($order->delivery_date)->format('H:i:s d/m/Y');
            }
            if ($order->guarantee_expired_date != null) {
                $order->guarantee_expired_date = Carbon::parse($order->guarantee_expired_date)->format('H:i:s d/m/Y');
            }
            $account = DB::table('account')->where('id', $order->account_id)->first();
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
            }
            $account->role = DB::table('role')->where('id', $account->role_id)->first();
            unset($account->role_id);
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
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
            'template_order_list' => $template_order_list,
            'customize_order_list' => $customize_order_list
        ]);
    }
    public function get_assigned_orders_design(Request $request)
    {
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
            $input = $decodedToken['id'];
        } catch (Throwable $e) {
            $input = $decodedToken->id;
        }

        $account = Account::find($input);
        if ($account->role_id != 3) {
            return response()->json([
                'error' => 'Invalid user (User is unauthorized)'
            ], 500);
        }
        $order_list = DB::table('orders')->whereNotNull('designStaff_id')->where('designStaff_id', $input)->get();
        $order_list->map(function ($order) {
            $product = DB::table('product')->where('id', $order->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            $order->product = $product;
            $order->created = Carbon::parse($order->created)->format('H:i:s d/m/Y');
            if ($order->delivery_date != null) {
                $order->delivery_date = Carbon::parse($order->delivery_date)->format('H:i:s d/m/Y');
            }
            if ($order->guarantee_expired_date != null) {
                $order->guarantee_expired_date = Carbon::parse($order->guarantee_expired_date)->format('H:i:s d/m/Y');
            }

            $account = DB::table('account')->where('id', $order->account_id)->first();
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
            }
            $account->role = DB::table('role')->where('id', $account->role_id)->first();
            unset($account->role_id);
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
            $order->account = $account;
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            unset($order->order_status_id);
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            unset($order->order_type_id);
            unset($order->product_id);
            unset($order->account_id);

            $design_process = DB::table('design_process')->where('order_id', $order->id)->orderby('created', 'desc')->first();
            if ($design_process == null) {
                $order->design_process_status = null;
            } else if ($design_process->design_process_status_id == 4) {
                $order->design_process_status = null;
            } else {
                $order->design_process_status = DB::table('design_process_status')->where('id', $design_process->design_process_status_id)->first();
            }
            return $order;
        });

        // Sort the orders by design_process_status
        $sorted_order_list = $order_list->sortBy(function ($order) {
            return $order->design_process_status ? $order->design_process_status->id : null; // Use the status id for sorting, or null if no status
        });
        return response()->json(
            $sorted_order_list->values()->all() // Resetting the keys to have a clean array
        );
    }
    public function get_assigned_orders_production(Request $request)
    {
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
                    return response()->json(['error' => 'Invalid token'], 401);
                }
            }
        }
        try {
            $input = $decodedToken['id'];
        } catch (Throwable $e) {
            $input = $decodedToken->id;
        }

        $account = Account::find($input);
        if ($account->role_id != 4) {
            return response()->json([
                'error' => 'Invalid user (User is unauthorized)'
            ], 500);
        }
        $template_order_list = DB::table('orders')->whereNotNull('productionStaff_id')->where('productionStaff_id', $input)->where('order_status_id', 3)->where('order_type_id', 1)->get();
        $template_order_list->map(function ($order) {
            $product = DB::table('product')->where('id', $order->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            $order->product = $product;
            $order->created = Carbon::parse($order->created)->format('H:i:s d/m/Y');
            if ($order->delivery_date != null) {
                $order->delivery_date = Carbon::parse($order->delivery_date)->format('H:i:s d/m/Y');
            }
            if ($order->guarantee_expired_date != null) {
                $order->guarantee_expired_date = Carbon::parse($order->guarantee_expired_date)->format('H:i:s d/m/Y');
            }

            $account = DB::table('account')->where('id', $order->account_id)->first();
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
            }
            $account->role = DB::table('role')->where('id', $account->role_id)->first();
            unset($account->role_id);
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
            $order->account = $account;
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            unset($order->order_status_id);
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            unset($order->order_type_id);
            unset($order->product_id);
            unset($order->account_id);

            $production_process = DB::table('production_process')->where('order_id', $order->id)->orderby('created', 'desc')->first();
            if ($production_process != null) {
                $production_process->production_status = DB::table('production_status')->where('id', $production_process->production_status_id)->first();
                unset($production_process->production_status_id);
                $production_process->created = Carbon::parse($production_process->created)->format('H:i:s d/m/Y');
                $order->production_process = $production_process;
            } else {
                $order->production_process = null;
            }
            return $order;
        });
        $sorted_template_order_list = $template_order_list->sortBy(function ($order) {
            if ($order->production_process !== null) {
                return $order->production_process->production_status ? $order->production_process->production_status->id : PHP_INT_MAX;
            } else {
                return PHP_INT_MAX; // Ensure null values appear at the start
            }
        });

        $customize_order_list = DB::table('orders')->whereNotNull('productionStaff_id')->where('productionStaff_id', $input)->where('order_status_id', 3)->where('order_type_id', 2)->get();
        $customize_order_list->map(function ($order) {
            $product = DB::table('product')->where('id', $order->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            $order->product = $product;
            $order->created = Carbon::parse($order->created)->format('H:i:s d/m/Y');
            if ($order->delivery_date != null) {
                $order->delivery_date = Carbon::parse($order->delivery_date)->format('H:i:s d/m/Y');
            }
            if ($order->guarantee_expired_date != null) {
                $order->guarantee_expired_date = Carbon::parse($order->guarantee_expired_date)->format('H:i:s d/m/Y');
            }

            $account = DB::table('account')->where('id', $order->account_id)->first();
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
            }
            $account->role = DB::table('role')->where('id', $account->role_id)->first();
            unset($account->role_id);
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
            $order->account = $account;
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            unset($order->order_status_id);
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            unset($order->order_type_id);
            unset($order->product_id);
            unset($order->account_id);

            $production_process = DB::table('production_process')->where('order_id', $order->id)->orderby('created', 'desc')->first();
            if ($production_process != null) {
                $production_process->production_status = DB::table('production_status')->where('id', $production_process->production_status_id)->first();
                unset($production_process->production_status_id);
                $production_process->created = Carbon::parse($production_process->created)->format('H:i:s d/m/Y');
                $order->production_process = $production_process;
            } else {
                $order->production_process = null;
            }
            return $order;
        });
        $sorted_customize_order_list = $customize_order_list->sortBy(function ($order) {
            if ($order->production_process !== null) {
                return $order->production_process->production_status ? $order->production_process->production_status->id : PHP_INT_MAX;
            } else {
                return PHP_INT_MAX; // Ensure null values appear at the start
            }
        });
        return response()->json([
            'template_order_list' => $sorted_template_order_list->values()->all(),
            'customize_order_list' => $sorted_customize_order_list->values()->all()
        ]);
    }
    public function get_assigned_complete_orders_production(Request $request)
    {
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
                    return response()->json(['error' => 'Invalid token'], 401);
                }
            }
        }
        try {
            $input = $decodedToken['id'];
        } catch (Throwable $e) {
            $input = $decodedToken->id;
        }

        $account = Account::find($input);
        if ($account->role_id != 4) {
            return response()->json([
                'error' => 'Invalid user (User is unauthorized)'
            ], 500);
        }
        $data1 = collect();
        $template_order_list = DB::table('orders')->whereNotNull('productionStaff_id')->where('productionStaff_id', $input)->whereIn('order_status_id', [3, 4, 5, 6, 7])->where('order_type_id', 1)->get();
        foreach ($template_order_list as $order) {
            $production_process = DB::table('production_process')->where('order_id', $order->id)->orderby('created', 'desc')->first();
            if ($production_process != null) {
                if ($production_process->production_status_id == 6) {
                    $data1->push($order);
                }
            }
        }
        $data1->map(function ($order) {
            $product = DB::table('product')->where('id', $order->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            $order->product = $product;
            $order->created = Carbon::parse($order->created)->format('H:i:s d/m/Y');
            if ($order->delivery_date != null) {
                $order->delivery_date = Carbon::parse($order->delivery_date)->format('H:i:s d/m/Y');
            }
            if ($order->guarantee_expired_date != null) {
                $order->guarantee_expired_date = Carbon::parse($order->guarantee_expired_date)->format('H:i:s d/m/Y');
            }

            $account = DB::table('account')->where('id', $order->account_id)->first();
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
            }
            $account->role = DB::table('role')->where('id', $account->role_id)->first();
            unset($account->role_id);
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
            $order->account = $account;

            $production_process = DB::table('production_process')->where('order_id', $order->id)->orderby('created', 'desc')->first();
            if ($order->order_status_id > 3) {
                $production_process->production_status = DB::table('production_status')->where('id', $production_process->production_status_id)->first();
                unset($production_process->production_status_id);
                $production_process->created = Carbon::parse($production_process->created)->format('H:i:s d/m/Y');
                $order->production_process = $production_process;
            } else {
                $production_process->production_status = null;
                unset($production_process->production_status_id);
                $production_process->created = Carbon::parse($production_process->created)->format('H:i:s d/m/Y');
                $order->production_process = $production_process;
            }
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            unset($order->order_status_id);
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            unset($order->order_type_id);
            unset($order->product_id);
            unset($order->account_id);
            return $order;
        });
        $sorted_template_order_list = $data1->sortBy(function ($order) {
            if ($order->production_process != null) {
                return $order->production_process->production_status ? $order->production_process->production_status->id : null; // Use the status id for sorting, or null if no status
            } else {
                return null;
            }
        });

        $data2 = collect();
        $customize_order_list = DB::table('orders')->where('productionStaff_id', $input)->whereIn('order_status_id', [3, 4, 5, 6, 7])->where('order_type_id', 2)->get();
        foreach ($customize_order_list as $order) {
            $production_process = DB::table('production_process')->where('order_id', $order->id)->orderby('created', 'desc')->first();
            if ($production_process != null) {
                if ($production_process->production_status_id == 6) {
                    $data2->push($order);
                }
            }
        }
        $data2->map(function ($order) {
            $product = DB::table('product')->where('id', $order->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            $order->product = $product;
            $order->created = Carbon::parse($order->created)->format('H:i:s d/m/Y');
            if ($order->delivery_date != null) {
                $order->delivery_date = Carbon::parse($order->delivery_date)->format('H:i:s d/m/Y');
            }
            if ($order->guarantee_expired_date != null) {
                $order->guarantee_expired_date = Carbon::parse($order->guarantee_expired_date)->format('H:i:s d/m/Y');
            }

            $account = DB::table('account')->where('id', $order->account_id)->first();
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
            }
            $account->role = DB::table('role')->where('id', $account->role_id)->first();
            unset($account->role_id);
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
            $order->account = $account;

            $production_process = DB::table('production_process')->where('order_id', $order->id)->orderby('created', 'desc')->first();
            if ($order->order_status_id > 3) {
                $production_process->production_status = DB::table('production_status')->where('id', $production_process->production_status_id)->first();
                unset($production_process->production_status_id);
                $production_process->created = Carbon::parse($production_process->created)->format('H:i:s d/m/Y');
                $order->production_process = $production_process;
            } else {
                $production_process->production_status = null;
                unset($production_process->production_status_id);
                $production_process->created = Carbon::parse($production_process->created)->format('H:i:s d/m/Y');
                $order->production_process = $production_process;
            }
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            unset($order->order_status_id);
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            unset($order->order_type_id);
            unset($order->product_id);
            unset($order->account_id);
            return $order;
        });
        $sorted_customize_order_list = $data2->sortBy(function ($order) {
            if ($order->production_process != null) {
                return $order->production_process->production_status ? $order->production_process->production_status->id : null; // Use the status id for sorting, or null if no status
            } else {
                return null;
            }
        });

        return response()->json([
            'template_order_list' => $sorted_template_order_list->values()->all(),
            'customize_order_list' => $sorted_customize_order_list->values()->all()
        ]);
    }
    public function request_design_process(Request $request)
    {
        $input = json_decode($request->input('new_design_process'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
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
                    return response()->json(['error' => 'Invalid token'], 401);
                }
            }
        }
        try {
            $id = $decodedToken['id'];
        } catch (Throwable $e) {
            $id = $decodedToken->id;
        }
        $order = DB::table('orders')->where('id', $input['order_id'])->first();
        if ($order->designStaff_id != $id) {
            return response()->json([
                'error' => 'Your account isn\'t assigned to the selected order'
            ], 403);
        }

        DB::beginTransaction();
        try {
            $product_diamond = DB::table('product_diamond')->where('product_id', $order->product_id)->get();
            $product_metal = DB::table('product_metal')->where('product_id', $order->product_id)->get();
            foreach ($product_diamond as $diamond) {
                if ($diamond->status == 0) {
                    DB::rollBack();
                    return response()->json([
                        'error' => 'There are already a design process in the middle of checking'
                    ], 403);
                }
            }
            foreach ($product_metal as $metal) {
                if ($metal->status == 0) {
                    DB::rollBack();
                    return response()->json([
                        'error' => 'There are already a design process in the middle of checking'
                    ], 403);
                }
            }
            $product_price = 0;
            if (isset($input['diamond_list']) && $input['diamond_list'] != null) {
                foreach ($input['diamond_list'] as $diamond1) {
                    $diamond = DB::table('diamond')->where('id', $diamond1['diamond']['id'])->first();
                    if ($diamond->deactivated) {
                        DB::rollBack();
                        return response()->json([
                            'error' => 'One of the selected diamond is currently deactivated'
                        ], 403);
                    }
                    $diamond = DB::table('diamond')->where('id', $diamond1['diamond']['id'])->first();
                    $product_diamond = new Product_Diamond();
                    $product_diamond->product_id = $order->product_id;
                    $product_diamond->diamond_id = $diamond1['diamond']['id'];
                    $product_diamond->count = $diamond1['count'];
                    $product_diamond->price = ceil($diamond->price * $diamond1['count']);
                    $product_diamond->diamond_shape_id = $diamond1['diamond_shape']['id'];
                    $product_diamond->status = 0;
                    $product_price += ceil($diamond->price * $diamond1['count']);
                    $product_diamond->save();
                }
            }
            if (isset($input['metal_list']) && $input['metal_list'] != null) {
                foreach ($input['metal_list'] as $metal1) {
                    $metal = DB::table('metal')->where('id', $metal1['metal']['id'])->first();
                    if ($metal->deactivated) {
                        DB::rollBack();
                        return response()->json([
                            'error' => 'One of the selected metal is currently deactivated'
                        ], 403);
                    }
                    $metal = DB::table('metal')->where('id', $metal1['metal']['id'])->first();
                    $product_metal = new Product_Metal();
                    $product_metal->product_id = $order->product_id;
                    $product_metal->metal_id = $metal1['metal']['id'];
                    $product_metal->price = ceil($metal->sale_price_per_gram * $metal1['weight']);
                    $product_metal->volume = $metal1['volume'];
                    $product_metal->weight = $metal1['weight'];
                    $product_metal->status = 0;
                    $product_price += ceil($metal->sale_price_per_gram * $metal1['weight']);
                    $product_metal->save();
                }
            }
            $id = DB::table('design_process')->insertGetId([
                'order_id' => $input['order_id'],
                'imageUrl' => "",
                'note' => $input['note'],
                'mounting_type_id' => $input['mounting_type_id'],
                'mounting_size' => $input['mounting_size'],
                'design_process_status_id' => 1,
                'production_price' => $order->production_price,
                'profit_rate' => $order->profit_rate,
                'product_price' => $product_price,
                'total_price' => 0,
                'created' => Carbon::now()->format('Y-m-d H:i:s'),
            ]);

            $imageUrl = "";
            if (isset($input['imageUrl']) && $input['imageUrl'] != null) {
                $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['imageUrl']));
                $destinationPath = public_path('image/Job/Design_process/' . $id);
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                $fileName = Carbon::now()->timestamp . '_' . $id . '.jpg';
                file_put_contents($destinationPath . '/' . $fileName, $fileData);
                $imageUrl = $fileName;
            } else {
                $destinationPath = public_path('image/Job/Design_process/' . $id);
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                $product = DB::table('product')->where('id', $order->product_id)->first();
                $cpyfileName = $product->imageUrl;
                $fileName = Carbon::now()->timestamp . '_' . $id . '.jpg';
                $destinationFilePath = public_path('image/Job/Design_process/' . $id . '/' . $fileName);
                $sourceFilePath = public_path('image/Order/' . $order->product_id . '/' . $cpyfileName);
                File::copy($sourceFilePath, $destinationFilePath);
                $imageUrl = $fileName;
            }
            DB::table('design_process')->where('id', $id)->update([
                'imageUrl' => $imageUrl,
                'product_price' => $product_price
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
        return response()->json([
            'success' => 'Request design process successfully'
        ], 201);
    }
    public function pricing_design_process(Request $request)
    {
        $input = json_decode($request->input('priced_design_process'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
        $validator = Validator::make($input, [
            'production_price' => 'required',
            'profit_rate' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first(),
            ], 403);
        }
        $design_process = DB::table('design_process')->where('id', $input['design_process_id'])->first();
        if ($design_process == null) {
            return response()->json([
                'error' => 'The selected design process doesn\'t exist'
            ], 403);
        }
        if ($design_process->design_process_status_id == 2) {
            return response()->json([
                'error' => 'The selected design process has already been priced'
            ], 403);
        }
        if ($design_process->design_process_status_id == 3) {
            return response()->json([
                'error' => 'The selected design process has already been completed'
            ], 403);
        }
        if ($design_process->design_process_status_id >= 4) {
            return response()->json([
                'error' => 'The selected design process has already been cancelled'
            ], 403);
        }
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
                    return response()->json(['error' => 'Invalid token'], 401);
                }
            }
        }
        try {
            $id = $decodedToken['id'];
        } catch (Throwable $e) {
            $id = $decodedToken->id;
        }
        $order = DB::table('orders')->where('id', $design_process->order_id)->first();
        if ($order->saleStaff_id != $id) {
            return response()->json([
                'error' => 'Your account isn\'t assigned to the selected order'
            ], 403);
        }
        DB::beginTransaction();
        try {
            $design_process = DB::table('design_process')->where('id', $input['design_process_id'])->first();
            DB::table('design_process')->where('id', $input['design_process_id'])->update([
                'profit_rate' => $input['profit_rate'],
                'production_price' => $input['production_price'],
                'total_price' => ceil(($design_process->product_price) * ($input['profit_rate'] + 100) / 100 + $input['production_price']),
                'design_process_status_id' => 2
            ]);
            DB::table('orders')->where('id', $design_process->order_id)->update([
                'note' => $input['note']
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
        return response()->json([
            'success' => 'Successfully price design process'
        ], 201);
    }
    public function approve_design_process(Request $request)
    {
        $input = json_decode($request->input('approval'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
        DB::beginTransaction();
        try {
            $design_process = DB::table('design_process')->where('id', $input['design_process_id'])->first();
            if ($design_process == null) {
                return response()->json([
                    'error' => 'The selected design process doesn\'t exist'
                ], 403);
            }
            if ($design_process->design_process_status_id < 2) {
                return response()->json([
                    'error' => 'The selected design process hasn\'t been priced'
                ], 403);
            }
            if ($design_process->design_process_status_id == 3) {
                return response()->json([
                    'error' => 'The selected design process has already been approved'
                ], 403);
            }
            if ($design_process->design_process_status_id == 4) {
                return response()->json([
                    'error' => 'The selected design process has already been cancelled'
                ], 403);
            }
            $order = DB::table('orders')->where('id', $design_process->order_id)->first();
            if ($input['approve']) {
                $product_price = 0;
                $product_diamond1 = DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 0)->get();
                $product_diamond2 = DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 1)->get();
                foreach ($product_diamond1 as $diamond1) {
                    $check = false;
                    foreach ($product_diamond2 as $diamond2) {
                        if ($diamond1->diamond_id == $diamond2->diamond_id && $diamond1->count == $diamond2->count) {
                            $check = true;
                        }
                    }
                    if (!$check) {
                        $product_price += $diamond1->price;
                    } else {
                        $tempp = DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 3)->where('diamond_id', $diamond1->diamond_id)->where('count', $diamond1->count)->first();
                        if ($tempp == null) {
                            $product_price += $diamond1->price;
                        } else {
                            $product_price += $tempp->price;
                        }
                    }
                }
                $product_metal1 = DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 0)->get();
                $product_metal2 = DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 1)->get();
                foreach ($product_metal1 as $metal1) {
                    $check = false;
                    foreach ($product_metal2 as $metal2) {
                        if ($metal1->metal_id == $metal2->metal_id && $metal1->volume == $metal2->volume) {
                            $check = true;
                        }
                    }
                    if (!$check) {
                        $product_price += $metal1->price;
                    } else {
                        $tempp = DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 3)->where('metal_id', $metal1->metal_id)->where('volume', $metal1->volume)->first();
                        if ($tempp == null) {
                            $product_price += $metal1->price;
                        } else {
                            $product_price += $tempp->price;
                        }
                    }
                }
                if (DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 0) != null) {
                    $product1 = DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 1)->get();
                    foreach ($product1 as $product) {
                        $copy = DB::table('product_diamond')->where('product_id', $order->product_id)->where('diamond_id', $product->diamond_id)->where('count', $product->count)->where('status', 3)->first();
                        if ($copy != null) {
                            $copy1 = collect($copy)->toArray();
                            $copy1['status'] = 2;
                            $copy1['id'] = null;
                            DB::table('product_diamond')->insert($copy1);
                            DB::table('product_diamond')->where('product_id', $order->product_id)->where('diamond_id', $product->diamond_id)->where('count', $product->count)->where('status', 1)->delete();
                        } else {
                            DB::table('product_diamond')->where('product_id', $order->product_id)->where('diamond_id', $product->diamond_id)->where('count', $product->count)->where('status', 1)->update([
                                'status' => 2
                            ]);
                        }
                    }
                    DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 1)->update([
                        'status' => 2
                    ]);
                    foreach ($product_diamond1 as $diamond1) {
                        $check = false;
                        foreach ($product_diamond2 as $diamond2) {
                            if ($diamond1->diamond_id == $diamond2->diamond_id && $diamond1->count == $diamond2->count) {
                                $check = true;
                            }
                        }
                        if (!$check) {
                            // $ccollection1 = DB::table('product_diamond')->where('product_id', $order->product_id)->where('diamond_id', $diamond1->diamond_id)->where('count', $diamond1->count)->where('status', 4)->first();
                            // if ($ccollection1 == null) {
                            DB::table('product_diamond')->where('product_id', $order->product_id)->where('diamond_id', $diamond1->diamond_id)->where('count', $diamond1->count)->where('status', 4)->delete();
                            $copiedCcollection1 = collect($diamond1)->toArray();
                            $copiedCcollection1['status'] = 4;
                            $copiedCcollection1['id'] = null;
                            DB::table('product_diamond')->insert($copiedCcollection1);
                            // }
                            DB::table('product_diamond')->where('product_id', $order->product_id)->where('id', $diamond1->id)->update([
                                'status' => 1
                            ]);
                        } else {
                            $collection1 = DB::table('product_diamond')->where('product_id', $order->product_id)->where('diamond_id', $diamond1->diamond_id)->where('count', $diamond1->count)->where('status', 3)->first();
                            if ($collection1 != null) {
                                $copiedCollection1 = collect($collection1)->toArray();
                                $copiedCollection1['status'] = 1;
                                $copiedCollection1['id'] = null;
                                DB::table('product_diamond')->insert($copiedCollection1);

                                DB::table('product_diamond')->where('product_id', $order->product_id)->where('diamond_id', $diamond1->diamond_id)->where('count', $diamond1->count)->where('status', 2)->delete();
                                $copiedCollection11 = collect($collection1)->toArray();
                                $copiedCollection11['status'] = 2;
                                $copiedCollection11['id'] = null;
                                DB::table('product_diamond')->insert($copiedCollection11);

                                // DB::table('product_diamond')->where('product_id', $order->product_id)->where('id', $diamond1->id)->update([
                                //     'status' => 1
                                // ]);
                                DB::table('product_diamond')->where('product_id', $order->product_id)->where('id', $diamond1->id)->delete();
                                DB::table('product_diamond')->where('product_id', $order->product_id)->where('diamond_id', $diamond1->diamond_id)->where('count', $diamond1->count)->where('status', 4)->delete();
                                DB::table('product_diamond')->where('product_id', $order->product_id)->where('diamond_id', $diamond1->diamond_id)->where('count', $diamond1->count)->where('status', 3)->update([
                                    'status' => 4
                                ]);
                            } else {
                                $copiedCollection111 = collect($diamond1)->toArray();
                                $copiedCollection111['status'] = 4;
                                $copiedCollection111['id'] = null;
                                DB::table('product_diamond')->insert($copiedCollection111);
                                DB::table('product_diamond')->where('product_id', $order->product_id)->where('id', $diamond1->id)->update([
                                    'status' => 1
                                ]);
                            }
                        }
                    }
                    $product_diamond11 = DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 3)->get();
                    foreach ($product_diamond11 as $product) {
                        DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 3)->where('diamond_id', $product->diamond_id)->delete();
                    }
                    $product_diamond = DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 4)->get();
                    if ($product_diamond != null) {
                        foreach ($product_diamond as $product) {
                            DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 4)->where('diamond_id', $product->diamond_id)->update([
                                'status' => 3
                            ]);
                        }
                    }
                }

                if (DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 0) != null) {
                    $product2 = DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 1)->get();
                    foreach ($product2 as $product) {
                        $cop = DB::table('product_metal')->where('product_id', $order->product_id)->where('metal_id', $product->metal_id)->where('volume', $product->volume)->where('status', 3)->first();
                        if ($cop != null) {
                            $copy2 = collect($cop)->toArray();
                            $copy2['status'] = 2;
                            $copy2['id'] = null;
                            DB::table('product_metal')->insert($copy2);
                            DB::table('product_metal')->where('product_id', $order->product_id)->where('metal_id', $product->metal_id)->where('volume', $product->volume)->where('status', 1)->delete();
                        } else {
                            DB::table('product_metal')->where('product_id', $order->product_id)->where('metal_id', $product->metal_id)->where('volume', $product->volume)->where('status', 1)->update([
                                'status' => 2
                            ]);
                        }
                    }
                    foreach ($product_metal1 as $metal1) {
                        $check = false;
                        foreach ($product_metal2 as $metal2) {
                            if ($metal1->metal_id == $metal2->metal_id && $metal1->volume == $metal2->volume) {
                                $check = true;
                            }
                        }
                        if (!$check) {
                            // $ccollection2 = DB::table('product_metal')->where('product_id', $order->product_id)->where('metal_id', $metal1->metal_id)->where('volume', $metal1->volume)->where('status', 4)->first();
                            // if ($ccollection2 == null) {
                            DB::table('product_metal')->where('product_id', $order->product_id)->where('metal_id', $metal1->metal_id)->where('volume', $metal1->volume)->where('status', 4)->delete();
                            $copiedCcollection2 = collect($metal1)->toArray();
                            $copiedCcollection2['status'] = 4;
                            $copiedCcollection2['id'] = null;
                            DB::table('product_metal')->insert($copiedCcollection2);
                            // }
                            DB::table('product_metal')->where('product_id', $order->product_id)->where('id', $metal1->id)->update([
                                'status' => 1
                            ]);
                        } else {
                            $collection2 = DB::table('product_metal')->where('product_id', $order->product_id)->where('metal_id', $metal1->metal_id)->where('volume', $metal1->volume)->where('status', 3)->first();
                            if ($collection2 != null) {
                                $copiedCollection2 = collect($collection2)->toArray();
                                $copiedCollection2['status'] = 1;
                                $copiedCollection2['id'] = null;
                                DB::table('product_metal')->insert($copiedCollection2);

                                DB::table('product_metal')->where('product_id', $order->product_id)->where('metal_id', $metal1->metal_id)->where('volume', $metal1->volume)->where('status', 2)->delete();
                                $copiedCollection22 = collect($collection2)->toArray();
                                $copiedCollection22['status'] = 2;
                                $copiedCollection22['id'] = null;
                                DB::table('product_metal')->insert($copiedCollection22);

                                // DB::table('product_metal')->where('product_id', $order->product_id)->where('id', $metal1->id)->update([
                                //     'status' => 1
                                // ]);
                                DB::table('product_metal')->where('product_id', $order->product_id)->where('id', $metal1->id)->delete();
                                DB::table('product_metal')->where('product_id', $order->product_id)->where('metal_id', $metal1->metal_id)->where('volume', $metal1->volume)->where('status', 4)->delete();
                                DB::table('product_metal')->where('product_id', $order->product_id)->where('metal_id', $metal1->metal_id)->where('volume', $metal1->volume)->where('status', 3)->update([
                                    'status' => 4
                                ]);
                            } else {
                                $copiedCollection222 = collect($metal1)->toArray();
                                $copiedCollection222['status'] = 4;
                                $copiedCollection222['id'] = null;
                                DB::table('product_metal')->insert($copiedCollection222);
                                DB::table('product_metal')->where('product_id', $order->product_id)->where('id', $metal1->id)->update([
                                    'status' => 1
                                ]);
                            }
                        }
                    }
                    $product_metal11 = DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 3)->get();
                    foreach ($product_metal11 as $product) {
                        DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 3)->where('metal_id', $product->metal_id)->delete();
                    }
                    $product_metal = DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 4)->get();
                    if ($product_metal != null) {
                        foreach ($product_metal as $product) {
                            DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 4)->where('metal_id', $product->metal_id)->update([
                                'status' => 3
                            ]);
                        }
                    }
                }

                DB::table('design_process')->where('id', $input['design_process_id'])->update([
                    'design_process_status_id' => 3
                ]);


                $order = DB::table('orders')->where('id', $design_process->order_id)->first();
                $note = $order->note . "\n" . $input['note'];

                $product = DB::table('product')->where('id', $order->product_id)->first();

                $temp = [
                    'profit_rate' => $order->profit_rate,
                    'production_price' => $order->production_price,
                    'product_price' => $order->product_price,
                    'total_price' => $order->total_price,
                    'mounting_type_id' => $product->mounting_type_id,
                    'mounting_size' => $product->mounting_size,
                    'imageUrl' => $product->imageUrl,
                    'note' => $order->note
                ];
                DB::table('product')->where('id', $order->product_id)->update([
                    'mounting_type_id' => $design_process->mounting_type_id,
                    'mounting_size' => $design_process->mounting_size
                ]);
                DB::table('orders')->where('id', $design_process->order_id)->update([
                    'production_price' => $design_process->production_price,
                    'profit_rate' => $design_process->profit_rate,
                    'product_price' => $product_price,
                    'total_price' => ceil($product_price * ($design_process->profit_rate + 100) / 100 + $design_process->production_price),
                    'note' => $note
                ]);
                DB::table('design_process')->where('id', $design_process->id)->update([
                    'profit_rate' => $temp['profit_rate'],
                    'production_price' => $temp['production_price'],
                    'product_price' => $temp['product_price'],
                    'total_price' => $temp['total_price'],
                    'mounting_type_id' => $temp['mounting_type_id'],
                    'mounting_size' => $temp['mounting_size'],
                    'note' => $temp['note']
                ]);
                if ($design_process->imageUrl != null) {
                    $fileName = 'main.jpg';
                    $destinationPath = public_path('image/Order/' . $order->product_id . '/' . $fileName);
                    $tempPath = public_path('image/Job/Design_process/temp.jpg');
                    File::copy($destinationPath, $tempPath);
                    File::delete($destinationPath);
                    $sourceFilePath = public_path('image/Job/Design_process/' . $design_process->id . '/' . $design_process->imageUrl);
                    File::copy($sourceFilePath, $destinationPath);
                    File::delete($sourceFilePath);
                    File::copy($tempPath, $sourceFilePath);
                    File::delete($tempPath);
                }
                if ((($product_price * ($design_process->profit_rate + 100) / 100 + $design_process->production_price) * 50 / 100) > ($order->total_price * 50 / 100 * 1.05)) {
                    DB::table('orders')->where('id', $design_process->order_id)->update([
                        'order_status_id' => 1
                    ]);
                } else {
                    $product = DB::table('product')->where('id', $order->product_id)->first();
                    DB::table('production_process')->insert([
                        'order_id' => $order->id,
                        'production_status_id' => 1,
                        'created' => Carbon::now()->format('Y-m-d H:i:s'),
                    ]);
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
                DB::commit();
                return response()->json([
                    'success' => 'Decline design process successfully'
                ], 200);
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
        return response()->json([
            'success' => 'Design process approve successfully'
        ], 200);
    }
    // public function cancel_design_process(Request $request)
    // {
    //     $input = json_decode($request->input('design_process_id'), true);
    //     if (!isset($input) || $input == null) {
    //         return response()->json([
    //             'error' => 'No input received'
    //         ], 403);
    //     }
    //     $design_process = DB::table('design_process')->where('id', $input)->first();
    //     $order = DB::table('orders')->where('id', $design_process->order_id)->first();
    //     DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 0)->delete();
    //     DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 0)->delete();
    //     DB::table('design_process')->where('id', $input)->update([
    //         'design_process_status_id' => 4
    //     ]);
    //     return response()->json([
    //         'success' => 'Cancel Successfully'
    //     ], 201);
    // }

    public function get_design_process_status_list(Request $request)
    {
        return response()->json(
            DB::table('design_process_status')->get()
        );
    }
    public function get_design_process_list(Request $request)
    {
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
                    return response()->json(['error' => 'Invalid token'], 401);
                }
            }
        }
        try {
            $id = $decodedToken['id'];
        } catch (Throwable $e) {
            $id = $decodedToken->id;
        }
        $account = Account::find($id);
        $design_list = collect();

        if ($account->role_id == 1) {
            $designs = DB::table('design_process')->whereNot('design_process_status_id', 1)->orderBy('design_process_status_id', 'asc')->get();
            $design_list = $design_list->merge($designs);
        } else if ($account->role_id == 2) {
            $order_list = DB::table('orders')->where('saleStaff_id', $account->id)->whereNot('order_status_id', 7)->orderby('order_status_id', 'asc')->get();
            foreach ($order_list as $order) {
                $designs = DB::table('design_process')->where('order_id', $order->id)->orderBy('design_process_status_id', 'asc')->get();
                $design_list = $design_list->merge($designs);
            }
        } else if ($account->role_id == 3) {
            $order_list = DB::table('orders')->where('designStaff_id', $account->id)->whereNot('order_status_id', 7)->orderby('order_status_id', 'asc')->get();
            foreach ($order_list as $order) {
                $designs = DB::table('design_process')->where('order_id', $order->id)->orderBy('design_process_status_id', 'asc')->get();
                $design_list = $design_list->merge($designs);
            }
        } else {
            return response()->json([
                'error' => 'Invalid user (User is unauthorized)'
            ], 500);
        }

        // Sort the collection by design_process_status_id
        $design_list = $design_list->sortBy('design_process_status_id')->values();

        // $design_list->transform(function ($design) {
        //     $design->mounting_type = DB::table('mounting_type')->where('id', $design->mounting_type_id)->first();
        //     $design->design_process_status = DB::table('design_process_status')->where('id', $design->design_process_status_id)->first();
        //     unset($design->mounting_type_id);
        //     unset($design->design_process_status_id);
        //     return $design;
        // });
        $design_list = $design_list->map(function ($design) {
            if ($design->mounting_type_id != null) {
                $design->mounting_type = DB::table('mounting_type')->where('id', $design->mounting_type_id)->first();
            } else {
                $design->mounting_type = null;
            }
            $design->design_process_status = DB::table('design_process_status')->where('id', $design->design_process_status_id)->first();
            $design->created = Carbon::parse($design->created)->format('H:i:s d/m/Y');

            $OGurl = env('ORIGIN_URL');
            $Durl = env('DESIGN_PROCESS_URL');

            $design->imageUrl = $OGurl . $Durl . $design->id . '/' . $design->imageUrl;
            unset($design->mounting_type_id);
            unset($design->design_process_status_id);
            return $design;
        });
        return response()->json(
            $design_list
        );
    }
    public function get_design_process_detail(Request $request)
    {
        $input = json_decode($request->input('design_process_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
        $design_process = DB::table('design_process')->where('id', $input)->first();
        if ($design_process == null) {
            return response()->json([
                'error' => 'The selected design process doesn\'t exist'
            ], 403);
        }
        $design_process->created = Carbon::parse($design_process->created)->format('H:i:s d/m/Y');
        $order = DB::table('orders')->where('id', $design_process->order_id)->first();
        $order->created = Carbon::parse($order->created)->format('H:i:s d/m/Y');
        if ($order->delivery_date != null) {
            $order->delivery_date = Carbon::parse($order->delivery_date)->format('H:i:s d/m/Y');
        }
        if ($order->guarantee_expired_date != null) {
            $order->guarantee_expired_date = Carbon::parse($order->guarantee_expired_date)->format('H:i:s d/m/Y');
        }
        $product = DB::table('product')->where('id', $order->product_id)->first();
        $OGurl = env('ORIGIN_URL');
        $Ourl = env('ORDER_URL');
        $Durl = env('DESIGN_PROCESS_URL');

        $product->mounting_type = DB::table('mounting_type')->where('id', $product->mounting_type_id)->first();
        unset($product->mounting_type_id);

        $product_url = $product->imageUrl;
        $product->imageUrl = $OGurl . $Ourl . $product->id . "/" . $product->imageUrl;

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

        $order->product = $product;

        $account = DB::table('account')->where('id', $order->account_id)->first();
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
        $order->account = $account;
        unset($order->account_id);

        $sale_staff = DB::table('account')->where('id', $order->saleStaff_id)->first();
        if ($sale_staff != null) {
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
        }
        $order->sale_staff = $sale_staff;
        unset($order->saleStaff_id);

        $design_staff = DB::table('account')->where('id', $order->designStaff_id)->first();
        if ($design_staff != null) {
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
        }
        $order->design_staff = $design_staff;
        unset($order->designStaff_id);

        $production_staff = DB::table('account')->where('id', $order->productionStaff_id)->first();
        if ($production_staff != null) {
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
        }
        $order->production_staff = $production_staff;
        unset($order->productionStaff_id);

        $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
        unset($order->order_status_id);
        $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
        unset($order->order_type_id);
        $order->imageUrl = $OGurl . $Ourl . $product->id . "/" . $product_url;

        $design_process->order = $order;
        $design_process->mounting_type = DB::table('mounting_type')->where('id', $design_process->mounting_type_id)->first();
        $design_process->design_process_status = DB::table('design_process_status')->where('id', $design_process->design_process_status_id)->first();
        unset($design_process->mounting_type_id);
        unset($design_process->design_process_status_id);
        unset($design_process->order_id);

        $product_price = 0;

        // Calculate the price for product_diamond
        $product_diamond_current = DB::table('product_diamond')->where('product_id', $order->product_id)->get();
        foreach ($product_diamond_current as $product) {
            if ($product->status == 0) {
                $product_price += $product->price;
            } elseif ($product->status == 1) {
                // Use exists() to check if there are any items with status 0
                $check = DB::table('product_diamond')
                    ->where('diamond_id', $product->diamond_id)
                    ->where('status', 0)
                    ->exists();  // More efficient than get()
                if (!$check) {
                    $product_price += $product->price;
                }
            }
        }

        // Calculate the price for product_metal
        $product_metal_current = DB::table('product_metal')->where('product_id', $order->product_id)->get();
        foreach ($product_metal_current as $product) {
            if ($product->status == 0) {
                $product_price += $product->price;
            } elseif ($product->status == 1) {
                // Use exists() to check if there are any items with status 0
                $check = DB::table('product_metal')
                    ->where('metal_id', $product->metal_id)
                    ->where('status', 0)
                    ->exists();  // More efficient than get()
                if (!$check) {
                    $product_price += $product->price;
                }
            }
        }

        // Set the design process URL and calculate the total price
        $design_process->imageUrl = $OGurl . $Durl . $design_process->id . '/' . $design_process->imageUrl;
        $design_process->total_price = ceil(($product_price) * ($design_process->profit_rate + 100) / 100 + $design_process->production_price);
        $design_process->product_price = $product_price;
        unset($order->product_id);

        return response()->json([
            'design_process' => $design_process
        ]);
    }
    // public function add_design_updating(Request $request)
    // {
    //     $input = json_decode($request->input('new_design_updating'), true);
    //     if (!isset($input) || $input == null) {
    //         return response()->json([
    //             'error' => 'No input received'
    //         ], 403);
    //     }
    //     $authorizationHeader = $request->header('Authorization');
    //     $token = null;

    //     if ($authorizationHeader && strpos($authorizationHeader, 'Bearer ') === 0) {
    //         $token = substr($authorizationHeader, 7); // Extract the token part after 'Bearer '
    //         try {
    //             $decodedToken = JWTAuth::decode(new \Tymon\JWTAuth\Token($token));
    //         } catch (JWTException $e) {
    //             try {
    //                 $decodedToken = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));
    //             } catch (\Exception $e) {
    //                 return response()->json(['error' => 'Invalid token'], 401);
    //             }
    //         }
    //     }
    //     try {
    //         $id = $decodedToken['id'];
    //     } catch (Throwable $e) {
    //         $id = $decodedToken->id;
    //     }
    //     $order = DB::table('orders')->where('id', $input['order_id'])->first();
    //     if ($order->designStaff_id != $id) {
    //         return response()->json([
    //             'error' => 'Your account isn\'t assigned to the selected order'
    //         ], 403);
    //     }

    //     DB::beginTransaction();
    //     try {
    //         $id = DB::table('design_updating')->insertGetId([
    //             'order_id' => $input['order_id'],
    //             'imageUrl' => "",
    //             'created' => Carbon::now()->format('Y-m-d H:i:s')
    //         ]);
    //         if (isset($input['imageUrl']) && $input['imageUrl'] != null) {
    //             $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['imageUrl']));
    //             $destinationPath = public_path('image/Job/design_updating/' . $input['order_id']);
    //             if (!file_exists($destinationPath)) {
    //                 mkdir($destinationPath, 0755, true);
    //             }
    //             $fileName = Carbon::now()->timestamp . '_' . $id . '.jpg';
    //             file_put_contents($destinationPath . '/' . $fileName, $fileData);
    //             DB::table('design_updating')->where('id', $id)->update([
    //                 'imageUrl' => $fileName
    //             ]);
    //         }
    //         DB::commit();
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         return response()->json(['error' => $e->getMessage()], 500);
    //     }
    //     return response()->json([
    //         'success' => 'Successfully added'
    //     ]);
    // }
    // public function get_design_updating_list(Request $request)
    // {
    //     $input = json_decode($request->input('order_id'), true);
    //     if (!isset($input) || $input == null) {
    //         return response()->json([
    //             'error' => 'No input received'
    //         ], 403);
    //     }
    //     $list = DB::table('design_updating')->where('order_id', $input)->get();
    //     $list->map(function ($list) {
    //         $list->created = Carbon::parse($list->created)->format('H:i:s d/m/Y');
    //         return $list;
    //     });
    //     return response()->json(
    //         $list
    //     );
    // }
    public function get_production_status_list()
    {
        return response()->json(
            DB::table('production_status')->get()
        );
    }
    public function add_production_process(Request $request)
    {
        $input = json_decode($request->input('new_production_process'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }

        $production_process = DB::table('production_process')->where('order_id', $input['order_id'])->orderBy('created', 'desc')->first();
        $previous_status = 0;
        $order = DB::table('orders')->where('id', $input['order_id'])->first();
        if ($order == null) {
            return response()->json([
                'error' => 'The selected order doesn\'t exist'
            ], 403);
        }
        if ($order->order_status_id < 3) {
            return response()->json([
                'error' => 'The selected order isn\'t ready for production'
            ], 403);
        }
        if ($order->order_status_id > 3 && $order->order_status_id < 7) {
            return response()->json([
                'error' => 'The selected order has already been produce'
            ], 403);
        }
        if ($order->order_status_id == 7) {
            return response()->json([
                'error' => 'The selected order has already been cancelled'
            ], 403);
        }
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
                    return response()->json(['error' => 'Invalid token'], 401);
                }
            }
        }
        try {
            $id = $decodedToken['id'];
        } catch (Throwable $e) {
            $id = $decodedToken->id;
        }
        if ($order->productionStaff_id != $id) {
            return response()->json([
                'error' => 'Your account isn\'t assigned to the selected order'
            ], 403);
        }
        DB::beginTransaction();
        try {
            if ($production_process != null) {
                $previous_status = $production_process->production_status_id;
            }
            if ($input['production_status_id'] - $previous_status <= 1) {
                if ($input['production_status_id'] == 6) {
                    if (empty($input['imageUrl'])) {
                        return response()->json([
                            'error' => 'An image is needed for the final status'
                        ], 403);
                    }
                }
                $id = DB::table('production_process')->insertGetId([
                    'order_id' => $input['order_id'],
                    'production_status_id' => $input['production_status_id'],
                    'imageUrl' => "",
                    'created' => Carbon::now()->format('Y-m-d H:i:s')
                ]);

                if (isset($input['imageUrl']) && $input['imageUrl'] != null) {
                    $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['imageUrl']));
                    $destinationPath = public_path('image/Job/Production_process/' . $input['order_id']);
                    if (!file_exists($destinationPath)) {
                        mkdir($destinationPath, 0755, true);
                    }
                    $fileName = Carbon::now()->timestamp . '_' . $id . '.jpg';
                    file_put_contents($destinationPath . '/' . $fileName, $fileData);
                } else {
                    $fileName = null;
                }
                DB::table('production_process')->where('id', $id)->update([
                    'imageUrl' => $fileName
                ]);
            } else {
                return response()->json([
                    'error' => 'You can\'t skip a production status'
                ], 403);
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
        return response()->json([
            'success' => 'Production process successfully added'
        ], 201);
    }
    public function get_production_process_list(Request $request)
    {
        $input = json_decode($request->input('order_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
        $production_process_list = DB::table('production_process')->where('order_id', $input)->orderBy('created', 'asc')->get();
        $production_process_list->map(function ($list) {
            if ($list->imageUrl != null) {
                $OGurl = env('ORIGIN_URL');
                $Purl = env('PRODUCTION_PROCESS_URL');
                $list->imageUrl = $OGurl . $Purl . $list->order_id . '/' . $list->imageUrl;
            }
            $list->created = Carbon::parse($list->created)->format('H:i:s d/m/Y');
            $list->production_status = DB::table('production_status')->where('id', $list->production_status_id)->first();
            unset($list->production_status_id);
            return $list;
        });
        return response()->json(
            $production_process_list
        );
    }
    public function production_complete(Request $request)
    {
        $input = json_decode($request->input('order_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
        $order = DB::table('orders')->where('id', $input)->first();
        if ($order == null) {
            return response()->json([
                'error' => 'The selected order doesn\'t exist'
            ], 403);
        }
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
                    return response()->json(['error' => 'Invalid token'], 401);
                }
            }
        }
        try {
            $id = $decodedToken['id'];
        } catch (Throwable $e) {
            $id = $decodedToken->id;
        }
        if ($order->productionStaff_id != $id) {
            return response()->json([
                'error' => 'Your account isn\'t assigned to the selected order'
            ], 403);
        }
        DB::beginTransaction();
        try {
            $production_process = DB::table('production_process')->where('order_id', $input)->orderBy('created', 'asc')->get();
            $previous_status = 0;
            $complete = false;
            foreach ($production_process as $production) {
                $current_status = $production->production_status_id;
                if ($current_status == 6) {
                    $complete = true;
                } elseif ($current_status - $previous_status == 1) {
                    $previous_status = $current_status;
                    $complete = false;
                } elseif ($current_status <= $previous_status) {
                    $previous_status = $current_status;
                    $complete = false;
                }
            }
            if ($complete) {
                $production_process = DB::table('production_process')->where('order_id', $input)->orderBy('id', 'desc')->first();
                DB::table('product')->where('id', $order->product_id)->update([
                    'imageUrl' => $production_process->imageUrl
                ]);
                DB::table('orders')->where('id', $input)->update([
                    'order_status_id' => 4
                ]);

                $fileName = 'main.jpg';
                $destinationPath = public_path('image/Order/' . $order->product_id);
                File::cleanDirectory($destinationPath);
                $destinationFilePath = public_path('image/Order/' . $order->product_id . '/' . $fileName);
                $sourceFilePath = public_path('image/Job/Production_process/' . $order->id . '/' . $production_process->imageUrl);
                File::copy($sourceFilePath, $destinationFilePath);
                DB::table('product')->where('id', $order->product_id)->update([
                    'imageUrl' => $fileName
                ]);

                DB::commit();
                return response()->json([
                    'success' => 'Production complete'
                ]);
            } else {
                return response()->json([
                    'error' => 'The condition to complete the order hasn\'t met'
                ], 403);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function generateOrderCode()
    {
        $orderCode = intval(substr(strval(microtime(true) * 10000), -6));
        $payment = DB::table('payment')->where('id', $orderCode)->get();
        if ($payment->count() > 0) {
            $this->generateOrderCode();
        }
        return $orderCode;
    }
    // public function generateSecurityCode()
    // {
    //     $securityCode = intval(substr(strval(microtime(true) * 10000), -6));
    //     $account = DB::table('account')->where('security_code', $securityCode)->get();
    //     if ($account->count() > 0) {
    //         $this->generateSecurityCode();
    //     }
    //     return $securityCode;
    // }
    public function create_payment_link(Request $request)
    {
        $input = json_decode($request->input('order_information'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
        $order = DB::table('orders')->where('id', $input['order_id'])->first();
        if ($order == null) {
            return response()->json([
                'error' => 'The selected order doesn\'t exist'
            ], 403);
        }
        if ($order->order_status_id == 1) {
            $amount = ceil(($order->total_price / 2) - $order->deposit_has_paid);
            $payment_type_id = 1;
            $description = "Pay Deposit For ORDER " . $order->id;
        } else if ($order->order_status_id == 4) {
            $amount = ceil(($order->total_price) - $order->deposit_has_paid);
            $payment_type_id = 2;
            $description = "Pay The Rest For ORDER " . $order->id;
        } else {
            return response()->json([
                'error' => 'The selected order isn\'t ready for deposit/payment'
            ], 403);
        }
        $client_id = env('CLIENT_ID');
        $api_key = env('API_KEY');
        $checksum_key = env('CHECK_SUM_KEY');
        $payOS = new PayOS($client_id, $api_key, $checksum_key);

        $data = [
            "orderCode" => $this->generateOrderCode(),
            "amount" => $amount,
            "description" => $description,
            "returnUrl" => $input['return_url'],
            "cancelUrl" => $input['cancel_url'],
        ];
        try {
            DB::table('payment')->insert([
                'id' => $data['orderCode'],
                'account_id' => $order->account_id,
                'order_id' => $order->id,
                'payment_type_id' => $payment_type_id,
                'isSuccess' => 0,
                'money' => $amount,
                'created' => Carbon::now()->format('Y-m-d H:i:s')
            ]);
            $response = $payOS->createPaymentLink($data);
            return response()->json([
                'payment_link' => $response['checkoutUrl']
            ]);
        } catch (Throwable $th) {
            DB::rollBack();
            return $th->getMessage();
        }
    }
    public function isValidData($transaction, $transaction_signature, $checksum_key)
    {
        ksort($transaction);
        $transaction_str_arr = [];
        foreach ($transaction as $key => $value) {
            if (in_array($value, ["undefined", "null"]) || gettype($value) == "NULL") {
                $value = "";
            }

            if (is_array($value)) {
                $valueSortedElementObj = array_map(function ($ele) {
                    ksort($ele);
                    return $ele;
                }, $value);
                $value = json_encode($valueSortedElementObj, JSON_UNESCAPED_UNICODE);
            }
            $transaction_str_arr[] = $key . "=" . $value;
        }
        $transaction_str = implode("&", $transaction_str_arr);
        dump($transaction_str);
        $signature = hash_hmac("sha256", $transaction_str, $checksum_key);
        dump($signature);
        return $signature == $transaction_signature;
    }
    public function confirm_payment(Request $request)
    {
        $checksum_key = env('CHECK_SUM_KEY');
        $input = $request->input();
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
        DB::beginTransaction();
        try {
            if ($this->isValidData($input['data'], $input['signature'], $checksum_key)) {
                $payment = DB::table('payment')->where('id', $input['data']['orderCode'])->first();
                $order = DB::table('orders')->where('id', $payment->order_id)->first();
                if (!isset($payment) || !isset($order)) {
                    return response()->json([
                        'error' => 'Invalid order code'
                    ], 403);
                }
                //m chưa save
                if ($order->order_status_id == 1) {
                    if ($order->order_type_id == 1) {
                        DB::table('orders')->where('id', $order->id)->update([
                            'deposit_has_paid' => $order->deposit_has_paid += $payment->money,
                            'order_status_id' => 3
                        ]);
                        DB::table('production_process')->insert([
                            'order_id' => $order->id,
                            'production_status_id' => 1,
                            'created' => Carbon::now()->format('Y-m-d H:i:s')
                        ]);
                    } else {
                        $design_process = DB::table('design_process')->where('order_id', $order->id)->where('design_process_status_id', 3)->first();
                        if ($design_process != null) {
                            DB::table('orders')->where('id', $order->id)->update([
                                'deposit_has_paid' => $order->deposit_has_paid += $payment->money,
                                'order_status_id' => 3
                            ]);
                            DB::table('production_process')->insert([
                                'order_id' => $order->id,
                                'production_status_id' => 1,
                                'created' => Carbon::now()->format('Y-m-d H:i:s')
                            ]);
                        } else {
                            $product = DB::table('product')->where('id', $order->product_id)->first();
                            DB::table('product_diamond')->where('product_id', $product->id)->where('status', 3)->delete();
                            DB::table('product_diamond')->where('product_id', $product->id)->where('status', 4)->delete();
                            DB::table('product_metal')->where('product_id', $product->id)->where('status', 3)->delete();
                            DB::table('product_metal')->where('product_id', $product->id)->where('status', 4)->delete();
                            DB::table('orders')->where('id', $order->id)->update([
                                'deposit_has_paid' => $order->deposit_has_paid += $payment->money,
                                'order_status_id' => 2
                            ]);
                        }
                    }
                } else {
                    $guarantee_expired_date = Carbon::now()->addYears(10)->format('Y-m-d H:i:s');
                    DB::table('orders')->where('id', $order->id)->update([
                        'order_status_id' => 5,
                        'guarantee_expired_date' => $guarantee_expired_date
                    ]);
                    $this->generatePDF($payment->id, $guarantee_expired_date);
                }
                DB::table('payment')->where('id', $input['data']['orderCode'])->update([
                    'isSuccess' => 1
                ]);
                DB::commit();
            } else {
                return response()->json([
                    'error' => 'Invalid signature'
                ], 403);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Transaction complete'
        ], 200);
    }
    public function generatePDF($orderCode, $guarantee_expired_date)
    {
        $payment = DB::table('payment')->where('id', $orderCode)->first();
        $account = DB::table('account')->where('id', $payment->account_id)->first();
        $order = DB::table('orders')->where('id', $payment->order_id)->first();
        $product = DB::table('product')->where('id', $order->product_id)->first();
        $product_diamond = DB::table('product_diamond')->where('product_id', $product->id)->where('status', 1)->get();
        $product_diamond->map(function ($product_diamond) {
            $diamond = DB::table('diamond')->where('id', $product_diamond->diamond_id)->first();
            $diamond_color = DB::table('diamond_color')->where('id', $diamond->diamond_color_id)->first();
            $diamond_clarity = DB::table('diamond_clarity')->where('id', $diamond->diamond_clarity_id)->first();
            $diamond_cut = DB::table('diamond_cut')->where('id', $diamond->diamond_cut_id)->first();
            $diamond_shape = DB::table('diamond_shape')->where('id', $product_diamond->diamond_shape_id)->first();

            $product_diamond->name = $diamond->size . " (mm) " . $diamond_color->name . '-' . $diamond_clarity->name . ' ' . $diamond_shape->name . ' Shape ' . $diamond_cut->name . ' Cut Diamond';
            $product_diamond->price = $this->formatCurrency($product_diamond->price);
            $product_diamond->unit_price = $this->formatCurrency($diamond->price);
            return $product_diamond;
        });
        $product_metal = DB::table('product_metal')->where('product_id', $product->id)->where('status', 1)->get();
        $product_metal->map(function ($product_metal) {
            $metal = DB::table('metal')->where('id', $product_metal->metal_id)->first();
            $product_metal->name = $metal->name;
            $product_metal->sale_price_per_gram = $this->formatCurrency($metal->sale_price_per_gram);
            $product_metal->price = $this->formatCurrency($product_metal->price);
            return $product_metal;
        });
        $data = [
            'date' => Carbon::now()->format('d/m/Y'),
            'account' => $account,
            'payment' => $payment,
            'product_diamond' => $product_diamond,
            'product_metal' => $product_metal,
            'order' => $order,
            'product_price' => $this->formatCurrency($order->product_price),
            'production_price' => $this->formatCurrency($order->production_price + ($order->product_price) * $order->profit_rate / 100),
            'total_price' => $this->formatCurrency($order->total_price),
            'extra' => $this->formatCurrency(($payment->money + $order->deposit_has_paid) - $order->total_price),
        ];
        $data2 = [
            'guarantee_expired_date' => Carbon::parse($guarantee_expired_date)->format('d/m/Y')
        ];

        $pdf = PDF::loadView('pdf', $data);
        $pdf2 = PDF::loadView('guarantee', $data2);
        $fileName = Carbon::now()->timestamp . '_' . $payment->id . '.pdf';
        $fileName2 = 'guarantee_' . Carbon::now()->timestamp . '_' . $payment->id . '.pdf';
        // $fileName = $payment->id . '.pdf';
        $content = $pdf->download()->getOriginalContent();
        $content2 = $pdf2->download()->getOriginalContent();
        $destinationPath = public_path('pdf/' . $order->id);
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }
        $filePath = public_path('pdf/' . $order->id . '/' . $fileName);
        $filePath2 = public_path('pdf/' . $order->id . '/' . $fileName2);
        File::put($filePath, $content);
        File::put($filePath2, $content2);
        $path_to_files = [$filePath, $filePath2];
        $messageContent = 'Dear ' . $account->fullname . ',<br><br>Thank you for your purchase. Please find attached the payment invoice for your order.<br><br>Best Regards,<br>Bijoux Jewelry';
        $this->sendMail($account->email, $messageContent, 'Payment Invoice', $path_to_files);
        // $this->sendMail('dxbach31102004@gmail.com', $messageContent, 'Payment Invoice', $path_to_files);
    }
    public function generatePDFextra($orderId, $guarantee_expired_date)
    {
        $order = DB::table('orders')->where('id', $orderId)->first();
        $account = DB::table('account')->where('id', $order->account_id)->first();
        $product = DB::table('product')->where('id', $order->product_id)->first();
        $product_diamond = DB::table('product_diamond')->where('product_id', $product->id)->where('status', 1)->get();
        $product_diamond->map(function ($product_diamond) {
            $diamond = DB::table('diamond')->where('id', $product_diamond->diamond_id)->first();
            $diamond_color = DB::table('diamond_color')->where('id', $diamond->diamond_color_id)->first();
            $diamond_clarity = DB::table('diamond_clarity')->where('id', $diamond->diamond_clarity_id)->first();
            $diamond_cut = DB::table('diamond_cut')->where('id', $diamond->diamond_cut_id)->first();
            $diamond_shape = DB::table('diamond_shape')->where('id', $product_diamond->diamond_shape_id)->first();

            $product_diamond->name = $diamond->size . " (mm) " . $diamond_color->name . '-' . $diamond_clarity->name . ' ' . $diamond_shape->name . ' Shape ' . $diamond_cut->name . ' Cut Diamond';
            $product_diamond->price = $this->formatCurrency($product_diamond->price);
            $product_diamond->unit_price = $this->formatCurrency($diamond->price);
            return $product_diamond;
        });
        $product_metal = DB::table('product_metal')->where('product_id', $product->id)->where('status', 1)->get();
        $product_metal->map(function ($product_metal) {
            $metal = DB::table('metal')->where('id', $product_metal->metal_id)->first();
            $product_metal->name = $metal->name;
            $product_metal->sale_price_per_gram = $this->formatCurrency($metal->sale_price_per_gram);
            $product_metal->price = $this->formatCurrency($product_metal->price);
            return $product_metal;
        });
        $data = [
            'date' => Carbon::now()->format('d/m/Y'),
            'account' => $account,
            'product_diamond' => $product_diamond,
            'product_metal' => $product_metal,
            'order' => $order,
            'product_price' => $this->formatCurrency($order->product_price),
            'production_price' => $this->formatCurrency($order->production_price + ($order->product_price) * $order->profit_rate / 100),
            'total_price' => $this->formatCurrency($order->total_price),
            'extra' => $this->formatCurrency($order->deposit_has_paid - $order->total_price),
        ];
        $data2 = [
            'guarantee_expired_date' => Carbon::parse($guarantee_expired_date)->format('d/m/Y')
        ];

        $pdf = PDF::loadView('pdf', $data);
        $pdf2 = PDF::loadView('guarantee', $data2);
        $fileName = Carbon::now()->timestamp . '_' . $order->id . '.pdf';
        $fileName2 = 'guarantee_' . Carbon::now()->timestamp . '_' . $order->id . '.pdf';
        // $fileName = $payment->id . '.pdf';
        $content = $pdf->download()->getOriginalContent();
        $content2 = $pdf2->download()->getOriginalContent();
        $destinationPath = public_path('pdf/' . $order->id);
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }
        $filePath = public_path('pdf/' . $order->id . '/' . $fileName);
        $filePath2 = public_path('pdf/' . $order->id . '/' . $fileName2);
        File::put($filePath, $content);
        File::put($filePath2, $content2);
        $path_to_files = [$filePath, $filePath2];
        $messageContent = 'Dear ' . $account->fullname . ',<br><br>Thank you for your purchase. Please find attached the payment invoice for your order.<br><br>Best Regards,<br>Bijoux Jewelry';
        $this->sendMail($account->email, $messageContent, 'Payment Invoice', $path_to_files);
    }
    function formatCurrency($amount)
    {
        return number_format($amount, 0);
    }
    public function sendMail($toEmail, $messageContent, $subject, $pathToFile)
    {
        try {
            Mail::to($toEmail)->send(new Email($messageContent, $subject, $pathToFile));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to send email: ' . $e->getMessage()], 500);
        }
    }
    public function get_payment_history(Request $request)
    {
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
                    return response()->json(['error' => 'Invalid token'], 401);
                }
            }
        }
        try {
            $input = $decodedToken['id'];
        } catch (Throwable $e) {
            $input = $decodedToken->id;
        }
        $account = DB::table('account')->where('id', $input)->first();
        if ($account->role_id == 5) {
            $payment_list = DB::table('payment')->where('account_id', $input)->where('isSuccess', 1)->orderBy('created', 'desc')->get();
            $payment_list->map(function ($payment) {
                $payment->created = Carbon::parse($payment->created)->format('H:i:s d/m/Y');
                $payment->payment_type = DB::table('payment_type')->where('id', $payment->payment_type_id)->first();
                $temp = DB::table('account')->where('id', $payment->account_id)->first();
                $temp->role = DB::table('role')->where('id', $temp->role_id)->first();
                unset($temp->role_id);
                if (!$temp->google_id) {
                    $OGurl = env('ORIGIN_URL');
                    $url = env('ACCOUNT_URL');
                    $temp->imageUrl = $OGurl . $url . $temp->id . "/" . $temp->imageUrl;
                }
                $temp->dob = Carbon::parse($temp->dob)->format('d/m/Y');
                $temp->deactivated_date = Carbon::parse($temp->deactivated_date)->format('d/m/Y');
                unset($temp->password);
                $payment->account = $temp;
                unset($payment->account_id);
                unset($payment->payment_type_id);
                return $payment;
            });
        } else if ($account->role_id == 1 || $account->role_id == 2) {
            $payment_list = DB::table('payment')->orderBy('created', 'desc')->get();
            $payment_list->map(function ($payment) {
                $payment->created = Carbon::parse($payment->created)->format('H:i:s d/m/Y');
                $payment->payment_type = DB::table('payment_type')->where('id', $payment->payment_type_id)->first();
                $temp = DB::table('account')->where('id', $payment->account_id)->first();
                $temp->role = DB::table('role')->where('id', $temp->role_id)->first();
                unset($temp->role_id);
                if (!$temp->google_id) {
                    $OGurl = env('ORIGIN_URL');
                    $url = env('ACCOUNT_URL');
                    $temp->imageUrl = $OGurl . $url . $temp->id . "/" . $temp->imageUrl;
                }
                $temp->dob = Carbon::parse($temp->dob)->format('d/m/Y');
                $temp->deactivated_date = Carbon::parse($temp->deactivated_date)->format('d/m/Y');
                unset($temp->password);
                $payment->account = $temp;
                unset($payment->account_id);
                unset($payment->payment_type_id);
                return $payment;
            });
        } else {
            return response()->json([
                'error' => 'You don\'t have permission to access this page'
            ], 403);
        }
        return response()->json(
            $payment_list
        );
    }
    public function confirm_delivery(Request $request)
    {
        $input = json_decode($request->input('order_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
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
                    return response()->json(['error' => 'Invalid token'], 401);
                }
            }
        }
        try {
            $id = $decodedToken['id'];
        } catch (Throwable $e) {
            $id = $decodedToken->id;
        }
        $order = DB::table('orders')->where('id', $input)->first();
        if ($order->account_id != $id) {
            return response()->json([
                'error' => 'The selected order isn\'t your order'
            ], 403);
        }
        if ($order->order_status_id != 5) {
            return response()->json([
                'error' => 'The selected order isn\'t being deliver'
            ], 403);
        }
        DB::beginTransaction();
        try {
            DB::table('orders')->where('id', $input)->update([
                'order_status_id' => 6
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function get_refund_list()
    {
        $customize_order_list = DB::table('orders')->where('order_type_id', 2)->where('order_status_id', '>=', 4)->orderBy('order_status_id', 'asc')->get();
        $temp1 = collect();
        foreach ($customize_order_list as $list1) {
            if ($list1->deposit_has_paid - $list1->total_price > 0) {
                $temp1->push($list1);
            }
        }
        $temp1->map(function ($order) {
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
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
            $order->account = $account;
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            unset($order->order_status_id);
            unset($order->order_type_id);
            unset($order->account_id);
            unset($order->product_id);
            $order->created = Carbon::parse($order->created)->format('H:i:s d/m/Y');
            if ($order->delivery_date != null) {
                $order->delivery_date = Carbon::parse($order->delivery_date)->format('H:i:s d/m/Y');
            }
            if ($order->guarantee_expired_date != null) {
                $order->guarantee_expired_date = Carbon::parse($order->guarantee_expired_date)->format('H:i:s d/m/Y');
            }
            return $order;
        });
        $template_order_list = DB::table('orders')->where('order_type_id', 1)->where('order_status_id', '>=', 4)->orderBy('order_status_id', 'asc')->get();
        $temp2 = collect();
        foreach ($template_order_list as $list2) {
            if ($list2->deposit_has_paid - $list2->total_price > 0) {
                $temp2->push($list2);
            }
        }
        $temp2->map(function ($order) {
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
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
            $order->account = $account;
            $order->order_status = DB::table('order_status')->where('id', $order->order_status_id)->first();
            $order->order_type = DB::table('order_type')->where('id', $order->order_type_id)->first();
            unset($order->order_status_id);
            unset($order->order_type_id);
            unset($order->account_id);
            unset($order->product_id);
            $order->created = Carbon::parse($order->created)->format('H:i:s d/m/Y');
            if ($order->delivery_date != null) {
                $order->delivery_date = Carbon::parse($order->delivery_date)->format('H:i:s d/m/Y');
            }
            if ($order->guarantee_expired_date != null) {
                $order->guarantee_expired_date = Carbon::parse($order->guarantee_expired_date)->format('H:i:s d/m/Y');
            }
            return $order;
        });
        return response()->json([
            'customize_order_list' => $temp1,
            'template_order_list' => $temp2
        ]);
    }
    public function confirm_refund(Request $request)
    {
        $input = json_decode($request->input('order_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
        $order = DB::table('orders')->where('id', $input)->first();
        if ($order == null) {
            return response()->json([
                'error' => 'The selected order doesn\'t exist'
            ], 403);
        }
        if ($order->order_status_id != 4) {
            return response()->json([
                'error' => 'The selected order isn\'t ready for refund'
            ], 403);
        }
        DB::beginTransaction();
        try {
            $guarantee_expired_date = Carbon::now()->addYears(10)->format('Y-m-d H:i:s');
            DB::table('orders')->where('id', $input)->update([
                'order_status_id' => 5,
                'guarantee_expired_date' => $guarantee_expired_date
            ]);
            $this->generatePDFextra($order->id, $guarantee_expired_date);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
        return response()->json([
            'success' => 'Refund complete'
        ]);
    }
    // function generateRandomString($length)
    // {
    //     $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    //     $charactersLength = strlen($characters);
    //     $randomString = '';

    //     // Generate random bytes and convert to string
    //     $bytes = random_bytes($length);
    //     for ($i = 0; $i < $length; $i++) {
    //         $randomString .= $characters[ord($bytes[$i]) % $charactersLength];
    //     }

    //     return $randomString;
    // }
    public function get_dashboard(Request $request)
    {
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
                    return response()->json(['error' => 'Invalid token'], 401);
                }
            }
        }
        try {
            $input = $decodedToken['role_id'];
        } catch (Throwable $e) {
            $input = $decodedToken->role_id;
        }
        if ($input != 1 && $input != 2) {
            return response()->json([
                'error' => 'You don\'t have permission to access this page'
            ], 403);
        }
        $year = Carbon::now()->year;
        $month = Carbon::now()->month;
        $months = collect();
        for ($i = 1; $i <= Carbon::now()->month; $i++) {
            $monthName = Carbon::createFromDate(null, $i, 1)->format('F');
            $months = $months->push($monthName);
        }
        $user = new \stdClass();
        if (DB::table('account')->where('status', 1)->whereYear('created', $year)->count() != null && DB::table('account')->where('status', 1)->whereYear('created', $year)->count() != 0) {
            $user->user_year = $this->formatNumber(DB::table('account')->where('status', 1)->whereYear('created', $year)->count());
        } else {
            $user->user_year = 0;
        }
        if (DB::table('account')->where('status', 1)->whereMonth('created', $month)->whereYear('created', $year)->count() != null && DB::table('account')->where('status', 1)->whereMonth('created', $month)->whereYear('created', $year)->count() != 0) {
            $user->this_month = $this->formatNumber(DB::table('account')->where('status', 1)->whereMonth('created', $month)->whereYear('created', $year)->count());
        } else {
            $user->this_month = 0;
        }
        $user_month = collect();
        for ($i = 1; $i <= Carbon::now()->month; $i++) {
            // if($i = 1){
            //     $account_count = DB::table('account')->whereMonth('created', 12)->whereYear('created', $year-1)->count();
            // } else {
            if (DB::table('account')->where('status', 1)->whereMonth('created', $i)->whereYear('created', $year)->count() != null && DB::table('account')->where('status', 1)->whereMonth('created', $i)->whereYear('created', $year)->count() != 0) {
                $account_count = DB::table('account')->where('status', 1)->whereMonth('created', $i)->whereYear('created', $year)->count();
            } else {
                $account_count = 0;
            }
            // }
            $user_month->push($account_count);
        }
        $user->user_month = $user_month->values()->all();

        $profit = new \stdClass();
        $temp = 0;
        if (DB::table('orders')->where('order_status_id', 6)->whereYear('created', $year)->get() != null) {
            $orders2 = DB::table('orders')->where('order_status_id', 6)->whereYear('created', $year)->get();
            foreach ($orders2 as $order) {
                $product_price = $order->product_price;
                $production_price = $order->production_price;
                $profit_rate = $order->profit_rate;
                $temp += ceil($production_price + ($product_price) * (($profit_rate * 100) / 100));
            }
            $profit->profit_year = $this->formatNumber($temp);
        } else {
            $profit->profit_year = 0;
        }


        $temp1 = 0;
        if (DB::table('orders')->where('order_status_id', 6)->whereMonth('created', $month)->whereYear('created', $year)->get() != null) {
            $orders3 = DB::table('orders')->where('order_status_id', 6)->whereMonth('created', $month)->whereYear('created', $year)->get();
            foreach ($orders3 as $order) {
                $product_price = $order->product_price;
                $production_price = $order->production_price;
                $profit_rate = $order->profit_rate;
                $temp1 += ceil($production_price + ($product_price) * (($profit_rate * 100) / 100));
            }
            $profit->this_month = $this->formatNumber($temp1);
        } else {
            $profit->this_month = 0;
        }
        $profit_month = collect();
        for ($i = 1; $i <= Carbon::now()->month; $i++) {
            $profits = 0;
            // if($i = 1){
            //     $orders = DB::table('orders')->whereMonth('created', 12)->whereYear('created', $year-1)->get();
            //     foreach($orders as $order){
            //         $product_price = $order->product_price;
            //         $production_price = $order->production_price;
            //         $profit_rate = $order->profit_rate;
            //         $profit += $production_price + ($product_price)*(($profit_rate * 100)/100);
            //     }
            // } else {
            if (DB::table('orders')->where('order_status_id', 6)->whereMonth('created', $i)->whereYear('created', $year)->get() != null) {
                $orders = DB::table('orders')->where('order_status_id', 6)->whereMonth('created', $i)->whereYear('created', $year)->get();
                foreach ($orders as $order) {
                    $product_price = $order->product_price;
                    $production_price = $order->production_price;
                    $profit_rate = $order->profit_rate;
                    $profits += ceil($production_price + ($product_price) * (($profit_rate * 100) / 100));
                }
            } else {
                $profits = 0;
            }
            // }
            $profit_month->push($profits);
        }
        $profit->profit_month = $profit_month->values()->all();

        $order = new \stdClass();
        if (DB::table('orders')->whereNot('order_status_id', 7)->whereYear('created', $year)->count() != null && DB::table('orders')->whereNot('order_status_id', 7)->whereYear('created', $year)->count() != 0) {
            $order->order_year = $this->formatNumber(DB::table('orders')->whereNot('order_status_id', 7)->whereYear('created', $year)->count());
        } else {
            $order->order_year = 0;
        }
        if (DB::table('orders')->whereNot('order_status_id', 7)->whereMonth('created', $month)->whereYear('created', $year)->count() != null && DB::table('orders')->whereNot('order_status_id', 7)->whereMonth('created', $month)->whereYear('created', $year)->count() != 0) {
            $order->this_month = $this->formatNumber(DB::table('orders')->whereNot('order_status_id', 7)->whereMonth('created', $month)->whereYear('created', $year)->count());
        } else {
            $order->this_month = 0;
        }
        $order_month = collect();
        for ($i = 1; $i <= Carbon::now()->month; $i++) {
            // if($i = 1){
            //     $order_count = DB::table('orders')->whereMonth('created', 12)->whereYear('created', $year-1)->count();
            // } else {
            if (DB::table('orders')->whereNot('order_status_id', 7)->whereMonth('created', $i)->whereYear('created', $year)->count() != null && DB::table('orders')->whereNot('order_status_id', 7)->whereMonth('created', $i)->whereYear('created', $year)->count() != 0) {
                $order_count = DB::table('orders')->whereNot('order_status_id', 7)->whereMonth('created', $i)->whereYear('created', $year)->count();
            } else {
                $order_count = 0;
            }
            // }
            $order_month->push($order_count);
        }
        $order->order_month = $order_month->values()->all();

        if (DB::table('orders')->where('order_status_id', '<', 6)->count() != null && DB::table('orders')->where('order_status_id', '<', 6)->count() != 0) {
            $total_order = DB::table('orders')->where('order_status_id', '<', 6)->count();
        } else {
            $total_order = 1;
        }

        $order_deposit = new \stdClass();
        if (DB::table('orders')->where('order_status_id', 1)->count() != null && DB::table('orders')->where('order_status_id', 1)->count() != 0) {
            $order_deposit_count = DB::table('orders')->where('order_status_id', 1)->count();
        } else {
            $order_deposit_count = 0;
        }
        $order_deposit->deposit_percentage = round($order_deposit_count / $total_order * 100, 0);
        $order_deposit->deposit_count = $order_deposit_count;

        $order_design = new \stdClass();
        if (DB::table('orders')->where('order_status_id', 2)->count() != null && DB::table('orders')->where('order_status_id', 2)->count() != 0) {
            $order_design_count = DB::table('orders')->where('order_status_id', 2)->count();
        } else {
            $order_design_count = 0;
        }
        $order_design->design_percentage = round($order_design_count / $total_order * 100, 0);
        $order_design->design_count = $order_design_count;

        $order_production = new \stdClass();
        if (DB::table('orders')->where('order_status_id', 3)->count() != null && DB::table('orders')->where('order_status_id', 3)->count() != 0) {
            $order_production_count = DB::table('orders')->where('order_status_id', 3)->count();
        } else {
            $order_production_count = 0;
        }
        $order_production->production_percentage = round($order_production_count / $total_order * 100, 0);
        $order_production->production_count = $order_production_count;

        $order_payment = new \stdClass();
        if (DB::table('orders')->where('order_status_id', 4)->count() != null && DB::table('orders')->where('order_status_id', 4)->count() != 0) {
            $order_payment_count = DB::table('orders')->where('order_status_id', 4)->count();
        } else {
            $order_payment_count = 0;
        }
        $order_payment->payment_percentage = round($order_payment_count / $total_order * 100, 0);
        $order_payment->payment_count = $order_payment_count;

        $order_delivery = new \stdClass();
        if (DB::table('orders')->where('order_status_id', 5)->count() != null && DB::table('orders')->where('order_status_id', 5)->count() != 0) {
            $order_delivery_count = DB::table('orders')->where('order_status_id', 5)->count();
        } else {
            $order_delivery_count = 0;
        }
        $order_delivery->delivery_percentage = round($order_delivery_count / $total_order * 100, 0);
        $order_delivery->delivery_count = $order_delivery_count;

        $order_template = new \stdClass();
        if (DB::table('orders')->where('order_type_id', 1)->whereNot('order_status_id', 7)->whereYear('created', $year)->count() != null && DB::table('orders')->where('order_type_id', 1)->whereNot('order_status_id', 7)->whereYear('created', $year)->count() != 0) {
            $order_template->order_template_year = $this->formatNumber(DB::table('orders')->where('order_type_id', 1)->whereNot('order_status_id', 7)->whereYear('created', $year)->count());
        } else {
            $order_template->order_template_year = 0;
        }
        if (DB::table('orders')->where('order_type_id', 1)->whereNot('order_status_id', 7)->whereMonth('created', $month)->whereYear('created', $year)->count() != null && DB::table('orders')->where('order_type_id', 1)->whereNot('order_status_id', 7)->whereMonth('created', $month)->whereYear('created', $year)->count() != 0) {
            $order_template->this_month = $this->formatNumber(DB::table('orders')->where('order_type_id', 1)->whereNot('order_status_id', 7)->whereMonth('created', $month)->whereYear('created', $year)->count());
        } else {
            $order_template->this_month = 0;
        }
        $order_template_month = collect();
        for ($i = 1; $i <= Carbon::now()->month; $i++) {
            // if($i = 1){
            //     $order_count = DB::table('orders')->whereMonth('created', 12)->whereYear('created', $year-1)->count();
            // } else {
            if (DB::table('orders')->where('order_type_id', 1)->whereNot('order_status_id', 7)->whereMonth('created', $i)->whereYear('created', $year)->count() != null && DB::table('orders')->where('order_type_id', 1)->whereNot('order_status_id', 7)->whereMonth('created', $i)->whereYear('created', $year)->count() != 0) {
                $order_count = DB::table('orders')->where('order_type_id', 1)->whereNot('order_status_id', 7)->whereMonth('created', $i)->whereYear('created', $year)->count();
            } else {
                $order_count = 0;
            }
            // }
            $order_template_month->push($order_count);
        }
        $order_template->order_template_month = $order_template_month->values()->all();

        $order_customize = new \stdClass();
        if (DB::table('orders')->where('order_type_id', 2)->whereNot('order_status_id', 7)->whereYear('created', $year)->count() != null && DB::table('orders')->where('order_type_id', 2)->whereNot('order_status_id', 7)->whereYear('created', $year)->count() != 0) {
            $order_customize->order_customize_year = $this->formatNumber(DB::table('orders')->where('order_type_id', 2)->whereNot('order_status_id', 7)->whereYear('created', $year)->count());
        } else {
            $order_customize->order_customize_year = 0;
        }
        if (DB::table('orders')->where('order_type_id', 2)->whereNot('order_status_id', 7)->whereMonth('created', $month)->whereYear('created', $year)->count() != null && DB::table('orders')->where('order_type_id', 2)->whereNot('order_status_id', 7)->whereMonth('created', $month)->whereYear('created', $year)->count() != 0) {
            $order_customize->this_month = $this->formatNumber(DB::table('orders')->where('order_type_id', 2)->whereNot('order_status_id', 7)->whereMonth('created', $month)->whereYear('created', $year)->count());
        } else {
            $order_customize->this_month = 0;
        }
        $order_customize_month = collect();
        for ($i = 1; $i <= Carbon::now()->month; $i++) {
            // if($i = 1){
            //     $order_count = DB::table('orders')->whereMonth('created', 12)->whereYear('created', $year-1)->count();
            // } else {
            if (DB::table('orders')->where('order_type_id', 2)->whereNot('order_status_id', 7)->whereMonth('created', $i)->whereYear('created', $year)->count() != null && DB::table('orders')->where('order_type_id', 2)->whereNot('order_status_id', 7)->whereMonth('created', $i)->whereYear('created', $year)->count() != 0) {
                $order_count = DB::table('orders')->where('order_type_id', 2)->whereNot('order_status_id', 7)->whereMonth('created', $i)->whereYear('created', $year)->count();
            } else {
                $order_count = 0;
            }
            // }
            $order_customize_month->push($order_count);
        }
        $order_customize->order_customize_month = $order_customize_month->values()->all();

        return response()->json([
            'months' => $months,
            'user' => $user,
            'profit' => $profit,
            'order' => $order,
            'order_deposit' => $order_deposit,
            'order_design' => $order_design,
            'order_production' => $order_production,
            'order_payment' => $order_payment,
            'order_delivery' => $order_delivery,
            'order_template' => $order_template,
            'order_customize' => $order_customize
        ]);
    }
    function formatNumber($number)
    {
        $suffix = '';
        if ($number >= 1000 && $number < 1000000) {
            $number = $number / 1000;
            $suffix = 'k';
        } elseif ($number >= 1000000 && $number < 1000000000) {
            $number = $number / 1000000;
            $suffix = 'M';
        } elseif ($number >= 1000000000) {
            $number = $number / 1000000000;
            $suffix = 'B';
        }

        // Round to 1 decimal place
        $number = round($number, 1);
        $formatted_order_count = (floor($number) == $number) ? number_format($number, 0) : $number;

        // Format the number with suffix
        return $formatted_order_count . $suffix;
    }
    public function cancel_payment(Request $request)
    {
        $input = json_decode($request->input('payment_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
        $payment = DB::table('payment')->where('id', $input)->first();
        if ($payment->isSuccess != 0) {
            return response()->json([
                'error' => 'The selected payment can\'t be cancelled'
            ], 403);
        }
        DB::beginTransaction();
        try {
            DB::table('payment')->where('id', $input)->update([
                'isSuccess' => 2
            ]);
            DB::commit();
            return response()->json([
                'success' => 'Payment cancelled successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function confirm_shipped(Request $request)
    {
        $input = json_decode($request->input('order_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
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
                    return response()->json(['error' => 'Invalid token'], 401);
                }
            }
        }
        try {
            $id = $decodedToken['id'];
        } catch (Throwable $e) {
            $id = $decodedToken->id;
        }
        $order = DB::table('orders')->where('id', $input)->first();
        if ($order->order_status_id != 5) {
            return response()->json([
                'error' => 'The selected order isn\'t ready for shipping'
            ], 403);
        } else if ($order->delivery_date != null) {
            return response()->json([
                'error' => 'The selected order has been shipped'
            ], 403);
        }
        if ($order->order_type_id == 2) {
            if ($order->saleStaff_id != $id && $order->saleStaff_id != null) {
                return response()->json([
                    'error' => 'The selected order isn\'t assigned to you'
                ], 403);
            }
        }
        DB::beginTransaction();
        try {
            DB::table('orders')->where('id', $input)->update([
                'delivery_date' => Carbon::now()->format('Y-m-d H:i:s')
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
        return response()->json([
            'success' => 'Confirm successfully'
        ]);
    }
}
