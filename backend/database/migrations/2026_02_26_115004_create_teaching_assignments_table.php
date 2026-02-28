<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('teaching_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guruId')->constrained('teachers')->onDelete('cascade'); 
            $table->foreignId('mapelId')->constrained('subjects')->onDelete('cascade');
            $table->foreignId('kelasId')->constrained('classes')->onDelete('cascade');
            $table->foreignId('tahunAjaranId')->constrained('academic_years')->onDelete('cascade');
            $table->unique([
                'guruId',
                'mapelId',
                'kelasId',
                'tahunAjaranId'
            ]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teaching_assignments');
    }
};
