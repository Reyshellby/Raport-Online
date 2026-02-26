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
            $table->foreignId('mapel_id')->constrained('majors')->onDelete('cascade');
            $table->foreignId('guru_id')->constrained('teachers')->onDelete('cascade');
            $table->integer('nilai')->unsigned();
            $table->enum('Periode_rapot', ['PTS S1', 'PAS S1', 'PTS S2', 'PAS S2']);
            $table->text('keterangan')->nullable();
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
