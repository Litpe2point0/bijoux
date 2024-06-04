<?php

namespace App\Models\orders;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    use HasFactory;
    protected $table = 'quote';
    public $timestamps=false;
    protected $primarykey = 'id';
    protected $fillable = [
        'product_id',
        'account_id',
        'product_price',
        'profit_rate',
        'production_price',
        'total_price',
        'quote_status_id',
        'note',
        'saleStaff_id',
        'designStaff_id',
        'productionStaff_id',
        'created'
    ];
}
