<?php

namespace App\Models\items;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Model_DiamondShape extends Model
{
    use HasFactory;
    protected $table = 'model_diamondshape';
    public $timestamps=false;
    protected $fillable = [
        'model_id',
        'diamond_shape_id'
    ];
}