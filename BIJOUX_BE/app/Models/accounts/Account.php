<?php

namespace App\Models\accounts;

use App\Models\accounts\Role;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;


class Account extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    public $timestamps = false;
    protected $table = 'account';
        protected $primaryKey = 'id';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'fullname',
        'imageUrl',
        'email',
        'password',
        'phone',
        'dob',
        'address',
        'deactivated',
        'deactivated_date',
        'google_id',
        'role_id',
        'status',
        'created',
        'security_code'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }
    public function getJWTCustomClaims()
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'role_id' => $this->role_id,
            'fullname' => $this->fullname,
            'phone' => $this->phone,
            'address' => $this->address
        ];
    }

    // public function role()
    // {
    //     return $this->belongsTo(Role::class);
    // }
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'id');
    }
}
