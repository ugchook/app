<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiImage;
use App\Models\User;
use App\Traits\AiTrait;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AiImageController extends Controller
{
    use AiTrait;

    public function index(Request $request): JsonResponse
    {
        $query = AiImage::where('user_id', Auth::id());
        
        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        $images = $query->orderBy('created_at', 'desc')
            ->paginate(24);

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
            'selfie' => 'required|boolean',
        ]);

        // Check if user has active subscription
        $user = Auth::user();
        if (!$user->subscription || $user->subscription->status !== 'active') {
            return response()->json([
                'status' => false,
                'message' => 'You need to subscribe to a plan to generate images.',
            ], 400);
        }

        // Check if user has enough credits
        if ($user->credits < 1) {
            return response()->json([
                'status' => false,
                'message' => 'You have not enough credits left. Please upgrade your plan.',
            ], 400);
        }

        try {
            // Prepare prompt based on selfie option
            $prompt = $request->prompt;
            if ($request->selfie) {
                $prompt .= '. Front-facing selfie perspective, camera held at arm\'s length, framing the subject from mid-torso to the top of the head. Subject looks directly at the camera. Natural smartphone lens with slight distortion. Clear facial features, well-lit. Background is fully visible and not blurred.';
            } else {
                $prompt .= '. Camera positioned in front of the subject, capturing from mid-torso to the top of the head. Subject is centered and looking directly into the lens. Neutral or confident expression. Balanced lighting, clear details. Background is sharp and fully visible, not blurred.';
            }

            // Create AI image record
            $image = AiImage::create([
                'user_id' => Auth::id(),
                'prompt' => $prompt,
                'options' => [
                    'selfie' => $request->selfie,
                    'aspect_ratio' => '9:16',
                    'model' => env('AI_SERVICE', 'bfl')
                ],
                'status' => 'processing',
            ]);

            // Deduct credit from user
            $user->decrement('credits');

            // Call external AI service using trait
            $this->generateImageWithAI($image, $prompt);

            return response()->json([
                'status' => true,
                'message' => 'Image generation started',
                'image' => $image,
            ]);

        } catch (\Exception $e) {
            Log::error('AI Image generation failed: ' . $e->getMessage());
            
            return response()->json([
                'status' => false,
                'message' => 'An error occurred. Please try again later.',
            ], 500);
        }
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

    public function update(Request $request, AiImage $aiImage): JsonResponse
    {
        if ($aiImage->user_id !== Auth::id()) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'sometimes|string|in:processing,completed,failed,nsfw',
            'url' => 'sometimes|string|url',
            'bfl_id' => 'sometimes|string',
        ]);

        $aiImage->update($request->only(['status', 'url', 'bfl_id']));

        return response()->json([
            'status' => true,
            'message' => 'Image updated successfully',
            'image' => $aiImage,
        ]);
    }
}
