<?php

namespace App\Http\Controllers\items;

use Illuminate\Http\Request;
use App\Models\items\Metal;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MetalController extends Controller
{
    public function add(Request $request)//chưa test
    {
        $input = json_decode($request->input('new_metal'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        DB::beginTransaction();
        try {
            $metal = new Metal();
            $metal->name = $input['name'];
            $metal->imageUrl = "";
            $metal->buy_price_per_gram = $input["buy_price_per_gram"];
            $metal->sell_price_per_gram = $input["sell_price_per_gram"];
            $metal->specific_weight = $input["specific_weight"];
            $metal->deactivated = false;
            $metal->created = Carbon::createFromTimestamp(time())->format('Y-m-d H:i:s');
            $metal->save();

            $metalId = (int)$metal->id;
            $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['imageUrl']));
            $destinationPath = public_path('image/Metal/' . $metalId);
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $fileName = time() . '_' . $metalId . '.jpg';
            file_put_contents($destinationPath . '/' . $fileName, $fileData);

            $url = env('URL');
            $metal->imageUrl = $url . 'Metal/' . $metalId . '/' . Carbon::createFromTimestamp(time())->format('Y-m-d H:i:s') . '_' . $metalId . '.jpg';
            $metal->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Metal successfulyl add'
        ], 201);
    }
    public function update_price(Request $request)//chưa test
    {
        $input = json_decode($request->input('new_metal'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        DB::beginTransaction();
        try {
            $product_metal = DB::table('product_metal')->where('metal_id', $input['id'])->groupby('product_id')->get();
            DB::table('metal')->where('id', $input['id'])->update([
                'buy_price_per_gram' => $input['buy_price_per_gram'],
                'sale_price_per_gram'=> $input['sale_price_per_gram'],
            ]);
            foreach ($product_metal as $product) {
                $metal_list = DB::table('product_metal')->where('product_id', $product->product_id)->get();
                foreach ($metal_list as $metal) {
                    if ($metal->status == 1) {
                        DB::table('product_metal')->where('metal_id', $metal->metal_id->where('status', 3))->delete();
                        DB::table('product_metal')->where('metal_id', $metal->metal_id->where('status', 1))->update([
                            'status' => 3
                        ]);
                        DB::table('product_metal')->insert([
                            'product_id' => $product->product_id,
                            'metal_id' => $metal->metal_id,
                            'volume' => $metal->volume,
                            'weight' => $metal->weight,
                            'price' => $input['sale_price_per_gram'] * $metal->weight,
                            'status' => 1
                        ]);
                    }
                    if ($metal->status == 0) {
                        DB::table('product_metal')->where('metal_id', $metal->metal_id->where('status', 4))->delete();
                        DB::table('product_metal')->where('metal_id', $metal->metal_id->where('status', 0))->update([
                            'status' => 4
                        ]);
                        DB::table('product_metal')->insert([
                            'product_id' => $product->product_id,
                            'metal_id' => $metal->metal_id,
                            'volume' => $metal->volume,
                            'weight' => $metal->weight,
                            'price' => $input['sale_price_per_gram'] * $metal->weight,
                            'status' => 0
                        ]);
                    }
                    if ($metal->status == 2) {
                    }
                    DB::table('product_metal')->where('metal_id', $metal->metal_id->where('status', 2))->update([
                        'price' => $input['sale_price_per_gram'] * $metal->weight
                    ]);
                }
            }
            
            foreach($product_metal as $product){
                $order =  DB::table('orders')->where('product_id',$product->product_id)->first();
                $profit_rate = $order->profit_rate;
                $production_price = $order->production_price;
                $product_price = 0;
                $diamond_list = DB::table('product_diamond')->where('product_id',$order->product_id)->get();
                $metal_list = DB::table('product_metal')->where('product_id',$order->product_id)->get();
                foreach($diamond_list as $diamond){
                    if($diamond->status == 1){
                        $product_price += $diamond->price;
                    }
                }
                foreach($metal_list as $metal){
                    if($metal->status == 1){
                        $product_price += $metal->price;
                    }
                }
                DB::table('orders')->where('product_id',$product->product_id)->update([
                    'product_price' => $product_price,
                    'total_price' => $product_price * ($profit_rate+100)/100 + $production_price
                ]);

                $quote =  DB::table('quote')->where('product_id',$product->product_id)->first();
                $profit_rate = $quote->profit_rate;
                $production_price = $quote->production_price;
                $product_price = 0;
                $diamond_list = DB::table('product_diamond')->where('product_id',$quote->product_id)->get();
                $metal_list = DB::table('product_metal')->where('product_id',$quote->product_id)->get();
                foreach($diamond_list as $diamond){
                    if($diamond->status == 1){
                        $product_price += $diamond->price;
                    }
                }
                foreach($metal_list as $metal){
                    if($metal->status == 1){
                        $product_price += $metal->price;
                    }
                }
                DB::table('quote')->where('product_id',$product->product_id)->update([
                    'product_price' => $product_price,
                    'total_price' => $product_price * ($profit_rate+100)/100 + $production_price
                ]);
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Price Update Successfully'
        ],201);
    }
    public function deactivate(Request $request)//chưa test
    {
        $input = json_decode($request->input('metal_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        DB::beginTransaction();
        try {
            DB::table('metal')->where('id', $input)->update([
                'deactivated' => true
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Successfully deactivated'
        ],201);
    }
    public function get_list()//chưa test
    {
        return response()->json([
            DB::table('metal')->get()
        ]);
    }
    public function get_detail(Request $request)//chưa test
    {
        $input = json_decode($request->input('metal_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        return response()->json([
            'metal' => DB::table('metal')->where('id',$input)->get()
        ]);
    }
    public function get_weight_price(Request $request)//chưa test
    {
        $input = json_decode($request->input('metal_information'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $metal = DB::table('metal')->where('id',$input['metal_id'])->first();
        $weight = $metal->specific_weight * $input['volume'];
        $price = $weight * $metal->sale_price_per_gram;
        $temp['weight'] =$weight;
        $temp['price'] = $price;
        return response()->json([
            'weight_price' =>$temp
        ]);
    }
}
