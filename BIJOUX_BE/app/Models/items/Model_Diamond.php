<?php

namespace App\Models\items;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * @OA\Schema(
 *     schema="ModelDiamond",
 *     type="object",
 *     title="Model Diamond",
 *     description="Model Diamond model schema",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="model_id", type="integer", example=2),
 *     @OA\Property(property="diamond_size_min", type="float", example=1.0),
 *     @OA\Property(property="diamond_size_max", type="float", example=2.0),
 *     @OA\Property(property="count", type="integer", example=5),
 *     @OA\Property(property="diamond_shape_id", type="integer", example=3),
 *     @OA\Property(property="is_editable", type="boolean", example=true),
 * )
 */
class Model_Diamond extends Model
{
    use HasFactory;
    protected $table = 'model_diamond';
    public $timestamps=false;
    protected $primarykey = 'id';
    protected $fillable = [
        'model_id',
        'diamond_size_min',
        'diamond_size_max',
        'count',
        'diamond_shape_id',
        'is_editable'
    ];
}