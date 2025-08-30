<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiAvatar;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class AiAvatarController extends Controller
{
    /**
     * Display a listing of AI avatars for the current workspace.
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $workspaceId = $request->header('X-Workspace-ID') ?? $user->currentWorkspace?->id;
        
        if (!$workspaceId) {
            return response()->json([
                'success' => false,
                'message' => 'No workspace selected'
            ], 400);
        }

        $workspace = Workspace::findOrFail($workspaceId);
        
        if (!$workspace->users()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied to this workspace'
            ], 403);
        }

        $aiAvatars = $workspace->aiAvatars()
            ->with(['user:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $aiAvatars,
            'message' => 'AI Avatars retrieved successfully'
        ]);
    }

    /**
     * Store a newly created AI avatar.
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();
        $workspaceId = $request->header('X-Workspace-ID') ?? $user->currentWorkspace?->id;
        
        if (!$workspaceId) {
            return response()->json([
                'success' => false,
                'message' => 'No workspace selected'
            ], 400);
        }

        $workspace = Workspace::findOrFail($workspaceId);
        
        if (!$workspace->users()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied to this workspace'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:text_to_image,image_to_video',
            'prompt' => 'required|string',
            'negative_prompt' => 'nullable|string',
            'input_image' => 'required_if:type,image_to_video|file|mimes:jpg,jpeg,png,webp|max:10240',
            'ai_service' => 'nullable|string|in:stable_diffusion,midjourney,dalle,leonardo',
            'generation_settings' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if workspace has enough credits
        $creditsNeeded = $this->getCreditsForType($request->type);
        if (!$workspace->hasCredits($creditsNeeded)) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient credits in workspace'
            ], 402);
        }

        $aiAvatar = new AiAvatar([
            'workspace_id' => $workspace->id,
            'user_id' => $user->id,
            'name' => $request->name,
            'type' => $request->type,
            'prompt' => $request->prompt,
            'negative_prompt' => $request->negative_prompt,
            'ai_service' => $request->ai_service ?? 'stable_diffusion',
            'generation_settings' => $request->generation_settings ?? [
                'width' => 512,
                'height' => 512,
                'steps' => 20,
                'guidance_scale' => 7.5
            ],
            'status' => 'pending',
        ]);

        // Handle file uploads
        if ($request->hasFile('input_image')) {
            $path = $request->file('input_image')->store('ai-avatars/input', 'public');
            $aiAvatar->input_image_path = $path;
        }

        $aiAvatar->save();

        // Process the AI avatar request
        $this->processAiAvatar($aiAvatar);

        return response()->json([
            'success' => true,
            'data' => $aiAvatar,
            'message' => 'AI Avatar request created successfully'
        ], 201);
    }

    /**
     * Display the specified AI avatar.
     */
    public function show(AiAvatar $aiAvatar): JsonResponse
    {
        $user = Auth::user();
        
        if ($aiAvatar->workspace_id !== ($user->currentWorkspace?->id ?? 0)) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied to this AI Avatar'
            ], 403);
        }

        $aiAvatar->load(['user:id,name,email', 'workspace:id,name']);

        return response()->json([
            'success' => true,
            'data' => $aiAvatar,
            'message' => 'AI Avatar retrieved successfully'
        ]);
    }

    /**
     * Update the specified AI avatar.
     */
    public function update(Request $request, AiAvatar $aiAvatar): JsonResponse
    {
        $user = Auth::user();
        
        if ($aiAvatar->workspace_id !== ($user->currentWorkspace?->id ?? 0)) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied to this AI Avatar'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'generation_settings' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $aiAvatar->update($request->only(['name', 'generation_settings']));

        return response()->json([
            'success' => true,
            'data' => $aiAvatar,
            'message' => 'AI Avatar updated successfully'
        ]);
    }

    /**
     * Remove the specified AI avatar.
     */
    public function destroy(AiAvatar $aiAvatar): JsonResponse
    {
        $user = Auth::user();
        
        if ($aiAvatar->workspace_id !== ($user->currentWorkspace?->id ?? 0)) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied to this AI Avatar'
            ], 403);
        }

        // Delete associated files
        if ($aiAvatar->input_image_path) {
            Storage::disk('public')->delete($aiAvatar->input_image_path);
        }
        if ($aiAvatar->output_image_path) {
            Storage::disk('public')->delete($aiAvatar->output_image_path);
        }
        if ($aiAvatar->output_video_path) {
            Storage::disk('public')->delete($aiAvatar->output_video_path);
        }

        $aiAvatar->delete();

        return response()->json([
            'success' => true,
            'message' => 'AI Avatar deleted successfully'
        ]);
    }

    /**
     * Get available AI services.
     */
    public function getAvailableServices(): JsonResponse
    {
        $services = [
            'stable_diffusion' => [
                'name' => 'Stable Diffusion',
                'description' => 'Open source text-to-image model',
                'supports' => ['text_to_image'],
                'credits_per_generation' => 1
            ],
            'midjourney' => [
                'name' => 'Midjourney',
                'description' => 'High-quality AI art generation',
                'supports' => ['text_to_image'],
                'credits_per_generation' => 2
            ],
            'dalle' => [
                'name' => 'DALL-E',
                'description' => 'OpenAI\'s text-to-image model',
                'supports' => ['text_to_image'],
                'credits_per_generation' => 2
            ],
            'leonardo' => [
                'name' => 'Leonardo AI',
                'description' => 'Professional AI art platform',
                'supports' => ['text_to_image', 'image_to_video'],
                'credits_per_generation' => 1
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $services,
            'message' => 'Available AI services retrieved successfully'
        ]);
    }

    /**
     * Process the AI avatar request.
     */
    private function processAiAvatar(AiAvatar $aiAvatar): void
    {
        // Update status to processing
        $aiAvatar->update(['status' => 'processing']);

        // Dispatch job to process the request
        // This would typically be a queued job
        // For now, we'll simulate processing
        
        try {
            switch ($aiAvatar->type) {
                case 'text_to_image':
                    $this->processTextToImage($aiAvatar);
                    break;
                case 'image_to_video':
                    $this->processImageToVideo($aiAvatar);
                    break;
            }
        } catch (\Exception $e) {
            $aiAvatar->update([
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Process text to image request.
     */
    private function processTextToImage(AiAvatar $aiAvatar): void
    {
        // This would typically call the selected AI service API
        // For now, we'll simulate the process
        
        $aiAvatar->update([
            'status' => 'completed',
            'output_image_path' => 'ai-avatars/output/' . uniqid() . '.png',
            'processing_time' => 15,
            'credits_used' => $this->getCreditsForType($aiAvatar->type)
        ]);

        // Decrement workspace credits
        $aiAvatar->workspace->decrementCredits($this->getCreditsForType($aiAvatar->type));
    }

    /**
     * Process image to video request.
     */
    private function processImageToVideo(AiAvatar $aiAvatar): void
    {
        // This would typically call the selected AI service API
        // For now, we'll simulate the process
        
        $aiAvatar->update([
            'status' => 'completed',
            'output_video_path' => 'ai-avatars/output/' . uniqid() . '.mp4',
            'processing_time' => 45,
            'credits_used' => $this->getCreditsForType($aiAvatar->type)
        ]);

        // Decrement workspace credits
        $aiAvatar->workspace->decrementCredits($this->getCreditsForType($aiAvatar->type));
    }

    /**
     * Get credits required for each type.
     */
    private function getCreditsForType(string $type): int
    {
        return match($type) {
            'text_to_image' => 1,
            'image_to_video' => 3,
            default => 1
        };
    }
}