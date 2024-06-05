<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\accounts\AccountController;
use App\Http\Controllers\ModelController;
use App\Http\Controllers\StoneController;
use App\Http\Controllers\MetalController;
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\OrderController;
use App\Http\Middleware\checkUserLogin;

Route::post('/login', [AccountController::class, 'login']);
    Route::get('/logout', [AccountController::class, 'logout']);

Route::group(['prefix' => 'admin'], function () {

    

    Route::middleware('checkAdminLogin')->group(function () {
        Route::group(['prefix' => 'account'], function () {
            Route::post('/get_staff_list', [AccountController::class, 'get_staff_list']);
            Route::post('/get_account_list', [AccountController::class, 'get_account_list']);
            Route::get('/get_staff_role_list', [AccountController::class, 'get_staff_role_list']);
            Route::get('/get_account_detail', [AccountController::class, 'get_account_detail']);
            Route::post('/update', [AccountController::class, 'update']);
        });

        Route::group(['prefix' => 'items'], function () {
            Route::group(['prefix' => 'model'], function () {
                Route::post('/add', [ModelController::class, 'add']);
                Route::post('/deactivate', [ModelController::class, 'deactivate']);
                Route::post('/delete', [ModelController::class, 'delete']);
                Route::post('/update', [ModelController::class, 'update']);
                Route::post('/set_available', [ModelController::class, 'set_available']);
                Route::post('/get_list', [ModelController::class, 'get_list']);
                Route::post('/get_detail', [ModelController::class, 'get_detail']);
                Route::get('/get_missing_image', [ModelController::class, 'get_missing_image']);
            });

            Route::group(['prefix' => 'metal'], function () {
                Route::post('/add', [MetalController::class, 'add']);
                Route::post('/deactivate', [MetalController::class, 'deactivate']);
                Route::post('/update', [MetalController::class, 'update']);
                Route::get('/get_list', [MetalController::class, 'get_list']);
                Route::post('/get_detail', [MetalController::class, 'get_detail']);
            });

            Route::group(['prefix' => 'stone'], function () {
                Route::post('/deactivate', [StoneController::class, 'deactivate']);
                Route::post('/update', [StoneController::class, 'update']);
                Route::post('/get_stone_list', [StoneController::class, 'get_stone_list']);
                Route::post('/get_stone_detail', [StoneController::class, 'get_stone_detail']);
                Route::get('/get_shape_list', [StoneController::class, 'get_shape_list']);
                Route::post('/get_shape_detail', [StoneController::class, 'get_shape_detail']);
            });
        });

        Route::group(['prefix' => 'quote'], function () {
            Route::get('/get_final_template', [QuoteController::class, 'get_final_template']);
            Route::post('/get_list', [QuoteController::class, 'get_list']);
            Route::post('/approve_template', [QuoteController::class, 'approve_template']);
            Route::post('/approve_customize', [QuoteController::class, 'approve_customize']);
            Route::post('/assigned_quote_template', [QuoteController::class, 'assigned_quote_template']);
            Route::post('/assigned_quote_customize', [QuoteController::class, 'assigned_quote_customize']);
        });

        Route::group(['prefix' => 'order'], function () {
            Route::post('/get_list', [OrderController::class, 'get_list']);
            Route::post('/get_detail', [OrderController::class, 'get_detail']);
            Route::post('/update_customize', [OrderController::class, 'update_customize']);
            Route::post('/update_template', [OrderController::class, 'update_template']);
            Route::post('/cancel', [OrderController::class, 'cancel']);
            Route::get('/get_assigned_staff', [OrderController::class, 'get_assigned_staff']);
            Route::get('/get_production_process_list', [OrderController::class, 'get_production_process_list']);
            Route::get('/get_production_status_list', [OrderController::class, 'get_production_status_list']);
            Route::post('/get_design_process_list', [OrderController::class, 'get_design_process_list']);
            Route::post('/approve_design_process', [OrderController::class, 'approve_design_process']);
        });
    });
});

Route::group(['prefix' => 'designer'], function () {
    Route::post('/login', [AccountController::class, 'login']);
    Route::get('/logout', [AccountController::class, 'logout']);

    Route::middleware('checkDesignLogin')->group(function () {
        Route::group(['prefix' => 'account', 'middleware' => 'checkDesignerLogin'], function () {
            Route::post('/update', [AccountController::class, 'update']);
            Route::post('/get_account_detail', [AccountController::class, 'get_account_detail']);
        });

        Route::group(['prefix' => 'orders'], function () {
            Route::post('/get_detail', [OrderController::class, 'get_detail']);
            Route::post('/get_assgined_order_design', [OrderController::class, 'get_assgined_order_design']);
            Route::post('/request_design_process', [OrderController::class, 'request_design_process']);
            Route::post('/get_design_process_list', [OrderController::class, 'get_design_process_list']);
            Route::post('/add_design_updating', [OrderController::class, 'add_design_updating']);
            Route::post('/design_complete', [OrderController::class, 'design_complete'])->middleware('checkCompleteCondition');
            Route::get('/get_complete_order_list', [OrderController::class, 'get_complete_order_list']);
        });
    });
});

Route::group(['prefix' => 'production'], function () {
    Route::post('/login', [AccountController::class, 'login']);
    Route::get('/logout', [AccountController::class, 'logout']);

    Route::middleware('checkProductionLogin')->group(function () {
        Route::group(['prefix' => 'account'], function () {
            Route::post('/update', [AccountController::class, 'update']);
            Route::post('/get_account_detail', [AccountController::class, 'get_account_detail']);
        });

        Route::group(['prefix' => 'orders'], function () {
            Route::post('/get_detail', [OrderController::class, 'get_detail']);
            Route::post('/get_assigned_order_production', [OrderController::class, 'get_assigned_order_production']);
            Route::get('/get_production_status_list', [OrderController::class, 'get_production_status_list']);
            Route::get('/get_production_process_list', [OrderController::class, 'get_production_process_list']);
            Route::post('/add_production_process', [OrderController::class, 'get_design_process_list']);
            Route::post('/production_complete', [OrderController::class, 'production_complete'])->middleware('checkCompleteCondition');
            Route::get('/get_complete_order_list', [OrderController::class, 'get_complete_order_list']);
        });
    });
});

Route::group(['prefix' => 'sale'], function () {
    Route::post('/login', [AccountController::class, 'login']);
    Route::get('/logout', [AccountController::class, 'logout']);

    Route::middleware('checkSaleLogin')->group(function () {
        Route::group(['prefix' => 'account'], function () {
            Route::get('/get_account_list', [AccountController::class, 'get_account_list']);
            Route::get('/get_staff_role_list', [AccountController::class, 'get_staff_role_list']);
            Route::post('/get_account_detail', [AccountController::class, 'get_account_detail']);
            Route::post('/update', [AccountController::class, 'update']);
            Route::post('/deactivate', [AccountController::class, 'deactivate']);
        });

        Route::group(['prefix' => 'quotes'], function () {
            Route::post('/get_list', [OrderController::class, 'get_list']);
            Route::post('/get_detail', [OrderController::class, 'get_detail']);
            Route::post('/approve_template', [QuoteController::class, 'approve_template']);
            Route::post('/approve_customize', [QuoteController::class, 'approve_customize']);
            Route::post('/get_assigned_quote_sale', [QuoteController::class, 'get_assigned_quote_sale']);
        });

        Route::group(['prefix' => 'orders'], function () {
            Route::post('/get_list', [OrderController::class, 'get_list']);
            Route::post('/get_detail', [OrderController::class, 'get_detail']);
            Route::post('/confirm_payment', [OrderController::class, 'confirm_payment']);
            Route::post('/get_design_process_list', [OrderController::class, 'get_design_process_list']);
            Route::post('/approve_design_process', [OrderController::class, 'approve_design_process']);
            Route::post('/get_assigned_order_sale', [OrderController::class, 'get_assigned_order_sale']);
            Route::get('/get_complete_order_list', [OrderController::class, 'get_complete_order_list']);
        });
    });
});


Route::group([], function () {
    Route::post('/login', [AccountController::class, 'login']);
    Route::post('/login_with_google', [AccountController::class, 'login_with_google']);
    Route::get('/logout', [AccountController::class, 'logout']);
    Route::post('/register', [AccountController::class, 'register']);

    Route::get('/get_account_list', [AccountController::class, 'get_account_list']);
    Route::get('/get_staff_list', [AccountController::class, 'get_staff_list']);
    Route::get('/get_staff_role_list', [AccountController::class, 'get_staff_role_list']);

    Route::middleware('checkUserLogin')->group(function () {
        Route::group(['prefix' => 'account'], function () {
            Route::post('/update', [AccountController::class, 'update']);
            Route::get('/get_account_detail', [AccountController::class, 'get_account_detail']);
        });

        Route::group(['prefix' => 'items'], function () {
            Route::group(['prefix' => 'model'], function () {
                Route::get('/get_list', [ModelController::class, 'get_list']);
                Route::get('/get_detail', [ModelController::class, 'get_detail']);
            });

            Route::group(['prefix' => 'metal'], function () {
                Route::get('/get_list', [MetalController::class, 'get_list']);
                Route::get('/get_detail', [MetalController::class, 'get_detail']);
            });

            Route::group(['prefix' => 'stone'], function () {
                Route::post('/get_stone_list', [StoneController::class, 'get_stone_list']);
                Route::get('/get_stone_detail', [StoneController::class, 'get_stone_detail']);
                Route::get('/get_shape_list', [StoneController::class, 'get_shape_list']);
                Route::get('/get_shape_detail', [StoneController::class, 'get_shape_detail']);
            });
        });

        Route::group(['prefix' => 'quotes'], function () {
            Route::post('/get_list', [QuoteController::class, 'get_list']);
            Route::get('/get_detail', [QuoteController::class, 'get_detail']);
            Route::post('/get_final_template', [QuoteController::class, 'get_final_template']);
            Route::post('/add_quote_template', [QuoteController::class, 'add_quote_template']);
            Route::post('/add_quote_customize', [QuoteController::class, 'add_quote_customize']);
        });

        Route::group(['prefix' => 'orders'], function () {
            Route::post('/get_list', [OrderController::class, 'get_list']);
            Route::get('/get_detail', [OrderController::class, 'get_detail']);
            Route::get('/get_production_status_list', [OrderController::class, 'get_production_status_list']);
            Route::post('/get_design_updating_list', [OrderController::class, 'get_design_updating_list']);
            Route::post('/get_production_process_list', [OrderController::class, 'get_production_process_list']);
        });
    });
});
