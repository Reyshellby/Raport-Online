<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class score extends Model
{
    protected $fillable = [
        'siswa_id',
        'teaching_assignment_id',
        'semester',
        'kategori',
        'nilai',
        'keterangan'
    ];

    public function siswa()
    {
        return $this->belongsTo(student::class);
    }

    public function assignment()
    {
        return $this->belongsTo(teaching_assignments::class);
    }
}
