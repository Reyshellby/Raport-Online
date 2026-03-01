<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getAllAdmin()
    {
        $data = User::all();

        return response()->json([
            'data' => $data
        ]);
    }

    public function UpdateRole(Request $request, string $id)
    {
        $validated = $request->validate([
            'role' => 'required|in:admin,superAdmin',
        ]);

        $data = User::find($id);

        if (!$data) {
            return response()->json([
                'status' => 'failed',
                'message' => 'data not found'
            ], 404);
        }

        $data->update([
            'role' => $validated['role']
        ]);

        return response()->json([
            'status' => 'Role updated',
            'data' => $data
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateCredentialAdmin(Request $request, string $id)
    {
        $validated = $request->validate([
            'password' => 'required|min:8',
            'username' => 'required|string',
        ]);

        $data = User::find($id);

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
        $admin = User::find($id);

        if (!$admin) {
            return response()->json([
                'status' => 'failed',
                'message' => 'data not found'
            ], 404);
        }

        $admin->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Admin has been delete'
        ], 200);
    }

    public function registerAdmin(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string',
            'email' => 'required|unique:users,email|email',
            'password' => 'required|min:8',
        ]);

        $data = User::create($validated);

        return response()->json([
            'status' => 'success',
            'data' => $data
        ], 201);
    }

    public function loginAdmin(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);

        $Admin = User::where('username', $validated['username'])->first();

        if (!$Admin || !Hash::check($validated['password'], $Admin->password) || $Admin->email != $validated['email']) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Credential is invalid'
            ], 401);
        }

        $token = $Admin->createToken('Admin_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'token' => $token,
            'data' => $Admin
        ], 200);
    }

    public function logoutAdmin(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'logout success'
        ], 200);
    }
}
