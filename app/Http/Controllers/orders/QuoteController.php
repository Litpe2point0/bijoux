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
use Carbon\Carbon;

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
        $url = env('URL');
        $files = File::allFiles($destinationPath);
        $imageCount = count($files) - 1;
        $main_image = $url . 'Final_templates/' . $model_id . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $shape_id . '/main.jpg';
        $related_image = [];
        for ($i = 1; $i < $imageCount; $i++) {
            $related_image[] = $url . 'Final_templates/' . $model_id . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $shape_id . '/related_' . $i . '.jpg';
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
            $quote->product = DB::table('product')->where('id', $quote->product_id)->first();
            unset($quote->product_id);
            $account = DB::table('account')->where('id', $quote->account_id)->first();
            $account->role = DB::table('role')->where('id', $account->role_id)->first();
            unset($account->role_id);
            $quote->account = $account;
            $quote->quote_status = DB::table('quote_status')->where('id', $quote->quote_status_id)->first();
            $quote->order_type = DB::table('order_type')->where('id', $quote->order_type_id)->first();
            unset($quote->quote_status_id);
            unset($quote->order_type_id);
            return $quote;
        });

        return response()->json([
            'quote_list' => $quote_list
        ]);
    }
    public function get_quote_list_customer(Request $request)
    {
        $input = json_decode($request->input('account_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $quote_list = DB::table('quote')->where('account_id', $input)->orderBy('quote_status_id', 'ASC')->get();
        $quote_list->map(function ($quote) {
            $quote->product = DB::table('product')->where('id', $quote->product_id)->first();
            unset($quote->product_id);
            $account = DB::table('account')->where('id', $quote->account_id)->first();
            $account->role = DB::table('role')->where('id', $account->role_id)->first();
            unset($account->role_id);
            $quote->account = $account;
            $quote->quote_status = DB::table('quote_status')->where('id', $quote->quote_status_id)->first();
            $quote->order_type = DB::table('order_type')->where('id', $quote->order_type_id)->first();
            unset($quote->quote_status_id);
            unset($quote->order_type_id);
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
            $url = env('URL');
            $product->imageUrl = $url . 'Orders/' . $productId . '/main.jpg';
            $product->save();

            $quote = new Quote();
            $quote->product_id = $product->id;
            $quote->account_id = $account_id;
            $quote->quote_status_id = 1;
            $quote->product_price = 0;
            $quote->production_price = 0;
            $quote->profit_rate = 0;
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
    public function assigned_quote(Request $request)
    {
        $input = json_decode($request->input('assigned_information'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        DB::beginTransaction();
        try {
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
        if ($quote->order_type_id == 1) {
            DB::beginTransaction();
            try {
                if (isset($input['note']) && $input['note'] != null) {
                    DB::table('quote')->where('id', $input['quote_id'])->update([
                        'note' => $input['note']
                    ]);
                }
                if (isset($input['mounting_type_id']) && $input['mounting_type_id'] != null) {
                    DB::table('product')->where('id', $quote->product_id)->update([
                        'mounting_type_id' => $input['mounting_type_id']
                    ]);
                }
                if (isset($input['imageUrl']) && $input['imageUrl'] != null) {
                    $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['image']));
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
                    $url = env('URL');
                    $imageUrl = $url . 'Orders/' . $quote->product_id . '/' . $fileName;
                    DB::table('product')->where('id', $quote->product_id)->update([
                        'imageUrl' => $imageUrl
                    ]);
                }
                if (isset($input['diamond_list']) && $input['diamond_list'] != null) {
                    foreach ($input['diamond_list'] as $diamond1) {
                        $product_diamond = new Product_Diamond();
                        $product_diamond->product_id = $quote->product_id;
                        $product_diamond->diamond_id = $diamond1->diamond->id;
                        $product_diamond->diamond_color = $diamond1->diamond_color;
                        $product_diamond->diamond_size = $diamond1->diamond_size;
                        $product_diamond->diamond_clarity = $diamond1->diamond_clarity;
                        $product_diamond->price_in_one = $diamond1->price_in_one;
                        $product_diamond->count = $diamond1->count;
                        $product_diamond->price = $diamond1->price;
                        $product_diamond->diamond_shape = $diamond1->diamond_shape->id;
                        $product_diamond->isAccepted = 0;
                        $product_price += $product_diamond->price;
                        $product_diamond->save();
                    }
                }
                foreach ($input['metal_list'] as $metal1) {
                    $product_metal = new Product_Metal();
                    $product_metal->product_id = $quote->product_id;
                    $product_metal->metal_id = $metal1->metal->id;
                    $product_metal->price = $metal1->price;
                    $product_metal->volume = $metal1->volume;
                    $product_metal->weight = $metal1->weight;
                    $product_metal->isAccepted = 0;
                    $product_price += $product_metal->price;
                    $product_metal->save();
                }

                Quote::where('id', $input['quote_id'])->update([
                    'production_price' => $input['production_price'],
                    'profit_rate' => $input['profic_rate'],
                    'product_price' => $product_price
                ]);
                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json($e->getMessage(), 500);
            }
            return response()->json([
                'success' => 'Process Complete'
            ], 201);
        } else {
            DB::beginTransaction();
            try {
                if (isset($input['note']) && $input['note'] != null) {
                    DB::table('quote')->where('id', $input['quote_id'])->update([
                        'note' => $input['note']
                    ]);
                }
                Quote::where('id', $input['quote_id'])->update([
                    'production_price' => $input['production_price'],
                    'profit_rate' => $input['profic_rate'],
                    'note' => $input['note']
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
            if ($input['approve']) {
                DB::table('quote')->where('id', $input['quote_id'])->update([
                    'quote_status_id' => 4,
                    'note' => $input['note']
                ]);
                DB::commit();
            } else {
                $quote = DB::table('quote')->where('id', $input['quote_id'])->first();
                DB::table('product_diamond')->where('product_id', $quote->product_id)->delete();
                DB::table('product_metal')->where('product_id', $quote->product_id)->delete();
                DB::table('product')->where('product_id', $quote->product_id)->update([
                    'mounting_size' => 0,
                ]);
                DB::table('quote')->where('id', $input['quote_id'])->update([
                    'quote_status_id' => 2,
                    'production_price' => 0,
                    'product_price' => 0,
                    'profit_rate' => 0,
                    'note' => $input['note']
                ]);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'Success' => 'Approve Successfully'
        ], 201);
    }
    public function cancel_quote(Request $request)
    {
        $input = json_decode($request->input('cancel'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        DB::beginTransaction();
        try {

            $quote = DB::table('quote')->where('id', $input['quote_id'])->first();
            DB::table('product_diamond')->where('product_id', $quote->product_id)->delete();
            DB::table('product_metal')->where('product_id', $quote->product_id)->delete();
            DB::table('product')->where('product_id', $quote->product_id)->update([
                'mounting_size' => 0,
            ]);
            DB::table('quote')->where('id', $input['quote_id'])->update([
                'quote_status_id' => 5,
                'product_price' => 0,
                'production_price' => 0,
                'profit_rate' => 0,
                'note' => $input['note']
            ]);
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
        $input = json_decode($request->input('account_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $quote = DB::table('quote')->where('saleStaff_id', $input['account_id'])->get();
        $quote->map(function ($quote) {
            $quote->product = DB::table('product')->where('product_id', $quote->product_id)->first();
            $quote->account = DB::table('account')->where('id', $quote->account_id)->first();
            $quote->quote_status = DB::table('quote_status')->where('id', $quote->quote_status_id)->first();
            unset($quote->product_id);
            unset($quote->account_id);
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
        $quote = DB::table('quote')->orderBy('quote_status_id', 'ASC')->first();

        $product = DB::table('product')->where('id', $quote->product_id)->first();
        $model = DB::table('model')->where('id', $product->model_id)->first();
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
            $model_metal->metal = DB::table('metal')->where('id', $model_metal->metal_id)->first();
            unset($model_metal->metal_id);
            return $model_metal;
        });
        $model->model_metal = $model_metal;


        $product->mounting_type = DB::table('mounting_type')->where('id', $product->mounting_type_id)->first();
        unset($product->mounting_type_id);
        $product->model = $model;
        unset($product->model_id);

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

        $quote->product = $product;
        unset($quote->product_id);

        $account = DB::table('account')->where('id', $quote->account_id)->first();
        $account->role = DB::table('role')->where('id', $account->role_id)->first();
        unset($account->role_id);
        $quote->account = $account;
        $quote->quote_status = DB::table('quote_status')->where('id', $quote->quote_status_id)->first();
        unset($quote->quote_status_id);

        return response()->json([
            'quote_detail' => $quote
        ]);
    }
}
