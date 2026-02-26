<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class student extends Authenticatable
{
    use HasApiTokens;
    protected $fillable = ['nama', 'nis', 'password', 'kelas_id', 'jurusan_id'];
    protected $hidden = ['password'];
    protected $casts = ['password' => 'hashed'];
}
