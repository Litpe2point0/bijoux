<?php

namespace App\Models\items;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * @OA\Schema(
 *     schema="ModelDiamondShape",
 *     type="object",
 *     title="Model Diamond Shape",
 *     description="Model Diamond Shape model schema",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="model_id", type="integer", example=2),
 *     @OA\Property(property="diamond_shape_id", type="integer", example=3),
 * )
 */
class Model_DiamondShape extends Model
{
    use HasFactory;
    protected $table = 'model_diamondshape';
    public $timestamps=false;
    protected $fillable = [
        'model_id',
        'diamond_shape_id'
    ];
}