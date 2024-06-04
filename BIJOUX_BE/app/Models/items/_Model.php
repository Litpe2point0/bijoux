<?php

namespace App\Models\items;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class _Model extends Model
{
    use HasFactory;
    protected $table = 'model';
    public $timestamps=false;
    protected $primarykey = 'id';
    protected $fillable = [
        'name',
        'imageUrl',
        'mounting_type_id',
        'mounting_style_id',
        'base_width',
        'base_height',
        'volume',
        'production_price',
        'profit_rate',
        'isAvailable',
        'deactivated'
    ];
}