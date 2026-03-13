<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class classes extends Model
{
    protected $fillable = ['nama_kelas', 'tingkat_kelas', 'tahun_angkatan', 'jurusan_id'];

    public function major(): BelongsTo
    {
        return $this->belongsTo(major::class, 'jurusan_id');
    }

    public function students(): HasMany
    {
        return $this->hasMany(student::class, 'kelas_id');
    }
}
