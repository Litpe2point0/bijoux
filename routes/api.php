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
            Route::post('/deactivate', [AccountController::class, 'deactivate'])->middleware(checkDeactivate::class);
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
            Route::post('/request_design_process ', [QuoteController::class, 'request_design_process']);
            Route::post('/approve_design_process', [OrderController::class, 'approve_design_process']);
            Route::post('/repricing_design_process', [OrderController::class, 'repricing_design_process']);
            Route::post('/confirm_payment', [OrderController::class, 'confirm_payment']);
            Route::post('/get_assigned_orders_sale', [OrderController::class, 'get_assigned_orders_sale']);
            Route::post('/get_assigned_orders_design ', [OrderController::class, 'get_assigned_orders_design']);
            Route::post('/get_assigned_orders_production ', [OrderController::class, 'get_assigned_orders_production']);
        });
    });
});


Route::group(['prefix' => 'items'], function () {
    Route::group(['prefix' => 'model'], function () {
        Route::post('/get_model_list', [ModelController::class, 'get_model_list']);
        Route::post('/get_detail', [ModelController::class, 'get_model_detail']);
        Route::post('/get_model_diamond', [ModelController::class, 'get_model_diamond']);
        Route::post('/get_model_shape', [ModelController::class, 'get_model_shape']);
        Route::post('/get_model_metal', [ModelController::class, 'get_model_metal']);
        Route::post('/get_mounting_type_list', [ModelController::class, 'get_mounting_type_list']);
        Route::post('/get_mounting_style_list', [ModelController::class, 'get_mounting_style_list']);

        Route::middleware('checkManager')->group(function () {
            Route::post('/add', [ModelController::class, 'add']);
            Route::post('/deactivate', [ModelController::class, 'deactivate']);
            Route::post('/delete', [ModelController::class, 'delete']);
            Route::post('/update', [ModelController::class, 'update']);
            Route::post('/set_available', [ModelController::class, 'set_available']);
            Route::post('/set_model_stone_size', [ModelController::class, 'set_model_stone_size']);
            Route::post('/get_missing_image', [ModelController::class, 'get_missing_image']);
            Route::post('/set_model_diamond', [ModelController::class, 'set_model_diamond']);
            Route::post('/set_model_shape', [ModelController::class, 'set_model_shape']);
            Route::post('/set_model_metal', [ModelController::class, 'set_model_metal']);
        });
    });

    Route::group(['prefix' => 'metal'], function () {
        Route::post('/get_metal_list', [MetalController::class, 'get_metal_list']);
        Route::post('/get_metal_detail', [MetalController::class, 'get_metal_detail']);

        Route::middleware('checkManager')->group(function () {
            Route::post('/add', [MetalController::class, 'add']);
            Route::post('/deactivate', [MetalController::class, 'deactivate']);
            Route::post('/update', [MetalController::class, 'update']);
        });
    });

    Route::group(['prefix' => 'diamond'], function () {
        Route::post('/get_diamond_list', [DiamondController::class, 'get_diamond_list']);
        Route::post('/get_diamond_detail', [DiamondController::class, 'get_diamond_detail']);
        Route::post('/get_shape_list', [DiamondController::class, 'get_shape_list']);
        Route::post('/get_shape_detail', [DiamondController::class, 'get_shape_detail']);

        Route::middleware('checkManager')->group(function () {
            Route::post('/deactivate', [DiamondController::class, 'deactivate']);
            Route::post('/update', [DiamondController::class, 'update']);
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
            Route::post('/get_final_template', [QuoteController::class, 'get_final_template']);
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
            Route::post('/get_design_updating_list', [OrderController::class, 'get_design_updating_list']);
            Route::post('/get_production_process_list', [OrderController::class, 'get_production_process_list']);
            Route::post('/get_product_detail', [OrderController::class, 'get_product_detail']);
        });
    });
});


    // Route::get('/get_account_list', [AccountController::class, 'get_account_list']);
    // Route::get('/get_staff_list', [AccountController::class, 'get_staff_list']);
    // Route::get('/get_staff_role_list', [AccountController::class, 'get_staff_role_list']);
    Route::get('/get_image', [AccountController::class, 'get_image']);
