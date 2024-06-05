<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class QuoteController extends Controller
{
    public function get_final_template(Request $request){

    }
    public function get_quote_list(Request $request){

    }
    public function add_quote_template(Request $request){
        //customer tạo quote
    }
    public function add_quote_customize(Request $request){
        //customer tạo quote
    }
    public function assigned_quote_template(Request $request){
        //manage vừa assign vừa approve
    }
    public function assigned_quote_customize(Request $request){
        //manage vừa assign vừa approve
    }
    public function approve_quote_template(Request $request){
        //cả sale và manager đều xài cái này, khi sale approve thì có thêm các trường còn manager thì chỉ đc xem và khi manager duyệt xong tự động tạo order
    }
    public function approve_quote_customize(Request $request){
        //cả sale và manager đều xài cái này, khi sale approve thì có thêm các trường còn manager thì chỉ đc xem và khi manager duyệt xong tự động tạo order
    }
    public function get_assigned_quote_sale(Request $request){
        
    }
}
