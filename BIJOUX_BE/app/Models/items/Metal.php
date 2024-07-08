<?php

namespace App\Models\items;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
