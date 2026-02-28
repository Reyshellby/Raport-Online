<?php

namespace App\Http\Controllers;

use App\Models\student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = student::all();

        return response()->json([
            'status' => 'success',
            'data' => $data
        ], 200);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string',
            'nis' => 'required|unique:students,nis',
            'password' => 'required|min:8',
            'kelas_id' => 'required|exists:classes,id',
            'jurusan_id' => 'required|exists:majors,id'
        ]);

        $data = student::create($validated);

        return response()->json([
            'status' => 'success',
            'data' => $data
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'nis' => 'required',
            'password' => 'required|min:8',
        ]);

        $student = student::where('nis', $validated['nis'])->first();

        if (!$student || !Hash::check($validated['password'], $student->password)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Credential is invalid'
            ], 401);
        }

        $token = $student->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'token' => $token,
            'data' => $student
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'logout success'
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $nis)
    {
        $data = student::where('nis', $nis)->first();

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
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'password' => 'required|min:8',
        ]);

        $data = student::find($id);

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
    public function destroy(string $id)
    {
        $data = student::find($id);

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
