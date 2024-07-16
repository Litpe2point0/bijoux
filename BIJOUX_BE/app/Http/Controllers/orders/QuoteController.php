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
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\accounts\Account;
use Carbon\Carbon;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Tymon\JWTAuth\Exceptions\JWTException;
use Throwable;

class QuoteController extends Controller
{
    /**
 * @OA\Post(
 *      path="/api/admin/quote/get_quote_list",
 *      operationId="getQuoteListAdmin",
 *      tags={"Quote"},
 *      summary="Get list of quotes for admin",
 *      description="Returns a list of quotes with product and account details for the admin",
 *      @OA\Response(
 *          response=200,
 *          description="Successful operation",
 *          @OA\JsonContent(
 *              type="array",
 *              @OA\Items(
 *                  @OA\Property(property="id", type="integer"),
 *                  @OA\Property(property="product", type="object",
 *                      @OA\Property(property="id", type="integer"),
 *                      @OA\Property(property="name", type="string"),
 *                      @OA\Property(property="imageUrl", type="string")
 *                  ),
 *                  @OA\Property(property="account", type="object",
 *                      @OA\Property(property="id", type="integer"),
 *                      @OA\Property(property="username", type="string"),
 *                      @OA\Property(property="fullname", type="string"),
 *                      @OA\Property(property="email", type="string"),
 *                      @OA\Property(property="phone", type="string"),
 *                      @OA\Property(property="dob", type="string"),
 *                      @OA\Property(property="imageUrl", type="string"),
 *                      @OA\Property(property="deactivated", type="boolean"),
 *                      @OA\Property(property="deactivated_date", type="string"),
 *                      @OA\Property(property="role", type="object",
 *                          @OA\Property(property="id", type="integer"),
 *                          @OA\Property(property="name", type="string")
 *                      )
 *                  ),
 *                  @OA\Property(property="quote_status", type="object",
 *                      @OA\Property(property="id", type="integer"),
 *                      @OA\Property(property="name", type="string")
 *                  )
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=403,
 *          description="Forbidden",
 *          @OA\JsonContent(
 *              @OA\Property(property="error", type="string", example="Forbidden")
 *          )
 *      ),
 *      @OA\Response(
 *          response=500,
 *          description="Internal Server Error",
 *          @OA\JsonContent(
 *              @OA\Property(property="error", type="string", example="Internal Server Error")
 *          )
 *      )
 * )
 */
    public function get_quote_list_admin()
    {
        $quote_list = DB::table('quote')->orderBy('quote_status_id', 'ASC')->get();
        $quote_list->map(function ($quote) {
            $product = DB::table('product')->where('id', $quote->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            $quote->product = $product;
            unset($quote->product_id);

            $account = DB::table('account')->where('id', $quote->account_id)->first();
            $account->role = DB::table('role')->where('id', $account->role_id)->first();
            unset($account->role_id);
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
            }
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
            $quote->account = $account;
            unset($quote->account_id);

            $quote->quote_status = DB::table('quote_status')->where('id', $quote->quote_status_id)->first();
            unset($quote->quote_status_id);
            return $quote;
        });

        return response()->json(
            $quote_list
        );
    }
    /**
 * @OA\Post(
 *      path="/api/admin/quote/get_priced_quote_list",
 *      operationId="getPricedQuoteList",
 *      tags={"Quote"},
 *      summary="Get list of priced quotes for admin",
 *      description="Returns a list of priced quotes with product and account details for the admin",
 *      @OA\Response(
 *          response=200,
 *          description="Successful operation",
 *          @OA\JsonContent(
 *              type="array",
 *              @OA\Items(
 *                  type="object",
 *                  @OA\Property(property="id", type="integer"),
 *                  @OA\Property(property="product", type="object",
 *                      @OA\Property(property="id", type="integer"),
 *                      @OA\Property(property="imageUrl", type="string"),
 *                      @OA\Property(property="mounting_type", type="object",
 *                          @OA\Property(property="id", type="integer"),
 *                          @OA\Property(property="name", type="string")
 *                      )
 *                  ),
 *                  @OA\Property(property="account", type="object",
 *                      @OA\Property(property="id", type="integer"),
 *                      @OA\Property(property="imageUrl", type="string"),
 *                      @OA\Property(property="dob", type="string"),
 *                      @OA\Property(property="deactivated_date", type="string"),
 *                      @OA\Property(property="role", type="object",
 *                          @OA\Property(property="id", type="integer"),
 *                          @OA\Property(property="name", type="string")
 *                      )
 *                  ),
 *                  @OA\Property(property="quote_status", type="object",
 *                      @OA\Property(property="id", type="integer"),
 *                      @OA\Property(property="name", type="string")
 *                  )
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=500,
 *          description="Internal Server Error",
 *          @OA\JsonContent(
 *              type="object",
 *              @OA\Property(property="error", type="string")
 *          )
 *      )
 * )
 */
    public function get_priced_quote_list()
    {
        $quote_list = DB::table('quote')->where('quote_status_id', 3)->get();
        $quote_list->map(function ($quote) {
            $product = DB::table('product')->where('id', $quote->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            $quote->product = $product;
            unset($quote->product_id);

            $account = DB::table('account')->where('id', $quote->account_id)->first();
            $account->role = DB::table('role')->where('id', $account->role_id)->first();
            unset($account->role_id);
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
            }
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
            $quote->account = $account;
            unset($quote->account_id);

            $quote->quote_status = DB::table('quote_status')->where('id', $quote->quote_status_id)->first();
            unset($quote->quote_status_id);
            return $quote;
        });

        return response()->json(
            $quote_list
        );
    }
    /**
 * @OA\Post(
 *      path="/api/quote/get_quote_list",
 *      operationId="getQuoteListCustomer",
 *      tags={"Quote"},
 *      summary="Get list of quotes for customer",
 *      description="Returns a list of quotes for the customer based on their account ID",
 *      @OA\RequestBody(
 *          required=true,
 *          @OA\JsonContent(
 *              @OA\Property(property="Authorization", type="string", description="Bearer token")
 *          )
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Successful operation",
 *          @OA\JsonContent(
 *              type="array",
 *              @OA\Items(
 *                  type="object",
 *                  @OA\Property(property="id", type="integer"),
 *                  @OA\Property(property="created", type="string"),
 *                  @OA\Property(property="product", type="object",
 *                      @OA\Property(property="id", type="integer"),
 *                      @OA\Property(property="imageUrl", type="string"),
 *                      @OA\Property(property="mounting_type", type="object",
 *                          @OA\Property(property="id", type="integer"),
 *                          @OA\Property(property="name", type="string")
 *                      )
 *                  ),
 *                  @OA\Property(property="account", type="object",
 *                      @OA\Property(property="id", type="integer"),
 *                      @OA\Property(property="imageUrl", type="string"),
 *                      @OA\Property(property="dob", type="string"),
 *                      @OA\Property(property="deactivated_date", type="string"),
 *                      @OA\Property(property="role", type="object",
 *                          @OA\Property(property="id", type="integer"),
 *                          @OA\Property(property="name", type="string")
 *                      )
 *                  ),
 *                  @OA\Property(property="quote_status", type="object",
 *                      @OA\Property(property="id", type="integer"),
 *                      @OA\Property(property="name", type="string")
 *                  ),
 *                  @OA\Property(property="sale_staff", type="object",
 *                      @OA\Property(property="id", type="integer"),
 *                      @OA\Property(property="imageUrl", type="string"),
 *                      @OA\Property(property="dob", type="string"),
 *                      @OA\Property(property="deactivated_date", type="string"),
 *                      @OA\Property(property="role", type="object",
 *                          @OA\Property(property="id", type="integer"),
 *                          @OA\Property(property="name", type="string")
 *                      )
 *                  ),
 *                  @OA\Property(property="design_staff", type="object",
 *                      @OA\Property(property="id", type="integer"),
 *                      @OA\Property(property="imageUrl", type="string"),
 *                      @OA\Property(property="dob", type="string"),
 *                      @OA\Property(property="deactivated_date", type="string"),
 *                      @OA\Property(property="role", type="object",
 *                          @OA\Property(property="id", type="integer"),
 *                          @OA\Property(property="name", type="string")
 *                      )
 *                  ),
 *                  @OA\Property(property="production_staff", type="object",
 *                      @OA\Property(property="id", type="integer"),
 *                      @OA\Property(property="imageUrl", type="string"),
 *                      @OA\Property(property="dob", type="string"),
 *                      @OA\Property(property="deactivated_date", type="string"),
 *                      @OA\Property(property="role", type="object",
 *                          @OA\Property(property="id", type="integer"),
 *                          @OA\Property(property="name", type="string")
 *                      )
 *                  )
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=401,
 *          description="Unauthorized",
 *          @OA\JsonContent(
 *              type="object",
 *              @OA\Property(property="error", type="string")
 *          )
 *      ),
 *      @OA\Response(
 *          response=500,
 *          description="Internal Server Error",
 *          @OA\JsonContent(
 *              type="object",
 *              @OA\Property(property="error", type="string")
 *          )
 *      )
 * )
 */
    public function get_quote_list_customer(Request $request)
    {
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
        try {
            $input = $decodedToken['id'];
        } catch (Throwable $e) {
            $input = $decodedToken->id;
        }

        $quote_list = DB::table('quote')->where('account_id', $input)->orderByRaw("
            CASE 
                WHEN quote_status_id = 5 THEN 2 
                WHEN quote_status_id = 4 THEN 1 
                ELSE 0 
            END ASC 
        ")->get();
        $quote_list->map(function ($quote) {
            $product = DB::table('product')->where('id', $quote->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $quote->created = Carbon::parse($quote->created)->format('H:i:s d/m/Y');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            if ($product->mounting_type_id != null) {
                $product->mounting_type = DB::table('mounting_type')->where('id', $product->mounting_type_id)->first();
            } else {
                $product->mounting_type = null;
            }
            unset($product->mounting_type_id);
            $quote->product = $product;
            unset($quote->product_id);

            $account = DB::table('account')->where('id', $quote->account_id)->first();
            $account->role = DB::table('role')->where('id', $account->role_id)->first();
            unset($account->role_id);
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
            }
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
            $quote->account = $account;
            unset($quote->account_id);

            $quote->quote_status = DB::table('quote_status')->where('id', $quote->quote_status_id)->first();
            unset($quote->quote_status_id);

            $sale_staff = DB::table('account')->where('id', $quote->saleStaff_id)->first();
            if ($sale_staff != null) {
                $sale_staff->role = DB::table('role')->where('id', $sale_staff->role_id)->first();
                unset($sale_staff->role_id);
                if (!$sale_staff->google_id) {
                    $OGurl = env('ORIGIN_URL');
                    $url = env('ACCOUNT_URL');
                    $sale_staff->imageUrl = $OGurl . $url . $sale_staff->id . "/" . $sale_staff->imageUrl;
                }
                $sale_staff->dob = Carbon::parse($sale_staff->dob)->format('d/m/Y');
                $sale_staff->deactivated_date = Carbon::parse($sale_staff->deactivated_date)->format('d/m/Y');
                unset($sale_staff->password);
            }

            $quote->sale_staff = $sale_staff;
            unset($quote->saleStaff_id);

            $design_staff = DB::table('account')->where('id', $quote->designStaff_id)->first();
            if ($design_staff != null) {
                $design_staff->role = DB::table('role')->where('id', $design_staff->role_id)->first();
                unset($design_staff->role_id);
                if (!$design_staff->google_id) {
                    $OGurl = env('ORIGIN_URL');
                    $url = env('ACCOUNT_URL');
                    $design_staff->imageUrl = $OGurl . $url . $design_staff->id . "/" . $design_staff->imageUrl;
                }
                $design_staff->dob = Carbon::parse($design_staff->dob)->format('d/m/Y');
                $design_staff->deactivated_date = Carbon::parse($design_staff->deactivated_date)->format('d/m/Y');
                unset($design_staff->password);
            }
            $quote->design_staff = $design_staff;
            unset($quote->designStaff_id);

            $production_staff = DB::table('account')->where('id', $quote->productionStaff_id)->first();
            if ($production_staff != null) {
                $production_staff->role = DB::table('role')->where('id', $production_staff->role_id)->first();
                unset($production_staff->role_id);
                if (!$production_staff->google_id) {
                    $OGurl = env('ORIGIN_URL');
                    $url = env('ACCOUNT_URL');
                    $production_staff->imageUrl = $OGurl . $url . $production_staff->id . "/" . $production_staff->imageUrl;
                }
                $production_staff->dob = Carbon::parse($production_staff->dob)->format('d/m/Y');
                $production_staff->deactivated_date = Carbon::parse($production_staff->deactivated_date)->format('d/m/Y');
                unset($production_staff->password);
            }
            $quote->production_staff = $production_staff;
            unset($quote->productionStaff_id);
            return $quote;
        });
        return response()->json(
            $quote_list,
        );
    }
    /**
 * @OA\Post(
 *      path="/api/quote/get_quote_status_list",
 *      operationId="getQuoteStatusList",
 *      tags={"Quote"},
 *      summary="Get list of quote statuses",
 *      description="Returns a list of all quote statuses",
 *      @OA\Response(
 *          response=200,
 *          description="Successful operation",
 *          @OA\JsonContent(
 *              type="array",
 *              @OA\Items(
 *                  type="object",
 *                  @OA\Property(property="id", type="integer"),
 *                  @OA\Property(property="name", type="string")
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=500,
 *          description="Internal Server Error",
 *          @OA\JsonContent(
 *              type="object",
 *              @OA\Property(property="error", type="string")
 *          )
 *      )
 * )
 */
    public function get_quote_status_list()
    {
        return response()->json(
            DB::table('quote_status')->get()
        );
    }
/**
 * @OA\Post(
 *     path="/api/quote/add_quote",
 *     summary="Add a new quote when customer send a customization request",
 *     description="Create a new quote with a product and associated account details.",
 *     operationId="addQuote",
 *     tags={"Quote"},
 *     security={{"bearerAuth": {}}},
 *     @OA\RequestBody(
 *         required=true,
 *         description="New quote data",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="mounting_type_id", type="integer", description="ID of the mounting type", example=1),
 *             @OA\Property(property="note", type="string", description="Additional note", example="Sample note")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Quote created successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="success", type="string", example="Quote created successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Invalid input or account issues",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="No Input Received or The selected customer account has been deactivated")
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
 *         description="Internal server error",
 *         @OA\JsonContent(
 *             type="string",
 *             example="Error message"
 *         )
 *     )
 * )
 */
    public function add_quote(Request $request)
    {
        $input = json_decode($request->input('new_quote'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Receive'
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
        try {
            $account_id = $decodedToken['id'];
        } catch (Throwable $e) {
            $account_id = $decodedToken->id;
        }
        $account = DB::table('account')->where('id', $account_id)->first();
        if ($account->deactivated) {
            return response()->json([
                'error' => 'The selected customer account has been deactivated'
            ], 403);
        } else {
            if(!$account->status){
                return response()->json([
                    'error' => 'The selected customer account hasn\'t been activated'
                ], 403);  
            }
        }

        if (isset($input['mounting_type_id']) && $input['mounting_type_id'] != null) {
            $type_id = $input['mounting_type_id'];
        } else $type_id = null;
        if (isset($input['note']) && $input['note'] != null) {
            $note = $input['note'];
        } else $note = null;
        DB::beginTransaction();
        try {
            $product = new Product();
            $product->mounting_type_id = $type_id;
            $product->imageUrl = "";
            $product->save();

            $productId = (int) $product->id;

            $fileName = 'main.jpg';
            $destinationPath = public_path('image/Order/' . $productId);
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $destinationFilePath = public_path('image/Order/' . $productId . '/' . $fileName);
            $sourceFilePath = public_path('image/Order/unknown.jpg');
            File::copy($sourceFilePath, $destinationFilePath);
            $product->imageUrl = $fileName;
            $product->save();

            $quote = new Quote();
            $quote->product_id = $product->id;
            $quote->account_id = $account_id;
            $quote->quote_status_id = 1;
            $quote->product_price = 0;
            $quote->production_price = 0;
            $quote->profit_rate = 0;
            $quote->total_price = 0;
            $quote->note = $note;
            $quote->created = Carbon::now()->format('Y-m-d H:i:s');
            $quote->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Quote create successfully'
        ], 201);
    }
/**
 * @OA\Post(
 *     path="/api/admin/quote/assign_quote",
 *     summary="Assign staff to a quote",
 *     description="Assign sales, design, and production staff to a quote.",
 *     operationId="assignQuote",
 *     tags={"Quote"},
 *     @OA\RequestBody(
 *         required=true,
 *         description="Assigned information data",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="assigned_information", type="object", description="JSON object containing assigned information details",
 *                 @OA\Property(property="quote_id", type="integer", example=1),
 *                 @OA\Property(property="saleStaff_id", type="integer", example=2),
 *                 @OA\Property(property="designStaff_id", type="integer", example=3),
 *                 @OA\Property(property="productionStaff_id", type="integer", example=4),
 *                 @OA\Property(property="note", type="string", example="Sample note")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Assign quote successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="success", type="string", example="Assign quote successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Invalid input or account issues",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="No input received or The selected sale staff account can't be null")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error",
 *         @OA\JsonContent(
 *             type="string",
 *             example="Error message"
 *         )
 *     )
 * )
 */
   public function assign_quote(Request $request) //
    {
        $input = json_decode($request->input('assigned_information'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
        DB::beginTransaction();
        try {
            $quote = DB::table('quote')->where('id', $input['quote_id'])->first();
            if ($quote->quote_status_id == 4) {
                DB::rollBack();
                return response()->json([
                    'error' => 'The selected quote has been completed'
                ], 403);
            }
            if ($quote->quote_status_id == 5) {
                DB::rollBack();
                return response()->json([
                    'error' => 'The selected quote has been cancelled'
                ], 403);
            }
            $saleStaff_id = isset($input['saleStaff_id']) ? $input['saleStaff_id'] : null;
            $designStaff_id = isset($input['designStaff_id']) ? $input['designStaff_id'] : null;
            $productionStaff_id = isset($input['productionStaff_id']) ? $input['productionStaff_id'] : null;
            if ($saleStaff_id != null) $sale_staff = DB::table('account')->where('id', $input['saleStaff_id'])->first();
            else {
                return response()->json([
                    'error' => 'The selected sale staff account can\'t be null'
                ], 403);
            }
            if ($designStaff_id != null) $design_staff = DB::table('account')->where('id', $input['designStaff_id'])->first();
            else {
                return response()->json([
                    'error' => 'The selected sale staff account can\'t be null'
                ], 403);
            }
            if ($productionStaff_id != null) $production_staff = DB::table('account')->where('id', $input['productionStaff_id'])->first();
            else {
                return response()->json([
                    'error' => 'The selected production staff account can\'t be null'
                ], 403);
            }
            if ($sale_staff != null) {
                if ($sale_staff->role_id != '2') {
                    return response()->json([
                        'error' => 'The selected sale staff account is not a sale staff'
                    ], 403);
                } else if ($sale_staff->deactivated) {
                    return response()->json([
                        'error' => 'The selected sale staff account has been deactivated'
                    ], 403);
                }
            }
            if ($design_staff != null) {
                if ($design_staff->role_id != '3') {
                    return response()->json([
                        'error' => 'The selected design staff account is not a design staff'
                    ], 403);
                } else if ($design_staff->deactivated) {
                    return response()->json([
                        'error' => 'The selected design staff account has been deactivated'
                    ], 403);
                }
            }
            if ($production_staff != null) {
                if ($production_staff->role_id != '4') {
                    return response()->json([
                        'error' => 'The selected production staff account is not a production staff'
                    ], 403);
                } else if ($production_staff->deactivated) {
                    return response()->json([
                        'error' => 'The selected production staff account has been deactivated'
                    ], 403);
                }
            }
            DB::table('quote')->where('id', $input['quote_id'])->update([
                'note' => $input['note']
            ]);
            DB::table('quote')->where('id', $input['quote_id'])->update([
                'saleStaff_id' => $saleStaff_id,
                'designStaff_id' => $designStaff_id,
                'productionStaff_id' => $productionStaff_id,
            ]);
            if ($quote->quote_status_id == 1) {
                DB::table('quote')->where('id', $input['quote_id'])->update([
                    'quote_status_id' => 2
                ]);
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Assign quote succesfully'
        ], 201);
    }
    /**
 * @OA\Post(
 *     path="/api/admin/quote/pricing_quote",
 *     tags={"Quote"},
 *     summary="Price a quote",
 *     description="This endpoint allows a sales staff member to price a quote.",
 *     @OA\RequestBody(
 *         required=true,
 *         description="The pricing details of the quote",
 *         @OA\JsonContent(
 *             required={"quote_id", "production_price", "profit_rate"},
 *             @OA\Property(property="quote_id", type="integer", example=1, description="The ID of the quote"),
 *             @OA\Property(property="mounting_type_id", type="integer", example=2, description="The ID of the mounting type"),
 *             @OA\Property(property="mounting_size", type="number", format="float", example=5.5, description="The size of the mounting"),
 *             @OA\Property(property="imageUrl", type="string", format="byte", description="The image of the product in base64 format"),
 *             @OA\Property(property="diamond_list", type="array", @OA\Items(
 *                 @OA\Property(property="diamond", type="object", @OA\Property(property="id", type="integer", example=1)),
 *                 @OA\Property(property="count", type="integer", example=1),
 *                 @OA\Property(property="price", type="number", format="float", example=5000),
 *                 @OA\Property(property="diamond_shape", type="object", @OA\Property(property="id", type="integer", example=1))
 *             )),
 *             @OA\Property(property="metal_list", type="array", @OA\Items(
 *                 @OA\Property(property="metal", type="object", @OA\Property(property="id", type="integer", example=1)),
 *                 @OA\Property(property="price", type="number", format="float", example=1000),
 *                 @OA\Property(property="volume", type="number", format="float", example=1.2),
 *                 @OA\Property(property="weight", type="number", format="float", example=10.5)
 *             )),
 *             @OA\Property(property="production_price", type="number", format="float", example=15000, description="The production price of the quote"),
 *             @OA\Property(property="profit_rate", type="number", format="float", example=20, description="The profit rate of the quote"),
 *             @OA\Property(property="note", type="string", example="Please confirm the details", description="Additional notes about the quote")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Successfully priced quote",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="string", example="Successfully price quote")
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Invalid input or unauthorized action",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="No input received")
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Invalid token",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Invalid token")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Error message")
 *         )
 *     )
 * )
 */
    public function pricing_quote(Request $request)
    {
        $input = json_decode($request->input('priced_quote'), true);
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
        try {
            $id = $decodedToken['id'];
        } catch (Throwable $e) {
            $id = $decodedToken->id;
        }
        $quote = DB::table('quote')->where('id', $input['quote_id'])->first();
        if ($quote->saleStaff_id != $id) {
            return response()->json([
                'error' => 'Your account isn\'t assigned to this quote'
            ], 403);
        }
        $product_price = 0;

        DB::beginTransaction();
        try {
            $quote = DB::table('quote')->where('id', $input['quote_id'])->first();
            if ($quote->quote_status_id < 2) {
                DB::rollBack();
                return response()->json([
                    'error' => 'The selected quote hasn\'t been assigned'
                ], 403);
            }
            if ($quote->quote_status_id == 3) {
                DB::rollBack();
                return response()->json([
                    'error' => 'The selected quote has already been priced'
                ], 403);
            }
            if ($quote->quote_status_id == 4) {
                DB::rollBack();
                return response()->json([
                    'error' => 'The selected quote has already been completed'
                ], 403);
            }
            if ($quote->quote_status_id >= 5) {
                DB::rollBack();
                return response()->json([
                    'error' => 'The selected quote has already been cancelled'
                ], 403);
            }
            DB::table('quote')->where('id', $input['quote_id'])->update([
                'note' => $input['note']
            ]);
            DB::table('product')->where('id', $quote->product_id)->update([
                'mounting_type_id' => $input['mounting_type_id'],
                'mounting_size' => $input['mounting_size']
            ]);
            if (isset($input['imageUrl']) && $input['imageUrl'] != null) {
                $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['imageUrl']));
                $destinationPath = public_path('image/Order/' . $quote->product_id);
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                $fileName = 'main.jpg';
                $files = File::allFiles($destinationPath);
                foreach ($files as $file) {
                    File::delete(public_path('image/Order/' . $quote->product_id) . '/' . $file->getBaseName());
                }
                file_put_contents($destinationPath . '/' . $fileName, $fileData);
                $imageUrl = $fileName;
                DB::table('product')->where('id', $quote->product_id)->update([
                    'imageUrl' => $imageUrl
                ]);
            }
            DB::table('product_diamond')->where('product_id', $quote->product_id)->delete();
            DB::table('product_metal')->where('product_id', $quote->product_id)->delete();
            if (isset($input['diamond_list']) && $input['diamond_list'] != null) {
                foreach ($input['diamond_list'] as $diamond1) {
                    $product_diamond = new Product_Diamond();
                    $diamond = DB::table('diamond')->where('id', $diamond1['diamond']['id'])->first();
                    if ($diamond->deactivated == true) {
                        DB::rollBack();
                        return response()->json([
                            'error' => 'One of the selected diamond is currently deactivated'
                        ], 403);
                    }
                    $product_diamond->product_id = $quote->product_id;
                    $product_diamond->diamond_id = $diamond1['diamond']['id'];
                    $product_diamond->count = $diamond1['count'];
                    $product_diamond->price = $diamond1['price'];
                    $product_diamond->diamond_shape_id = $diamond1['diamond_shape']['id'];
                    $product_diamond->status = true;
                    $product_price += $product_diamond->price;
                    $product_diamond->save();
                }
            }
            foreach ($input['metal_list'] as $metal1) {
                $product_metal = new Product_Metal();
                $metal = DB::table('metal')->where('id', $metal1['metal']['id'])->first();
                if ($metal->deactivated == true) {
                    DB::rollBack();
                    return response()->json([
                        'error' => 'One of the selected metal is currently deactivated'
                    ], 403);
                }
                $product_metal->product_id = $quote->product_id;
                $product_metal->metal_id = $metal1['metal']['id'];
                $product_metal->price = $metal1['price'];
                $product_metal->volume = $metal1['volume'];
                $product_metal->weight = $metal1['weight'];
                $product_metal->status = true;
                $product_price += $product_metal->price;
                $product_metal->save();
            }

            Quote::where('id', $input['quote_id'])->update([
                'production_price' => $input['production_price'],
                'profit_rate' => $input['profit_rate'],
                'product_price' => $product_price,
                'quote_status_id' => 3,
                'total_price' => ceil(($product_price) * ($input['profit_rate'] + 100) / 100 + $input['production_price'])
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }

        return response()->json([
            'success' => 'Successfully price quote'
        ], 201);
    }
    /**
 * @OA\Post(
 *     path="/api/admin/quote/approve_quote",
 *     tags={"Quote"},
 *     summary="Approve or decline a quote",
 *     description="This endpoint allows an account to approve or decline a quote.",
 *     @OA\RequestBody(
 *         required=true,
 *         description="Approval details for the quote",
 *         @OA\JsonContent(
 *             required={"quote_id", "approve"},
 *             @OA\Property(property="quote_id", type="integer", example=1, description="The ID of the quote"),
 *             @OA\Property(property="approve", type="boolean", example=true, description="Approval status of the quote"),
 *             @OA\Property(property="note", type="string", example="Approved with conditions", description="Additional notes about the approval")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Successfully approved or declined quote",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="string", example="Approve quote successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Invalid input or unauthorized action",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="No input received")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Error message")
 *         )
 *     )
 * )
 */
    public function approve_quote(Request $request)
    {
        $input = json_decode($request->input('approval'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }

        DB::beginTransaction();
        try {
            $quote = DB::table('quote')->where('id', $input['quote_id'])->first();
            if ($quote->quote_status_id < 3) {
                DB::rollBack();
                return response()->json([
                    'error' => 'The selected quote hasn\'t been priced'
                ], 403);
            }
            if ($quote->quote_status_id == 4) {
                DB::rollBack();
                return response()->json([
                    'error' => 'The selected quote has already been approved'
                ], 403);
            }
            if ($quote->quote_status_id == 5) {
                DB::rollBack();
                return response()->json([
                    'error' => 'The selected quote has already been cancelled'
                ], 403);
            }
            if ($input['approve'] || $input['approve'] == 1) {
                DB::table('quote')->where('id', $input['quote_id'])->update([
                    'quote_status_id' => 4,
                    'note' => $input['note']
                ]);
                DB::table('orders')->insert([
                    'product_id' => $quote->product_id,
                    'account_id' => $quote->account_id,
                    'deposit_has_paid' => 0,
                    'product_price' => $quote->product_price,
                    'profit_rate' => $quote->profit_rate,
                    'production_price' => $quote->production_price,
                    'total_price' => $quote->total_price,
                    'order_type_id' => 2,
                    'order_status_id' => 1,
                    'note' => $quote->note,
                    'saleStaff_id' => $quote->saleStaff_id,
                    'designStaff_id' => $quote->designStaff_id,
                    'productionStaff_id' => $quote->productionStaff_id,
                    'created' => Carbon::now()->format('Y-m-d H:i:s')
                ]);
            } else if (!$input['approve'] || $input['approve'] == 0) {
                DB::table('quote')->where('id', $input['quote_id'])->update([
                    'quote_status_id' => 2,
                    'note' => $input['note']
                ]);
                DB::commit();
                return response()->json([
                    'success' => 'Decline quote successfully'
                ], 201);
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Approve quote successfully'
        ], 201);
    }
    /**
 * @OA\Post(
 *     path="/api/quote/cancel",
 *     summary="Cancel a quote",
 *     tags={"Quote"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"quote_id", "note"},
 *             @OA\Property(property="quote_id", type="integer", example=1, description="ID of the quote to cancel"),
 *             @OA\Property(property="note", type="string", example="Customer requested cancellation", description="Reason for cancellation")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Cancel successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="string", example="Cancel successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Invalid input or unauthorized action",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="The selected quote has already been completed")
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Invalid token",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Invalid token")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Internal server error")
 *         )
 *     ),
 *     security={{ "apiAuth": {} }}
 * )
 */
    public function cancel(Request $request)
    {
        $input = json_decode($request->input('cancel'), true);
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
        try {
            $id = $decodedToken['id'];
        } catch (Throwable $e) {
            $id = $decodedToken->id;
        }
        $account = Account::find($id);
        if ($account->role_id != 1 && $account->role_id != 5) {
            return response()->json([
                'error' => 'Invalid user (User is unauthorized)'
            ], 500);
        }
        DB::beginTransaction();
        try {
            $quote = DB::table('quote')->where('id', $input['quote_id'])->first();
            if ($quote->quote_status_id == 4) {
                return response()->json([
                    'error' => 'The selected quote has already been completed'
                ], 403);
            }
            if ($quote->quote_status_id == 5) {
                return response()->json([
                    'error' => 'The selected quote has already been cancelled'
                ], 403);
            }
            DB::table('quote')->where('id', $input['quote_id'])->update([
                'quote_status_id' => 5,
                'note' => $input['note']
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Cancel successfully'
        ], 201);
    }
    /**
 * @OA\Post(
 *     path="/api/quote/get_assigned_quote_sale",
 *     summary="Get quotes assigned to a sales staff",
 *     tags={"Quote"},
 *     @OA\RequestBody(
 *         required=false,
 *         @OA\JsonContent(
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of assigned quotes",
 *         @OA\JsonContent(
 *             @OA\Property(property="quote_id", type="integer", example=1, description="ID of the quote"),
 *             @OA\Property(property="product", type="object", 
 *                 @OA\Property(property="id", type="integer", example=1, description="ID of the product"),
 *                 @OA\Property(property="imageUrl", type="string", example="http://example.com/image.jpg", description="URL of the product image"),
 *                 @OA\Property(property="mounting_type_id", type="integer", example=2, description="Mounting type ID of the product")
 *             ),
 *             @OA\Property(property="account", type="object", 
 *                 @OA\Property(property="id", type="integer", example=1, description="ID of the account"),
 *                 @OA\Property(property="name", type="string", example="John Doe", description="Name of the account owner"),
 *                 @OA\Property(property="imageUrl", type="string", example="http://example.com/account.jpg", description="URL of the account image"),
 *                 @OA\Property(property="dob", type="string", example="01/01/1990", description="Date of birth of the account owner")
 *             ),
 *             @OA\Property(property="quote_status", type="object", 
 *                 @OA\Property(property="id", type="integer", example=3, description="ID of the quote status"),
 *                 @OA\Property(property="status", type="string", example="Priced", description="Status of the quote")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Invalid token",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Invalid token")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Invalid user (User is unauthorized)")
 *         )
 *     ),
 *     security={{ "apiAuth": {} }}
 * )
 */
    public function get_assigned_quote_sale(Request $request)
    {
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
        try {
            $input = $decodedToken['id'];
        } catch (Throwable $e) {
            $input = $decodedToken->id;
        }
        $account = Account::find($input);
        if ($account->role_id != 2) {
            return response()->json([
                'error' => 'Invalid user (User is unauthorized)'
            ], 500);
        }

        $quote = DB::table('quote')->where('saleStaff_id', $input)->orderBy('quote_status_id','asc')->get();
        $quote->map(function ($quote) {
            $product = DB::table('product')->where('id', $quote->product_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('ORDER_URL');
            $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
            $quote->product = $product;
            unset($quote->product_id);

            $account = DB::table('account')->where('id', $quote->account_id)->first();
            $account->role = DB::table('role')->where('id', $account->role_id)->first();
            unset($account->role_id);
            if (!$account->google_id) {
                $OGurl = env('ORIGIN_URL');
                $url = env('ACCOUNT_URL');
                $account->imageUrl = $OGurl . $url . $account->id . '/' . $account->id . "/" . $account->imageUrl;
            }
            $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
            $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
            unset($account->password);
            $quote->account = $account;

            $quote->quote_status = DB::table('quote_status')->where('id', $quote->quote_status_id)->first();
            unset($quote->quote_status_id);
            return $quote;
        });
        return response()->json(
            $quote
        );
    }
    /**
 * @OA\Post(
 *     path="/api/quote/get_quote_detail",
 *     summary="Get detailed information about a specific quote",
 *     tags={"Quote"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"quote_id"},
 *             @OA\Property(property="quote_id", type="integer", example=1, description="ID of the quote")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Quote detail",
 *         @OA\JsonContent(
 *             @OA\Property(property="quote_detail", type="object",
 *                 @OA\Property(property="id", type="integer", example=1, description="ID of the quote"),
 *                 @OA\Property(property="created", type="string", example="12:00:00 01/01/2024", description="Creation timestamp of the quote"),
 *                 @OA\Property(property="product", type="object",
 *                     @OA\Property(property="id", type="integer", example=1, description="ID of the product"),
 *                     @OA\Property(property="imageUrl", type="string", example="http://example.com/product/1/image.jpg", description="URL of the product image"),
 *                     @OA\Property(property="mounting_type", type="object",
 *                         @OA\Property(property="id", type="integer", example=2, description="ID of the mounting type"),
 *                         @OA\Property(property="name", type="string", example="Prong", description="Name of the mounting type")
 *                     ),
 *                     @OA\Property(property="product_diamond", type="array",
 *                         @OA\Items(
 *                             @OA\Property(property="diamond", type="object",
 *                                 @OA\Property(property="id", type="integer", example=1, description="ID of the diamond"),
 *                                 @OA\Property(property="imageUrl", type="string", example="http://example.com/diamond/1/image.jpg", description="URL of the diamond image"),
 *                                 @OA\Property(property="created", type="string", example="12:00:00 01/01/2024", description="Creation timestamp of the diamond"),
 *                                 @OA\Property(property="diamond_color", type="object",
 *                                     @OA\Property(property="id", type="integer", example=1, description="ID of the diamond color"),
 *                                     @OA\Property(property="name", type="string", example="D", description="Color grade of the diamond")
 *                                 ),
 *                                 @OA\Property(property="diamond_origin", type="object",
 *                                     @OA\Property(property="id", type="integer", example=1, description="ID of the diamond origin"),
 *                                     @OA\Property(property="name", type="string", example="Russia", description="Origin of the diamond")
 *                                 ),
 *                                 @OA\Property(property="diamond_clarity", type="object",
 *                                     @OA\Property(property="id", type="integer", example=1, description="ID of the diamond clarity"),
 *                                     @OA\Property(property="name", type="string", example="VVS1", description="Clarity grade of the diamond")
 *                                 ),
 *                                 @OA\Property(property="diamond_cut", type="object",
 *                                     @OA\Property(property="id", type="integer", example=1, description="ID of the diamond cut"),
 *                                     @OA\Property(property="name", type="string", example="Excellent", description="Cut grade of the diamond")
 *                                 ),
 *                                 @OA\Property(property="diamond_shape", type="object",
 *                                     @OA\Property(property="id", type="integer", example=1, description="ID of the diamond shape"),
 *                                     @OA\Property(property="name", type="string", example="Round", description="Shape of the diamond")
 *                                 )
 *                             )
 *                         )
 *                     ),
 *                     @OA\Property(property="product_metal", type="array",
 *                         @OA\Items(
 *                             @OA\Property(property="metal", type="object",
 *                                 @OA\Property(property="id", type="integer", example=1, description="ID of the metal"),
 *                                 @OA\Property(property="imageUrl", type="string", example="http://example.com/metal/1/image.jpg", description="URL of the metal image"),
 *                                 @OA\Property(property="created", type="string", example="12:00:00 01/01/2024", description="Creation timestamp of the metal")
 *                             )
 *                         )
 *                     )
 *                 ),
 *                 @OA\Property(property="account", type="object",
 *                     @OA\Property(property="id", type="integer", example=1, description="ID of the account"),
 *                     @OA\Property(property="name", type="string", example="John Doe", description="Name of the account owner"),
 *                     @OA\Property(property="imageUrl", type="string", example="http://example.com/account/1/image.jpg", description="URL of the account image"),
 *                     @OA\Property(property="dob", type="string", example="01/01/1990", description="Date of birth of the account owner"),
 *                     @OA\Property(property="deactivated_date", type="string", example="01/01/2025", description="Deactivation date of the account"),
 *                     @OA\Property(property="role", type="object",
 *                         @OA\Property(property="id", type="integer", example=1, description="ID of the role"),
 *                         @OA\Property(property="name", type="string", example="Customer", description="Role of the account owner")
 *                     )
 *                 ),
 *                 @OA\Property(property="sale_staff", type="object",
 *                     @OA\Property(property="id", type="integer", example=2, description="ID of the sales staff"),
 *                     @OA\Property(property="name", type="string", example="Jane Doe", description="Name of the sales staff"),
 *                     @OA\Property(property="imageUrl", type="string", example="http://example.com/account/2/image.jpg", description="URL of the sales staff image"),
 *                     @OA\Property(property="dob", type="string", example="01/01/1985", description="Date of birth of the sales staff"),
 *                     @OA\Property(property="deactivated_date", type="string", example="01/01/2025", description="Deactivation date of the sales staff"),
 *                     @OA\Property(property="role", type="object",
 *                         @OA\Property(property="id", type="integer", example=2, description="ID of the role"),
 *                         @OA\Property(property="name", type="string", example="Sales Staff", description="Role of the sales staff")
 *                     ),
 *                     @OA\Property(property="order_count", type="integer", example=10, description="Number of orders managed by the sales staff")
 *                 ),
 *                 @OA\Property(property="design_staff", type="object",
 *                     @OA\Property(property="id", type="integer", example=3, description="ID of the design staff"),
 *                     @OA\Property(property="name", type="string", example="Alice Doe", description="Name of the design staff"),
 *                     @OA\Property(property="imageUrl", type="string", example="http://example.com/account/3/image.jpg", description="URL of the design staff image"),
 *                     @OA\Property(property="dob", type="string", example="01/01/1987", description="Date of birth of the design staff"),
 *                     @OA\Property(property="deactivated_date", type="string", example="01/01/2025", description="Deactivation date of the design staff"),
 *                     @OA\Property(property="role", type="object",
 *                         @OA\Property(property="id", type="integer", example=3, description="ID of the role"),
 *                         @OA\Property(property="name", type="string", example="Design Staff", description="Role of the design staff")
 *                     ),
 *                     @OA\Property(property="order_count", type="integer", example=5, description="Number of orders managed by the design staff")
 *                 ),
 *                 @OA\Property(property="production_staff", type="object",
 *                     @OA\Property(property="id", type="integer", example=4, description="ID of the production staff"),
 *                     @OA\Property(property="name", type="string", example="Bob Doe", description="Name of the production staff"),
 *                     @OA\Property(property="imageUrl", type="string", example="http://example.com/account/4/image.jpg", description="URL of the production staff image"),
 *                     @OA\Property(property="dob", type="string", example="01/01/1983", description="Date of birth of the production staff"),
 *                     @OA\Property(property="deactivated_date", type="string", example="01/01/2025", description="Deactivation date of the production staff"),
 *                     @OA\Property(property="role", type="object",
 *                         @OA\Property(property="id", type="integer", example=4, description="ID of the role"),
 *                         @OA\Property(property="name", type="string", example="Production Staff", description="Role of the production staff")
 *                     ),
 *                     @OA\Property(property="order_count", type="integer", example=15, description="Number of orders managed by the production staff")
 *                 ),
 *                 @OA\Property(property="quote_status", type="object",
 *                     @OA\Property(property="id", type="integer", example=1, description="ID of the quote status"),
 *                     @OA\Property(property="name", type="string", example="Pending", description="Name of the quote status")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="No input received",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="No input received")
 *         )
 *     )
 * )
 */
    public function get_quote_detail(Request $request)
    {
        $input = json_decode($request->input('quote_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No input received'
            ], 403);
        }
        $quote = DB::table('quote')->where('id', $input)->first();
        $quote->created = Carbon::parse($quote->created)->format('H:i:s d/m/Y');
        $product = DB::table('product')->where('id', $quote->product_id)->first();
        $OGurl = env('ORIGIN_URL');
        $url = env('ORDER_URL');
        $product->imageUrl = $OGurl . $url . $product->id . "/" . $product->imageUrl;
        $product->mounting_type = DB::table('mounting_type')->where('id', $product->mounting_type_id)->first();
        unset($product->mounting_type_id);

        $product_diamond = DB::table('product_diamond')->where('product_id', $product->id)->get();
        $product_diamond->map(function ($product_diamond) {
            $diamond = DB::table('diamond')->where('id', $product_diamond->diamond_id)->first();
            $diamond->created = Carbon::parse($diamond->created)->format('H:i:s d/m/Y');
            $OGurl = env('ORIGIN_URL');
            $url = env('DIAMOND_URL');
            $diamond->imageUrl = $OGurl . $url . $diamond->imageUrl;
            $diamond->diamond_color = DB::table('diamond_color')->where('id', $diamond->diamond_color_id)->first();
            $diamond->diamond_origin = DB::table('diamond_origin')->where('id', $diamond->diamond_origin_id)->first();
            $diamond->diamond_clarity = DB::table('diamond_clarity')->where('id', $diamond->diamond_clarity_id)->first();
            $diamond->diamond_cut = DB::table('diamond_cut')->where('id', $diamond->diamond_cut_id)->first();
            unset($diamond->diamond_color_id);
            unset($diamond->diamond_origin_id);
            unset($diamond->diamond_clarity_id);
            unset($diamond->diamond_cut_id);
            $product_diamond->diamond = $diamond;

            $product_diamond->diamond_shape = DB::table('diamond_shape')->where('id', $product_diamond->diamond_shape_id)->first();
            unset($product_diamond->diamond_id);
            unset($product_diamond->diamond_shape_id);
            return $product_diamond;
        });
        $product->product_diamond = $product_diamond;

        $product_metal = DB::table('product_metal')->where('product_id', $product->id)->get();
        $product_metal->map(function ($product_metal) {
            $metal = DB::table('metal')->where('id', $product_metal->metal_id)->first();
            $OGurl = env('ORIGIN_URL');
            $url = env('METAL_URL');
            $metal->created = Carbon::parse($metal->created)->format('H:i:s d/m/Y');
            $metal->imageUrl = $OGurl . $url . $metal->id . '/' . $metal->imageUrl;
            $product_metal->metal = $metal;
            unset($product_metal->metal_id);
            return $product_metal;
        });
        $product->product_metal = $product_metal;

        $quote->product = $product;
        unset($quote->product_id);

        $account = DB::table('account')->where('id', $quote->account_id)->first();
        $account->role = DB::table('role')->where('id', $account->role_id)->first();
        unset($account->role_id);
        if (!$account->google_id) {
            $OGurl = env('ORIGIN_URL');
            $url = env('ACCOUNT_URL');
            $account->imageUrl = $OGurl . $url . $account->id . "/" . $account->imageUrl;
        }
        $account->dob = Carbon::parse($account->dob)->format('d/m/Y');
        $account->deactivated_date = Carbon::parse($account->deactivated_date)->format('d/m/Y');
        unset($account->password);
        $quote->account = $account;
        unset($quote->account_id);

        $sale_staff = DB::table('account')->where('id', $quote->saleStaff_id)->first();
        $sale_staff->order_count = DB::table('orders')->where('saleStaff_id', $sale_staff->id)->whereNot('order_status_id', 1)->whereNot('order_status_id', 2)->count();
        $sale_staff->role = DB::table('role')->where('id', $sale_staff->role_id)->first();
        unset($sale_staff->role_id);
        if (!$sale_staff->google_id) {
            $OGurl = env('ORIGIN_URL');
            $url = env('ACCOUNT_URL');
            $sale_staff->imageUrl = $OGurl . $url . $sale_staff->id . "/" . $sale_staff->imageUrl;
        }
        $sale_staff->dob = Carbon::parse($sale_staff->dob)->format('d/m/Y');
        $sale_staff->deactivated_date = Carbon::parse($sale_staff->deactivated_date)->format('d/m/Y');
        unset($sale_staff->password);
        $quote->sale_staff = $sale_staff;
        unset($quote->saleStaff_id);

        $design_staff = DB::table('account')->where('id', $quote->designStaff_id)->first();
        $design_staff->order_count = DB::table('orders')->where('designStaff_id', $design_staff->id)->whereNot('order_status_id', 1)->whereNot('order_status_id', 2)->count();
        $design_staff->role = DB::table('role')->where('id', $design_staff->role_id)->first();
        unset($design_staff->role_id);
        if (!$design_staff->google_id) {
            $OGurl = env('ORIGIN_URL');
            $url = env('ACCOUNT_URL');
            $design_staff->imageUrl = $OGurl . $url . $design_staff->id . "/" . $design_staff->imageUrl;
        }
        $design_staff->dob = Carbon::parse($design_staff->dob)->format('d/m/Y');
        $design_staff->deactivated_date = Carbon::parse($design_staff->deactivated_date)->format('d/m/Y');
        unset($design_staff->password);
        $quote->design_staff = $design_staff;
        unset($quote->designStaff_id);

        $production_staff = DB::table('account')->where('id', $quote->productionStaff_id)->first();
        $production_staff->order_count = DB::table('orders')->where('productionStaff_id', $production_staff->id)->whereNot('order_status_id', 1)->whereNot('order_status_id', 2)->whereNot('order_status_id', 3)->count();
        $production_staff->role = DB::table('role')->where('id', $production_staff->role_id)->first();
        unset($production_staff->role_id);
        if (!$production_staff->google_id) {
            $OGurl = env('ORIGIN_URL');
            $url = env('ACCOUNT_URL');
            $production_staff->imageUrl = $OGurl . $url . $production_staff->id . "/" . $production_staff->imageUrl;
        }
        $production_staff->dob = Carbon::parse($production_staff->dob)->format('d/m/Y');
        $production_staff->deactivated_date = Carbon::parse($production_staff->deactivated_date)->format('d/m/Y');
        unset($production_staff->password);
        $quote->production_staff = $production_staff;
        unset($quote->productionStaff_id);

        $quote->quote_status = DB::table('quote_status')->where('id', $quote->quote_status_id)->first();
        unset($quote->quote_status_id);

        return response()->json([
            'quote_detail' => $quote
        ]);
    }
}
