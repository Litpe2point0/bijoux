<?php

namespace App\Models\items;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $table = 'product';
    public $timestamps=false;
    protected $primarykey = 'id';
    protected $fillable = [
        'imageUrl',
        'mounting_type_id',
        'model_id',
        'mounting_size'
    ];
}
