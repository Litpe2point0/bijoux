<?php

namespace App\Models\items;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * @OA\Schema(
 *     schema="Diamond",
 *     type="object",
 *     title="Diamond",
 *     description="Diamond model schema",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="size", type="float", example=1.5),
 *     @OA\Property(property="imageUrl", type="string", example="http://example.com/image.jpg"),
 *     @OA\Property(property="diamond_color_id", type="integer", example=2),
 *     @OA\Property(property="diamond_clarity_id", type="integer", example=3),
 *     @OA\Property(property="diamond_cut_id", type="integer", example=4),
 *     @OA\Property(property="diamond_origin_id", type="integer", example=5),
 *     @OA\Property(property="price", type="float", example=1000.0),
 *     @OA\Property(property="deactivated", type="boolean", example=false),
 *     @OA\Property(property="created", type="string", format="date-time", example="2023-01-01T00:00:00.000Z")
 * )
 */
class Diamond extends Model
{
    use HasFactory;
    protected $table = 'diamond';
    public $timestamps=false;
    protected $primarykey = 'id';
    protected $fillable = [
        'size',
        'imageUrl',
        'diamond_color_id',
        'diamond_clarity_id',
        'diamond_cut_id',
        'diamond_origin_id',
        'price',
        'deactivated',
        'created'
    ];
}