<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class score extends Model
{
    protected $fillable = [
        'siswa_id',
        'guru_id',
        'mapel_id',
        'nilai',
        'Periode_rapot',
        'keterangan'
    ];
}
