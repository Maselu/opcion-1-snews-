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
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $topics]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
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
        // Devuelve TODOS los comentarios en una lista plana para la creación del árbol frontend
        // Este coincide con el comportamiento de ArticleController
        $topic = Topic::with([
            'user',
            'article',
            'comments' => function ($query) {
                // Obtiene TODOS los comentarios (no solo el nivel raíz)
                $query->with(['user', 'likes'])
                    ->orderBy('created_at', 'desc');
            }
        ])->findOrFail($id);

        return response()->json($topic);
    }

    public function update(Request $request, $id)
    {
        $topic = Topic::findOrFail($id);

        if ($topic->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $topic->update($validated);

        return response()->json($topic);
    }

    public function destroy($id)
    {
        $topic = Topic::findOrFail($id);

        if ($topic->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $topic->delete();

        return response()->json(['message' => 'Topic deleted']);
    }
}
