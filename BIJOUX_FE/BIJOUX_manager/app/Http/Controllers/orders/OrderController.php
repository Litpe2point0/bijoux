<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function get_list(){

    }
    public function update_order_customize(Request $request){

    }
    public function update_order_template(Request $request){

    }
    public function cancel(Request $request){

    }
    public function get_detail(Request $request){

    }
    public function confirm_payment(Request $request){

    }
    public function get_assigned_staff(Request $request){

    }
    public function get_assigned_order_sale(Request $request){

    }
    public function get_assigned_order_design(Request $request){

    }
    public function get_assigned_order_production(Request $request){

    }
    public function request_design_process(Request $request){

    }
    public function approve_design_process(Request $request){
        //sale và manager đều xài cái này, sale có thể thêm trường production_price, còn manager chỉ có thể xem
    }
    public function get_design_process_list(Request $request){

    }
    public function add_design_updating(Request $request){

    }
    public function get_design_updating_list(Request $request){

    }
    public function get_production_status_list(){

    }
    public function add_production_process(Request $request){

    }
    public function get_production_process_list(Request $request){

    }
    public function design_complete(Request $request){

    }
    public function production_complete(Request $request){
        
    }
}
