<?php

namespace App\Models\items;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Diamond extends Model
{
    use HasFactory;
    protected $table = 'diamond';
    public $timestamps=false;
    protected $primarykey = 'id';
    protected $fillable = [
        'size',
        'diamond_color_id',
        'diamond_clarity_id',
        'diamond_cut_id',
        'diamond_origin_id',
        'price',
        'deactivated',
        'created'
    ];
}