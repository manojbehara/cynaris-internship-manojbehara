<?php

use Illuminate\Support\Facades\Route;
use App\Models\Post;

Route::get('/', function () {
    $posts = Post::query()
        ->where('title', '!=', '')
        ->orderByDesc('created_at')
        ->with('comments')
        ->get();

    return response()->json($posts);
});
