<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiVoice;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

class AiVoiceController extends Controller
{
    /**
     * Display a listing of AI voices for the current workspace.
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

        $aiVoices = $workspace->aiVoices()
            ->with(['user:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $aiVoices,
            'message' => 'AI Voices retrieved successfully'
        ]);
    }

    /**
     * Store a newly created AI voice.
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
            'type' => 'required|string|in:text_to_speech,speech_to_text,speech_to_speech,voice_clone',
            'input_text' => 'required_if:type,text_to_speech,voice_clone|string',
            'input_audio' => 'required_if:type,speech_to_text,speech_to_speech|file|mimes:mp3,wav,m4a|max:10240',
            'voice_id' => 'nullable|string',
            'voice_settings' => 'nullable|array',
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

        $aiVoice = new AiVoice([
            'workspace_id' => $workspace->id,
            'user_id' => $user->id,
            'name' => $request->name,
            'type' => $request->type,
            'input_text' => $request->input_text,
            'voice_id' => $request->voice_id,
            'voice_settings' => $request->voice_settings,
            'status' => 'pending',
        ]);

        // Handle file uploads
        if ($request->hasFile('input_audio')) {
            $path = $request->file('input_audio')->store('ai-voices/input', 'public');
            $aiVoice->input_audio_path = $path;
        }

        $aiVoice->save();

        // Process the AI voice request
        $this->processAiVoice($aiVoice);

        return response()->json([
            'success' => true,
            'data' => $aiVoice,
            'message' => 'AI Voice request created successfully'
        ], 201);
    }

    /**
     * Display the specified AI voice.
     */
    public function show(AiVoice $aiVoice): JsonResponse
    {
        $user = Auth::user();
        
        if ($aiVoice->workspace_id !== ($user->currentWorkspace?->id ?? 0)) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied to this AI Voice'
            ], 403);
        }

        $aiVoice->load(['user:id,name,email', 'workspace:id,name']);

        return response()->json([
            'success' => true,
            'data' => $aiVoice,
            'message' => 'AI Voice retrieved successfully'
        ]);
    }

    /**
     * Update the specified AI voice.
     */
    public function update(Request $request, AiVoice $aiVoice): JsonResponse
    {
        $user = Auth::user();
        
        if ($aiVoice->workspace_id !== ($user->currentWorkspace?->id ?? 0)) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied to this AI Voice'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'voice_settings' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $aiVoice->update($request->only(['name', 'voice_settings']));

        return response()->json([
            'success' => true,
            'data' => $aiVoice,
            'message' => 'AI Voice updated successfully'
        ]);
    }

    /**
     * Remove the specified AI voice.
     */
    public function destroy(AiVoice $aiVoice): JsonResponse
    {
        $user = Auth::user();
        
        if ($aiVoice->workspace_id !== ($user->currentWorkspace?->id ?? 0)) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied to this AI Voice'
            ], 403);
        }

        // Delete associated files
        if ($aiVoice->input_audio_path) {
            Storage::disk('public')->delete($aiVoice->input_audio_path);
        }
        if ($aiVoice->output_audio_path) {
            Storage::disk('public')->delete($aiVoice->output_audio_path);
        }

        $aiVoice->delete();

        return response()->json([
            'success' => true,
            'message' => 'AI Voice deleted successfully'
        ]);
    }

    /**
     * Get available voices from ElevenLabs.
     */
    public function getAvailableVoices(): JsonResponse
    {
        $apiKey = config('services.elevenlabs.api_key');
        
        if (!$apiKey) {
            return response()->json([
                'success' => false,
                'message' => 'ElevenLabs API key not configured'
            ], 500);
        }

        try {
            $response = Http::withHeaders([
                'xi-api-key' => $apiKey
            ])->get('https://api.elevenlabs.io/v1/voices');

            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'data' => $response->json(),
                    'message' => 'Available voices retrieved successfully'
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve voices from ElevenLabs'
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error connecting to ElevenLabs API'
            ], 500);
        }
    }

    /**
     * Process the AI voice request.
     */
    private function processAiVoice(AiVoice $aiVoice): void
    {
        // Update status to processing
        $aiVoice->update(['status' => 'processing']);

        // Dispatch job to process the request
        // This would typically be a queued job
        // For now, we'll simulate processing
        
        try {
            switch ($aiVoice->type) {
                case 'text_to_speech':
                    $this->processTextToSpeech($aiVoice);
                    break;
                case 'speech_to_text':
                    $this->processSpeechToText($aiVoice);
                    break;
                case 'speech_to_speech':
                    $this->processSpeechToSpeech($aiVoice);
                    break;
                case 'voice_clone':
                    $this->processVoiceClone($aiVoice);
                    break;
            }
        } catch (\Exception $e) {
            $aiVoice->update([
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Process text to speech request.
     */
    private function processTextToSpeech(AiVoice $aiVoice): void
    {
        $apiKey = config('services.elevenlabs.api_key');
        
        if (!$apiKey) {
            throw new \Exception('ElevenLabs API key not configured');
        }

        // Call ElevenLabs API
        $response = Http::withHeaders([
            'xi-api-key' => $apiKey,
            'Content-Type' => 'application/json'
        ])->post('https://api.elevenlabs.io/v1/text-to-speech/' . ($aiVoice->voice_id ?? '21m00Tcm4TlvDq8ikWAM'), [
            'text' => $aiVoice->input_text,
            'model_id' => 'eleven_monolingual_v1',
            'voice_settings' => $aiVoice->voice_settings ?? [
                'stability' => 0.5,
                'similarity_boost' => 0.5
            ]
        ]);

        if ($response->successful()) {
            // Save the audio file
            $filename = 'ai-voices/output/' . uniqid() . '.mp3';
            Storage::disk('public')->put($filename, $response->body());
            
            $aiVoice->update([
                'status' => 'completed',
                'output_audio_path' => $filename,
                'processing_time' => 5, // Simulated
                'credits_used' => $this->getCreditsForType($aiVoice->type)
            ]);

            // Decrement workspace credits
            $aiVoice->workspace->decrementCredits($this->getCreditsForType($aiVoice->type));
        } else {
            throw new \Exception('Failed to generate speech: ' . $response->body());
        }
    }

    /**
     * Process speech to text request.
     */
    private function processSpeechToText(AiVoice $aiVoice): void
    {
        // This would typically use a speech-to-text service
        // For now, we'll simulate the process
        
        $aiVoice->update([
            'status' => 'completed',
            'output_text' => 'Simulated transcription of audio content',
            'processing_time' => 3,
            'credits_used' => $this->getCreditsForType($aiVoice->type)
        ]);

        // Decrement workspace credits
        $aiVoice->workspace->decrementCredits($this->getCreditsForType($aiVoice->type));
    }

    /**
     * Process speech to speech request.
     */
    private function processSpeechToSpeech(AiVoice $aiVoice): void
    {
        // This would combine speech-to-text and text-to-speech
        // For now, we'll simulate the process
        
        $aiVoice->update([
            'status' => 'completed',
            'output_text' => 'Simulated transcription',
            'output_audio_path' => 'ai-voices/output/simulated-output.mp3',
            'processing_time' => 8,
            'credits_used' => $this->getCreditsForType($aiVoice->type)
        ]);

        // Decrement workspace credits
        $aiVoice->workspace->decrementCredits($this->getCreditsForType($aiVoice->type));
    }

    /**
     * Process voice clone request.
     */
    private function processVoiceClone(AiVoice $aiVoice): void
    {
        // This would use ElevenLabs voice cloning API
        // For now, we'll simulate the process
        
        $aiVoice->update([
            'status' => 'completed',
            'output_audio_path' => 'ai-voices/output/cloned-voice.mp3',
            'processing_time' => 15,
            'credits_used' => $this->getCreditsForType($aiVoice->type)
        ]);

        // Decrement workspace credits
        $aiVoice->workspace->decrementCredits($this->getCreditsForType($aiVoice->type));
    }

    /**
     * Get credits required for each type.
     */
    private function getCreditsForType(string $type): int
    {
        return match($type) {
            'text_to_speech' => 1,
            'speech_to_text' => 2,
            'speech_to_speech' => 3,
            'voice_clone' => 5,
            default => 1
        };
    }
}