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
        Schema::create('scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('teaching_assignment_id')->constrained('teaching_assignments')->onDelete('cascade');
            $table->tinyInteger('semester');
            $table->enum('kategori', ['PTS', 'PAS']);
            $table->integer('nilai')->unsigned();
            $table->text('keterangan')->nullable();
            $table->unique([
                'siswa_id',
                'teaching_assignment_id',
                'semester',
                'kategori'
            ]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scores');
    }
};
