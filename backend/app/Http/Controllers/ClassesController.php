<?php

namespace App\Http\Controllers;

use App\Models\classes;
use Carbon\Carbon;
use Illuminate\Http\Request;

use function Symfony\Component\Clock\now;

class ClassesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getAllClasses()
    {
        $data = classes::with('major')->get();

        return response()->json([
            'status' => 'success',
            'data' => $data
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function createClasses(Request $request)
    {
        $validated = $request->validate([
            'nama_kelas' => 'required|string',
            'tingkat_kelas' => 'required|in:X,XI,XII',
            'major_id' => 'required|exists:majors,id',
            'tahun_angkatan' => 'required|integer|min:1945|max:' . (Carbon::now()->year + 1),
        ]);

        $data = classes::create([
            'nama_kelas' => $validated['nama_kelas'],
            'tingkat_kelas' => $validated['tingkat_kelas'],
            'jurusan_id' => $validated['major_id'],
            'tahun_angkatan' => $validated['tahun_angkatan'],
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $data
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function showClasses(string $classes)
    {
        $data = classes::where('nama_kelas', $classes)->first();

        if(!$data) {
            return response()->json([
                'status' => 'failed',
                'message' => 'data not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $data
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateClasses(Request $request, string $id)
    {
        $validated = $request->validate([
            'nama_kelas' => 'required|string',
            'tingkat_kelas' => 'required|in:X,XI,XII',
        ]);

        $data = classes::find($id);

        if(!$data) {
            return response()->json([
                'status' => 'failed',
                'message' => 'data not found'
            ], 404);
        }

        $data->update($validated);

        return response()->json([
            'status' => 'updated',
            'data' => $data
        ], 200);
    }
 
    /**
     * Remove the specified resource from storage.
     */
    public function destroyClasses(string $id)
    {
        $data = classes::find($id);

        if(!$data) {
            return response()->json([
                'status' => 'failed',
                'message' => 'data not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Class has been delete'
        ], 200);
    }

    /**
     * Get students by class ID.
     */
    public function getStudentsByClass(string $id)
    {
        $class = classes::find($id);

        if (!$class) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Class not found'
            ], 404);
        }

        $students = $class->students()->orderBy('nama')->get(['id', 'nama', 'nis']);

        return response()->json([
            'status' => 'success',
            'data' => $students
        ], 200);
    }
}

