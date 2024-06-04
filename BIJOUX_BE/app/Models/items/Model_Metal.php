<?php

namespace App\Models\items;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Model_Metal extends Model
{
    use HasFactory;
    protected $table = 'model_metal';
    public $timestamps=false;
    protected $primarykey = 'id';
    protected $fillable = [
        'model_id',
        'metal_id',
        'is_main',
        'percentage'
    ];
}