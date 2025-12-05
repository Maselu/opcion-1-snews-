<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Load user with counts
        $userData = User::where('id', $user->id)
            ->withCount(['comments', 'topics'])
            ->first();

        if (!$userData) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Calculate likes received on user's comments
        $likesReceived = $userData->comments()
            ->withCount('likes')
            ->get()
            ->sum('likes_count');

        return response()->json([
            'id' => $userData->id,
            'name' => $userData->name,
            'email' => $userData->email,
            'avatar_url' => $userData->avatar_url,
            'bio' => $userData->bio,
            'created_at' => $userData->created_at,
            'stats' => [
                'comments_count' => $userData->comments_count,
                'topics_count' => $userData->topics_count,
                'likes_received_count' => $likesReceived,
            ]
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'bio' => 'sometimes|string|max:1000',
            'avatar_url' => 'sometimes|url|max:500',
        ]);

        $userData = User::find($user->id);

        if (!$userData) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $userData->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $userData
        ]);
    }
}
