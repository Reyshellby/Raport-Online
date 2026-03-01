<?php

namespace App\Http\Controllers;

use App\Models\academic_year;
use Illuminate\Http\Request;

class AcademicYear extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getAllAcademicYear()
    {
        $data = academic_year::all();

        return response()->json([
            'status' => 'success',
            'data' => $data
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function createAcademicYear(Request $request)
    {
        $validated = $request->validate([
            'nama_tahun' => 'required|string|unique:academic_years,nama_tahun',
            'is_active' => 'required|boolean',
        ]);

        $data = academic_year::create($validated);

        return response()->json([
            'status' => 'success',
            'data' => $data
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function showAcademicYear(string $academic_year)
    {
        $data = academic_year::where('nama_tahun', $academic_year)->first();

        if (!$data) {
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
    public function updateStatusAcademicYear(Request $request, string $id)
    {
        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $data = academic_year::find($id);

        if (!$data) {
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
    public function destroyAcademicYear(string $id)
    {
        $data = academic_year::find($id);

        if (!$data) {
            return response()->json([
                'status' => 'failed',
                'message' => 'data not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Academic Year has been delete'
        ], 200);
    }
}
