<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiImage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AiImageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $images = AiImage::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return response()->json([
            'status' => true,
            'images' => $images->items(),
            'totalPage' => $images->lastPage(),
            'currentPage' => $images->currentPage(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'prompt' => 'required|string|max:1000',
            'options' => 'required|array',
        ]);

        $image = AiImage::create([
            'user_id' => Auth::id(),
            'prompt' => $request->prompt,
            'options' => $request->options,
            'status' => 'processing',
        ]);

        // TODO: Implement actual AI image generation logic here
        // This would typically involve calling an external AI service

        return response()->json([
            'status' => true,
            'message' => 'Image generation started',
            'image' => $image,
        ]);
    }

    public function show(AiImage $aiImage): JsonResponse
    {
        if ($aiImage->user_id !== Auth::id()) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'status' => true,
            'image' => $aiImage,
        ]);
    }
}
