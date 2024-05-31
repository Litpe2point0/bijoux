<?php

namespace App\Http\Controllers\items;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DiamondController extends Controller
{
    public function get_diamond_list(Request $request){
        $input = json_decode($request->input('new_model'), true);
        
    }
    public function deactivate(Request $request){

    }
    public function update(Request $request){

    }
    public function get_diamond_detail(Request $request){

    }
    public function get_shape_list(){

    }
    public function get_shape_detail(Request $request){
        
    }
    public function get_diamond_origin(Request $request){
        
    }
    public function get_color_list(Request $request){
        
    }
}
