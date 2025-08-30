<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiContent;
use App\Models\User;
use App\Traits\AiTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AiContentController extends Controller
{
    use AiTrait;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $page = $request->get('page', 1);
        $limit = $request->get('limit', 12);

        $contents = AiContent::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'status' => true,
            'contents' => $contents->items(),
            'totalPage' => $contents->lastPage(),
            'currentPage' => $contents->currentPage(),
            'total' => $contents->total()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        
        // Check subscription and credits
        if (!$user->hasActiveSubscription()) {
            return response()->json([
                'status' => false,
                'message' => 'Active subscription required'
            ], 400);
        }

        if ($user->credits < 1) {
            return response()->json([
                'status' => false,
                'message' => 'Insufficient credits'
            ], 400);
        }

        $request->validate([
            'prompt' => 'required|string|max:2000',
            'type' => 'required|string|in:News & Updates,Storytelling,Advertising & Marketing,Guides & Education,Entertainment & Interaction,Business & Work,Self-Development,Technology & Future'
        ]);

        // Deduct credit
        $user->decrement('credits');

        // Create content record
        $content = AiContent::create([
            'user_id' => $user->id,
            'prompt' => $request->prompt,
            'type' => $request->type,
            'status' => 'pending',
            'configuration' => json_encode([
                'type' => $request->type,
                'prompt' => $request->prompt
            ])
        ]);

        // Generate content with AI service
        $this->generateContentWithAI($content, $request->prompt, $request->type);

        return response()->json([
            'status' => true,
            'message' => 'Content generation started',
            'id' => $content->id
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, AiContent $aiContent)
    {
        $user = $request->user();
        
        if ($aiContent->user_id !== $user->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'status' => true,
            'content' => $aiContent
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AiContent $aiContent)
    {
        $user = $request->user();
        
        if ($aiContent->user_id !== $user->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'sometimes|string|in:pending,processing,completed,failed',
            'output' => 'sometimes|array',
            'metadata' => 'sometimes|array'
        ]);

        $aiContent->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Content updated successfully',
            'data' => $aiContent
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AiContent $aiContent)
    {
        $user = request()->user();
        
        if ($aiContent->user_id !== $user->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        }

        $aiContent->delete();

        return response()->json([
            'status' => true,
            'message' => 'Content deleted successfully'
        ]);
    }

    /**
     * Generate content using AI service
     */
    private function generateContentWithAI($content, $prompt, $type)
    {
        try {
            $service = env('AI_SERVICE', 'bfl');
            
            switch ($service) {
                case 'bfl':
                    $this->generateContentWithBFL($content, $prompt, $type);
                    break;
                case 'openai':
                    $this->generateContentWithOpenAI($content, $prompt, $type);
                    break;
                case 'stability':
                    $this->generateContentWithStability($content, $prompt, $type);
                    break;
                default:
                    $this->generateContentWithBFL($content, $prompt, $type);
            }
        } catch (\Exception $e) {
            Log::error('AI Content generation failed: ' . $e->getMessage());
            $content->update(['status' => 'failed']);
        }
    }

    /**
     * Generate content with BFL API
     */
    private function generateContentWithBFL($content, $prompt, $type)
    {
        $apiKey = env('BFL_API_KEY');
        $apiUrl = env('BFL_API_URL', 'https://api.bfl.com');

        $payload = [
            'prompt' => $prompt,
            'type' => $type,
            'callback_url' => route('webhook.bfl'),
            'content_id' => $content->id
        ];

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json'
        ])->post($apiUrl . '/v1/content/generate', $payload);

        if ($response->successful()) {
            $data = $response->json();
            $content->update([
                'status' => 'processing',
                'metadata' => json_encode($data)
            ]);
        } else {
            $content->update(['status' => 'failed']);
            Log::error('BFL API error: ' . $response->body());
        }
    }

    /**
     * Generate content with OpenAI API
     */
    private function generateContentWithOpenAI($content, $prompt, $type)
    {
        $apiKey = env('OPENAI_API_KEY');
        
        $payload = [
            'model' => 'gpt-4',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => "You are a content creator specializing in {$type}. Create engaging, high-quality content based on the user's prompt."
                ],
                [
                    'role' => 'user',
                    'content' => $prompt
                ]
            ],
            'max_tokens' => 1000,
            'temperature' => 0.7
        ];

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json'
        ])->post('https://api.openai.com/v1/chat/completions', $payload);

        if ($response->successful()) {
            $data = $response->json();
            $content->update([
                'status' => 'processing',
                'metadata' => json_encode($data)
            ]);
        } else {
            $content->update(['status' => 'failed']);
            Log::error('OpenAI API error: ' . $response->body());
        }
    }

    /**
     * Generate content with Stability AI API
     */
    private function generateContentWithStability($content, $prompt, $type)
    {
        $apiKey = env('STABILITY_API_KEY');
        
        $payload = [
            'text_prompts' => [
                [
                    'text' => $prompt,
                    'weight' => 1
                ]
            ],
            'cfg_scale' => 7,
            'height' => 1024,
            'width' => 1024,
            'samples' => 1,
            'steps' => 30
        ];

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json'
        ])->post('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', $payload);

        if ($response->successful()) {
            $data = $response->json();
            $content->update([
                'status' => 'processing',
                'metadata' => json_encode($data)
            ]);
        } else {
            $content->update(['status' => 'failed']);
            Log::error('Stability AI API error: ' . $response->body());
        }
    }
}

