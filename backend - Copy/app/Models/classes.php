<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class classes extends Model
{
    protected $fillable = ['nama_kelas', 'tingkat_kelas', 'tahun_angkatan', 'jurusan_id'];
}
