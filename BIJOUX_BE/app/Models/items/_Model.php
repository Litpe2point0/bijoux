<?php

namespace App\Models\items;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="Model",
 *     type="object",
 *     title="Model",
 *     description="Item Model schema",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Ring"),
 *     @OA\Property(property="imageUrl", type="string", example="http://example.com/image.jpg"),
 *     @OA\Property(property="mounting_type_id", type="integer", example=2),
 *     @OA\Property(property="mounting_style_id", type="integer", example=3),
 *     @OA\Property(property="base_width", type="float", example=1.5),
 *     @OA\Property(property="base_height", type="float", example=1.0),
 *     @OA\Property(property="volume", type="float", example=5.0),
 *     @OA\Property(property="production_price", type="float", example=500.0),
 *     @OA\Property(property="profit_rate", type="float", example=0.2),
 *     @OA\Property(property="isAvailable", type="boolean", example=true),
 *     @OA\Property(property="deactivated", type="boolean", example=false)
 * )
 */
class _Model extends Model
{
    use HasFactory;
    protected $table = 'model';
    public $timestamps = false;
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