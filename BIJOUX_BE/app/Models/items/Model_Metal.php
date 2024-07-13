<?php

namespace App\Models\items;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * @OA\Schema(
 *     schema="ModelMetal",
 *     type="object",
 *     title="Model Metal",
 *     description="Model Metal model schema",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="model_id", type="integer", example=2),
 *     @OA\Property(property="metal_id", type="integer", example=3),
 *     @OA\Property(property="is_main", type="boolean", example=true),
 *     @OA\Property(property="percentage", type="integer", example=50),
 * )
 */
class Model_Metal extends Model
{
    use HasFactory;
    protected $table = 'model_metal';
    public $timestamps=false;
    protected $primarykey = 'id';
    protected $fillable = [
        'model_id',
        'metal_id',
        'is_main',
        'percentage'
    ];
}