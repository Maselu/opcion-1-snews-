<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = Article::with('category')->orderBy('published_at', 'desc');

        // Filter by category name
        if ($request->has('category')) {
            $categoryName = $request->input('category');
            $query->whereHas('category', function ($q) use ($categoryName) {
                $q->where('name', $categoryName);
            });
        }

        // Limit results
        $limit = $request->input('limit', 10);

        if ($limit) {
            $articles = $query->limit($limit)->get();
            return response()->json(['data' => $articles]);
        }

        // Paginate if no limit
        $articles = $query->paginate(10);
        return response()->json($articles);
    }

    public function show($id)
    {
        // Return ALL comments in flat list for frontend tree building
        $article = Article::with([
            'category',
            'comments' => function ($query) {
                // Get ALL comments (not just root level)
                $query->with(['user', 'likes'])
                    ->orderBy('created_at', 'desc');
            }
        ])->findOrFail($id);

        return response()->json($article);
    }
}
