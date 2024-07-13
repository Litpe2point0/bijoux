<?php

namespace App\Models\orders;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * @OA\Schema(
 *     schema="Order",
 *     type="object",
 *     title="Order",
 *     description="Order model schema",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="product_id", type="integer", example=2),
 *     @OA\Property(property="account_id", type="integer", example=3),
 *     @OA\Property(property="deposit_has_paid", type="boolean", example=true),
 *     @OA\Property(property="product_price", type="number", format="float", example=1000.0),
 *     @OA\Property(property="profit_rate", type="number", format="float", example=0.2),
 *     @OA\Property(property="production_price", type="number", format="float", example=800.0),
 *     @OA\Property(property="total_price", type="number", format="float", example=1200.0),
 *     @OA\Property(property="order_type_id", type="integer", example=1),
 *     @OA\Property(property="order_status_id", type="integer", example=2),
 *     @OA\Property(property="note", type="string", example="Special instructions for the order"),
 *     @OA\Property(property="saleStaff_id", type="integer", example=4),
 *     @OA\Property(property="designStaff_id", type="integer", example=5),
 *     @OA\Property(property="productionStaff_id", type="integer", example=6),
 *     @OA\Property(property="created", type="string", format="date-time", example="2024-07-14T10:30:00Z"),
 *     @OA\Property(property="delivery_date", type="string", format="date", example="2024-07-20"),
 *     @OA\Property(property="guarantee_expired_date", type="string", format="date", example="2025-07-20"),
 * )
 */
class Order extends Model
{
    use HasFactory;
    protected $table = 'orders';
    public $timestamps=false;
    protected $primarykey = 'id';
    protected $fillable = [
        'product_id',
        'account_id',
        'deposit_has_paid',
        'product_price',
        'profit_rate',
        'production_price',
        'total_price',
        'order_type_id',
        'order_status_id',
        'note',
        'saleStaff_id',
        'designStaff_id',
        'productionStaff_id',
        'created',
        'delivery_date',
        'guarantee_expired_date'
    ];
}
