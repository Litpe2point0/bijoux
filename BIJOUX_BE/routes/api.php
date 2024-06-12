<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\accounts\AccountController;
use App\Http\Controllers\items\ModelController;
use App\Http\Controllers\items\DiamondController;
use App\Http\Controllers\items\MetalController;
use App\Http\Controllers\orders\QuoteController;
use App\Http\Controllers\orders\OrderController;
use App\Http\Middleware\checkDeactivate;
use App\Http\Middleware\checkUserLogin;

Route::group(['prefix' => 'admin'], function () {

    Route::middleware('checkAdminLogin')->group(function () {
        Route::group(['prefix' => 'account'], function () {
            Route::post('/update', [AccountController::class, 'update']);
            Route::post('/get_staff_role_list', [AccountController::class, 'get_staff_role_list']);
            Route::post('/get_staff_list', [AccountController::class, 'get_staff_list']);
            Route::post('/get_account_list', [AccountController::class, 'get_account_list']);
            Route::post('/set_deactivate', [AccountController::class, 'set_deactivate'])->middleware(checkDeactivate::class);
        });

        Route::group(['prefix' => 'quote'], function () {
            Route::post('/get_quote_list', [QuoteController::class, 'get_quote_list_admin']);
            Route::post('/pricing_quote', [QuoteController::class, 'pricing_quote'])->middleware('checkSaleStaff');
            Route::post('/approve_quote', [QuoteController::class, 'approve_quote'])->middleware('checkManager');
            Route::post('/assign_quote', [QuoteController::class, 'assign_quote'])->middleware('checkManager');
            Route::post('/get_assigned_quote_sale', [QuoteController::class, 'get_assigned_quote_sale']);
        });

        Route::group(['prefix' => 'order'], function () {
            Route::post('/get_order_list', [OrderController::class, 'get_order_list_admin']);
            Route::post('/reassign_order', [OrderController::class, 'reassign_order'])->middleware('checkManager');
            Route::post('/get_assigned_staff', [OrderController::class, 'get_assigned_staff']);
            Route::post('/request_design_process ', [OrderController::class, 'request_design_process'])->middleware('checkDesignStaff');
            Route::post('/approve_design_process', [OrderController::class, 'approve_design_process'])->middleware('checkManager');
            Route::post('/cancel_design_process', [OrderController::class, 'cancel_design_process'])->middleware('checkManager');
            Route::post('/pricing_design_process', [OrderController::class, 'pricing_design_process'])->middleware('checkSaleStaff');
            Route::post('/get_design_process_list', [OrderController::class, 'get_design_process_list']);
            Route::post('/get_design_process_detail', [OrderController::class, 'get_design_process_detail']);
            Route::post('/add_design_updating', [OrderController::class, 'add_design_updating']);
            Route::post('/add_production_process', [OrderController::class, 'add_production_process'])->middleware('checkProductionStaff');
            Route::post('/production_complete', [OrderController::class, 'production_complete'])->middleware('checkProductionStaff');
            Route::post('/get_assigned_orders_sale', [OrderController::class, 'get_assigned_orders_sale']);
            Route::post('/get_assigned_orders_design ', [OrderController::class, 'get_assigned_orders_design']);
            Route::post('/get_assigned_orders_production ', [OrderController::class, 'get_assigned_orders_production']);
        });
    });
});


Route::group(['prefix' => 'items'], function () {
    Route::group(['prefix' => 'model'], function () {
        Route::post('/get_list', [ModelController::class, 'get_model_list']);
        Route::post('/get_detail', [ModelController::class, 'get_model_detail']);
        Route::post('/get_model_diamond', [ModelController::class, 'get_model_diamond']);
        Route::post('/get_model_shape', [ModelController::class, 'get_model_shape']);
        Route::post('/get_model_metal', [ModelController::class, 'get_model_metal']);
        Route::post('/get_mounting_type_list', [ModelController::class, 'get_mounting_type_list']);
        Route::post('/get_mounting_style_list', [ModelController::class, 'get_mounting_style_list']);
        Route::post('/get_final_checkout', [ModelController::class, 'get_final_checkout']);

        Route::middleware('checkManager')->group(function () {
            Route::post('/add', [ModelController::class, 'add']);
            Route::post('/set_deactivate', [ModelController::class, 'set_deactivate']);
            Route::post('/update', [ModelController::class, 'update']);
            Route::post('/set_available', [ModelController::class, 'set_available']);
            Route::post('/set_model_stone_size', [ModelController::class, 'set_model_stone_size']);
            Route::post('/get_missing_image', [ModelController::class, 'get_missing_image']);
        });
    });

    Route::group(['prefix' => 'metal'], function () {
        Route::post('/get_list', [MetalController::class, 'get_list']);
        Route::post('/get_detail', [MetalController::class, 'get_detail']);
        Route::post('/get_weight_price', [MetalController::class, 'get_weight_price']);
        Route::post('/get_metal_is_main', [MetalController::class, 'get_metal_is_main']);
        Route::post('/get_metal_compatibility', [MetalController::class, 'get_metal_compatibility']);

        Route::middleware('checkManager')->group(function () {
            Route::post('/add', [MetalController::class, 'add']);
            Route::post('/update_price', [MetalController::class, 'update_price']);
            Route::post('/set_deactivate', [MetalController::class, 'set_deactivate']);
        });
    });

    Route::group(['prefix' => 'diamond'], function () {
        Route::post('/get_diamond_list', [DiamondController::class, 'get_diamond_list']);
        Route::post('/get_diamond_detail', [DiamondController::class, 'get_diamond_detail']);
        Route::post('/get_shape_list', [DiamondController::class, 'get_shape_list']);
        Route::post('/get_size_list', [DiamondController::class, 'get_size_list']);
        Route::post('/get_clarity_list', [DiamondController::class, 'get_clarity_list']);
        Route::post('/get_cut_list', [DiamondController::class, 'get_cut_list']);
        Route::post('/get_color_list', [DiamondController::class, 'get_color_list']);
        Route::post('/get_diamond_origin_list', [DiamondController::class, 'get_diamond_origin_list']);

        Route::middleware('checkManager')->group(function () {
            Route::post('/set_deactivate', [DiamondController::class, 'set_deactivate']);
            Route::post('/update_price', [DiamondController::class, 'update_price']);
        });
    });
});


Route::group([], function () {
    Route::post('/login', [AccountController::class, 'login']);
    Route::post('/login_with_google', [AccountController::class, 'login_with_google']);
    Route::post('/logout', [AccountController::class, 'logout']);
    Route::post('/register', [AccountController::class, 'register']);

    Route::middleware('checkUserLogin')->group(function () {
        Route::group(['prefix' => 'account'], function () {
            Route::post('/update', [AccountController::class, 'update_self']);
            Route::post('/get_account_detail', [AccountController::class, 'get_account_detail']);
        });

        Route::group(['prefix' => 'quote'], function () {
            Route::post('/get_quote_list', [QuoteController::class, 'get_quote_list_customer']);
            Route::post('/get_quote_status_list', [QuoteController::class, 'get_quote_status_list']);
            Route::post('/get_quote_detail', [QuoteController::class, 'get_quote_detail']);
            Route::post('/add_quote', [QuoteController::class, 'add_quote']);
            Route::post('/cancel', [QuoteController::class, 'cancel']);
        });

        Route::group(['prefix' => 'order'], function () {
            Route::post('/add_order_template', [OrderController::class, 'add_order_template']);
            Route::post('/get_order_list', [OrderController::class, 'get_order_list_customer']);
            Route::post('/get_order_detail', [OrderController::class, 'get_order_detail']);
            Route::post('/get_order_status_list', [OrderController::class, 'get_order_status_list']);
            Route::post('/get_order_type_list', [OrderController::class, 'get_order_type_list']);
            Route::post('/cancel', [OrderController::class, 'cancel_order']);
            Route::post('/get_production_status_list', [OrderController::class, 'get_production_status_list']);
            Route::post('/get_design_process_status_list', [OrderController::class, 'get_design_process_status_list']);
            Route::post('/get_design_updating_list', [OrderController::class, 'get_design_updating_list']);
            Route::post('/get_production_process_list', [OrderController::class, 'get_production_process_list']);
            Route::post('/get_product_detail', [OrderController::class, 'get_product_detail']);
        });
    });
});

// "DMMM"
Route::get('/confirm_payment', [OrderController::class, 'confirm_payment']);
// Route::post('/decode', [AccountController::class, 'decode']);
// Route::get('/get_image', [AccountController::class, 'get_image']);
