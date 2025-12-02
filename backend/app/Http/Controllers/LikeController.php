<?php

namespace App\Http\Controllers;

use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller
{
    public function toggle($commentId)
    {
        $userId = Auth::id();

        $like = Like::where('user_id', $userId)
            ->where('comment_id', $commentId)
            ->first();

        if ($like) {
            $like->delete();
            return response()->json(['liked' => false]);
        } else {
            Like::create([
                'user_id' => $userId,
                'comment_id' => $commentId,
            ]);
            return response()->json(['liked' => true]);
        }
    }
}
