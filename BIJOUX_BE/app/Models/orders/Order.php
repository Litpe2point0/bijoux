<?php

namespace App\Models\orders;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
