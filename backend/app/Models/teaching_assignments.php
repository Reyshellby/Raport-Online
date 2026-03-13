<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class teaching_assignments extends Model
{
    protected $fillable = ['guruId', 'mapelId', 'kelasId', 'tahunAjaranId'];
    public function guru()
    {
        return $this->belongsTo(teacher::class, 'guruId');
    }

    public function mapel()
    {
        return $this->belongsTo(subject::class, 'mapelId');
    }

    public function kelas()
    {
        return $this->belongsTo(classes::class, 'kelasId');
    }

    public function tahunAjaran()
    {
        return $this->belongsTo(academic_year::class, 'tahunAjaranId');
    }

    public function nilai()
    {
        return $this->hasMany(score::class, 'teaching_assignment_id');
    }
}
