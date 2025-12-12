<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = Article::with('category')->orderBy('published_at', 'desc');

        // Filtrar por nombre de categoría
        if ($request->has('category')) {
            $categoryName = $request->input('category');
            $query->whereHas('category', function ($q) use ($categoryName) {
                $q->where('name', $categoryName);
            });
        }

        // Limitar resultados
        $limit = $request->input('limit', 10);

        if ($limit) {
            $articles = $query->limit($limit)->get();
            return response()->json(['data' => $articles]);
        }

        // Paginar si no hay límite
        $articles = $query->paginate(10);
        return response()->json($articles);
    }

    public function show($id)
    {
        // Devuelve TODOS los comentarios en una lista plana para la creación del árbol frontend
        $article = Article::with([
            'category',
            'comments' => function ($query) {
                // Obtiene TODOS los comentarios (no solo el nivel raíz)
                $query->with(['user', 'likes'])
                    ->orderBy('created_at', 'desc');
            }
        ])->findOrFail($id);

        return response()->json($article);
    }
}
