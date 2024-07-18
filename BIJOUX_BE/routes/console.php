<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Schedule::call(function(){
    // DB::table('orders')->whereNotNull('delivery_date')->where('order_status_id',5)->where('delivery_date', '<=', Carbon::now()->subDays(3))->update([
    //     'order_status_id' => 6
    // ]);
    DB::table('orders')->whereNotNull('delivery_date')->where('order_status_id',5)->where('delivery_date', '<=', Carbon::now()->subMinute())->update([
        'order_status_id' => 6
    ]);
    echo('Đã xong rồi em');
})->everyFiveMinutes();