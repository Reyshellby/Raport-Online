<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class teaching_assignments extends Model
{
    protected $fillable = ['guruId', 'mapelId', 'kelasId', 'tahunAjaranId'];
    public function guru()
    {
        return $this->belongsTo(teacher::class);
    }

    public function mapel()
    {
        return $this->belongsTo(subject::class);
    }

    public function kelas()
    {
        return $this->belongsTo(classes::class);
    }

    public function tahunAjaran()
    {
        return $this->belongsTo(academic_year::class);
    }
}
