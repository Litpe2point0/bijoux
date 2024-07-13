<?php

namespace App\Models\accounts;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;


/**
 * @OA\Schema(
 *     schema="Account",
 *     type="object",
 *     title="Account",
 *     description="Account model",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="username", type="string", example="johndoe"),
 *     @OA\Property(property="fullname", type="string", example="John Doe"),
 *     @OA\Property(property="imageUrl", type="string", example="http://example.com/image.jpg"),
 *     @OA\Property(property="email", type="string", example="john.doe@example.com"),
 *     @OA\Property(property="phone", type="string", example="123-456-7890"),
 *     @OA\Property(property="dob", type="string", format="date", example="1990-01-01"),
 *     @OA\Property(property="address", type="string", example="123 Main St"),
 *     @OA\Property(property="deactivated", type="boolean", example=false),
 *     @OA\Property(property="deactivated_date", type="string", format="date-time", example="2023-01-01T00:00:00.000Z"),
 *     @OA\Property(property="google_id", type="string", example="1234567890"),
 *     @OA\Property(property="role_id", type="integer", example=5),
 *     @OA\Property(property="status", type="integer", example=1),
 *     @OA\Property(property="created", type="string", format="date-time", example="2023-01-01T00:00:00.000Z"),
 *     @OA\Property(property="security_code", type="string", example="123456"),
 * )
 */
class Account extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    public $timestamps = false;
    protected $table = 'account';
    protected $primarykey = 'id';
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
}
