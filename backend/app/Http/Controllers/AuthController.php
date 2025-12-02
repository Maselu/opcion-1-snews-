<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function user(Request $request)
    {
        $user = $request->user()->loadCount(['comments', 'likes', 'topics']);
        return response()->json($user);
    }
}
