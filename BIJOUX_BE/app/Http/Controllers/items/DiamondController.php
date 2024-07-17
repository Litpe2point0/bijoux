<?php

namespace App\Http\Controllers\items;

use Illuminate\Http\Request;
use App\Models\items\Diamond;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Tymon\JWTAuth\Exceptions\JWTException;
use Throwable;

class DiamondController extends Controller
{
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
            //find diamond
            $diamond = DB::table('diamond')->where('id', $input['diamond_id'])->first();
            if ($diamond == null) {
                return response()->json([
                    'error' => 'The selected diamond doesn\'t exist'
                ], 403);
            }
            //check input deactivate
            if ($input['deactivate']) {
                DB::table('diamond')->where('id', $input['diamond_id'])->update([
                    'deactivated' => true,
                ]);
                $tf = true;
            } else {
                DB::table('diamond')->where('id', $input['diamond_id'])->update([
                    'deactivated' => false,
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
                'success' => 'Deactivate diamond successfully'
            ], 201);
        } else {
            return response()->json([
                'success' => 'Activate diamond successfully'
            ], 201);
        }
    }
    public function update_price(Request $request)
    {
        //input
        $input = json_decode($request->input('update_price'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
        DB::beginTransaction();
        try {
            $diamond = DB::table('diamond')->where('id', $input['diamond_id'])->first();
            if ($diamond->deactivated) {
                return response()->json([
                    'error' => 'The selected diamond has been deactivated'
                ], 403);
            }
            //find all product that contain the selected diamond
            $product_diamond  = DB::table('product_diamond')->select('product_id')->where('diamond_id', $input['diamond_id'])->groupby('product_id')->get();
            //update the diamond price
            DB::table('diamond')->where('id', $input['diamond_id'])->update([
                'price' => $input['price'],
                'created' => Carbon::now()->format('Y-m-d H:i:s')
            ]);
            $data = [];
            foreach ($product_diamond as $product) {
                $temp1 = DB::table('orders')->where('product_id', $product->product_id)->first();
                if($temp1 != null){
                    if($temp1->order_status_id >= 3){
                        continue;
                    }
                }
                $true = false;
                //find all product_diamond list to update price
                $diamond_list = DB::table('product_diamond')->where('product_id', $product->product_id)->where('diamond_id', $input['diamond_id'])->get();
                //check if the list has already been update previously to avoid removing the original price
                foreach ($diamond_list as $diamond) {
                    if ($diamond->status == 3) {
                        $true = true;
                    }
                }
                //loop to update diamond price
                foreach ($diamond_list as $diamond) {
                    //update current diamond price
                    if ($diamond->status == 1) {
                        if (!$true) {
                            //set status to save the original current diamond price before update price
                            DB::table('product_diamond')->where('product_id', $product->product_id)->where('diamond_id', $diamond->diamond_id)->where('status', 1)->update([
                                'status' => 3
                            ]);
                        }
                        $temp = [
                            'product_id' => $product->product_id,
                            'diamond_id' => $diamond->diamond_id,
                            'diamond_shape_id' => $diamond->diamond_shape_id,
                            'count' => $diamond->count,
                            'price' => $input['price'] * $diamond->count,
                            'status' => 1
                        ];
                        //delete the current diamond price if the original current diamond price has already been saved
                        DB::table('product_diamond')->where('product_id', $product->product_id)->where('diamond_id', $diamond->diamond_id)->where('status', 1)->delete();
                        $data[] = $temp;
                    } else if ($diamond->status == 0) {
                        if (!$true) {
                            //set status to save the original future diamond price before update price
                            DB::table('product_diamond')->where('product_id', $product->product_id)->where('diamond_id', $diamond->diamond_id)->where('status', 0)->update([
                                'status' => 4
                            ]);
                        }
                        $temp = [
                            'product_id' => $product->product_id,
                            'diamond_id' => $diamond->diamond_id,
                            'diamond_shape_id' => $diamond->diamond_shape_id,
                            'count' => $diamond->count,
                            'price' => $input['price'] * $diamond->count,
                            'status' => 0
                        ];
                        //delete the future diamond price if the original diamond price has already been saved
                        DB::table('product_diamond')->where('product_id', $product->product_id)->where('diamond_id', $diamond->diamond_id)->where('status', 0)->delete();
                        $data[] = $temp;
                    }
                }
            }
            //insert all the update diamond price
            DB::table('product_diamond')->insert($data);
            //loop to update diamond price in order and quote
            foreach ($product_diamond as $product) {
                $temp1 = DB::table('orders')->where('product_id', $product->product_id)->first();
                if($temp1 != null){
                    if($temp1->order_status_id >= 3){
                        continue;
                    }
                }
                $order =  DB::table('orders')->where('product_id', $product->product_id)->first();
                //check if order exist
                if ($order != null) {
                    $profit_rate = $order->profit_rate;
                    $production_price = $order->production_price;
                    $product_price = 0;
                    $diamond_list = DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 1)->get();
                    $metal_list = DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 1)->get();
                    //calculate new product price after update diamond price
                    foreach ($diamond_list as $diamond) {
                        if ($diamond->status == 1) {
                            $product_price += $diamond->price;
                        }
                    }
                    foreach ($metal_list as $metal) {
                        if ($metal->status == 1) {
                            $product_price += $metal->price;
                        }
                    }
                    DB::table('orders')->where('product_id', $product->product_id)->update([
                        'product_price' => $product_price,
                        'total_price' => ceil($product_price * ($profit_rate + 100) / 100 + $production_price)
                    ]);
                }

                $quote =  DB::table('quote')->where('product_id', $product->product_id)->first();
                //check if quote exist
                if ($quote != null) {
                    $profit_rate = $quote->profit_rate;
                    $production_price = $quote->production_price;
                    $product_price = 0;
                    $diamond_list = DB::table('product_diamond')->where('product_id', $quote->product_id)->where('status', 1)->get();
                    $metal_list = DB::table('product_metal')->where('product_id', $quote->product_id)->where('status', 1)->get();
                    //calculate new product price after update diamond price
                    foreach ($diamond_list as $diamond) {
                        if ($diamond->status == 1) {
                            $product_price += $diamond->price;
                        }
                    }
                    foreach ($metal_list as $metal) {
                        if ($metal->status == 1) {
                            $product_price += $metal->price;
                        }
                    }
                    DB::table('quote')->where('product_id', $product->product_id)->update([
                        'product_price' => $product_price,
                        'total_price' => ceil(($product_price) * ($profit_rate + 100) / 100 + $production_price)
                    ]);
                }
                if ($order != null) {
                    $design_process =  DB::table('design_process')->where('order_id', $order->id)->first();
                    //check if quote exist
                    if ($design_process != null && $design_process->design_process_status_id < 4) {
                        $profit_rate = $design_process->profit_rate;
                        $production_price = $design_process->production_price;
                        $product_price = 0;
                        if ($design_process->design_process_status_id < 3) {
                            $diamond_list = DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 0)->get();
                            $metal_list = DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 0)->get();
                        } else if ($design_process->design_process_status_id = 3) {
                            $diamond_list = DB::table('product_diamond')->where('product_id', $order->product_id)->where('status', 2)->get();
                            $metal_list = DB::table('product_metal')->where('product_id', $order->product_id)->where('status', 2)->get();
                        }
                        //calculate new product price after update metal price
                        foreach ($diamond_list as $diamond) {
                            if ($diamond->status == 1) {
                                $product_price += $diamond->price;
                            }
                        }
                        foreach ($metal_list as $metal) {
                            if ($metal->status == 1) {
                                $product_price += $metal->price;
                            }
                        }
                        DB::table('design_process')->where('order_id', $order->id)->update([
                            'product_price' => $product_price,
                            'total_price' => ceil(($product_price) * ($profit_rate + 100) / 100 + $production_price)
                        ]);
                    }
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Price update successfully'
        ], 201);
    }
}
