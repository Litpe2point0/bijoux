<?php

namespace App\Http\Controllers\items;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\items\_Model;
use App\Models\items\Model_Diamond;
use App\Models\items\Model_DiamondShape;
use App\Models\items\Model_Metal;
use Illuminate\Support\Facades\File;
use Tymon\JWTAuth\Facades\JWTAuth;
use Carbon\Carbon;

class ModelController extends Controller
{
    public function add(Request $request)
    {
        //input
        $input = json_decode($request->input('new_model'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        DB::beginTransaction();
        try {
            $model = new _Model();
            $model->name = $input['name'];
            $model->mounting_type_id = $input['mounting_type_id'];
            $model->mounting_style_id = $input['mounting_style_id'];
            $model->imageUrl = "asd";
            $model->base_width = $input['base_width'];
            $model->base_height = $input['base_height'];
            $model->volume = $input['volume'];
            $model->production_price = $input['production_price'];
            $model->profit_rate = $input['profit_rate'];
            $model->isAvailable = false;
            $model->deactivated = false;

            $model->save();
            $modelId = (int) $model->id;

            foreach ($input['model_diamond_shape'] as $shape_id) {
                $model_shape = new Model_DiamondShape();
                $model_shape->model_id = $modelId;
                $model_shape->diamond_shape_id = $shape_id['diamond_shape_id'];
                $model_shape->save();
            }
            foreach ($input['model_diamond'] as $diamond) {
                $model_diamond = new Model_Diamond();
                $model_diamond->model_id = $modelId;
                $model_diamond->diamond_size_min = $diamond['diamond_size_min'];
                $model_diamond->diamond_size_max = $diamond['diamond_size_max'];
                $model_diamond->count = $diamond['count'];
                $model_diamond->diamond_shape_id = $diamond['diamond_shape_id'];
                $model_diamond->is_editable = false;
                $model_diamond->save();
            }
            foreach ($input['model_metal'] as $metal) {
                $model_metal = new Model_Metal();
                $model_metal->model_id = $modelId;
                $model_metal->metal_id = $metal['metal_id'];
                $model_metal->is_main = $metal['is_main'];
                $model_metal->percentage = $metal['percentage'];
                $model_metal->save();
            }

            if (isset($input['imageUrl']) && $input['imageUrl'] != null) {
                $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['imageUrl']));
                $destinationPath = public_path('image/Mounting/mounting_model/' . $modelId);
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                $fileName = time() . '_' . $modelId . '.jpg';
                file_put_contents($destinationPath . '/' . $fileName, $fileData);

                $model->imageUrl = $fileName;
                $model->save();
            } else {
                $fileName = time() . '_' . $modelId . '.jpg';
                $destinationPath = public_path('image/Mounting/mounting_model/' . $modelId);
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                $destinationFilePath = public_path('image/Mounting/mounting_model/' . $modelId . '/' . $fileName);
                $sourceFilePath = public_path('image/Mounting/mounting_model/unknown.jpg');
                File::copy($sourceFilePath, $destinationFilePath);
                $model->imageUrl = $fileName;
                $model->save();
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }

        return response()->json([
            'success' => "Model Successfully Added",
        ], 201);
    }
    public function get_model_list(Request $request)
    {
        //input
        $input = json_decode($request->input('model_search_information'), true);
        //check token
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
        $role_id = (int) $decodedToken['role_id'];
        //create query
        $query_available = DB::table('model')
            ->join('model_diamondshape', 'model.id', '=', 'model_diamondshape.model_id')
            ->join('model_metal', 'model.id', '=', 'model_metal.model_id')
            ->select('model.id as model_id');
        $query_unavailable = DB::table('model')
            ->join('model_diamondshape', 'model.id', '=', 'model_diamondshape.model_id')
            ->join('model_metal', 'model.id', '=', 'model_metal.model_id')
            ->select('model.id as model_id');

        if ($role_id == 5) {
            $query_available->where('deactivated', false);
        }

        if (isset($input['mounting_style']) && $input['mounting_style'] != null) {
            // $mountingStyleIds = [];
            // foreach ($input['mounting_style'] as $instance) {
            //     $mountingStyleIds[] = $instance['id'];
            // }
            $query_available->whereIn('model.mounting_style_id',  $input['mounting_style']);
            $query_unavailable->whereIn('model.mounting_style_id',  $input['mounting_style']);
        }

        if (isset($input['mounting_type_id']) && $input['mounting_type_id'] != null) {
            $query_available->where('model.mounting_type_id', $input['mounting_type_id']);
            $query_unavailable->where('model.mounting_type_id', $input['mounting_type_id']);
        }

        if (isset($input['diamond_shape']) && $input['diamond_shape'] != null) {
            // $diamondShapeIds = [];
            // foreach ($input['diamond_shape'] as $instance) {
            //     $diamondShapeIds[] = $instance['id'];
            // }
            $query_available->whereIn('model_diamondshape.diamond_shape_id', $input['diamond_shape']);
            $query_unavailable->whereIn('model_diamondshape.diamond_shape_id', $input['diamond_shape']);
        }

        if (isset($input['metal']) && $input['metal'] != null) {
            // $metalIds = [];
            // foreach ($input['metal'] as $instance) {
            //     $metalIds[] = $instance['id'];
            // }
            $query_available->whereIn('model_metal.metal_id', $input['metal']);
            $query_unavailable->whereIn('model_metal.metal_id', $input['metal']);
        }

        $temp1 = collect();
        $modelIds = $query_available->pluck('model_id');
        foreach ($modelIds as $model_id) {
            $filtered_models = DB::table('model')->where('id', $model_id)->where('isAvailable', true)->first();
            if ($filtered_models) {
                $temp1->push($filtered_models);
            }
        }
        $model_available = $temp1->unique('id')->values();

        $model_available->map(function ($model) {
            $model->mounting_type = DB::table('mounting_type')->where('id', $model->mounting_type_id)->first();
            $model->mounting_style = DB::table('mounting_style')->where('id', $model->mounting_style_id)->first();
            unset($model->mounting_style_id);
            unset($model->mounting_type_id);

            $model_shape = DB::table('model_diamondshape')->where('model_id', $model->id)->get();
            $model_shape->map(function ($model_shape) {
                $model_shape->diamond_shape = DB::table('diamond_shape')->where('id', $model_shape->diamond_shape_id)->first();
                unset($model_shape->model_id);
                unset($model_shape->diamond_shape_id);
                return $model_shape;
            });
            $model->model_diamond_shape = $model_shape;

            $model_diamond = DB::table('model_diamond')->where('model_id', $model->id)->get();
            $model_diamond->map(function ($model_diamond) {
                $model_diamond->diamond_shape = DB::table('diamond_shape')->where('id', $model_diamond->diamond_shape_id)->first();
                unset($model_diamond->model_id);
                unset($model_diamond->id);
                unset($model_diamond->diamond_shape_id);
                return $model_diamond;
            });
            $model->model_diamond = $model_diamond;

            $model_metal = DB::table('model_metal')->where('model_id', $model->id)->get();
            $model_metal->map(function ($model_metal) {
                $model_metal->metal = DB::table('metal')->where('id', $model_metal->metal_id)->first();
                $model_metal->metal->created = Carbon::parse($model_metal->metal->created)->format('H:i:s d/m/Y');
                unset($model_metal->id);
                unset($model_metal->model_id);
                unset($model_metal->metal_id);
                return $model_metal;
            });
            $model->model_metal = $model_metal;
            $OGurl = env('ORIGIN_URL');
            $url = env('MODEL_URL');
            $model->imageUrl = $OGurl . $url . $model->id . '/' . $model->imageUrl;
            return $model;
        });
        if ($role_id != 5) {

            $temp2 = collect();
            $modelIds2 = $query_unavailable->pluck('model_id');
            foreach ($modelIds2 as $model_id) {
                $filtered_models2 = DB::table('model')->where('id', $model_id)->where('isAvailable', false)->first();
                if ($filtered_models2) {
                    $temp2->push($filtered_models2);
                }
            }
            $model_unavailable = $temp2->unique('id')->values();

            $model_unavailable->map(function ($model) {
                $model->mounting_type = DB::table('mounting_type')->where('id', $model->mounting_type_id)->first();
                $model->mounting_style = DB::table('mounting_style')->where('id', $model->mounting_style_id)->first();
                unset($model->mounting_style_id);
                unset($model->mounting_type_id);

                $model_shape = DB::table('model_diamondshape')->where('model_id', $model->id)->get();
                $model_shape->map(function ($model_shape) {
                    $model_shape->diamond_shape = DB::table('diamond_shape')->where('id', $model_shape->diamond_shape_id)->first();
                    unset($model_shape->model_id);
                    unset($model_shape->diamond_shape_id);
                    return $model_shape;
                });
                $model->model_diamond_shape = $model_shape;

                $model_diamond = DB::table('model_diamond')->where('model_id', $model->id)->get();
                $model_diamond->map(function ($model_diamond) {
                    $model_diamond->diamond_shape = DB::table('diamond_shape')->where('id', $model_diamond->diamond_shape_id)->first();
                    unset($model_diamond->model_id);
                    unset($model_diamond->id);
                    unset($model_diamond->diamond_shape_id);
                    return $model_diamond;
                });
                $model->model_diamond = $model_diamond;

                $model_metal = DB::table('model_metal')->where('model_id', $model->id)->get();
                $model_metal->map(function ($model_metal) {
                    $model_metal->metal = DB::table('metal')->where('id', $model_metal->metal_id)->first();
                    $model_metal->metal->created = Carbon::parse($model_metal->metal->created)->format('H:i:s d/m/Y');
                    unset($model_metal->id);
                    unset($model_metal->model_id);
                    unset($model_metal->metal_id);
                    return $model_metal;
                });
                $model->model_metal = $model_metal;
                $OGurl = env('ORIGIN_URL');
                $url = env('MODEL_URL');
                $model->imageUrl = $OGurl . $url . $model->id . $model->imageUrl;
                return $model;
            });
        } else {
            $model_unavailable = null;
        }
        return response()->json([
            'model_available' => $model_available,
            'model_unavailable' => $model_unavailable
        ]);
    }
    public function get_model_detail(Request $request)
    {
        $input = json_decode($request->input('model_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $model = DB::table('model')->where('id', $input)->first();
        if ($model == null) {
            return response()->json([
                'error' => 'The Selected Model Doesn\'t Exist'
            ], 403);
        }

        $model->mounting_type = DB::table('mounting_type')->where('id', $model->mounting_type_id)->first();
        $model->mounting_style = DB::table('mounting_style')->where('id', $model->mounting_style_id)->first();
        unset($model->mounting_style_id);
        unset($model->mounting_type_id);

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
            $model_metal->metal->created = Carbon::parse($model_metal->metal->created)->format('H:i:s d/m/Y');
            unset($model_metal->metal_id);
            return $model_metal;
        });
        $model->model_metal = $model_metal;
        $OGurl = env('ORIGIN_URL');
        $url = env('MODEL_URL');
        $model->imageUrl = $OGurl . $url . $model->id . $model->imageUrl;

        return response()->json([
            'model' => $model
        ]);
    }
    public function set_deactivate(Request $request)
    {
        $input = json_decode($request->input('deactivate'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        DB::beginTransaction();
        try {
            $tf = false;
            $model = DB::table('model')->where('id', $input['model_id'])->first();
            if ($model == null) {
                return response()->json([
                    'error' => 'The Selected Model Doesn\'t Exist'
                ], 403);
            }
            if ($input['deactivate']) {
                DB::table('model')->where('id', $input['model_id'])->update([
                    'deactivated' => true,
                ]);
                $tf = true;
            } else {
                DB::table('model')->where('id', $input['model_id'])->update([
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
                'success' => 'Deactivate Model Successfully'
            ], 200);
        } else {
            return response()->json([
                'success' => 'Activate Model Successfully'
            ], 200);
        }
    }
    public function update(Request $request)
    {
        $input = json_decode($request->input('new_model'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        DB::beginTransaction();
        try {

            $updateData = [
                'name' => $input['name'],
                'mounting_type_id' => $input['mounting_type_id'],
                'mounting_style_id' => $input['mounting_style_id'],
                'base_width' => $input['base_width'],
                'base_height' => $input['base_height'],
                'volume' => $input['volume'],
                'production_price' => $input['production_price'],
                'profit_rate' => $input['profit_rate']
            ];
            if (!empty($input['imageUrl'])) {
                $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['imageUrl']));
                $destinationPath = public_path('image/Mounting/mounting_model/' . $input['id']);
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }

                $fileName = time() . '_' . $input['id'] . '.jpg';
                //delete all files in the model directory
                File::cleanDirectory($destinationPath);
                file_put_contents($destinationPath . '/' . $fileName, $fileData);

                $updateData['imageUrl'] = $fileName;
            }
            DB::table('model_metal')->where('model_id', $input['id'])->delete();
            DB::table('model_diamondshape')->where('model_id', $input['id'])->delete();
            DB::table('model_diamond')->where('model_id', $input['id'])->delete();
            foreach ($input['model_diamond_shape'] as $shape) {
                DB::table('model_diamondshape')->insert([
                    'model_id' => $input['id'],
                    'diamond_shape_id' => $shape['diamond_shape_id']
                ]);
            }
            foreach ($input['model_diamond'] as $diamond) {
                DB::table('model_diamond')->insert([
                    'model_id' => $input['id'],
                    'diamond_size_min' => $diamond['diamond_size_min'],
                    'diamond_size_max' => $diamond['diamond_size_max'],
                    'count' => $diamond['count'],
                    'diamond_shape_id' => $diamond['diamond_shape_id'],
                    'is_editable' => $diamond['is_editable']
                ]);
            }
            foreach ($input['model_metal'] as $metal) {
                DB::table('model_metal')->insert([
                    'model_id' => $input['id'],
                    'metal_id' => $metal['metal_id'],
                    'is_main' => $metal['is_main'],
                    'percentage' => $metal['percentage']
                ]);
            }
            DB::table('model')->where('id', $input['id'])->update($updateData);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Model Update Successfully'
        ], 201);
    }
    public function set_available(Request $request)
    {
        $input = json_decode($request->input('set_available'), true);
        $model_id = $input['model_id'];
        $image_list = $input['image_list'];
        if (!isset($model_id) || $model_id == null || !isset($image_list) || $image_list == null) {
            return response()->json([
                'error' => 'Not Enough Input Received'
            ], 404);
        }

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json(['error' => 'Invalid image list JSON: ' . json_last_error_msg()], 400);
        }

        DB::beginTransaction();
        try {
            foreach ($image_list as $image) {
                $count = 1;
                $mainImgData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image['main_image']));

                $metal_1_id = isset($image['metal_1_id']) ? $image['metal_1_id'] : 0;
                $metal_2_id = isset($image['metal_2_id']) ? $image['metal_2_id'] : 0;

                $destinationPath = public_path('image/Final_templates/' . $model_id . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $image['diamond_shape_id']);
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                File::cleanDirectory($destinationPath);
                $mainImgName = 'main.jpg';
                file_put_contents($destinationPath . '/' . $mainImgName, $mainImgData);

                foreach ($image['related_images'] as $related_image) {
                    $relatedImgData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $related_image));
                    $relatedImgName = 'related_' . $count . '.jpg';
                    file_put_contents($destinationPath . '/' . $relatedImgName, $relatedImgData);
                    $count++;
                };
            }
            DB::table('model')->where('id', $model_id)->update([
                'isAvailable' => true,
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }

        return response()->json([
            'success' => 'Succesfully Set Available'
        ], 200);
    }
    public function get_missing_image(Request $request)
    {
        // $input = json_decode($request->input('model_id'), true);
        // if(!isset($input)&&$input == null){
        //     return response()->json([
        //         'error' => 'No Model id received!'
        //     ],404);
        // }
        // $missing_image = [];
        // $model = DB::table('model')->where('id',$input)->first();
        // $metal_1_id = DB::table('metal')->get();
        // foreach ($metal_1_id as $metal1) {
        //     $metal1_id = $metal1->id;
        //     $metal_2_id = DB::table('metal_compatibility')->where('Metal_id_1', $metal1_id)->get();
        //     foreach ($metal_2_id as $metal2) {
        //         $metal2_id = $metal2->Metal_id_2;
        //         $diamond_shape_id = DB::table('diamond_shape')->get();
        //         foreach ($diamond_shape_id as $shape) {
        //             $shape_id = $shape->id;
        //             $destinationPath = public_path('image/Final_templates/' . $input . '_' . $metal1_id . '_' . $metal2_id . '_' . $shape_id);

        //             if (!file_exists($destinationPath)) {
        //                 $metal_1 = DB::table('metal')->where('id',$metal1_id)->first();
        //                 $metal_2 = DB::table('metal')->where('id',$metal2_id)->first();
        //                 $diamond_shape = DB::table('diamond_shape')->where('id',$shape_id)->first();
        //                 $temp = [
        //                     'metal_1' => $metal_1,
        //                     'metal_2' => $metal_2,
        //                     'diamond_shape' => $diamond_shape
        //                 ];
        //                 $missing_image[] = $temp;
        //             }
        //         }
        //     }
        // }
        // if($missing_image == null){
        //     return response()->json([
        //         'error' => 'There are no Missing Image'
        //     ],404);
        // }
        // if($model == null){
        //     return response()->json([
        //         'error' => 'The Selected model doesn\'t exist'
        //     ],404);
        // }
        // return response()->json([
        //     'model' => $model,
        //     'missing_image' => $missing_image
        // ]);

        $input = json_decode($request->input('model_id'), true);

        if (!isset($input) || $input == null) {
            return response()->json(['error' => 'No Model Id Received!'], 404);
        }

        $model = DB::table('model')->where('id', $input)->first();
        if ($model == null) {
            return response()->json(['error' => 'The Selected Model Doesn\'t Exist'], 404);
        }

        $missing_image = [];

        $model_metal_main = DB::table('model_metal')->where('model_id', $input)->where('is_main', 1)->get();
        $model_metal_notmain = DB::table('model_metal')->where('model_id', $input)->where('is_main', 0)->get();
        $model_diamondShapes = DB::table('model_diamondshape')->where('model_id', $input)->get();
        $diamondShapes = [];
        foreach ($model_diamondShapes as $diamondshape) {
            $shape = DB::table('diamond_shape')->where('id', $diamondshape->diamond_shape_id)->first();
            $diamondShapes[] = $shape;
        }

        $metal2Mapping = [];
        foreach ($model_metal_main as $metal) {
            $metalCompatibilities = DB::table('metal_compatibility')->where('Metal_id_1', $metal->id)->get();
            foreach ($metalCompatibilities as $compatibility) {
                $bo = false;
                foreach ($model_metal_notmain as $metal2) {
                    if ($compatibility->Metal_id_2 == $metal2->id) {
                        $bo = true;
                    }
                }
                if ($bo) {
                    $metal2Mapping[$compatibility->Metal_id_1][] = $compatibility->Metal_id_2;
                }
            }
        }

        foreach ($model_metal_main as $metal1) {
            if (isset($metal2Mapping[$metal1->id])) {
                foreach ($metal2Mapping[$metal1->id] as $metal2_id) {
                    foreach ($diamondShapes as $shape) {
                        $destinationPath = public_path('image/Final_templates/' . $input . '_' . $metal1->id . '_' . $metal2_id . '_' . $shape->id);

                        if (!file_exists($destinationPath)) {
                            $metal_1 = DB::table('metal')->where('id', $metal1->id)->first();
                            $metal_1->created = Carbon::parse($metal_1->created)->format('H:i:s d/m/Y');
                            $metal_2 = DB::table('metal')->where('id', $metal2_id)->first();
                            $metal_2->created = Carbon::parse($metal_2->created)->format('H:i:s d/m/Y');
                            $diamond_shape = $shape;

                            $temp = [
                                'metal_1' => $metal_1,
                                'metal_2' => $metal_2,
                                'diamond_shape' => $diamond_shape
                            ];

                            $missing_image[] = $temp;
                        }
                    }
                }
            }
        }

        return response()->json([
            'model' => $model,
            'missing_image' => $missing_image
        ]);
    }
    public function get_model_diamond(Request $request)
    {
        $input = json_decode($request->input('model_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }

        $model_diamond = DB::table('model_diamond')->where('model_id', $input)->get();
        $model_diamond->map(function ($model_diamond) {
            $model_diamond->diamond_shape = DB::table('diamond_shape')->where('id', $model_diamond->diamond_shape_id)->first();
            unset($model_diamond->diamond_shape_id);
            unset($model_diamond->model_id);
            return $model_diamond;
        });
        $returned_model_diamond['model_id'] = $input;
        $returned_model_diamond['model_diamond'] = $model_diamond;
        return response()->json([
            'returned_model_diamond' => $returned_model_diamond
        ]);
    }
    public function get_model_shape(Request $request)
    {
        $input = json_decode($request->input('model_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }

        $model_shape = DB::table('model_diamondshape')->where('model_id', $input)->get();
        $model_shape->map(function ($model_shape) {
            $model_shape->diamond_shape = DB::table('diamond_shape')->where('id', $model_shape->diamond_shape_id)->first();
            unset($model_shape->diamond_shape_id);
            unset($model_shape->model_id);
            return $model_shape;
        });
        $returned_model_shape['model_id'] = $input;
        $returned_model_shape['model_shape'] = $model_shape;
        return response()->json([
            'returned_model_shape' => $returned_model_shape
        ]);
    }
    public function get_model_metal(Request $request)
    {
        $input = json_decode($request->input('model_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }

        $model_metal = DB::table('model_metal')->where('model_id', $input)->get();
        $model_metal->map(function ($model_metal) {
            $model_metal->metal = DB::table('metal')->where('id', $model_metal->metal_id)->first();
            $model_metal->metal->created = Carbon::parse($model_metal->metal->created)->format('H:i:s d/m/Y');
            unset($model_metal->metal_id);
            unset($model_metal->model_id);
            return $model_metal;
        });
        $returned_model_metal['model_id'] = $input;
        $returned_model_metal['model_metal'] = $model_metal;
        return response()->json([
            'returned_model_metal' => $returned_model_metal
        ]);
    }
    public function get_mounting_type_list()
    {
        return response()->json(
            DB::table('mounting_type')->get()
        );
    }
    public function get_mounting_style_list()
    {
        $mounting_style_list = DB::table('mounting_style')->get();
        $mounting_style_list->map(function ($mounting_style) {
            $OGurl = env('ORIGIN_URL');
            $url = env('STYLE_URL');
            $mounting_style->imageUrl = $OGurl . $url . $mounting_style->id . "/" . $mounting_style->imageUrl;
            return $mounting_style;
        });
        return response()->json(
            $mounting_style_list
        );
    }
    public function get_final_checkout(Request $request)
    {
        $input = json_decode($request->input('template_information'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $model_id = $input['model_id'];
        $model = DB::table('model')->where('id', $model_id)->first();
        if (isset($input['metal_1_id']) && $input['metal_1_id'] != null) {
            $metal_1_id = $input['metal_1_id'];
            $metal = DB::table('metal')->where('id', $input['metal_1_id'])->first();
            if ($metal == null) {
                return response()->json([
                    'error' => 'The Template Must Contain 1 Main Metal'
                ], 403);
            }
            if ($metal->deactivated) {
                return response()->json([
                    'error' => 'The Template Contain a Metal That Has Been Deactivated'
                ], 403);
            };
        } else $metal_1_id = 0;
        if (isset($input['metal_2_id']) && $input['metal_2_id'] != null) {
            $metal_2_id = $input['metal_2_id'];
            $metal = DB::table('metal')->where('id', $input['metal_2_id'])->first();
            if ($metal != null) {
                if ($metal->deactivated) {
                    return response()->json([
                        'error' => 'The Template Contain a Metal That Has Been Deactivated'
                    ], 403);
                };
            }
        } else $metal_2_id = 0;
        $shape_id = $input['diamond_shape_id'];
        $destinationPath = public_path('image/Final_templates/' . $model_id . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $shape_id);
        if (!file_exists($destinationPath)) {
            return response()->json([
                'error' => 'The Selected Template Doesn\'t Exist'
            ], 404);
        }
        $OGurl = env('ORIGIN_URL');
        $url = env('FINAL_TEMPLATE_URL');
        $files = File::allFiles($destinationPath);
        if ($files == null) {
            return response()->json([
                'error' => 'The Selected Template Isn\'t Available'
            ], 404);
        }
        $imageCount = count($files) - 1;
        $main_image = $OGurl . $url . $model_id . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $shape_id . '/main.jpg';
        $related_image = [];
        for ($i = 1; $i <= $imageCount; $i++) {
            $related_image[] = $OGurl . $url . $model_id . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $shape_id . '/related_' . $i . '.jpg';
        }
        $OGurl = env('ORIGIN_URL');
        $Murl = env('METAL_URL');
        $Durl = env('DIAMOND_URL');
        $metal_1 = DB::table('metal')->where('id', $metal_1_id)->first();
        $metal_2 = DB::table('metal')->where('id', $metal_2_id)->first();
        $model_metal_1 = DB::table('model_metal')->where('model_id', $model_id)->where('metal_id', $metal_1_id)->where('is_main', true)->first();
        $model_metal_2 = DB::table('model_metal')->where('model_id', $model_id)->where('metal_id', $metal_2_id)->where('is_main', false)->first();
        $volume =  DB::table('size_to_volume')->where('size', $input['mounting_size'])->value('volume');
        $metal_1->price = $volume * $model_metal_1->percentage * $metal_1->specific_weight * $metal_1->sale_price_per_gram;
        $metal_2->price = $volume * $model_metal_2->percentage * $metal_2->specific_weight * $metal_2->sale_price_per_gram;
        $metal_1->imageUrl = $OGurl . $Murl . $metal->id . '/' . $metal_1->imageUrl;
        $metal_2->imageUrl = $OGurl . $Murl . $metal->id . '/' . $metal_2->imageUrl;
        unset($metal_1->buy_price_per_gram);
        unset($metal_1->sale_price_per_gram);
        unset($metal_1->specific_weight);
        unset($metal_1->deactivated);
        unset($metal_1->created);
        unset($metal_2->buy_price_per_gram);
        unset($metal_2->sale_price_per_gram);
        unset($metal_2->specific_weight);
        unset($metal_2->deactivated);
        unset($metal_2->created);
        $metal_list = [
            $metal_1,
            $metal_2
        ];
        $model_diamond = DB::table('model_diamond')->where('model_id', $model_id)->get();
        $diamond_list = collect();
        foreach ($model_diamond as $diamonds) {
            if ($diamonds->is_editable == 1) {
                $diamond = DB::table('diamond')->where('size', $input['diamond_size'])->where('diamond_color_id', $input['diamond_color_id'])->where('diamond_clarity_id', $input['diamond_clarity_id'])->where('diamond_cut_id', $input['diamond_cut_id'])->where('diamond_origin_id', $input['diamond_origin_id'])->first();
                $diamond->price = $diamonds->count * $diamond->price;
                $diamond->imageUrl = $OGurl . $Durl . $diamond->imageUrl;
                $diamond->diamond_shape = DB::table('diamond_shape')->where('id', $input['diamond_shape_id'])->first();
                $diamond->diamond_clarity = DB::table('diamond_clarity')->where('id', $diamond->diamond_clarity_id)->first();
                $diamond->diamond_cut = DB::table('diamond_cut')->where('id', $diamond->diamond_cut_id)->first();
                $diamond->diamond_color = DB::table('diamond_color')->where('id', $diamond->diamond_color_id)->first();
                $diamond->diamond_origin = DB::table('diamond_origin')->where('id', $diamond->diamond_origin_id)->first();
                $diamond->count = $diamonds->count;
                unset($diamond->deactivated);
                unset($diamond->created);
                unset($diamond->diamond_clarity_id);
                unset($diamond->diamond_cut_id);
                unset($diamond->diamond_color_id);
                unset($diamond->diamond_origin_id);
                $diamond_list->push($diamond);
            } else {
                $diamond = DB::table('diamond')->where('size', $diamonds->diamond_size_max)->where('diamond_color_id', $input['diamond_color_id'])->where('diamond_clarity_id', $input['diamond_clarity_id'])->where('diamond_cut_id', $input['diamond_cut_id'])->where('diamond_origin_id', $input['diamond_origin_id'])->first();
                $diamond->price = $diamonds->count * $diamond->price;
                $diamond->imageUrl = $OGurl . $Durl . $diamond->imageUrl;
                $diamond->diamond_shape = DB::table('diamond_shape')->where('id', $diamonds->diamond_shape_id)->first();
                $diamond->diamond_clarity = DB::table('diamond_clarity')->where('id', $diamond->diamond_clarity_id)->first();
                $diamond->diamond_cut = DB::table('diamond_cut')->where('id', $diamond->diamond_cut_id)->first();
                $diamond->diamond_color = DB::table('diamond_color')->where('id', $diamond->diamond_color_id)->first();
                $diamond->diamond_origin = DB::table('diamond_origin')->where('id', $diamond->diamond_origin_id)->first();
                $diamond->count = $diamonds->count;
                unset($diamond->deactivated);
                unset($diamond->created);
                unset($diamond->diamond_clarity_id);
                unset($diamond->diamond_cut_id);
                unset($diamond->diamond_color_id);
                unset($diamond->diamond_origin_id);
                $diamond_list->push($diamond);
            }
        }
        return response()->json([
            'main_image' => $main_image,
            'related_image' => $related_image,
            'metal_list' => $metal_list,
            'diamond_list' => $diamond_list->values()->all()
        ]);
    }
}
