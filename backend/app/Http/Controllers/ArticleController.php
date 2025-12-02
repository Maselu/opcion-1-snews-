<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = Article::with('category');

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $articles = $query->orderBy('published_at', 'desc')->paginate(10);

        return response()->json($articles);
    }

    public function show($id)
    {
        $article = Article::with(['category', 'comments.user', 'comments.replies.user', 'comments.likes'])
            ->findOrFail($id);

        return response()->json($article);
    }
}
