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
use PHPUnit\Framework\Constraint\IsTrue;
use Tymon\JWTAuth\Facades\JWTAuth;
use Carbon\Carbon;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use PhpParser\Node\Stmt\If_;
use Tymon\JWTAuth\Exceptions\JWTException;
use Throwable;

class ModelController extends Controller
{
/**
 * @OA\Post(
 *     path="/api/items/model/add",
 *     summary="Add a new model",
 *     description="This endpoint allows you to add a new model with metals and diamonds.",
 *     operationId="addModel",
 *     tags={"Model"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="new_model", type="object",
 *                 @OA\Property(property="name", type="string", example="Model Name"),
 *                 @OA\Property(property="mounting_type_id", type="integer", example=1),
 *                 @OA\Property(property="mounting_style_id", type="integer", example=1),
 *                 @OA\Property(property="base_width", type="number", format="float", example=5.0),
 *                 @OA\Property(property="base_height", type="number", format="float", example=5.0),
 *                 @OA\Property(property="volume", type="number", format="float", example=10.0),
 *                 @OA\Property(property="production_price", type="number", format="float", example=100.0),
 *                 @OA\Property(property="profit_rate", type="number", format="float", example=15.0),
 *                 @OA\Property(property="imageUrl", type="string", example="data:image/jpeg;base64,..."),
 *                 @OA\Property(
 *                     property="model_diamond_shape", 
 *                     type="array", 
 *                     @OA\Items(type="integer", example=1)
 *                 ),
 *                 @OA\Property(
 *                     property="model_diamond", 
 *                     type="array", 
 *                     @OA\Items(
 *                         type="object",
 *                         @OA\Property(property="diamond_size_min", type="number", format="float", example=1.0),
 *                         @OA\Property(property="diamond_size_max", type="number", format="float", example=2.0),
 *                         @OA\Property(property="count", type="integer", example=5),
 *                         @OA\Property(property="diamond_shape", type="object", @OA\Property(property="id", type="integer", example=1)),
 *                         @OA\Property(property="is_editable", type="integer", example=1)
 *                     )
 *                 ),
 *                 @OA\Property(
 *                     property="model_metal", 
 *                     type="array", 
 *                     @OA\Items( ref="#/components/schemas/Metal"
 *                     )
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Model successfully added",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="success", type="string", example="Model successfully added")
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Input validation error",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="No input received")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error",
 *         @OA\JsonContent(
 *             type="string",
 *             example="Internal server error"
 *         )
 *     )
 * )
 */
    public function add(Request $request)
    {
        //input
        $input = json_decode($request->input('new_model'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
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

            $model_diamond = collect($input['model_diamond']);
            $editable_diamonds = $model_diamond->filter(function ($diamond) {
                return $diamond['is_editable'] == 1;
            });
            if ($editable_diamonds->count() !== 1) {
                return response()->json([
                    'error' => 'There must be exactly one editable diamond.'
                ], 403);
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
            if ($check == true) {
                $model_metal_notmain = $model_metal2->firstWhere('is_main', 0);
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
            foreach ($model_metal as $metal) {
                if ($metal['is_main'] == 1) {
                    $main_metal_ids[] = $metal['metal']['id'];
                }
            }
            if ($check == true) {
                foreach ($model_metal as $metal) {
                    if ($metal['is_main'] == 0) {
                        $notmain_metal_ids[] = $metal['metal']['id'];
                    }
                }
                foreach ($main_metal_ids as $metal) {
                    $check3 = false;
                    $metalCompatibilities1 = DB::table('metal_compatibility')->where('Metal_id_1', $metal)->get();
                    foreach ($metalCompatibilities1 as $compatibility2) {
                        foreach ($notmain_metal_ids as $metal2) {
                            if ($compatibility2->Metal_id_2 == $metal2) {
                                $check3 = true;
                            }
                        }
                    }
                    if (!$check3) {
                        return response()->json([
                            'error' => 'Metal compatibility error'
                        ], 403);
                    }
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
                $fileName = Carbon::now()->timestamp . '_' . $modelId . '.jpg';
                file_put_contents($destinationPath . '/' . $fileName, $fileData);

                $model->imageUrl = $fileName;
                $model->save();
            } else {
                $fileName = Carbon::now()->timestamp . '_' . $modelId . '.jpg';
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
            'success' => "Model successfully added",
        ], 201);
    }
    /**
 * @OA\Post(
 *     path="/api/items/model/get_list",
 *     summary="Get model list",
 *     description="Retrieve available and unavailable models based on search criteria.",
 *     operationId="getModelList",
 *     tags={"Model"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="model_search_information", type="object",
 *                 @OA\Property(property="mounting_style", type="array", @OA\Items(type="integer", example=1)),
 *                 @OA\Property(property="mounting_type_id", type="integer", example=1),
 *                 @OA\Property(property="diamond_shape", type="array", @OA\Items(type="integer", example=1)),
 *                 @OA\Property(property="metal", type="array", @OA\Items(type="integer", example=1))
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Successfully retrieved models",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="model_available", type="array", @OA\Items(type="object")),
 *             @OA\Property(property="model_unavailable", type="array", @OA\Items(type="object"))
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Invalid token",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Invalid token")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error",
 *         @OA\JsonContent(
 *             type="string",
 *             example="Internal server error"
 *         )
 *     )
 * )
 */
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
            } catch (JWTException $e) {
                try {
                    $decodedToken = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Invalid token'], 401);
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
        $models = DB::table('model')->whereIn('id', $modelIds)->where('isAvailable', true)->get();
        if (in_array($role_id, [2, 3, 4, 5])) {
            foreach ($models as $model) {
                $check = false;
                $mm = collect();
                $isValid = false;
                $modelMetals = DB::table('model_metal')->where('model_id', $model->id)->get();
                foreach ($modelMetals as $modelMetal) {
                    $metal = DB::table('metal')->where('id', $modelMetal->metal_id)->first();
                    if ($metal && $metal->deactivated == 0) {
                        $mm->push($modelMetal);
                        $isValid = true;
                    }
                    if ($modelMetal->is_main == 0) {
                        $check = true;
                    }
                }
                if (!$mm->isEmpty()) {
                    $notmain_metal_ids = [];
                    $main_metal_ids = [];
                    foreach ($mm as $metal) {
                        if ($metal->is_main == 0) {
                            $notmain_metal_ids[] = $metal->metal_id;
                        } else {
                            $main_metal_ids[] = $metal->metal_id;
                        }
                    }
                    if($main_metal_ids == null){
                        $isValid = false;
                        continue;
                    }
                    if ($check) {
                        if($notmain_metal_ids == null){
                            $isValid = false;
                            continue;
                        }
                        $check2 = true;
                        foreach ($main_metal_ids as $metal) {
                            $check3 = false;
                            $metalCompatibilities1 = DB::table('metal_compatibility')->where('Metal_id_1', $metal)->get();
                            foreach ($metalCompatibilities1 as $compatibility2) {
                                foreach ($notmain_metal_ids as $metal2) {
                                    if ($compatibility2->Metal_id_2 == $metal2) {
                                        $check3 = true;
                                    }
                                }
                            }
                            if (!$check3) {
                                $check2 = false;
                            }
                        }
                        if($check2){
                            $isValid = true;
                        } else {
                            $isValid = false;
                        }
                    }
                }
                if ($isValid) {
                    $temp1->push($model);
                }
            }
        } else {
            foreach ($modelIds as $model_id) {
                $filtered_models = DB::table('model')->where('id', $model_id)->where('isAvailable', true)->first();
                if ($filtered_models) {
                    $temp1->push($filtered_models);
                }
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
            $models2 = DB::table('model')->whereIn('id', $modelIds2)->where('isAvailable', true)->get();
            if (in_array($role_id, [2, 3, 4, 5])) {
                foreach ($models2 as $model) {
                    $isValid = false;
                    $modelMetals = DB::table('model_metal')->where('model_id', $model->id)->get();
                    foreach ($modelMetals as $modelMetal) {
                        $metal = DB::table('metal')->where('id', $modelMetal->metal_id)->first();
                        if ($metal && $metal->deactivated == 0) {
                            $isValid = true;
                            break;
                        }
                    }
                    if ($isValid) {
                        $temp2->push($model);
                    }
                }
            } else {
                foreach ($modelIds2 as $model_id) {
                    $filtered_models2 = DB::table('model')->where('id', $model_id)->where('isAvailable', false)->first();
                    if ($filtered_models2) {
                        $temp2->push($filtered_models2);
                    }
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
/**
 * @OA\Post(
 *     path="/api/items/model/get_detail",
 *     tags={"Model"},
 *     summary="Get details of a model",
 *     description="Returns detailed information about a model including its metals, diamonds, and related styles.",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="model_id",
 *                 type="integer",
 *                 example=1,
 *                 description="ID of the model to fetch details for"
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Details of the model",
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="model",
 *                 type="object",
 *                 ref="#/components/schemas/Model"
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized: Invalid or missing authentication token",
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="error",
 *                 type="string",
 *                 example="Invalid token"
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Forbidden: No input received, model not found, deactivated, unavailable, or metal compatibility error",
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="error",
 *                 type="string",
 *                 example="The selected model isn't available"
 *             )
 *         )
 *     )
 * )
 */
    public function get_model_detail(Request $request)
    {
        $input = json_decode($request->input('model_id'), true);
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
        if ($token == null) {
            $role_id = 5;
        } else {
            try {
                $role_id = $decodedToken['role_id'];
            } catch (Throwable $e) {
                $role_id = $decodedToken->role_id;
            }
        }
        $model = DB::table('model')->where('id', $input)->first();
        if ($model == null) {
            return response()->json([
                'error' => 'The selected model doesn\'t exist'
            ], 403);
        }
        if ((bool)$model->deactivated == true && $role_id != 1) {
            return response()->json([
                'error' => 'The selected model is deactivated'
            ], 403);
        }
        if ($model->isAvailable == false && $role_id != 1) {
            return response()->json([
                'error' => 'The selected model is unavailable'
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

        $temp = collect();
        $model_metal = DB::table('model_metal')->where('model_id', $model->id)->get();
        if ($role_id == 5) {
            $check = false;
            foreach ($model_metal as $metal2) {
                if ($metal2->is_main == 0) {
                    $check = true;
                }
            }
            if ($check) {
                $temp3 = collect();
                foreach ($model_metal as $metal1) {
                    $metal = DB::table('metal')->where('id', $metal1->metal_id)->first();
                    if ($metal->deactivated == 1) {
                        continue;
                    }
                    $temp3->push($metal1);
                }
                $notmain_metal_ids = [];
                $main_metal_ids = [];
                foreach ($temp3 as $metal) {
                    if ($metal->is_main == 0) {
                        $notmain_metal_ids[] = $metal->metal_id;
                    } else {
                        $main_metal_ids[] = $metal->metal_id;
                    }
                }
                if ($notmain_metal_ids == null || $main_metal_ids == null) {
                    return response()->json([
                        'error' => 'The selected model isn\'t available'
                    ], 403);
                }
                foreach ($main_metal_ids as $metal) {
                    $check3 = false;
                    $metalCompatibilities1 = DB::table('metal_compatibility')->where('Metal_id_1', $metal)->get();
                    foreach ($metalCompatibilities1 as $compatibility2) {
                        foreach ($notmain_metal_ids as $metal2) {
                            if ($compatibility2->Metal_id_2 == $metal2) {
                                $mm2 = DB::table('model_metal')->where('model_id', $model->id)->where('metal_id', $metal2)->where('is_main', 0)->first();
                                $temp->push($mm2);
                                $check3 = true;
                            }
                        }
                    }
                    if (!$check3) {
                        return response()->json([
                            'error' => 'Metal compatibility error'
                        ], 403);
                    } else {
                        $mm1 = DB::table('model_metal')->where('model_id', $model->id)->where('metal_id', $metal)->where('is_main', 1)->first();
                        $temp->push($mm1);
                    }
                }
            } else {
                foreach ($model_metal as $metal1) {
                    $metal = DB::table('metal')->where('id', $metal1->metal_id)->first();
                    if ($metal->deactivated == 1) {
                        continue;
                    }
                    $temp->push($metal1);
                }
            }
            // foreach ($model_metal as $metal1) {
            //     $metal = DB::table('metal')->where('id', $metal1->metal_id)->first();
            //     if ($metal->deactivated == 1) {
            //         continue;
            //     }
            //     $temp->push($metal1);
            // }
        } else {
            foreach ($model_metal as $metal1) {
                $temp->push($metal1);
            }
        }
        $temp->map(function ($model_metal) {
            // $metal = DB::table('metal')->where('id', $model_metal->metal_id)->first();
            // if ($metal->deactivated == 1) {
            //     $model_metal->isAvailable = false;
            // } else {
            $model_metal->metal = DB::table('metal')->where('id', $model_metal->metal_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('METAL_URL');
            $model_metal->metal->imageUrl = $OGurl . $url . $model_metal->metal->id . '/' . $model_metal->metal->imageUrl;
            $model_metal->metal->created = Carbon::parse($model_metal->metal->created)->format('H:i:s d/m/Y');
            unset($model_metal->model_id);
            unset($model_metal->metal_id);
            // }
            return $model_metal;
        });
        if ($temp->isEmpty() && $role_id == 5) {
            return response()->json([
                'error' => 'The selected model isn\'t available'
            ], 403);
        }
        $model->model_metal = $temp->values()->all();
        $model->imageUrl = $OGurl . $Murl . $model->id . '/' . $model->imageUrl;

        return response()->json([
            'model' => $model
        ]);
    }

/**
 * @OA\Post(
 *     path="/api/items/model/set_deactivate",
 *     tags={"Model"},
 *     summary="Deactivate or activate a model",
 *     description="Deactivates or activates a model based on input.",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="model_id",
 *                 type="integer",
 *                 example=1,
 *                 description="ID of the model to deactivate or activate"
 *             ),
 *             @OA\Property(
 *                 property="deactivate",
 *                 type="boolean",
 *                 example=true,
 *                 description="True to deactivate, false to activate"
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Success message",
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="success",
 *                 type="string",
 *                 example="Deactivate model successfully"
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized: Invalid or missing authentication token",
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="error",
 *                 type="string",
 *                 example="Invalid token"
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Forbidden: No input received or model not found",
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="error",
 *                 type="string",
 *                 example="The selected model doesn't exist"
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal Server Error",
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="error",
 *                 type="string",
 *                 example="Database error occurred"
 *             )
 *         )
 *     )
 * )
 */
    public function set_deactivate(Request $request)
    {
        $input = json_decode($request->input('deactivate'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
        DB::beginTransaction();
        try {
            $tf = false;
            $model = DB::table('model')->where('id', $input['model_id'])->first();
            if ($model == null) {
                return response()->json([
                    'error' => 'The selected model doesn\'t exist'
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
                'success' => 'Deactivate model successfully'
            ], 200);
        } else {
            return response()->json([
                'success' => 'Activate model successfully'
            ], 200);
        }
    }
    /**
 * Update model details.
 *
 * @OA\Post(
 *      path="/api/items/model/update",
 *      operationId="updateModel",
 *      tags={"Model"},
 *      summary="Update model details",
 *      @OA\RequestBody(
 *          required=true,
 *          description="Updated model object",
 *          @OA\JsonContent(
 *              @OA\Property(property="new_model", type="object",
 *                  @OA\Property(property="id", type="integer", example="1"),
 *                  @OA\Property(property="name", type="string", example="Updated Model"),
 *                  @OA\Property(property="mounting_type_id", type="integer", example="2"),
 *                  @OA\Property(property="mounting_style_id", type="integer", example="3"),
 *                  @OA\Property(property="base_width", type="float", example="10.5"),
 *                  @OA\Property(property="base_height", type="float", example="15.2"),
 *                  @OA\Property(property="volume", type="float", example="200.5"),
 *                  @OA\Property(property="production_price", type="float", example="1500.0"),
 *                  @OA\Property(property="profit_rate", type="float", example="0.25"),
 *                  @OA\Property(property="imageUrl", type="string", example="data:image/jpeg;base64,/9j/4AAQSk..."),
 *                  @OA\Property(property="model_metal", type="array",
 *                      @OA\Items(
 *                          @OA\Property(property="metal", type="object",
 *                              @OA\Property(property="id", type="integer", example="1")
 *                          ),
 *                          @OA\Property(property="is_main", type="integer", example="1"),
 *                          @OA\Property(property="percentage", type="float", example="50.0")
 *                      )
 *                  ),
 *                  @OA\Property(property="model_diamond", type="array",
 *                      @OA\Items(
 *                          @OA\Property(property="diamond_size_min", type="float", example="0.5"),
 *                          @OA\Property(property="diamond_size_max", type="float", example="1.0"),
 *                          @OA\Property(property="count", type="integer", example="1"),
 *                          @OA\Property(property="diamond_shape", type="object",
 *                              @OA\Property(property="id", type="integer", example="1")
 *                          ),
 *                          @OA\Property(property="is_editable", type="integer", example="1")
 *                      )
 *                  ),
 *                  @OA\Property(property="model_diamond_shape", type="array",
 *                      @OA\Items(type="integer", example="1")
 *                  )
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=201,
 *          description="Model updated successfully"
 *      ),
 *      @OA\Response(
 *          response=403,
 *          description="Error updating model",
 *          @OA\JsonContent(
 *              @OA\Property(property="error", type="string", example="Error updating model")
 *          )
 *      )
 * )
 */
    public function update(Request $request)
    {
        $input = json_decode($request->input('new_model'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
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
                $fileName = Carbon::now()->timestamp . '_' . $input['id'] . '.jpg';
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
                $temp = false;
                $model_metal1 = $input['model_metal'];
                foreach ($model_metal1 as $metal) {
                    if ($metal['is_main'] == 0) {
                        $temp = true;
                    }
                }

                $model_metal2 = collect($input['model_metal']);

                //$main_metals = $model_metal2->where('is_main',1);
                //$main_metal_ids = $main_metals->pluck('metal.id');
                $grouped_metals = $model_metal2->groupBy('is_main');
                $main_metals = $grouped_metals->get(1, collect());
                $main_metal_ids = $main_metals->pluck('metal.id');
                if ($main_metal_ids->duplicates()->isNotEmpty()) {
                    return response()->json([
                        'error' => 'Duplicate main metals found.'
                    ], 403);
                }
                //$non_main_metals = $model_metal2->where('is_main',0);
                //$non_main_metal_ids = $non_main_metals->pluck('metal.id');
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
                        $check3 = false;
                        $metalCompatibilities1 = DB::table('metal_compatibility')->where('Metal_id_1', $metal)->get();
                        foreach ($metalCompatibilities1 as $compatibility2) {
                            foreach ($notmain_metal_ids as $metal2) {
                                if ($compatibility2->Metal_id_2 == $metal2) {
                                    $check3 = true;
                                }
                            }
                        }
                        if (!$check3) {
                            return response()->json([
                                'error' => 'Metal compatibility error'
                            ], 403);
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
                                $destinationPath = public_path('image/Final_Template/' . $input['id'] . '_' . $metal1->id . '_' . $metal2_id . '_' . $shape);
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
            'success' => 'Model update successfully'
        ], 201);
    }
    /**
 * Set model available with images.
 *
 * @OA\Post(
 *      path="/api/items/model/set_available",
 *      operationId="setAvailableModel",
 *      tags={"Model"},
 *      summary="Set model available with images",
 *      @OA\RequestBody(
 *          required=true,
 *          description="Model ID and image list",
 *          @OA\JsonContent(
 *              @OA\Property(property="set_available", type="object",
 *                  @OA\Property(property="model_id", type="integer", example="1"),
 *                  @OA\Property(property="image_list", type="array",
 *                      @OA\Items(
 *                          @OA\Property(property="main_image", type="string", example="data:image/jpeg;base64,/9j/4AAQSk..."),
 *                          @OA\Property(property="metal_1_id", type="integer", example="1"),
 *                          @OA\Property(property="metal_2_id", type="integer", example="2"),
 *                          @OA\Property(property="diamond_shape_id", type="integer", example="1"),
 *                          @OA\Property(property="related_image", type="array",
 *                              @OA\Items(type="string", example="data:image/jpeg;base64,/9j/4AAQSk...")
 *                          )
 *                      )
 *                  )
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Model set available successfully"
 *      ),
 *      @OA\Response(
 *          response=403,
 *          description="Error setting model available",
 *          @OA\JsonContent(
 *              @OA\Property(property="error", type="string", example="Error setting model available")
 *          )
 *      )
 * )
 */
    public function set_available(Request $request)
    {
        $input = json_decode($request->input('set_available'), true);
        $model_id = $input['model_id'];
        $image_list = $input['image_list'];
        if (!isset($model_id) || $model_id == null || !isset($image_list) || $image_list == null) {
            return response()->json([
                'error' => 'Not enough enput received'
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

                $destinationPath = public_path('image/Final_Template/' . $model_id . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $image['diamond_shape_id']);
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
                            $destinationPath = public_path('image/Final_Template/' . $model_id . '_' . $metal1->id . '_' . $metal2_id . '_' . $shape->id);

                            if (!file_exists($destinationPath)) {
                                foreach ($image_list as $image) {
                                    $count = 1;
                                    $mainImgData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image['main_image']));

                                    $metal_1_id = isset($image['metal_1_id']) ? $image['metal_1_id'] : 0;
                                    $metal_2_id = isset($image['metal_2_id']) ? $image['metal_2_id'] : 0;

                                    $destinationPath = public_path('image/Final_Template/' . $model_id . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $image['diamond_shape_id']);
                                    File::cleanDirectory($destinationPath);
                                }
                                return response()->json([
                                    'error' => 'There are still missing image to this model'
                                ], 403);
                            } else {
                                $files = File::allFiles($destinationPath);
                                if ($files == null) {
                                    foreach ($image_list as $image) {
                                        $count = 1;
                                        $mainImgData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image['main_image']));

                                        $metal_1_id = isset($image['metal_1_id']) ? $image['metal_1_id'] : 0;
                                        $metal_2_id = isset($image['metal_2_id']) ? $image['metal_2_id'] : 0;

                                        $destinationPath = public_path('image/Final_Template/' . $model_id . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $image['diamond_shape_id']);
                                        File::cleanDirectory($destinationPath);
                                    }
                                    return response()->json([
                                        'error' => 'There are still missing image to this model'
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
            'success' => 'Succesfully set available'
        ], 200);
    }
    /**
 * @OA\Post(
 *      path="/api/items/model/get_missing_image",
 *      operationId="getMissingImage",
 *      tags={"Model"},
 *      summary="Get model details with missing images",
 *      description="Returns model details along with information about missing images for metal combinations and diamond shapes.",
 *      @OA\RequestBody(
 *          required=true,
 *          @OA\JsonContent(
 *              @OA\Property(
 *                  property="model_id",
 *                  type="integer",
 *                  description="ID of the model to retrieve images for"
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Successful operation",
 *          @OA\JsonContent(
 *              @OA\Property(
 *                  property="model",
 *                  ref="#/components/schemas/Model"
 *              ),
 *              @OA\Property(
 *                  property="missing_image",
 *                  type="array",
 *                  @OA\Items(
 *                      @OA\Property(
 *                          property="metal_1",
 *                          ref="#/components/schemas/Metal"
 *                      ),
 *                      @OA\Property(
 *                          property="metal_2",
 *                          ref="#/components/schemas/Metal"
 *                      ),
 *                      @OA\Property(
 *                          property="diamond_shape",
 *                          ref="#/components/schemas/ModelDiamondShape"
 *                      )
 *                  )
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=403,
 *          description="No Model Id Received or The selected model doesn't exist",
 *          @OA\JsonContent(
 *              @OA\Property(
 *                  property="error",
 *                  type="string", example="No Model Id Received or The selected model doesn't exist"
 *              )
 *          )
 *      )
 * )
 */
    public function get_missing_image(Request $request)
    {
        $input = json_decode($request->input('model_id'), true);

        if (!isset($input) || $input == null) {
            return response()->json(['error' => 'No Model Id Received!'], 403);
        }

        $model = DB::table('model')->where('id', $input)->first();
        if ($model == null) {
            return response()->json(['error' => 'The selected model doesn\'t exist'], 403);
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
                        $destinationPath = public_path('image/Final_Template/' . $input . '_' . $metal1->id . '_' . $metal2_id . '_' . $shape->id);

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
    /**
 * @OA\Post(
 *      path="/api/items/model/get_model_diamond",
 *      operationId="getModelDiamond",
 *      tags={"Model"},
 *      summary="Get model diamonds",
 *      description="Returns diamonds associated with a specified model.",
 *      @OA\RequestBody(
 *          required=true,
 *          @OA\JsonContent(
 *              @OA\Property(
 *                  property="model_id",
 *                  type="integer",
 *                  description="ID of the model to retrieve diamonds for"
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Successful operation",
 *          @OA\JsonContent(
 *              @OA\Property(
 *                  property="returned_model_diamond",
 *                  type="object",
 *                  @OA\Property(
 *                      property="model_id",
 *                      type="integer",
 *                      description="ID of the model"
 *                  ),
 *                  @OA\Property(
 *                      property="model_diamond",
 *                      type="array",
 *                      @OA\Items(
 *                          ref="#/components/schemas/ModelDiamond"
 *                      )
 *                  )
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=403,
 *          description="No input received",
 *          @OA\JsonContent(
 *              @OA\Property(
 *                  property="error",
 *                  type="string", example="No input received"
 *              )
 *          )
 *      )
 * )
 */
    public function get_model_diamond(Request $request)
    {
        $input = json_decode($request->input('model_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
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
    /**
 * @OA\Post(
 *      path="/api/items/model/get_model_shape",
 *      operationId="getModelShape",
 *      tags={"Model"},
 *      summary="Get model diamond shapes",
 *      description="Returns diamond shapes associated with a specified model.",
 *      @OA\RequestBody(
 *          required=true,
 *          @OA\JsonContent(
 *              @OA\Property(
 *                  property="model_id",
 *                  type="integer",
 *                  description="ID of the model to retrieve diamond shapes for"
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Successful operation",
 *          @OA\JsonContent(
 *              @OA\Property(
 *                  property="returned_model_shape",
 *                  type="object",
 *                  @OA\Property(
 *                      property="model_id",
 *                      type="integer",
 *                      description="ID of the model"
 *                  ),
 *                  @OA\Property(
 *                      property="model_shape",
 *                      type="array",
 *                      @OA\Items(
 *                          ref="#/components/schemas/ModelDiamondShape"
 *                      )
 *                  )
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=403,
 *          description="No input received",
 *          @OA\JsonContent(
 *              @OA\Property(
 *                  property="error",
 *                  type="string", example="No input received"
 *              )
 *          )
 *      )
 * )
 */
    public function get_model_shape(Request $request)
    {
        $input = json_decode($request->input('model_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
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

/**
 * @OA\Post(
 *      path="/api/items/model/get_model_metal",
 *      operationId="getModelMetal",
 *      tags={"Model"},
 *      summary="Get model metals",
 *      description="Returns metals associated with a specified model.",
 *      @OA\RequestBody(
 *          required=true,
 *          @OA\JsonContent(
 *              @OA\Property(
 *                  property="model_id",
 *                  type="integer",
 *                  description="ID of the model to retrieve metals for"
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Successful operation",
 *          @OA\JsonContent(
 *              @OA\Property(
 *                  property="returned_model_metal",
 *                  type="object",
 *                  @OA\Property(
 *                      property="model_id",
 *                      type="integer",
 *                      description="ID of the model"
 *                  ),
 *                  @OA\Property(
 *                      property="model_metal",
 *                      type="array",
 *                      @OA\Items(
 *                          ref="#/components/schemas/Metal"
 *                      )
 *                  )
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=403,
 *          description="No input received",
 *          @OA\JsonContent(
 *              @OA\Property(
 *                  property="error",
 *                  type="string", example="No input received"
 *              )
 *          )
 *      )
 * )
 */
    public function get_model_metal(Request $request)
    {
        $input = json_decode($request->input('model_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
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
    /**
 * @OA\Post(
 *      path="/api/items/model/get_mounting_type_list",
 *      operationId="postMountingTypeList",
 *      tags={"Model"},
 *      summary="Get mounting type list",
 *      description="Returns a list of all mounting types.",
 *      @OA\Response(
 *          response=200,
 *          description="Successful operation",
 *          @OA\JsonContent(
 *              type="array",
 *              @OA\Items(
 *                  @OA\Property(property="id", type="integer", example=1),
 *                  @OA\Property(property="name", type="string", example="Type A"),
 *                  @OA\Property(property="min_size", type="integer", example=10),
 *                  @OA\Property(property="max_size", type="integer", example=50),
 *              )
 *          )
 *      )
 * )
 */
    public function get_mounting_type_list()
    {
        return response()->json(
            DB::table('mounting_type')->get()
        );
    }
    /**
 * @OA\Post(
 *      path="/api/items/model/get_mounting_style_list",
 *      operationId="postMountingStyleList",
 *      tags={"Model"},
 *      summary="Get mounting style list",
 *      description="Returns a list of all mounting styles.",
 *      @OA\Response(
 *          response=200,
 *          description="Successful operation",
 *          @OA\JsonContent(
 *              type="array",
 *              @OA\Items(
 *                  @OA\Property(property="id", type="integer", example=1),
 *                  @OA\Property(property="name", type="string", example="Style A"),
 *                  @OA\Property(property="imageUrl", type="string", example="http://example.com/style.jpg"),
 *              )
 *          )
 *      )
 * )
 */
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
/**
 * @OA\Post(
 *      path="/api/items/model/get_final_checkout",
 *      operationId="getFinalCheckout",
 *      tags={"Model"},
 *      summary="Get final checkout details",
 *      description="Returns details for final checkout based on provided template information.",
 *      @OA\RequestBody(
 *          required=true,
 *          @OA\JsonContent(
 *              required={"template_information", "template_information.model_id", "template_information.diamond_shape_id", "template_information.metal_1_id", "template_information.mounting_size", "template_information.diamond_origin_id", "template_information.diamond_clarity_id", "template_information.diamond_color_id", "template_information.diamond_cut_id", "template_information.diamond_size"},
 *                  example={
 *                  "template_information": {
 *                      "model_id": 1,
 *                      "diamond_shape_id": 2,
 *                      "metal_1_id": 3,
 *                      "metal_2_id": null,
 *                      "mounting_size": "1.5",
 *                      "diamond_origin_id": 4,
 *                      "diamond_clarity_id": 5,
 *                      "diamond_color_id": 6,
 *                      "diamond_cut_id": 7,
 *                      "diamond_size": 1.5
 *                  }
 *              }
 *          )
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Successful operation",
 *          @OA\JsonContent(
 *              @OA\Property(property="name", type="string"),
 *              @OA\Property(property="model_id", type="integer"),
 *              @OA\Property(
 *                  property="mounting_type",
 *                  type="object",
 *                  @OA\Property(property="id", type="integer"),
 *                  @OA\Property(property="name", type="string"),
 *                  @OA\Property(property="min_size", type="number", format="float"),
 *                  @OA\Property(property="max_size", type="number", format="float")
 *              ),
 *              @OA\Property(property="main_image", type="string"),
 *              @OA\Property(property="related_image", type="array", @OA\Items(type="string")),
 *              @OA\Property(
 *                  property="metal",
 *                  type="object",
 *                  @OA\Property(property="name", type="string"),
 *                  @OA\Property(property="price", type="number", format="float")
 *              ),
 *              @OA\Property(
 *                  property="diamond_list",
 *                  type="array",
 *                  @OA\Items(
 *                      @OA\Property(property="id", type="integer"),
 *                      @OA\Property(property="name", type="string"),
 *                      @OA\Property(property="imageUrl", type="string"),
 *                      @OA\Property(property="diamond_size", type="number", format="float"),
 *                      @OA\Property(
 *                          property="diamond_color",
 *                          type="object",
 *                          @OA\Property(property="id", type="integer"),
 *                          @OA\Property(property="name", type="string")
 *                      ),
 *                      @OA\Property(
 *                          property="diamond_origin",
 *                          type="object",
 *                          @OA\Property(property="id", type="integer"),
 *                          @OA\Property(property="name", type="string")
 *                      ),
 *                      @OA\Property(
 *                          property="diamond_clarity",
 *                          type="object",
 *                          @OA\Property(property="id", type="integer"),
 *                          @OA\Property(property="name", type="string")
 *                      ),
 *                      @OA\Property(
 *                          property="diamond_cut",
 *                          type="object",
 *                          @OA\Property(property="id", type="integer"),
 *                          @OA\Property(property="name", type="string")
 *                      ),
 *                      @OA\Property(property="price", type="number", format="float"),
 *                      @OA\Property(
 *                          property="diamond_shape",
 *                          type="object",
 *                          @OA\Property(property="id", type="integer"),
 *                          @OA\Property(property="name", type="string")
 *                      ),
 *                      @OA\Property(property="count", type="integer"),
 *                      @OA\Property(property="is_editable", type="boolean")
 *                  )
 *              ),
 *              @OA\Property(property="production_price", type="number", format="float"),
 *              @OA\Property(property="total_price", type="number", format="float")
 *          )
 *      ),
 *      @OA\Response(
 *          response=403,
 *          description="Error occurred",
 *          @OA\JsonContent(
 *              @OA\Property(property="error", type="string",example="Error occurred")
 *          )
 *      )
 * )
 */
        public function get_final_checkout(Request $request)
    {
        $input = json_decode($request->input('template_information'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
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
                'error' => "Something went wrong"
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
                    'error' => 'The template must contain 1 main metal'
                ], 403);
            }
            if ($metal->deactivated) {
                return response()->json([
                    'error' => 'The template contain a metal that has been deactivated'
                ], 403);
            };
        }
        if (isset($input['metal_2_id']) && $input['metal_2_id'] != null) {
            $metal_2_id = $input['metal_2_id'];
            $metal = DB::table('metal')->where('id', $input['metal_2_id'])->first();
            if ($metal != null) {
                if ($metal->deactivated) {
                    return response()->json([
                        'error' => 'The template contain a metal that has been deactivated'
                    ], 403);
                };
            }
        } else $metal_2_id = 0;
        $shape_id = $input['diamond_shape_id'];
        $destinationPath = public_path('image/Final_Template/' . $model_id . '_' . $metal_1_id . '_' . $metal_2_id . '_' . $shape_id);
        if (!file_exists($destinationPath)) {
            return response()->json([
                'error' => 'The selected template doesn\'t exist'
            ], 403);
        }
        $OGurl = env('ORIGIN_URL');
        $url = env('FINAL_TEMPLATE_URL');
        $files = File::allFiles($destinationPath);
        if ($files == null) {
            return response()->json([
                'error' => 'The selected template isn\'t available'
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
        if ($model->mounting_type_id != 3) {
            $volume =  DB::table('size_to_volume')->where('size', $input['mounting_size'])->value('volume');
            if ($metal_2_id != null || $metal_2_id != 0) {
                $metal_2 = DB::table('metal')->where('id', $metal_2_id)->first();
                $model_metal_2 = DB::table('model_metal')->where('model_id', $model_id)->where('metal_id', $metal_2_id)->where('is_main', false)->first();
                $metal_2->price = $volume * ($model_metal_2->percentage / 100) * $metal_2->specific_weight * $metal_2->sale_price_per_gram;
                $iprice = $metal_2->price;
            } else {
                $iprice = 0;
            }
            $metal_1->price = $volume * ($model_metal_1->percentage / 100) * $metal_1->specific_weight * $metal_1->sale_price_per_gram;
        } else {
            if ($metal_2_id != null || $metal_2_id != 0) {
                $metal_2 = DB::table('metal')->where('id', $metal_2_id)->first();
                $model_metal_2 = DB::table('model_metal')->where('model_id', $model_id)->where('metal_id', $metal_2_id)->where('is_main', false)->first();
                $metal_2->price = $model->volume * ($model_metal_2->percentage / 100) * $metal_2->specific_weight * $metal_2->sale_price_per_gram;
                $iprice = $metal_2->price;
            } else {
                $iprice = 0;
            }
            $metal_1->price = $model->volume * ($model_metal_1->percentage / 100) * $metal_1->specific_weight * $metal_1->sale_price_per_gram;
        }

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
                            'error' => 'The selected template contain a diamond that has been deactivated'
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
                        'error' => 'The selected template contain a diamond that doesn\'t exist'
                    ], 403);
                }
            } else {
                $diamond = DB::table('diamond')->where('size', $diamonds->diamond_size_max)->where('diamond_color_id', $input['diamond_color_id'])->where('diamond_clarity_id', $input['diamond_clarity_id'])->where('diamond_cut_id', $input['diamond_cut_id'])->where('diamond_origin_id', $input['diamond_origin_id'])->first();
                if ($diamond != null) {
                    if ($diamond->deactivated) {
                        return response()->json([
                            'error' => 'The selected template contain a diamond that has been deactivated'
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
                        'error' => 'The selected template contain a diamond that doesn\'t exist'
                    ], 403);
                }
            }
        }
        $production_price = $model->production_price + ($product_price  * $model->profit_rate / 100);
        $total_price = ($product_price) * ($model->profit_rate + 100) / 100 + $model->production_price;
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
