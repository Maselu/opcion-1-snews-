<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\WeatherController;
use App\Http\Controllers\ProfileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Rutas públicas
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{id}', [ArticleController::class, 'show']);
Route::get('/articles/{id}/comments', [CommentController::class, 'index']);
Route::get('/topics', [TopicController::class, 'index']);
Route::get('/topics/{id}', [TopicController::class, 'show']);
Route::get('/weather', [WeatherController::class, 'current']);
Route::get('/weather/detailed', [WeatherController::class, 'detailed']);
Route::get('/weather/cities', [WeatherController::class, 'cities']);

// Rutas de autenticación (públicas)
Route::post('/auth/register', [AuthController::class, 'register']);

// Rutas protegidas
Route::middleware('auth:supabase')->group(function () {
    // User & Profile
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    // Comentarios
    Route::post('/articles/{id}/comments', [CommentController::class, 'store']);
    Route::put('/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

    // Likes
    Route::post('/comments/{id}/likes', [LikeController::class, 'toggle']);

    // Temas
    Route::post('/topics', [TopicController::class, 'store']);
    Route::post('/topics/{id}/comments', [CommentController::class, 'storeTopicComment']);
    Route::put('/topics/{id}', [TopicController::class, 'update']);
    Route::delete('/topics/{id}', [TopicController::class, 'destroy']);
});
