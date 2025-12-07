<?php

namespace App\Http\Controllers;

use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TopicController extends Controller
{
    public function index()
    {
        $topics = Topic::with(['user', 'article'])
            ->withCount('comments')
            ->latest()
            ->paginate(15);

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
        $topic = Topic::with([
            'user',
            'article',
            'comments' => function ($query) {
                $query->whereNull('parent_comment_id')
                    ->with(['user', 'likes', 'replies.user', 'replies.likes'])
                    ->orderBy('created_at', 'desc');
            }
        ])->findOrFail($id);

        return response()->json($topic);
    }

    public function update(Request $request, $id)
    {
        $topic = Topic::findOrFail($id);

        // Check if user owns the topic
        if ($topic->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
        ]);

        $topic->update($validated);

        return response()->json($topic);
    }

    public function destroy($id)
    {
        $topic = Topic::findOrFail($id);

        // Check if user owns the topic
        if ($topic->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $topic->delete();

        return response()->json(['message' => 'Topic deleted successfully']);
    }
}
