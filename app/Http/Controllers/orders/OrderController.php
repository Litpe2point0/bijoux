<?php

namespace App\Http\Controllers\orders;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\items\Product_Diamond;
use App\Models\items\Product_Metal;
use App\Models\items\Product;
use App\Models\orders\Order;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;

class OrderController extends Controller
{
    public function get_order_list_admin()
    {
        $order_list = DB::table('orders')->orderBy('order_status_id','asc')->get();
        $order_list->map(function ($order) {
            $order->product = DB::table('product')->where('id', $order->product_id)->first();
            $order->account = DB::table('account')->where('id',$order->account_id)->first();
            $order->order_status = DB::table('order_status')->where('id',$order->order_status_id)->first();
            $order->order_type = DB::table('order_type')->where('id',$order->order_type_id)->first();
            unset($order->order_status_id);
            unset($order->order_type_id);
            unset($order->account_id);
            unset($order->product_id);
            return $order;   
        });
        $customize_order_list = DB::table('orders')->where('order_type_id',1)->orderBy('order_status_id','asc')->get();
        $customize_order_list->map(function ($order) {
            $order->product = DB::table('product')->where('id', $order->product_id)->first();
            $order->account = DB::table('account')->where('id',$order->account_id)->first();
            $order->order_status = DB::table('order_status')->where('id',$order->order_status_id)->first();
            $order->order_type = DB::table('order_type')->where('id',$order->order_type_id)->first();
            unset($order->order_status_id);
            unset($order->order_type_id);
            unset($order->account_id);
            unset($order->product_id);
            return $order;   
        });
        $template_order_list = DB::table('orders')->where('order_type_id',2)->orderBy('order_status_id','asc')->get();
        $template_order_list->map(function ($order) {
            $order->product = DB::table('product')->where('id', $order->product_id)->first();
            $order->account = DB::table('account')->where('id',$order->account_id)->first();
            $order->order_status = DB::table('order_status')->where('id',$order->order_status_id)->first();
            $order->order_type = DB::table('order_type')->where('id',$order->order_type_id)->first();
            unset($order->order_status_id);
            unset($order->order_type_id);
            unset($order->account_id);
            unset($order->product_id);
            return $order;   
        });
        return response()->json([
            'order_list' => $order_list,
            'customize_order_list' => $customize_order_list,
            'template_order_list' => $template_order_list
        ]);
    }
    public function get_order_list_customer(Request $request)
    {
        $input = json_decode($request->input('account_id'), true);
        if(!isset($input) || $input == null){
            return response()->json([
                'error' => 'No Input Received'
            ],404);
        }

        $order_list = DB::table('orders')->where('account_id',$input)->orderBy('order_status_id','asc')->get();
        $order_list->map(function ($order) {
            $order->product = DB::table('product')->where('id', $order->product_id)->first();
            $order->account = DB::table('account')->where('id',$order->account_id)->first();
            $order->order_status = DB::table('order_status')->where('id',$order->order_status_id)->first();
            $order->order_type = DB::table('order_type')->where('id',$order->order_type_id)->first();
            unset($order->order_status_id);
            unset($order->order_type_id);
            unset($order->account_id);
            unset($order->product_id);
            return $order;   
        });
        $customize_order_list = DB::table('orders')->where('account_id',$input)->where('order_type_id',1)->orderBy('order_status_id','asc')->get();
        $customize_order_list->map(function ($order) {
            $order->product = DB::table('product')->where('id', $order->product_id)->first();
            $order->account = DB::table('account')->where('id',$order->account_id)->first();
            $order->order_status = DB::table('order_status')->where('id',$order->order_status_id)->first();
            $order->order_type = DB::table('order_type')->where('id',$order->order_type_id)->first();
            unset($order->order_status_id);
            unset($order->order_type_id);
            unset($order->account_id);
            unset($order->product_id);
            return $order;   
        });
        $template_order_list = DB::table('orders')->where('account_id',$input)->where('order_type_id',2)->orderBy('order_status_id','asc')->get();
        $template_order_list->map(function ($order) {
            $order->product = DB::table('product')->where('id', $order->product_id)->first();
            $order->account = DB::table('account')->where('id',$order->account_id)->first();
            $order->order_status = DB::table('order_status')->where('id',$order->order_status_id)->first();
            $order->order_type = DB::table('order_type')->where('id',$order->order_type_id)->first();
            unset($order->order_status_id);
            unset($order->order_type_id);
            unset($order->account_id);
            unset($order->product_id);
            return $order;   
        });
        return response()->json([
            'order_list' => $order_list,
            'customize_order_list' => $customize_order_list,
            'template_order_list' => $template_order_list
        ]);
    }
    public function add_order_template(Request $request)
    {
        $input = json_decode($request->input('new_order'), true);
        $account_id = $input['account']['id'];
        $count = 1;
        $product_price = 0;
        DB::beginTransaction();
        try {
            $model = DB::table('model')->where('id', $input['model_id'])->first();
            $model_diamond = DB::table('model_diamond')->where('model_id',$model->id)->get();

            $metal_list = $input['metal_list'];
            foreach($metal_list as $metalO){
                ${'metal_'.$count.'_id'} = $metalO['metal']['id'];
                $count++;
            }
            if($count < 3){
                $metal_2_id = 0;
            }
            $destinationPath = public_path('image/Final_templates/' . $input['model_id'] . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $input['diamond_shape_id']);
            if (!file_exists($destinationPath)) {
                return response()->json([
                    'error' => 'Product is not available'
                ], 404);
            }
            $url = env('URL');
            $imageUrl = $url . 'Final_templates/' . $input['model_id'] . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $input['diamond_shape_id'] . '/main.jpg';
            
            $mounting_type_id = $model->mounting_type_id;

            $product = new Product();
            $product->imageUrl = $imageUrl;
            $product->mounting_type_id = $mounting_type_id;
            $product->model_id = $input['model_id'];
            $product->mounting_size = $input['mounting_size'];
            $product->save();

            foreach ($metal_list as $metalO) {
                $product_metal = new Product_Metal();
                $product_metal->product_id = $product->id;
                $product_metal->metal_id = $metalO['metal']['id'];
                $product_metal->volume = $metalO['volume'];
                $product_metal->weight = $metalO['weight'];
                $product_metal->price = $metalO['price'];
                $product_metal->isAccepted = true;
                $product_metal->save();
                $product_price += $metalO['price'];
            }

            foreach($model_diamond as $diamond0){
                $product_diamond = new Product_Diamond();
                if($diamond0->Is_editable == 1){
                    $diamond = DB::table('diamond')->where('size',$input['diamond_size'])->where('diamond_color_id', $input['diamond_color_id'])->where('diamond_clarity_id',$input['diamond_clarity_id'])->where('diamond_cut_id',$input['diamond_cut_id'])->where('diamond_origin_id',$input['diamond_origin_id'])->first();
                    $product_diamond->product_id = $product->id;
                    $product_diamond->diamond_id = $diamond->id;
                    $product_diamond->diamond_shape_id = $input['diamond_shape_id'];
                    $product_diamond->count = $diamond0->count;
                    $product_diamond->price = $diamond->price * $diamond0->count;
                    $product_diamond->isAccepted = true;
                    $product_diamond->save();
                } else if($diamond0->Is_editable == 0){
                    $diamond = DB::table('diamond')->where('size',$diamond0->diamond_size_max)->where('diamond_color_id', $input['diamond_color_id'])->where('diamond_clarity_id',$input['diamond_clarity_id'])->where('diamond_cut_id',$input['diamond_cut_id'])->where('diamond_origin_id',$input['diamond_origin_id'])->first();
                    $product_diamond->product_id = $product->id;
                    $product_diamond->diamond_id = $diamond->id;
                    $product_diamond->diamond_shape_id = $diamond0->diamond_shape_id;
                    $product_diamond->count = $diamond0->count;
                    $product_diamond->price = $diamond->price * $diamond0->count;
                    $product_diamond->isAccepted = true;
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
        $input = json_decode($request->input('assigned_order'), true);
        if(!isset($input) || $input == null){
            return response()->json([
                'error' => 'No Input Received'
            ],404);
        }
        
    }
    public function update_order_customize(Request $request)
    {
    }
    public function update_order_template(Request $request)
    {
    }
    public function cancel(Request $request)
    {
    }
    public function get_detail(Request $request)
    {
    }
    public function confirm_payment(Request $request)
    {
    }
    public function get_assigned_staff(Request $request)
    {
    }
    public function get_assigned_order_sale(Request $request)
    {
    }
    public function get_assigned_order_design(Request $request)
    {
    }
    public function get_assigned_order_production(Request $request)
    {
    }
    public function request_design_process(Request $request)
    {
    }
    public function approve_design_process(Request $request)
    {
        //sale và manager đều xài cái này, sale có thể thêm trường production_price, còn manager chỉ có thể xem
    }
    public function get_design_process_list(Request $request)
    {
    }
    public function add_design_updating(Request $request)
    {
    }
    public function get_design_updating_list(Request $request)
    {
    }
    public function get_production_status_list()
    {
    }
    public function add_production_process(Request $request)
    {
    }
    public function get_production_process_list(Request $request)
    {
    }
    public function design_complete(Request $request)
    {
    }
    public function production_complete(Request $request)
    {
    }
}
