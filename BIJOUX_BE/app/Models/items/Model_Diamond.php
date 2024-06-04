<?php

namespace App\Models\items;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Model_Diamond extends Model
{
    use HasFactory;
    protected $table = 'model_diamond';
    public $timestamps=false;
    protected $primarykey = 'id';
    protected $fillable = [
        'model_id',
        'diamond_size_min',
        'diamond_size_max',
        'count',
        'diamond_shape_id',
        'Is_editable'
    ];
}