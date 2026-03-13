<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class major extends Model
{
    protected $fillable = ['nama_jurusan'];

    public function classes(): HasMany
    {
        return $this->hasMany(classes::class, 'jurusan_id');
    }
}
