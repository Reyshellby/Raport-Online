<?php

namespace App\Http\Controllers;

use App\Models\classes;
use Illuminate\Http\Request;

class ClassesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = classes::all();

        return response()->json([
            'status' => 'success',
            'data' => $data
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kelas' => 'required|string',
            'tingkat_kelas' => 'required|between:10,12',
            'tahun_angkatan' => 'required|integer|min:1945',
        ]);

        $data = classes::create($validated);

        return response()->json([
            'status' => 'success',
            'data' => $data
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $classes)
    {
        // $data = classes::where('nama_kelas', $classes)->first();

        // if(!$data) {
        //     return response()->json([
        //         'status' => 'failed',
        //         'message' => 'data not found'
        //     ], 404);
        // }

        // return response()->json([
        //     'status' => 'success',
        //     'data' => $data
        // ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'nama_kelas' => 'required|string',
            'tingkat_kelas' => 'required|between:10,12',
            'tahun_angkatan' => 'required|integer|min:1945',
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
            'status' => 'success',
            'data' => $data
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
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
            'message' => 'data has been delete'
        ], 200);
    }
}
