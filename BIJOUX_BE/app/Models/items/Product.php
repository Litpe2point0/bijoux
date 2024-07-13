<?php

namespace App\Models\items;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * @OA\Schema(
 *     schema="Product",
 *     type="object",
 *     title="Product",
 *     description="Product model schema",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="imageUrl", type="string", example="https://example.com/image.jpg"),
 *     @OA\Property(property="mounting_type_id", type="integer", example=2),
 *     @OA\Property(property="model_id", type="integer", example=3),
 *     @OA\Property(property="mounting_size", type="string", example="small"),
 * )
 */
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
