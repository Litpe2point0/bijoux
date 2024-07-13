<?php

namespace App\Models\items;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * @OA\Schema(
 *     schema="Metal",
 *     type="object",
 *     title="Metal",
 *     description="Metal model schema",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Gold"),
 *     @OA\Property(property="buy_price_per_gram", type="float", example=50.0),
 *     @OA\Property(property="sale_price_per_gram", type="float", example=80.0),
 *     @OA\Property(property="imageUrl", type="string", example="http://example.com/image.jpg"),
 *     @OA\Property(property="specific_weight", type="float", example=19.32),
 *     @OA\Property(property="deactivated", type="boolean", example=false),
 *     @OA\Property(property="created", type="string", format="date-time", example="2023-01-01T00:00:00.000Z")
 * )
 */
class Metal extends Model
{
    use HasFactory;
    protected $table = 'metal';
    public $timestamps=false;
    protected $primarykey = 'id';
    protected $fillable = [
        'name',
        'buy_price_per_gram',
        'sale_price_per_gram',
        'imageUrl',
        'specific_weight',
        'deactivated',
        'created'
    ];
}
