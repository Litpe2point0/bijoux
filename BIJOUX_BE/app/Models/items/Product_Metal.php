<?php

namespace App\Models\items;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * @OA\Schema(
 *     schema="ProductMetal",
 *     type="object",
 *     title="Product Metal",
 *     description="Product Metal model schema",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="product_id", type="integer", example=2),
 *     @OA\Property(property="metal_id", type="integer", example=3),
 *     @OA\Property(property="volume", type="number", format="float", example=10.5),
 *     @OA\Property(property="weight", type="number", format="float", example=5.2),
 *     @OA\Property(property="status", type="integer", example=1),
 *     @OA\Property(property="price", type="number", format="float", example=500.75),
 * )
 */
class Product_Metal extends Model
{
    use HasFactory;
    protected $table = 'product_metal';
    public $timestamps=false;
    protected $primarykey = 'id';
    protected $fillable = [
        'product_id',
        'metal_id',
        'volume',
        'weight',
        'status',
        'price'
    ];
}
