<?php

namespace App\Http\Controllers;

use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TopicController extends Controller
{
    public function index()
    {
        $topics = Topic::with('user')->orderBy('created_at', 'desc')->paginate(15);
        return response()->json($topics);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'article_id' => 'nullable|exists:articles,id',
        ]);

        $topic = Topic::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'description' => $request->description,
            'article_id' => $request->article_id,
        ]);

        return response()->json($topic, 201);
    }

    public function show($id)
    {
        $topic = Topic::with(['user', 'comments.user'])->findOrFail($id);
        return response()->json($topic);
    }
}
