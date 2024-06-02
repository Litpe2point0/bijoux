<?php

namespace App\Models\items;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product_Metal extends Model
{
    use HasFactory;
    protected $table = 'product_metal';
    public $timestamps=false;
    protected $fillable = [
        'product_id',
        'metal_id',
        'volume',
        'weight',
        'status',
        'price'
    ];
}
