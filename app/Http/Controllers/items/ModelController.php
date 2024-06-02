<?php

namespace App\Http\Controllers\items;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\items\_Model;
use App\Models\items\Model_Diamond;
use App\Models\items\Model_DiamondShape;
use App\Models\items\Model_Metal;

class ModelController extends Controller
{
    public function add(Request $request)
    {
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


            $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['image']));
            $destinationPath = public_path('image/Mounting/mounting_model/' . $modelId);
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $fileName = time() . '_' . $modelId . '.jpg';
            file_put_contents($destinationPath . '/' . $fileName, $fileData);

            $url = env('URL');
            $model->imageUrl = $url . 'Mounting/mounting_model/' . $modelId . '/' . time() . '_' . $modelId . '.jpg';
            $model->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }

        return response()->json([
            'success' => "Register Successfully",
        ], 201);
    }
    public function get_model_list(Request $request)
    {
        $input = json_decode($request->input('model'), true);

        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }

        $query_available = _Model::query();
        $query_unavailable = _Model::query();

        if (isset($input['mounting_type_id'])) {
            $query_available->where('mounting_type_id', $input['mounting_type_id']);
            $query_unavailable->where('mounting_type_id', $input['mounting_type_id']);
        }

        if (isset($input['mounting_style_id'])) {
            $query_available->where('mounting_style_id', $input['mounting_style_id']);
            $query_unavailable->where('mounting_style_id', $input['mounting_style_id']);
        }

        $model_available = $query_available->where('isAvailable', true)->orderBy('deactivated', 'asc')->get();
        $model_available->map(function ($model) {
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
                unset($model_metal->metal_id);
                return $model_metal;
            });
            $model->model_metal = $model_metal;
            return $model;
        });
        $model_unavailable = $query_unavailable->where('isAvailable', false)->orderBy('deactivated', 'asc')->get();
        $model_unavailable->map(function ($model) {
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
                unset($model_metal->metal_id);
                return $model_metal;
            });
            $model->model_metal = $model_metal;
            return $model;
        });
        return response()->json([
            'model_available' => $model_available,
            'model_unavailable' => $model_unavailable
        ]);
    }
    public function get_model_detail(Request $request)
    {
        $input = json_decode($request->input('model_information'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $model = DB::table('model')->where('id', $input['model_id'])->first();

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
            unset($model_metal->metal_id);
            return $model_metal;
        });
        $model->model_metal = $model_metal;


        return response()->json([
            'model' => $model
        ]);
    }
    public function deactivate(Request $request)
    {
        $input = json_decode($request->input('model_information'), true);
        if(!isset($input) || $input == null){
            return response()->json([
                'error' => 'No Input Received'
            ],404);
        }
        DB::beginTransaction();
        try {
            DB::table('model')->where('id', $input['model_id'])->update([
                'deactivated' => true,
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Succesfull deactivated'
        ], 200);
    }
    public function delete(Request $request)
    {
    }
    public function update(Request $request)
    {
    }
    public function set_available(Request $request)
    {
        $model_id = json_decode($request->input('model_id'), true);
        $image_list = json_decode($request->input('image_list'), true);
        if(!isset($model_id) || $model_id == null || !isset($image_list) || $image_list == null){
            return response()->json([
                'error' => 'Not Enough Input Received'
            ],404);
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
            'success' => 'Succesfull Set Available'
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
            return response()->json(['error' => 'No Model id received!'], 404);
        }

        $model = DB::table('model')->where('id', $input)->first();
        if ($model == null) {
            return response()->json(['error' => 'The Selected model doesn\'t exist'], 404);
        }

        $missing_image = [];

        $metals = DB::table('metal')->get();
        $metalCompatibilities = DB::table('metal_compatibility')->get();
        $diamondShapes = DB::table('diamond_shape')->get();

        $metal2Mapping = [];
        foreach ($metalCompatibilities as $compatibility) {
            $metal2Mapping[$compatibility->Metal_id_1][] = $compatibility->Metal_id_2;
        }

        foreach ($metals as $metal1) {
            if (isset($metal2Mapping[$metal1->id])) {
                foreach ($metal2Mapping[$metal1->id] as $metal2_id) {
                    foreach ($diamondShapes as $shape) {
                        $destinationPath = public_path('image/Final_templates/' . $input . '_' . $metal1->id . '_' . $metal2_id . '_' . $shape->id);

                        if (!file_exists($destinationPath)) {
                            $metal_1 = $metal1;
                            $metal_2 = DB::table('metal')->where('id', $metal2_id)->first();
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

        if (empty($missing_image)) {
            return response()->json(['error' => 'There are no Missing Images'], 404);
        }

        return response()->json([
            'model' => $model,
            'missing_image' => $missing_image
        ]);
    }
    public function set_model_diamond(Request $request)
    {
        $input = json_decode($request->input('new_model_diamond'), true);
        if(!isset($input) || $input == null){
            return response()->json([
                'error' => 'No Input Received'
            ],404);
        }
        DB::beginTransaction();
        try {
            $model_id = $input['model_id'];
            foreach ($input['model_diamond'] as $model_diamond) {
                $model_diamond = new Model_Diamond();
                $model_diamond->model_id = $model_id;
                $model_diamond->diamond_size_min = $model_diamond['diamond_size_min'];
                $model_diamond->diamond_size_max = $model_diamond['diamond_size_max'];
                $model_diamond->count = $model_diamond['count'];
                $model_diamond->diamond_shape_id = $model_diamond['diamond_shape_id'];
                $model_diamond->is_editable = false;
                $model_diamond->save();
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Succesfull Set'
        ], 200);
    }
    public function set_model_shape(Request $request)
    {
        $input = json_decode($request->input('new_model_shape'), true);
        if(!isset($input) || $input == null){
            return response()->json([
                'error' => 'No Input Received'
            ],404);
        }
        DB::beginTransaction();
        try {
            $model_id = $input['model_id'];
            foreach ($input['model_shape'] as $model_shape) {
                $model_shape = new Model_DiamondShape();
                $model_shape->model_id = $model_id;
                $model_shape->diamond_shape_id = $model_shape['diamond_shape_id'];
                $model_shape->save();
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Succesfull Set'
        ], 200);
    }
    public function set_model_metal(Request $request)
    {
        $input = json_decode($request->input('new_model_metal'), true);
        if(!isset($input) || $input == null){
            return response()->json([
                'error' => 'No Input Received'
            ],404);
        }
        DB::beginTransaction();
        try {
            $model_id = $input['model_id'];
            foreach ($input['model_metal'] as $model_metal) {
                $model_metal = new Model_Metal();
                $model_metal->model_id = $model_id;
                $model_metal->metal_id = $model_metal['metal_id'];
                $model_metal->is_main = $model_metal['is_main'];
                $model_metal->percentage = $model_metal['percentage'];
                $model_metal->save();
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Succesfull Set'
        ], 200);
    }
    public function get_model_diamond(Request $request)
    {
        $input = json_decode($request->input('model_id'), true);
        if(!isset($input) || $input == null){
            return response()->json([
                'error' => 'No Input Received'
            ],404);
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
        if(!isset($input) || $input == null){
            return response()->json([
                'error' => 'No Input Received'
            ],404);
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
        if(!isset($input) || $input == null){
            return response()->json([
                'error' => 'No Input Received'
            ],404);
        }

        $model_metal = DB::table('model_metal')->where('model_id', $input)->get();
        $model_metal->map(function ($model_metal) {
            $model_metal->metal = DB::table('metal')->where('id', $model_metal->metal_id)->first();
            unset($model_metal->metal_id);
            unset($model_metal->model_id);
            return $model_metal;
        });
        $returned_model_metal['model_id'] = $input;
        $returned_model_metal['model_metal'] = $model_metal;
        return response()->json([
            'returned_model_diamond' => $returned_model_metal
        ]);
    }
    public function get_mounting_type_list()
    {
        return response()->json([
            DB::table('mounting_type')->get()
        ]);
    }
    public function get_mounting_style_list()
    {
        return response()->json([
            DB::table('mounting_style')->get()
        ]);
    }
}
