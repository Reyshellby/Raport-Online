<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class student extends Authenticatable
{
    use HasApiTokens;
    protected $guarded = [];
    protected $hidden = ['password'];
    protected $casts = ['password' => 'hashed'];
}
