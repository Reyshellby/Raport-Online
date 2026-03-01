<?php

namespace App\Http\Controllers;

use App\Models\teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getAllTeacher()
    {
        $data = teacher::all();

        return response()->json([
            'status' => 'success',
            'data' => $data
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function registerTeacher(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string',
            'nip' => 'required|unique:teachers,nip',
            'password' => 'required|min:8',
        ]);

        $data = teacher::create($validated);

        return response()->json([
            'status' => 'success',
            'data' => $data
        ], 201);
    }

    public function loginTeacher(Request $request)
    {
        $validated = $request->validate([
            'nip' => 'required',
            'password' => 'required|min:8',
        ]);

        $teacher = teacher::where('nip', $validated['nip'])->first();

        if (!$teacher || !Hash::check($validated['password'], $teacher->password)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Credential is invalid'
            ], 401);
        }

        $token = $teacher->createToken('Teacher_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'token' => $token,
            'data' => $teacher
        ], 200);
    }

    public function logoutTeacher(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'logout success'
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function updatePasswordTeacher(Request $request, string $id)
    {
        $validated = $request->validate([
            'password' => 'required|min:8',
        ]);

        $data = teacher::find($id);

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
    public function destroyTeacher(string $id)
    {
        $data = teacher::find($id);

        if (!$data) {
            return response()->json([
                'status' => 'failed',
                'message' => 'data not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Teacher has been delete'
        ], 200);
    }
}
