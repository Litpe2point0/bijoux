<?php

namespace App\Http\Controllers\items;

use Illuminate\Http\Request;
use App\Models\items\Metal;
use App\Models\items\Product_Metal;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Tymon\JWTAuth\Exceptions\JWTException;
use Throwable;

class MetalController extends Controller
{
    // public function add(Request $request)
    // {
    //     //input
    //     $input = json_decode($request->input('new_metal'), true);
    //     if (!isset($input) || $input == null) {
    //         return response()->json([
    //             'error' => 'No Input Received'
    //         ], 403);
    //     }
    //     DB::beginTransaction();
    //     try {
    //         //create new metal
    //         $metal = new Metal();
    //         $metal->name = $input['name'];
    //         $metal->imageUrl = "";
    //         $metal->buy_price_per_gram = $input["buy_price_per_gram"];
    //         $metal->sale_price_per_gram = $input["sale_price_per_gram"];
    //         $metal->specific_weight = $input["specific_weight"];
    //         $metal->deactivated = false;
    //         $metal->created = Carbon::createFromTimestamp(time())->format('Y-m-d H:i:s');
    //         $metal->save();

    //         //get metal id
    //         $metalId = (int)$metal->id;
    //         $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['imageUrl']));
    //         $destinationPath = public_path('image/Metal/' . $metalId);
    //         //check destination path if not create one
    //         if (!file_exists($destinationPath)) {
    //             mkdir($destinationPath, 0755, true);
    //         }
    //         $fileName = time() . '_' . $metalId . '.jpg';
    //         //input filedata through destination path with fileName 
    //         file_put_contents($destinationPath . '/' . $fileName, $fileData);

    //         $metal->imageUrl = $fileName;
    //         $metal->save();

    //         DB::commit();
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         return response()->json($e->getMessage(), 500);
    //     }
    //     return response()->json([
    //         'success' => 'Metal Successfully Add'
    //     ], 201);
    // }

    public function update_price(Request $request)
    {
        //input
        $input = json_decode($request->input('update_price'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 403);
        }
        DB::beginTransaction();
        try {
            $metal = DB::table('metal')->where('id', $input['metal_id'])->first();
            if ($metal->deactivated) {
                return response()->json([
                    'error' => 'The Selected Metal Has Been Deactivated'
                ], 403);
            }
            //find all product that contain the selected metal
            $product_metal = DB::table('product_metal')->select('product_id')->where('metal_id', $input['metal_id'])->groupby('product_id')->get();
            //update the metal price
            DB::table('metal')->where('id', $input['metal_id'])->update([
                'buy_price_per_gram' => $input['buy_price_per_gram'],
                'sale_price_per_gram' => $input['sale_price_per_gram'],
                'created' => Carbon::now()->format('Y-m-d H:i:s')
            ]);
            $data = [];
            foreach ($product_metal as $product) {
                $temp1 = DB::table('orders')->where('product_id', $product->id)->first();
                if($temp1 != null){
                    if($temp1->order_status_id >= 3){
                        continue;
                    }
                }
                $true = false;
                //find all product_metal list to update price
                $metal_list = DB::table('product_metal')->where('product_id', $product->product_id)->where('metal_id', $input['metal_id'])->get();
                //check if the list has already been update previously to avoid removing the original price
                foreach ($metal_list as $metal) {
                    if ($metal->status == 3) {
                        $true = true;
                    }
                }
                //loop to update metal price
                foreach ($metal_list as $metal) {
                    //update current metal price
                    if ($metal->status == 1) {
                        if (!$true) {
                            //set status to save the original current metal price before update price
                            DB::table('product_metal')->where('product_id', $product->product_id)->where('metal_id', $metal->metal_id)->where('status', 1)->update([
                                'status' => 3
                            ]);
                        }
                        $temp = [
                            'product_id' => $product->product_id,
                            'metal_id' => $metal->metal_id,
                            'volume' => $metal->volume,
                            'weight' => $metal->weight,
                            'price' => $input['sale_price_per_gram'] * $metal->weight,
                            'status' => 1
                        ];
                        //delete the current metal price if the original current metal price has already been saved
                        DB::table('product_metal')->where('product_id', $product->product_id)->where('metal_id', $metal->metal_id)->where('status', 1)->delete();
                        $data[] = $temp;
                    } else if ($metal->status == 0) {
                        if (!$true) {
                            //set status to save the original future metal price before update price
                            DB::table('product_metal')->where('product_id', $product->product_id)->where('metal_id', $metal->metal_id)->where('status', 0)->update([
                                'status' => 4
                            ]);
                        }
                        $temp = [
                            'product_id' => $product->product_id,
                            'metal_id' => $metal->metal_id,
                            'volume' => $metal->volume,
                            'weight' => $metal->weight,
                            'price' => $input['sale_price_per_gram'] * $metal->weight,
                            'status' => 0
                        ];
                        //delete the future metal price if the original metal price has already been saved
                        DB::table('product_metal')->where('product_id', $product->product_id)->where('metal_id', $metal->metal_id)->where('status', 0)->delete();
                        $data[] = $temp;
                    }
                }
            }
            //insert all the update metal price
            DB::table('product_metal')->insert($data);
            //loop to update metal price in order and quote
            foreach ($product_metal as $product) {
                $temp1 = DB::table('orders')->where('product_id', $product->id)->first();
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
                    DB::table('orders')->where('product_id', $product->product_id)->update([
                        'product_price' => $product_price,
                        'total_price' => ceil(($product_price + $production_price) * ($profit_rate + 100) / 100)
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
                    DB::table('quote')->where('product_id', $product->product_id)->update([
                        'product_price' => $product_price,
                        'total_price' => ceil(($product_price + $production_price) * ($profit_rate + 100) / 100)
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
                        } else if($design_process->design_process_status_id = 3){
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
                            'total_price' => ceil(($product_price + $production_price) * ($profit_rate + 100) / 100)
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
            'success' => 'Price Update Successfully'
        ], 201);
    }
    public function set_deactivate(Request $request)
    {
        //input
        $input = json_decode($request->input('deactivate'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 403);
        }
        DB::beginTransaction();
        try {
            $tf = false;
            $metal = DB::table('metal')->where('id', $input['metal_id'])->first();
            //check metal
            if ($metal == null) {
                return response()->json([
                    'error' => 'The Selected Metal Doesn\'t Exist'
                ], 403);
            }
            //check input deactivate
            if ($input['deactivate']) {
                DB::table('metal')->where('id', $input['metal_id'])->update([
                    'deactivated' => true,
                ]);
                $tf = true;
            } else {
                DB::table('metal')->where('id', $input['metal_id'])->update([
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
                'success' => 'Deactivate Metal Successfully'
            ], 201);
        } else {
            return response()->json([
                'success' => 'Activate Metal Successfully'
            ], 201);
        }
    }
    public function get_list(Request $request)
    {
        //check token
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
        if ($token == null) {
            $role_id = 5;
        } else {
            try {
                $role_id = $decodedToken['role_id'];
            } catch (Throwable $e) {
                $role_id = $decodedToken->role_id;
            }
        }

        //create query
        $query = Metal::query();
        //check role
        if ($role_id == 5 || $role_id == 4 || $role_id == 3 || $role_id == 2) {
            //configure query
            $metal = $query->where('deactivated', false)->get();
            $metal->map(function ($metal) {
                $OGurl = env('ORIGIN_URL');
                $url = env('METAL_URL');
                $metal->imageUrl = $OGurl . $url . $metal->id . "/" . $metal->imageUrl;
                $metal->created = Carbon::parse($metal->created)->format('H:i:s d/m/Y');
                return $metal;
            });
        } else {
            $metal = $query->orderBy('deactivated', 'asc')->get();
            $metal->map(function ($metal) {
                $OGurl = env('ORIGIN_URL');
                $url = env('METAL_URL');
                $metal->imageUrl = $OGurl . $url . $metal->id . "/" . $metal->imageUrl;
                $metal->created = Carbon::parse($metal->created)->format('H:i:s d/m/Y');
                return $metal;
            });
        }
        return response()->json(
            $metal
        );
    }
    public function get_detail(Request $request)
    {
        //input
        $input = json_decode($request->input('metal_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 403);
        }
        $metal = DB::table('metal')->where('id', $input)->first();
        $OGurl = env('ORIGIN_URL');
        $url = env('METAL_URL');
        $metal->imageUrl = $OGurl . $url . $metal->id . "/" . $metal->imageUrl;
        $metal->created = Carbon::parse($metal->created)->format('H:i:s d/m/Y');
        return response()->json([
            'metal' => $metal
        ]);
    }
    public function get_weight_price(Request $request)
    {
        //input
        $input = json_decode($request->input('metal_information'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 403);
        }
        $metal = DB::table('metal')->where('id', $input['metal_id'])->first();
        if ($metal->deactivated) {
            return response()->json([
                'error' => 'The Selected Metal Is Deactivated'
            ], 403);
        }
        $weight = $metal->specific_weight * $input['volume'];
        $price = $weight * $metal->sale_price_per_gram;
        $temp['weight'] = $weight;
        $temp['price'] = $price;
        return response()->json([
            'weight_price' => $temp
        ]);
    }
    public function get_metal_is_main(Request $request)
    {
        //input
        $input = json_decode($request->input('model_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 403);
        }
        $metal_list = DB::table('model_metal')->where('model_id', $input)->where('is_main', true)->pluck('metal_id');
        $data = collect();
        foreach ($metal_list as $metal) {
            $temp = DB::table('metal')->where('id', $metal)->first();
            $temp->created = Carbon::parse($temp->created)->format('H:i:s d/m/Y');
            $data->push($temp);
        }
        return response()->json(
            $data
        );
    }
    public function get_metal_compatibility(Request $request)
    {
        //input
        $input = json_decode($request->input('metal_compatibility'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 403);
        }
        $metal = DB::table('metal')->where('id', $input['metal_id'])->first();
        if ($metal->deactivated) {
            return response()->json([
                'error' => 'The Selected Metal Has Been Deactivated'
            ], 403);
        }
        $OGurl = env('ORIGIN_URL');
        $url = env('METAL_URL');
        $metal_list = DB::table('model_metal')->where('model_id', $input['model_id'])->where('is_main', false)->pluck('metal_id')->values();
        foreach ($metal_list as $metal) {
            $temp1 = DB::table('metal')->where('id', $metal)->first();
            if ($temp1->deactivated) {
                $metal_list = $metal_list->reject(function ($value, $key) use ($metal) {
                    return $value == $metal;
                });
            }
        }
        $metal_compatibility = DB::table('metal_compatibility')->where('Metal_id_1', $input['metal_id'])->pluck('Metal_id_2')->values();
        $data = collect();
        foreach ($metal_list as $metal1) {
            foreach ($metal_compatibility as $compability) {
                if ($metal1 == $compability) {
                    $temp = DB::table('model_metal')->where('model_id', $input['model_id'])->where('metal_id', $metal1)->first();
                    $temp->metal = DB::table('metal')->where('id', $metal1)->first();
                    if ($temp->metal->deactivated) {
                        continue;
                    }
                    $temp->metal->imageUrl = $OGurl . $url . $temp->metal->id . "/" . $temp->metal->imageUrl;
                    $temp->metal->created = Carbon::parse($temp->metal->created)->format('H:i:s d/m/Y');
                    unset($temp->metal_id);
                    unset($temp->model_id);
                    unset($temp->id);
                    $data->push($temp);
                }
            }
        }
        return response()->json(
            $data
        );
    }
}
