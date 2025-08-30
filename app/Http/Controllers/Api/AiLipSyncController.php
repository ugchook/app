<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiLipSync;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class AiLipSyncController extends Controller
{
    /**
     * Display a listing of AI lip syncs for the current workspace.
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

        $aiLipSyncs = $workspace->aiLipSyncs()
            ->with(['user:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $aiLipSyncs,
            'message' => 'AI Lip Syncs retrieved successfully'
        ]);
    }

    /**
     * Store a newly created AI lip sync.
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
            'type' => 'required|string|in:video_translation,video_dubbing',
            'input_video' => 'required|file|mimes:mp4,avi,mov,wmv|max:102400',
            'input_audio' => 'nullable|file|mimes:mp3,wav,m4a|max:10240',
            'source_language' => 'required|string|size:2',
            'target_language' => 'required|string|size:2',
            'voice_id' => 'nullable|string',
            'ai_service' => 'nullable|string|in:wav2lip,sync_labs,elevenlabs,hey_gen',
            'lip_sync_settings' => 'nullable|array',
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

        $aiLipSync = new AiLipSync([
            'workspace_id' => $workspace->id,
            'user_id' => $user->id,
            'name' => $request->name,
            'type' => $request->type,
            'source_language' => $request->source_language,
            'target_language' => $request->target_language,
            'voice_id' => $request->voice_id,
            'ai_service' => $request->ai_service ?? 'wav2lip',
            'lip_sync_settings' => $request->lip_sync_settings ?? [
                'quality' => 'high',
                'preserve_original_audio' => false,
                'sync_precision' => 0.8
            ],
            'status' => 'pending',
        ]);

        // Handle file uploads
        if ($request->hasFile('input_video')) {
            $path = $request->file('input_video')->store('ai-lip-syncs/input', 'public');
            $aiLipSync->input_video_path = $path;
        }

        if ($request->hasFile('input_audio')) {
            $path = $request->file('input_audio')->store('ai-lip-syncs/input', 'public');
            $aiLipSync->input_audio_path = $path;
        }

        $aiLipSync->save();

        // Process the AI lip sync request
        $this->processAiLipSync($aiLipSync);

        return response()->json([
            'success' => true,
            'data' => $aiLipSync,
            'message' => 'AI Lip Sync request created successfully'
        ], 201);
    }

    /**
     * Display the specified AI lip sync.
     */
    public function show(AiLipSync $aiLipSync): JsonResponse
    {
        $user = Auth::user();
        
        if ($aiLipSync->workspace_id !== ($user->currentWorkspace?->id ?? 0)) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied to this AI Lip Sync'
            ], 403);
        }

        $aiLipSync->load(['user:id,name,email', 'workspace:id,name']);

        return response()->json([
            'success' => true,
            'data' => $aiLipSync,
            'message' => 'AI Lip Sync retrieved successfully'
        ]);
    }

    /**
     * Update the specified AI lip sync.
     */
    public function update(Request $request, AiLipSync $aiLipSync): JsonResponse
    {
        $user = Auth::user();
        
        if ($aiLipSync->workspace_id !== ($user->currentWorkspace?->id ?? 0)) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied to this AI Lip Sync'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'lip_sync_settings' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $aiLipSync->update($request->only(['name', 'lip_sync_settings']));

        return response()->json([
            'success' => true,
            'data' => $aiLipSync,
            'message' => 'AI Lip Sync updated successfully'
        ]);
    }

    /**
     * Remove the specified AI lip sync.
     */
    public function destroy(AiLipSync $aiLipSync): JsonResponse
    {
        $user = Auth::user();
        
        if ($aiLipSync->workspace_id !== ($user->currentWorkspace?->id ?? 0)) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied to this AI Lip Sync'
            ], 403);
        }

        // Delete associated files
        if ($aiLipSync->input_video_path) {
            Storage::disk('public')->delete($aiLipSync->input_video_path);
        }
        if ($aiLipSync->input_audio_path) {
            Storage::disk('public')->delete($aiLipSync->input_audio_path);
        }
        if ($aiLipSync->output_video_path) {
            Storage::disk('public')->delete($aiLipSync->output_video_path);
        }
        if ($aiLipSync->output_audio_path) {
            Storage::disk('public')->delete($aiLipSync->output_audio_path);
        }

        $aiLipSync->delete();

        return response()->json([
            'success' => true,
            'message' => 'AI Lip Sync deleted successfully'
        ]);
    }

    /**
     * Get available AI services.
     */
    public function getAvailableServices(): JsonResponse
    {
        $services = [
            'wav2lip' => [
                'name' => 'Wav2Lip',
                'description' => 'Open source lip sync solution',
                'supports' => ['video_dubbing'],
                'credits_per_generation' => 2
            ],
            'sync_labs' => [
                'name' => 'Sync Labs',
                'description' => 'Professional lip sync platform',
                'supports' => ['video_translation', 'video_dubbing'],
                'credits_per_generation' => 3
            ],
            'elevenlabs' => [
                'name' => 'ElevenLabs',
                'description' => 'AI voice synthesis with lip sync',
                'supports' => ['video_dubbing'],
                'credits_per_generation' => 2
            ],
            'hey_gen' => [
                'name' => 'HeyGen',
                'description' => 'AI video generation and translation',
                'supports' => ['video_translation', 'video_dubbing'],
                'credits_per_generation' => 4
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $services,
            'message' => 'Available AI services retrieved successfully'
        ]);
    }

    /**
     * Get supported languages.
     */
    public function getSupportedLanguages(): JsonResponse
    {
        $languages = [
            'en' => 'English',
            'es' => 'Spanish',
            'fr' => 'French',
            'de' => 'German',
            'it' => 'Italian',
            'pt' => 'Portuguese',
            'ru' => 'Russian',
            'ja' => 'Japanese',
            'ko' => 'Korean',
            'zh' => 'Chinese',
            'ar' => 'Arabic',
            'hi' => 'Hindi',
            'tr' => 'Turkish',
            'nl' => 'Dutch',
            'pl' => 'Polish',
            'sv' => 'Swedish',
            'da' => 'Danish',
            'no' => 'Norwegian',
            'fi' => 'Finnish',
            'cs' => 'Czech'
        ];

        return response()->json([
            'success' => true,
            'data' => $languages,
            'message' => 'Supported languages retrieved successfully'
        ]);
    }

    /**
     * Process the AI lip sync request.
     */
    private function processAiLipSync(AiLipSync $aiLipSync): void
    {
        // Update status to processing
        $aiLipSync->update(['status' => 'processing']);

        // Dispatch job to process the request
        // This would typically be a queued job
        // For now, we'll simulate processing
        
        try {
            switch ($aiLipSync->type) {
                case 'video_translation':
                    $this->processVideoTranslation($aiLipSync);
                    break;
                case 'video_dubbing':
                    $this->processVideoDubbing($aiLipSync);
                    break;
            }
        } catch (\Exception $e) {
            $aiLipSync->update([
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Process video translation request.
     */
    private function processVideoTranslation(AiLipSync $aiLipSync): void
    {
        // This would typically call the selected AI service API
        // For now, we'll simulate the process
        
        $aiLipSync->update([
            'status' => 'completed',
            'transcription_text' => 'Simulated transcription in ' . $aiLipSync->source_language,
            'translated_text' => 'Simulated translation to ' . $aiLipSync->target_language,
            'output_video_path' => 'ai-lip-syncs/output/' . uniqid() . '.mp4',
            'processing_time' => 120,
            'credits_used' => $this->getCreditsForType($aiLipSync->type)
        ]);

        // Decrement workspace credits
        $aiLipSync->workspace->decrementCredits($this->getCreditsForType($aiLipSync->type));
    }

    /**
     * Process video dubbing request.
     */
    private function processVideoDubbing(AiLipSync $aiLipSync): void
    {
        // This would typically call the selected AI service API
        // For now, we'll simulate the process
        
        $aiLipSync->update([
            'status' => 'completed',
            'transcription_text' => 'Simulated transcription in ' . $aiLipSync->source_language,
            'translated_text' => 'Simulated translation to ' . $aiLipSync->target_language,
            'output_video_path' => 'ai-lip-syncs/output/' . uniqid() . '.mp4',
            'output_audio_path' => 'ai-lip-syncs/output/' . uniqid() . '.mp3',
            'processing_time' => 180,
            'credits_used' => $this->getCreditsForType($aiLipSync->type)
        ]);

        // Decrement workspace credits
        $aiLipSync->workspace->decrementCredits($this->getCreditsForType($aiLipSync->type));
    }

    /**
     * Get credits required for each type.
     */
    private function getCreditsForType(string $type): int
    {
        return match($type) {
            'video_translation' => 3,
            'video_dubbing' => 5,
            default => 3
        };
    }
}