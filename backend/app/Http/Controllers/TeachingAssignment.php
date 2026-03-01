<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\teaching_assignments;

class TeachingAssignment extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getAllAssignmentForAdmin()
    {
        $assignments = teaching_assignments::with(['guru', 'mapel', 'kelas', 'tahunAjaran'])->get();


        $result = $assignments->map(function ($item) {
            return [
                'guru' => $item->guru->nama,
                'mapel' => $item->mapel->nama_mapel,
                'kelas' => $item->kelas->nama_kelas,
                'tahun_ajaran' => $item->tahunAjaran->nama_tahun,
            ];
        })->groupBy('tahun_ajaran')->sortKeysDesc();

        return response()->json([
            'status' => 'success',
            'data' => $result
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function createAssignment(Request $request)
    {
        $validated = $request->validate([
            'guruId' => 'required|exists:teachers,id',
            'mapelId' => 'required|exists:subjects,id',
            'kelasId' => 'required|exists:classes,id',
            'tahunAjaranId' => 'required|exists:academic_years,id'
        ]);

        $data = teaching_assignments::create($validated);

        return response()->json([
            'status' => 'success',
            'data' => $data
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateAssignment(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroyAssignment(string $id)
    {
        $data = teaching_assignments::find($id);

        if (!$data) {
            return response()->json([
                'status' => 'failed',
                'message' => 'data not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Assignment has been delete'
        ], 200);
    }
}
