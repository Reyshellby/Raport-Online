<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\student;
use App\Models\classes;
use App\Models\major;
use App\Models\academic_year;
use App\Models\subject;
use App\Models\teacher;
use App\Models\teaching_assignments;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'username' => 'admin',
            'email' => 'test@gmail.com',
            'password' => 'herry123'
        ]);

        // 1. Create Majors (Jurusan)
        $ipa = major::create(['nama_jurusan' => 'IPA']);
        $ips = major::create(['nama_jurusan' => 'IPS']);
        $bahasa = major::create(['nama_jurusan' => 'Bahasa']);

        // 2. Create Academic Years
        $tahunAjaran = academic_year::create(['nama_tahun' => '2025/2026']);

        // 3. Create Classes (Kelas)
        $class1 = classes::create(['nama_kelas' => 'XII-A', 'jurusan_id' => $ipa->id, 'tahun_angkatan' => 2025]);
        $class2 = classes::create(['nama_kelas' => 'XII-B', 'jurusan_id' => $ips->id, 'tahun_angkatan' => 2025]);
        $class3 = classes::create(['nama_kelas' => 'XII-C', 'jurusan_id' => $bahasa->id, 'tahun_angkatan' => 2025]);

        // 4. Create Students (Siswa) - dengan NIS tertentu untuk testing
        $siswa1 = student::create([
            'nama' => 'Andi Mahendra',
            'nis' => '001',
            'password' => Hash::make('password123'),
            'kelas_id' => $class1->id,
            'jurusan_id' => $ipa->id,
        ]);

        $siswa2 = student::create([
            'nama' => 'Budi Santoso',
            'nis' => '002',
            'password' => Hash::make('password456'),
            'kelas_id' => $class1->id,
            'jurusan_id' => $ipa->id,
        ]);

        $siswa3 = student::create([
            'nama' => 'Citra Dewi',
            'nis' => '003',
            'password' => Hash::make('password789'),
            'kelas_id' => $class2->id,
            'jurusan_id' => $ips->id,
        ]);

        $siswa4 = student::create([
            'nama' => 'Doni Pratama',
            'nis' => '004',
            'password' => Hash::make('pass1234'),
            'kelas_id' => $class3->id,
            'jurusan_id' => $bahasa->id,
        ]);

        // 5. Create Subjects (Mata Pelajaran)
        $matematika = subject::create(['nama_mapel' => 'Matematika']);
        $bahasa_indonesia = subject::create(['nama_mapel' => 'Bahasa Indonesia']);
        $bahasa_inggris = subject::create(['nama_mapel' => 'Bahasa Inggris']);
        $fisika = subject::create(['nama_mapel' => 'Fisika']);
        $kimia = subject::create(['nama_mapel' => 'Kimia']);
        $sejarah = subject::create(['nama_mapel' => 'Sejarah']);

        // 6. Create Teachers (Guru)
        $guru1 = teacher::create([
            'nama' => 'Ibu Siti Nurhaliza',
            'nip' => '19800115200812001',
            'password' => Hash::make('guru123'),
        ]);

        $guru2 = teacher::create([
            'nama' => 'Bapak Ahmad Wijaya',
            'nip' => '19750320199003001',
            'password' => Hash::make('guru456'),
        ]);

        $guru3 = teacher::create([
            'nama' => 'Ibu Rini Handayani',
            'nip' => '19820410200502002',
            'password' => Hash::make('guru789'),
        ]);

        // 7. Create Teaching Assignments (Penugasan Mengajar)
        $assignment1 = teaching_assignments::create([
            'guruId' => $guru1->id,
            'mapelId' => $matematika->id,
            'kelasId' => $class1->id,
            'tahunAjaranId' => $tahunAjaran->id,
        ]);

        $assignment2 = teaching_assignments::create([
            'guruId' => $guru2->id,
            'mapelId' => $bahasa_inggris->id,
            'kelasId' => $class1->id,
            'tahunAjaranId' => $tahunAjaran->id,
        ]);

        $assignment3 = teaching_assignments::create([
            'guruId' => $guru3->id,
            'mapelId' => $fisika->id,
            'kelasId' => $class1->id,
            'tahunAjaranId' => $tahunAjaran->id,
        ]);
    }
}
