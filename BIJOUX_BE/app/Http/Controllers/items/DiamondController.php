<?php

namespace App\Http\Controllers\items;

use Illuminate\Http\Request;
use App\Models\items\Diamond;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class DiamondController extends Controller
{
    public function get_diamond_list(Request $request) //chưa test
    {
        $input = json_decode($request->input('diamond_search_information'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $query = Diamond::Query();
        if (isset($input['size']) && $input['size'] != null) {
            $query->where('size', $input['size']);
        }
        if (isset($input['diamond_color_id ']) && $input['diamond_color_id '] != null) {
            $query->where('diamond_color_id', $input['diamond_color_id']);
        }
        if (isset($input['diamond_cut_id ']) && $input['diamond_cut_id '] != null) {
            $query->where('diamond_cut_id', $input['diamond_cut_id']);
        }
        if (isset($input['diamond_clarity_id']) && $input['diamond_clarity_id'] != null) {
            $query->where('diamond_clarity_id', $input['diamond_clarity_id']);
        }
        if (isset($input['diamond_origin_id']) && $input['diamond_origin_id'] != null) {
            $query->where('diamond_origin_id', $input['diamond_origin_id']);
        }
        $diamond_list = $query->get();
        $diamond_list->map(function ($diamond) {
            $OGurl = env('ORIGIN_URL');
            $url = env('DIAMOND_URL');
            $diamond->imageUrl = $OGurl . $url . $diamond->imageUrl;
            return $diamond;
        });
        return response()->json([
            $diamond_list
        ]);
    }
    public function deactivate(Request $request) //chưa test
    {
        $input = json_decode($request->input('diamond_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        DB::beginTransaction();
        try {
            DB::table('diamond')->where('id', $input)->update([
                'deactivated' => true
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Diamond deactivate'
        ], 201);
    }
    public function update_price(Request $request) //chưa test
    {
        $input = json_decode($request->input('new_diamond'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        DB::beginTransaction();
        try {
            $product_diamond  = DB::table('product_diamond')->where('diamond_id', $input['id'])->groupby('product_id')->get();
            DB::table('diamond')->where('id', $input['id'])->update([
                'price' => $input['price']
            ]);
            foreach ($product_diamond as $product) {
                $diamond_list = DB::table('product_diamond')->where('product_id', $product->product_id)->get();
                foreach ($diamond_list as $diamond) {
                    if ($diamond->status == 1) {
                        DB::table('product_diamond')->where('diamond_id', $diamond->diamond_id)->where('status', 3)->delete();
                        DB::table('product_diamond')->where('diamond_id', $diamond->diamond_id)->where('status', 1)->update([
                            'status' => 3
                        ]);
                        DB::table('product_diamond')->insert([
                            'product_id' => $product->product_id,
                            'diamond_id' => $diamond->diamond_id,
                            'diamond_shape_id' => $diamond->diamond_shape_id,
                            'count' => $diamond->count,
                            'price' => $input['price'] * $diamond->count,
                            'status' => 1
                        ]);
                    }
                    if ($diamond->status == 0) {
                        DB::table('product_diamond')->where('diamond_id', $diamond->diamond_id)->where('status', 4)->delete();
                        DB::table('product_diamond')->where('diamond_id', $diamond->diamond_id)->where('status', 0)->update([
                            'status' => 4
                        ]);
                        DB::table('product_diamond')->insert([
                            'product_id' => $product->product_id,
                            'diamond_id' => $diamond->diamond_id,
                            'diamond_shape_id' => $diamond->diamond_shape_id,
                            'count' => $diamond->count,
                            'price' => $input['price'] * $diamond->count,
                            'status' => 0
                        ]);
                    }
                    if ($diamond->status == 2) {
                        DB::table('product_diamond')->where('diamond_id', $diamond->diamond_id)->where('status', 2)->update([
                            'price' => $input['price'] * $diamond->count,
                        ]);
                    }
                    
                }
            }

            foreach ($product_diamond as $product) {
                $order =  DB::table('orders')->where('product_id', $product->product_id)->first();
                $profit_rate = $order->profit_rate;
                $production_price = $order->production_price;
                $product_price = 0;
                $diamond_list = DB::table('product_diamond')->where('product_id', $order->product_id)->get();
                $metal_list = DB::table('product_metal')->where('product_id', $order->product_id)->orderby('metal_id')->get();
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
                    'total_price' => $product_price * ($profit_rate + 100) / 100 + $production_price
                ]);

                $quote =  DB::table('quote')->where('product_id', $product->product_id)->first();
                $profit_rate = $quote->profit_rate;
                $production_price = $quote->production_price;
                $product_price = 0;
                $diamond_list = DB::table('product_diamond')->where('product_id', $order->product_id)->get();
                $metal_list = DB::table('product_metal')->where('product_id', $order->product_id)->orderby('metal_id')->get();
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
                    'total_price' => $product_price * ($profit_rate + 100) / 100 + $production_price
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
    }
    public function get_diamond_detail(Request $request) //chưa test
    {
        $input = json_decode($request->input('diamond_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $diamond = DB::table('diamond')->where('id', $input)->first();
        $OGurl = env('ORIGIN_URL');
        $url = env('DIAMOND_URL');
        $diamond->imageUrl = $OGurl . $url . $diamond->imageUrl;
        return response()->json([
            $diamond
        ]);
    }
    public function get_shape_list() //chưa test
    {
        return response()->json([
            DB::table('diamond_shape')->get()
        ]);
    }
    public function get_shape_detail(Request $request) //chưa test
    {
        $input = json_decode($request->input('shape_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        return response()->json([
            DB::table('diamond_shape')->where('id', $input)->first()
        ]);
    }
    public function get_diamond_origin_list() //chưa test
    {
        return response()->json([
            DB::table('diamond_origin')->get()
        ]);
    }
    public function get_color_list() //chưa test
    {
        return response()->json([
            DB::table('diamond_color')->get()
        ]);
    }
    public function get_size_list() //chưa test
    {
        return response()->json([
            DB::table('diamond')->select('size')->groupBy('size')->get()
        ]);
    }
    public function get_cut_list() //chưa test
    {
        return response()->json([
            DB::table('diamond_cut')->get()
        ]);
    }
    public function get_clarity_list() //chưa test
    {
        return response()->json([
            DB::table('diamond_clarity')->get()
        ]);
    }
}
