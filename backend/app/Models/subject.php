<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class subject extends Model
{
    protected $fillable = ['nama_mapel'];

    public function assignments()
    {
        return $this->hasMany(teaching_assignments::class, 'mapelId');
    }
}
