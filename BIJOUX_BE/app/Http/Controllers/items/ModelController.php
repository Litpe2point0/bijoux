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
            ], 403);
        }
        DB::beginTransaction();
        try {
            $check = false;
            $check2 = false;
            $model_metal = $input['model_metal'];
            foreach ($model_metal as $metal) {
                if ($metal['is_main'] == 0) {
                    $check = true;
                }
                if ($metal['is_main'] == 1) {
                    $check2 = true;
                }
            }
            if ($check2 == false) {
                return response()->json([
                    'error' => 'The model must contain at least one main metal.'
                ], 403);
            }

            $model_metal1 = collect($input['model_metal']);

            $grouped_metals = $model_metal1->groupBy('is_main');
            $main_metals = $grouped_metals->get(1, collect());
            $main_metal_ids = $main_metals->pluck('metal.id');
            if ($main_metal_ids->duplicates()->isNotEmpty()) {
                return response()->json([
                    'error' => 'Duplicate main metals found.'
                ], 403);
            }
            $non_main_metals = $grouped_metals->get(0, collect());
            $non_main_metal_ids = $non_main_metals->pluck('metal.id');
            if ($non_main_metal_ids->duplicates()->isNotEmpty()) {
                return response()->json([
                    'error' => 'Duplicate secondary metals found.'
                ], 403);
            }

            $model_metal_main = $model_metal1->firstWhere('is_main', 1);
            if ($check == true) {
                $model_metal_notmain = $model_metal1->firstWhere('is_main', 0);
            }
            if ($check != true) {
                if ($model_metal_main['percentage'] != 100) {
                    return response()->json([
                        'error' => 'The percentage of the main metal must be 100.'
                    ], 403);
                }
            } else {
                $percentageValues1 = $main_metals->pluck('percentage')->unique();
                if ($percentageValues1->count() > 1) {
                    return response()->json([
                        'error' => 'All main metals must have the same percentage value.'
                    ], 403);
                }
            }
            if ($check == true && isset($model_metal_notmain)) {
                $percentageValues2 = $non_main_metals->pluck('percentage')->unique();
                if ($percentageValues2->count() > 1) {
                    return response()->json([
                        'error' => 'All secondary metals must have the same percentage value.'
                    ], 403);
                }

                $totalPercentage = $percentageValues1->sum() + $percentageValues2->sum();
                if ($totalPercentage != 100) {
                    return response()->json([
                        'error' => 'The sum of the main metal percentage and the secondary metal percentage must be 100.'
                    ], 403);
                }
            }

            $main_metal_ids = [];
            $notmain_metal_ids = [];
            if ($check == true) {
                foreach ($model_metal1 as $metal) {
                    if ($metal['is_main'] == 0) {
                        $notmain_metal_ids[] = $metal['metal']['id'];
                    }
                }
                $metalCompatibilities1 = DB::table('metal_compatibility')->whereIn('Metal_id_1', $main_metal_ids)->get();
                $metalCompatibilities1 = DB::table('metal_compatibility')
                    ->whereIn('Metal_id_1', $main_metal_ids)
                    ->get();

                // Count occurrences of each Metal_id_2
                $metalCounts = $metalCompatibilities1->groupBy('Metal_id_2')->map(function ($group) {
                    return $group->count();
                });

                // Get the count of unique Metal_id_1 values
                $uniqueMetal1Count = collect($main_metal_ids)->count();

                // Filter Metal_id_2 values that are associated with all Metal_id_1 values
                $commonMetal2Ids = $metalCounts->filter(function ($count) use ($uniqueMetal1Count) {
                    return $count == $uniqueMetal1Count;
                })->keys();

                if ($commonMetal2Ids->isEmpty()) {
                    return response()->json([
                        'error' => 'Metal Compatibility Error'
                    ], 403);
                }
            }
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
                $model_shape->diamond_shape_id = $shape_id;
                $model_shape->save();
            }
            foreach ($input['model_diamond'] as $diamond) {
                $model_diamond = new Model_Diamond();
                $model_diamond->model_id = $modelId;
                $model_diamond->diamond_size_min = $diamond['diamond_size_min'];
                $model_diamond->diamond_size_max = $diamond['diamond_size_max'];
                $model_diamond->count = $diamond['count'];
                $model_diamond->diamond_shape_id = $diamond['diamond_shape']['id'];
                $model_diamond->is_editable = $diamond['is_editable'];
                $model_diamond->save();
            }
            foreach ($input['model_metal'] as $metal) {
                $model_metal = new Model_Metal();
                $model_metal->model_id = $modelId;
                $model_metal->metal_id = $metal['metal']['id'];
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
        if ($token == null) {
            $role_id = 5;
        } else {
            $role_id = (int) $decodedToken['role_id'];
        }

        //create query
        $query_available = DB::table('model')
            ->join('model_diamondshape', 'model.id', '=', 'model_diamondshape.model_id')
            ->join('model_metal', 'model.id', '=', 'model_metal.model_id')
            ->select('model.id as model_id');
        $query_unavailable = DB::table('model')
            ->join('model_diamondshape', 'model.id', '=', 'model_diamondshape.model_id')
            ->join('model_metal', 'model.id', '=', 'model_metal.model_id')
            ->select('model.id as model_id');

        if ($role_id == 5 || $role_id == 4 || $role_id == 3 || $role_id == 2) {
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
        $model_available = $temp1->unique('id')->sortBy('deactivated')->values();

        $model_available->map(function ($model) {
            $OGurl = env('ORIGIN_URL');
            $Surl = env('STYLE_URL');
            $model->mounting_type = DB::table('mounting_type')->where('id', $model->mounting_type_id)->first();
            $model->mounting_style = DB::table('mounting_style')->where('id', $model->mounting_style_id)->first();
            $model->mounting_style->imageUrl = $OGurl . $Surl . $model->mounting_style->id . '/' . $model->mounting_style->imageUrl;
            unset($model->mounting_style_id);
            unset($model->mounting_type_id);

            $model_shape = DB::table('model_diamondshape')->where('model_id', $model->id)->get();
            $diamond_shape_ids = [];
            foreach ($model_shape as $instance) {
                $diamond_shape_ids[] = $instance->diamond_shape_id;
            }
            $model->model_diamond_shape = DB::table('diamond_shape')->whereIn('id', $diamond_shape_ids)->get();

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
                $OGurl = env('ORIGIN_URL');
                $url = env('METAL_URL');
                $model_metal->metal->imageUrl = $OGurl . $url . $model_metal->metal->id . '/' . $model_metal->metal->imageUrl;
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
            $model_unavailable = $temp2->unique('id')->sortBy('deactivated')->values();

            $model_unavailable->map(function ($model) {
                $OGurl = env('ORIGIN_URL');
                $Surl = env('STYLE_URL');
                $model->mounting_type = DB::table('mounting_type')->where('id', $model->mounting_type_id)->first();
                $model->mounting_style = DB::table('mounting_style')->where('id', $model->mounting_style_id)->first();
                $model->mounting_style->imageUrl = $OGurl . $Surl . $model->mounting_style->id . '/' . $model->mounting_style->imageUrl;
                unset($model->mounting_style_id);
                unset($model->mounting_type_id);

                $model_shape = DB::table('model_diamondshape')->where('model_id', $model->id)->get();
                $diamond_shape_ids = [];
                foreach ($model_shape as $instance) {
                    $diamond_shape_ids[] = $instance->diamond_shape_id;
                }
                $model->model_diamond_shape = DB::table('diamond_shape')->whereIn('id', $diamond_shape_ids)->get();

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
                    $OGurl = env('ORIGIN_URL');
                    $url = env('METAL_URL');
                    $model_metal->metal->imageUrl = $OGurl . $url . $model_metal->metal->id . '/' . $model_metal->metal->imageUrl;
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
            ], 403);
        }
        $model = DB::table('model')->where('id', $input)->first();
        if ($model == null) {
            return response()->json([
                'error' => 'The Selected Model Doesn\'t Exist'
            ], 403);
        }
        $OGurl = env('ORIGIN_URL');
        $Murl = env('MODEL_URL');
        $Surl = env('STYLE_URL');
        $model->mounting_type = DB::table('mounting_type')->where('id', $model->mounting_type_id)->first();
        $model->mounting_style = DB::table('mounting_style')->where('id', $model->mounting_style_id)->first();
        $model->mounting_style->imageUrl = $OGurl . $Surl . $model->mounting_style->id . '/' . $model->mounting_style->imageUrl;
        unset($model->mounting_style_id);
        unset($model->mounting_type_id);

        $model_shape = DB::table('model_diamondshape')->where('model_id', $model->id)->get();
        $diamond_shape_ids = [];
        foreach ($model_shape as $instance) {
            $diamond_shape_ids[] = $instance->diamond_shape_id;
        }
        $model->model_diamond_shape = DB::table('diamond_shape')->whereIn('id', $diamond_shape_ids)->get();

        $model_diamond = DB::table('model_diamond')->where('model_id', $model->id)->get();
        $model_diamond->map(function ($model_diamond) {
            $model_diamond->diamond_shape = DB::table('diamond_shape')->where('id', $model_diamond->diamond_shape_id)->first();
            if ($model_diamond->is_editable == 1) {
                $model_diamond->size_list = DB::table('diamond')->select('size')->where('size', '>=', $model_diamond->diamond_size_min)->where('size', '<=', $model_diamond->diamond_size_max)->groupBy('size')->pluck('size')->values();
            }
            unset($model_diamond->model_id);
            unset($model_diamond->diamond_shape_id);
            return $model_diamond;
        });
        $model->model_diamond = $model_diamond;

        $model_metal = DB::table('model_metal')->where('model_id', $model->id)->get();
        $model_metal->map(function ($model_metal) {
            $metal = DB::table('metal')->where('id', $model_metal->metal_id)->first();
            if ($metal->deactivated == 1) {
                $model_metal->isAvailable = false;
            } else {
                $model_metal->metal = DB::table('metal')->where('id', $model_metal->metal_id)->first();
                $OGurl = env('ORIGIN_URL');
                $url = env('METAL_URL');
                $model_metal->metal->imageUrl = $OGurl . $url . $model_metal->metal->id . '/' . $model_metal->metal->imageUrl;
                $model_metal->metal->created = Carbon::parse($model_metal->metal->created)->format('H:i:s d/m/Y');
                unset($model_metal->model_id);
                unset($model_metal->metal_id);
            }
            return $model_metal;
        });
        $model->model_metal = $model_metal;
        $model->imageUrl = $OGurl . $Murl . $model->id . '/' . $model->imageUrl;

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
            ], 403);
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
            ], 403);
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
                'profit_rate' => $input['profit_rate'],
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
            $temp2 = false;
            $model_metal1 = $input['model_metal'];
            foreach ($model_metal1 as $metal) {
                if ($metal['is_main'] == 1) {
                    $temp2 = true;
                }
            }
            if ($temp2 == false) {
                return response()->json([
                    'error' => 'The model must contain at least one main metal.'
                ], 403);
            }

            $model_diamond1 = collect($input['model_diamond']);
            $editable_diamonds = $model_diamond1->filter(function ($diamond) {
                return $diamond['is_editable'] == 1;
            });
            if ($editable_diamonds->count() !== 1) {
                return response()->json([
                    'error' => 'There must be exactly one editable diamond.'
                ], 403);
            }
            
            $check = true;
            $model_metal = DB::table('model_metal')->where('model_id', $input['id'])->get();
            $model_metal->map(function ($metal) {
                $metal->metal = DB::table('metal')->where('id', $metal->metal_id)->first();
                unset($metal->id);
                unset($metal->model_id);
                unset($metal->metal_id);
                return $metal;
            });
            $model_diamondshape = DB::table('model_diamondshape')->where('model_id', $input['id'])->pluck('diamond_shape_id')->values();
            foreach ($input['model_metal'] as $metal1) {
                $check = true;
                foreach ($model_metal as $metal2) {
                    if ($metal2->metal->id == $metal1['metal']['id'] && $metal2->is_main == $metal1['is_main']) {
                        $check = false;
                    }
                }
                if ($check == true) {
                    break;
                }
            }
            foreach ($model_metal as $metal1) {
                $check = true;
                if ($check == false) {
                    foreach ($input['model_metal'] as $metal2) {
                        if ($metal1->metal->id == $metal2['metal']['id'] && $metal1->is_main == $metal2['is_main']) {
                            $check = false;
                        }
                    }
                    if ($check == true) {
                        break;
                    }
                }
            }
            foreach ($input['model_diamond_shape'] as $shape1) {
                if ($check == false) {
                    $check = true;
                    foreach ($model_diamondshape as $shape2) {
                        if ($shape1 == $shape2) {
                            $check = false;
                        }
                    }
                    if ($check == true) {
                        break;
                    }
                }
            }
            foreach ($model_diamondshape as $shape1) {
                if ($check == false) {
                    $check = true;
                    foreach ($input['model_diamond_shape'] as $shape2) {
                        if ($shape1 == $shape2) {
                            $check = false;
                        }
                    }
                    if ($check == true) {
                        break;
                    }
                }
            }
            if ($check == true) {
                //check input validation
                $temp = false;
                $model_metal1 = $input['model_metal'];
                foreach ($model_metal1 as $metal) {
                    if ($metal['is_main'] == 0) {
                        $temp = true;
                    }
                }

                $model_metal2 = collect($input['model_metal']);

                $grouped_metals = $model_metal2->groupBy('is_main');
                $main_metals = $grouped_metals->get(1, collect());
                $main_metal_ids = $main_metals->pluck('metal.id');
                if ($main_metal_ids->duplicates()->isNotEmpty()) {
                    return response()->json([
                        'error' => 'Duplicate main metals found.'
                    ], 403);
                }
                $non_main_metals = $grouped_metals->get(0, collect());
                $non_main_metal_ids = $non_main_metals->pluck('metal.id');
                if ($non_main_metal_ids->duplicates()->isNotEmpty()) {
                    return response()->json([
                        'error' => 'Duplicate secondary metals found.'
                    ], 403);
                }

                $model_metal_main = $model_metal2->firstWhere('is_main', 1);
                if ($temp == true) {
                    $model_metal_notmain = $model_metal2->firstWhere('is_main', 0);
                }
                if ($temp != true) {
                    if ($model_metal_main['percentage'] != 100) {
                        return response()->json([
                            'error' => 'The percentage of the main metal must be 100.'
                        ], 403);
                    }
                } else {
                    $percentageValues1 = $main_metals->pluck('percentage')->unique();
                    if ($percentageValues1->count() > 1) {
                        return response()->json([
                            'error' => 'All main metals must have the same percentage value.'
                        ], 403);
                    }
                }
                if ($temp == true && isset($model_metal_notmain)) {
                    $percentageValues2 = $non_main_metals->pluck('percentage')->unique();
                    if ($percentageValues2->count() > 1) {
                        return response()->json([
                            'error' => 'All secondary metals must have the same percentage value.'
                        ], 403);
                    }

                    $totalPercentage = $percentageValues1->sum() + $percentageValues2->sum();
                    if ($totalPercentage != 100) {
                        return response()->json([
                            'error' => 'The sum of the main metal percentage and the secondary metal percentage must be 100.'
                        ], 403);
                    }
                }

                $main_metal_ids = [];
                $notmain_metal_ids = [];
                foreach ($model_metal1 as $metal) {
                    if ($metal['is_main'] == 1) {
                        $main_metal_ids[] = $metal['metal']['id'];
                    }
                }
                if ($temp == true) {
                    foreach ($model_metal1 as $metal) {
                        if ($metal['is_main'] == 0) {
                            $notmain_metal_ids[] = $metal['metal']['id'];
                        }
                    }
                    foreach ($main_metal_ids as $metal) {
                        $metalCompatibilities1 = DB::table('metal_compatibility')->where('Metal_id_1', $metal)->get();
                        foreach ($metalCompatibilities1 as $compatibility2) {
                            $bo = false;
                            foreach ($notmain_metal_ids as $metal2) {
                                if ($compatibility2->Metal_id_2 != $metal2) {
                                    return response()->json([
                                        'error' => 'Metal Compatibility Error'
                                    ], 403);
                                }
                            }
                        }
                    }
                }

                //check if the image exist or not, if not, set isAvailable to false
                $diamondShapes = $input['model_diamond_shape'];
                $metal2Mapping = [];
                foreach ($main_metal_ids as $metal) {
                    if (!isset($notmain_metal_ids) || $notmain_metal_ids == null) {
                        $metal2Mapping[$metal][] = 0;
                    }
                    $metalCompatibilities2 = DB::table('metal_compatibility')->where('Metal_id_1', $metal)->get();
                    foreach ($metalCompatibilities2 as $compatibility2) {
                        $bo = false;
                        foreach ($notmain_metal_ids as $metal2) {
                            if ($compatibility2->Metal_id_2 == $metal2) {
                                $bo = true;
                            }
                        }
                        if ($bo) {
                            $metal2Mapping[$compatibility2->Metal_id_1][] = $compatibility2->Metal_id_2;
                        }
                    }
                }
                foreach ($main_metal_ids as $metal) {
                    $metal1 = DB::table('metal')->where('id', $metal)->first();
                    if (isset($metal2Mapping[$metal1->id])) {
                        foreach ($metal2Mapping[$metal1->id] as $metal2_id) {
                            foreach ($diamondShapes as $shape) {
                                $check = true;
                                $destinationPath = public_path('image/Final_template/' . $input['id'] . '_' . $metal1->id . '_' . $metal2_id . '_' . $shape);
                                if (file_exists($destinationPath)) {
                                    $files = File::allFiles($destinationPath);
                                    if ($files != null) {
                                        $check = false;
                                    }
                                }
                            }
                        }
                    }
                    if ($check == true) {
                        break;
                    }
                }
            }

            //delete all model_metal, model_diamondshape, model_diamond
            DB::table('model_metal')->where('model_id', $input['id'])->delete();
            DB::table('model_diamondshape')->where('model_id', $input['id'])->delete();
            DB::table('model_diamond')->where('model_id', $input['id'])->delete();
            foreach ($input['model_diamond_shape'] as $shape) {
                DB::table('model_diamondshape')->insert([
                    'model_id' => $input['id'],
                    'diamond_shape_id' => $shape
                ]);
            }

            //insert new model_metal, model_diamondshape, model_diamond
            foreach ($input['model_diamond'] as $diamond) {
                DB::table('model_diamond')->insert([
                    'model_id' => $input['id'],
                    'diamond_size_min' => $diamond['diamond_size_min'],
                    'diamond_size_max' => $diamond['diamond_size_max'],
                    'count' => $diamond['count'],
                    'diamond_shape_id' => $diamond['diamond_shape']['id'],
                    'is_editable' => $diamond['is_editable']
                ]);
            }
            foreach ($input['model_metal'] as $metal) {
                DB::table('model_metal')->insert([
                    'model_id' => $input['id'],
                    'metal_id' => $metal['metal']['id'],
                    'is_main' => $metal['is_main'],
                    'percentage' => $metal['percentage']
                ]);
            }
            if ($check == true) {
                $updateData['isAvailable'] = false;
            }
            if ($check == false) {
                $updateData['isAvailable'] = true;
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
            ], 403);
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

                $destinationPath = public_path('image/Final_template/' . $model_id . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $image['diamond_shape_id']);
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                File::cleanDirectory($destinationPath);
                $mainImgName = 'main.jpg';
                file_put_contents($destinationPath . '/' . $mainImgName, $mainImgData);

                foreach ($image['related_image'] as $related_image) {
                    $relatedImgData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $related_image));
                    $relatedImgName = 'related_' . $count . '.jpg';
                    file_put_contents($destinationPath . '/' . $relatedImgName, $relatedImgData);
                    $count++;
                };
            }

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
                if ($model_metal_notmain->isEmpty()) {
                    $metal2Mapping[$metal->metal_id][] = 0;
                }
                $metalCompatibilities = DB::table('metal_compatibility')->where('Metal_id_1', $metal->metal_id)->get();
                foreach ($metalCompatibilities as $compatibility) {
                    $bo = false;
                    foreach ($model_metal_notmain as $metal2) {
                        if ($compatibility->Metal_id_2 == $metal2->metal_id) {
                            $bo = true;
                        }
                    }
                    if ($bo) {
                        $metal2Mapping[$compatibility->Metal_id_1][] = $compatibility->Metal_id_2;
                    }
                }
            }
            foreach ($model_metal_main as $metal) {
                $metal1 = DB::table('metal')->where('id', $metal->metal_id)->first();
                if (isset($metal2Mapping[$metal1->id])) {
                    foreach ($metal2Mapping[$metal1->id] as $metal2_id) {
                        foreach ($diamondShapes as $shape) {
                            $destinationPath = public_path('image/Final_template/' . $model_id . '_' . $metal1->id . '_' . $metal2_id . '_' . $shape->id);

                            if (!file_exists($destinationPath)) {
                                foreach ($image_list as $image) {
                                    $count = 1;
                                    $mainImgData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image['main_image']));

                                    $metal_1_id = isset($image['metal_1_id']) ? $image['metal_1_id'] : 0;
                                    $metal_2_id = isset($image['metal_2_id']) ? $image['metal_2_id'] : 0;

                                    $destinationPath = public_path('image/Final_template/' . $model_id . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $image['diamond_shape_id']);
                                    File::cleanDirectory($destinationPath);
                                }
                                return response()->json([
                                    'error' => 'There Are Still Missing Image To This Model'
                                ], 403);
                            } else {
                                $files = File::allFiles($destinationPath);
                                if ($files == null) {
                                    foreach ($image_list as $image) {
                                        $count = 1;
                                        $mainImgData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image['main_image']));

                                        $metal_1_id = isset($image['metal_1_id']) ? $image['metal_1_id'] : 0;
                                        $metal_2_id = isset($image['metal_2_id']) ? $image['metal_2_id'] : 0;

                                        $destinationPath = public_path('image/Final_template/' . $model_id . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $image['diamond_shape_id']);
                                        File::cleanDirectory($destinationPath);
                                    }
                                    return response()->json([
                                        'error' => 'There Are Still Missing Image To This Model'
                                    ], 403);
                                }
                            }
                        }
                    }
                }
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
        $input = json_decode($request->input('model_id'), true);

        if (!isset($input) || $input == null) {
            return response()->json(['error' => 'No Model Id Received!'], 403);
        }

        $model = DB::table('model')->where('id', $input)->first();
        if ($model == null) {
            return response()->json(['error' => 'The Selected Model Doesn\'t Exist'], 403);
        }
        $OGurl = env('ORIGIN_URL');
        $Murl = env('MODEL_URL');
        $Surl = env('STYLE_URL');
        $model->mounting_type = DB::table('mounting_type')->where('id', $model->mounting_type_id)->first();
        $model->mounting_style = DB::table('mounting_style')->where('id', $model->mounting_style_id)->first();
        $model->mounting_style->imageUrl = $OGurl . $Surl . $model->mounting_style->id . '/' . $model->mounting_style->imageUrl;
        unset($model->mounting_style_id);
        unset($model->mounting_type_id);

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
            if ($model_metal_notmain->isEmpty()) {
                $metal2Mapping[$metal->metal_id][] = 0;
            }
            $metalCompatibilities = DB::table('metal_compatibility')->where('Metal_id_1', $metal->metal_id)->get();
            foreach ($metalCompatibilities as $compatibility) {
                $bo = false;
                foreach ($model_metal_notmain as $metal2) {
                    if ($compatibility->Metal_id_2 == $metal2->metal_id) {
                        $bo = true;
                    }
                }
                if ($bo) {
                    $metal2Mapping[$compatibility->Metal_id_1][] = $compatibility->Metal_id_2;
                }
            }
        }
        foreach ($model_metal_main as $metal) {
            $metal1 = DB::table('metal')->where('id', $metal->metal_id)->first();
            if (isset($metal2Mapping[$metal1->id])) {
                foreach ($metal2Mapping[$metal1->id] as $metal2_id) {
                    foreach ($diamondShapes as $shape) {
                        $destinationPath = public_path('image/Final_template/' . $input . '_' . $metal1->id . '_' . $metal2_id . '_' . $shape->id);

                        if (!file_exists($destinationPath)) {
                            $metal_1 = DB::table('metal')->where('id', $metal1->id)->first();
                            $metal_1->imageUrl = $OGurl . env('METAL_URL') . $metal_1->id . '/' . $metal_1->imageUrl;
                            $metal_1->created = Carbon::parse($metal_1->created)->format('H:i:s d/m/Y');
                            if ($metal2_id == 0) {
                                $metal_2 = null;
                            } else {
                                $metal_2 = DB::table('metal')->where('id', $metal2_id)->first();
                                $metal_2->imageUrl = $OGurl . env('METAL_URL') . $metal_2->id . '/' . $metal_2->imageUrl;
                                $metal_2->created = Carbon::parse($metal_2->created)->format('H:i:s d/m/Y');
                            }
                            $diamond_shape = $shape;

                            $temp = [
                                'metal_1' => $metal_1,
                                'metal_2' => $metal_2,
                                'diamond_shape' => $diamond_shape
                            ];

                            $missing_image[] = $temp;
                        } else {
                            $files = File::allFiles($destinationPath);
                            if ($files == null) {
                                $metal_1 = DB::table('metal')->where('id', $metal1->id)->first();
                                $metal_1->imageUrl = $OGurl . env('METAL_URL') . $metal_1->id . '/' . $metal_1->imageUrl;
                                $metal_1->created = Carbon::parse($metal_1->created)->format('H:i:s d/m/Y');
                                $metal_2 = DB::table('metal')->where('id', $metal2_id)->first();
                                $metal_2->imageUrl = $OGurl . env('METAL_URL') . $metal_2->id . '/' . $metal_2->imageUrl;
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
        }
        $model->imageUrl = $OGurl . $Murl . $model->id . '/' . $model->imageUrl;

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
            ], 403);
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
            ], 403);
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
            ], 403);
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
            ], 403);
        }
        $validatedData = validator($input, [
            'model_id' => 'required',
            'diamond_shape_id' => 'required',
            'metal_1_id' => 'required',
            'mounting_size' => 'required',
            'diamond_origin_id' => 'required',
            'diamond_clarity_id' => 'required',
            'diamond_color_id' => 'required',
            'diamond_cut_id' => 'required',
            'diamond_size' => 'required',
        ]);
        if ($validatedData->fails()) {
            return response()->json([
                'error' => "Something Went Wrong"
            ], 403);
        }
        $model_id = $input['model_id'];
        $model = DB::table('model')->where('id', $model_id)->first();
        $product_price = 0;
        $metal_1 = DB::table('metal')->where('id', $input['metal_1_id'])->first();
        $metal_2 = DB::table('metal')->where('id', $input['metal_2_id'])->first();
        $diamond_color = DB::table('diamond_color')->where('id', $input['diamond_color_id'])->first();
        $diamond_clarity = DB::table('diamond_clarity')->where('id', $input['diamond_clarity_id'])->first();
        $diamond_cut = DB::table('diamond_cut')->where('id', $input['diamond_cut_id'])->first();
        $diamond_shape = DB::table('diamond_shape')->where('id', $input['diamond_shape_id'])->first();
        if ($metal_2 != null) {
            $mname = " - " . $metal_2->name;
        } else {
            $mname = "";
        }
        $name = $model->name . " In " . $metal_1->name . $mname . " With " . $input['diamond_size'] . " (mm) " . $diamond_color->name . "-" . $diamond_clarity->name . " " . $diamond_shape->name . " Shape " . $diamond_cut->name . "Cut Diamond";
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
        }
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
        $destinationPath = public_path('image/Final_template/' . $model_id . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $shape_id);
        if (!file_exists($destinationPath)) {
            return response()->json([
                'error' => 'The Selected Template Doesn\'t Exist'
            ], 403);
        }
        $OGurl = env('ORIGIN_URL');
        $url = env('FINAL_TEMPLATE_URL');
        $files = File::allFiles($destinationPath);
        if ($files == null) {
            return response()->json([
                'error' => 'The Selected Template Isn\'t Available'
            ], 403);
        }
        $imageCount = count($files) - 1;
        $main_image = $OGurl . $url . $model_id . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $shape_id . '/main.jpg';
        $related_image = [];
        for ($i = 1; $i <= $imageCount; $i++) {
            $related_image[] = $OGurl . $url . $model_id . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $shape_id . '/related_' . $i . '.jpg';
        }
        $OGurl = env('ORIGIN_URL');
        $Durl = env('DIAMOND_URL');
        $metal_1 = DB::table('metal')->where('id', $metal_1_id)->first();
        $model_metal_1 = DB::table('model_metal')->where('model_id', $model_id)->where('metal_id', $metal_1_id)->where('is_main', true)->first();
        $volume =  DB::table('size_to_volume')->where('size', $input['mounting_size'])->value('volume');
        if ($metal_2_id != null) {
            $metal_2 = DB::table('metal')->where('id', $metal_2_id)->first();
            $model_metal_2 = DB::table('model_metal')->where('model_id', $model_id)->where('metal_id', $metal_2_id)->where('is_main', false)->first();
            $metal_2->price = $volume * $model_metal_2->percentage * $metal_2->specific_weight * $metal_2->sale_price_per_gram;
            $iprice = $metal_2->price;
        } else {
            $iprice = 0;
        }
        $metal_1->price = $volume * $model_metal_1->percentage * $metal_1->specific_weight * $metal_1->sale_price_per_gram;

        $mprice = $metal_1->price + $iprice;
        $product_price += $mprice;
        $metal = [
            'name' => $metal_1->name . $mname . " " . $model->name,
            'price' => $mprice,
        ];
        $model_diamond = DB::table('model_diamond')->where('model_id', $model_id)->get();
        $diamond_list = collect();
        foreach ($model_diamond as $diamonds) {
            if ($diamonds->is_editable == 1) {
                $diamond = DB::table('diamond')->where('size', $input['diamond_size'])->where('diamond_color_id', $input['diamond_color_id'])->where('diamond_clarity_id', $input['diamond_clarity_id'])->where('diamond_cut_id', $input['diamond_cut_id'])->where('diamond_origin_id', $input['diamond_origin_id'])->first();
                if ($diamond != null) {
                    if ($diamond->deactivated) {
                        return response()->json([
                            'error' => 'The Selected Template Contain a Diamond That Has Been Deactivated'
                        ], 403);
                    }
                    $diamond->name = $input['diamond_size'] . " (mm) " . $diamond_color->name . "-" . $diamond_clarity->name . " " . $diamond_shape->name . " Shape " . $diamond_cut->name . "Cut Diamond";
                    $diamond->price = $diamonds->count * $diamond->price;
                    $diamond->imageUrl = $OGurl . $Durl . $diamond->imageUrl;
                    $diamond->diamond_shape = DB::table('diamond_shape')->where('id', $input['diamond_shape_id'])->first();
                    $diamond->diamond_clarity = DB::table('diamond_clarity')->where('id', $diamond->diamond_clarity_id)->first();
                    $diamond->diamond_cut = DB::table('diamond_cut')->where('id', $diamond->diamond_cut_id)->first();
                    $diamond->diamond_color = DB::table('diamond_color')->where('id', $diamond->diamond_color_id)->first();
                    $diamond->diamond_origin = DB::table('diamond_origin')->where('id', $diamond->diamond_origin_id)->first();
                    $diamond->count = $diamonds->count;
                    $diamond->is_editable = $diamonds->is_editable;
                    $product_price += $diamond->price;
                    unset($diamond->deactivated);
                    unset($diamond->created);
                    unset($diamond->diamond_clarity_id);
                    unset($diamond->diamond_cut_id);
                    unset($diamond->diamond_color_id);
                    unset($diamond->diamond_origin_id);
                    $diamond_list->push($diamond);
                } else {
                    return response()->json([
                        'error' => 'The Selected Template Contain a Diamond That Doesn\'t Exist'
                    ], 403);
                }
            } else {
                $diamond = DB::table('diamond')->where('size', $diamonds->diamond_size_max)->where('diamond_color_id', $input['diamond_color_id'])->where('diamond_clarity_id', $input['diamond_clarity_id'])->where('diamond_cut_id', $input['diamond_cut_id'])->where('diamond_origin_id', $input['diamond_origin_id'])->first();
                if ($diamond != null) {
                    if ($diamond->deactivated) {
                        return response()->json([
                            'error' => 'The Selected Template Contain a Diamond That Has Been Deactivated'
                        ], 403);
                    }
                    $diamond_shape2 = DB::table('diamond_shape')->where('id', $diamonds->diamond_shape_id)->first();
                    $diamond->name = $diamonds->diamond_size_max . " (mm) " . $diamond_color->name . "-" . $diamond_clarity->name . " " . $diamond_shape2->name . " Shape " . $diamond_cut->name . "Cut Diamond";
                    $diamond->price = $diamonds->count * $diamond->price;
                    $diamond->imageUrl = $OGurl . $Durl . $diamond->imageUrl;
                    $diamond->diamond_shape = DB::table('diamond_shape')->where('id', $diamonds->diamond_shape_id)->first();
                    $diamond->diamond_clarity = DB::table('diamond_clarity')->where('id', $diamond->diamond_clarity_id)->first();
                    $diamond->diamond_cut = DB::table('diamond_cut')->where('id', $diamond->diamond_cut_id)->first();
                    $diamond->diamond_color = DB::table('diamond_color')->where('id', $diamond->diamond_color_id)->first();
                    $diamond->diamond_origin = DB::table('diamond_origin')->where('id', $diamond->diamond_origin_id)->first();
                    $diamond->count = $diamonds->count;
                    $diamond->is_editable = $diamonds->is_editable;
                    $product_price += $diamond->price;
                    unset($diamond->deactivated);
                    unset($diamond->created);
                    unset($diamond->diamond_clarity_id);
                    unset($diamond->diamond_cut_id);
                    unset($diamond->diamond_color_id);
                    unset($diamond->diamond_origin_id);
                    $diamond_list->push($diamond);
                } else {
                    return response()->json([
                        'error' => 'The Selected Template Contain a Diamond That Doesn\'t Exist'
                    ], 403);
                }
            }
        }
        $production_price = $model->production_price + (($product_price + $model->production_price) * $model->profit_rate);
        $total_price = ($product_price + $model->production_price) * ($model->profit_rate + 100) / 100;
        return response()->json([
            'name' => $name,
            'model_id' => $model_id,
            'mounting_type' => DB::table('mounting_type')->where('id', $model->mounting_type_id)->first(),
            'main_image' => $main_image,
            'related_image' => $related_image,
            'metal' => $metal,
            'diamond_list' => $diamond_list->values()->all(),
            'production_price' => $production_price,
            'total_price' => $total_price
        ]);
    }
}
