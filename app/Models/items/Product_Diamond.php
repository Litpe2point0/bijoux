<?php

namespace App\Models\items;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product_Diamond extends Model
{
    use HasFactory;
    protected $table = 'product_diamond';
    public $timestamps=false;
    protected $primarykey = 'id';
    protected $fillable = [
        'product_id',
        'diamond_id',
        'diamond_shape_id',
        'count',
        'price',
        'isAccepted'
    ];
}
