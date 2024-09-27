<?php

namespace App\Models\accounts;

use App\Models\accounts\Account;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;
    protected $table = 'role';
    public $timestamps=false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'name',
    ];

    // public function account()
    // {
    //     return $this->hasMany(Account::class);
    // }
    public function accounts()
    {
        return $this->hasMany(Account::class, 'role_id', 'id');
    }
}