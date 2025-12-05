<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function user(Request $request)
    {
        $user = $request->user()->loadCount(['comments', 'likes', 'topics']);
        return response()->json($user);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|uuid',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'avatar_url' => 'nullable|url|max:500',
        ]);

        try {
            $user = User::create([
                'id' => $validated['id'],
                'name' => $validated['name'],
                'email' => $validated['email'],
                'avatar_url' => $validated['avatar_url'] ?? null,
                'bio' => '',
            ]);

            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to register user',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
