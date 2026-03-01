<?php

namespace App\Http\Controllers;

use App\Models\subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getAllSubject()
    {
        $data = subject::all();

        return response()->json([
            'status' => 'success',
            'data' => $data
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function createSubject(Request $request)
    {
        $validated = $request->validate([
            'nama_mapel' => 'required|string',
        ]);

        $data = subject::create($validated);

        return response()->json([
            'status' => 'success',
            'data' => $data
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function showSubject(string $subject)
    {
        $data = subject::where('nama_mapel', $subject)->first();

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
    public function updateSubject(Request $request, string $id)
    {
         $validated = $request->validate([
            'nama_mapel' => 'required|string',
        ]);

        $data = subject::find($id);

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
    public function destroySubject(string $id)
    {
        $data = subject::find($id);

        if(!$data) {
            return response()->json([
                'status' => 'failed',
                'message' => 'data not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Subject has been delete'
        ], 200);
    }
}
