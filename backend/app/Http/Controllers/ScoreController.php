<?php

namespace App\Http\Controllers;

use App\Models\score;
use App\Models\teaching_assignments;
use App\Models\student;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ScoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getAllAssignmentForTeacher()
    {
        $teacherId = Auth::guard('teachers')->id();
        $assignments = teaching_assignments::with(['mapel', 'kelas', 'tahunAjaran'])
            ->where('guruId', $teacherId)
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'mapel' => $a->mapel->name,
                    'kelas' => $a->kelas->name,
                    'tahun_ajaran' => $a->tahunAjaran->name
                ];
            })->groupBy('tahun_ajaran')->sortKeysDesc();

        return response()->json([
            'status' => 'success',
            'data' => $assignments
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function storeScoreForTeacher(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|exists:students,id',
            'semester' => 'required|integer|min:1|max:2',
            'kategori' => 'required|in:PTS,PAS',
            'nilai' => 'required|integer|min:0|max:100',
            'keterangan' => 'nullable|string',
        ]);

        $teacherId = Auth::guard('teachers')->id();

        $assignment = teaching_assignments::where('guruId', $teacherId)
            ->where('mapelId', $request->mapel_id)
            ->where('kelasId', $request->kelas_id)
            ->where('tahunAjaranId', $request->tahun_ajaran_id)
            ->first();

        if (!$assignment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak berhak mengisi nilai untuk mapel/kelas/tahun ajaran ini.'
            ], 403);
        }

        $student = student::findOrFail($request->siswa_id);
        if ($student->kelas_id != $assignment->kelasId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Siswa tidak berada di kelas ini.'
            ], 403);
        }

        $existingScore = score::where('siswa_id', $request->siswa_id)
            ->where('teaching_assignment_id', $assignment->id)
            ->where('semester', $request->semester)
            ->where('kategori', $request->kategori)
            ->first();

        if ($existingScore) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nilai untuk siswa ini di semester & kategori ini sudah ada.'
            ], 409);
        }

        // Buat nilai baru
        $score = score::create([
            'siswa_id' => $request->siswa_id,
            'teaching_assignment_id' => $assignment->id,
            'semester' => $request->semester,
            'kategori' => $request->kategori,
            'nilai' => $request->nilai,
            'keterangan' => $request->keterangan ?? null
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Nilai berhasil disimpan.',
            'data' => $score
        ]);
    }

    public function getMyScores(Request $request)
    {
        $request->validate([
            'semester' => 'required|integer|min:1|max:2',
            'kategori' => 'required|in:PTS,PAS'
        ]);

        $studentId = Auth::guard('students')->id();

        // Ambil semua score siswa beserta info mapel & assignment
        $scores = score::with(['assignment.mapel'])
            ->where('siswa_id', $studentId)
            ->where('semester', $request->semester)
            ->where('kategori', $request->kategori)
            ->get()
            ->map(function($score) {
                return [
                    'mapel' => $score->assignment->mapel->nama_mapel,
                    'nilai' => $score->nilai,
                    'keterangan' => $score->keterangan
                ];
            });

        return response()->json([
            'status' => 'success',
            'semester' => $request->semester,
            'kategori' => $request->kategori,
            'data' => $scores
        ]);
    }
}
