<?php

namespace App\Models\items;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * @OA\Schema(
 *     schema="ProductDiamond",
 *     type="object",
 *     title="Product Diamond",
 *     description="Product Diamond model schema",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="product_id", type="integer", example=2),
 *     @OA\Property(property="diamond_id", type="integer", example=3),
 *     @OA\Property(property="diamond_shape_id", type="integer", example=4),
 *     @OA\Property(property="count", type="integer", example=5),
 *     @OA\Property(property="price", type="number", format="float", example=100.5),
 *     @OA\Property(property="status", type="integer", example=1),
 * )
 */
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
        'status'
    ];
}
