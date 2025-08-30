<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiImage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class WebhookController extends Controller
{
    public function bfl(Request $request): JsonResponse
    {
        try {
            $data = $request->all();
            Log::info('BFL Webhook received:', $data);

            // Extract the image ID from the webhook data
            $bflId = $data['id'] ?? null;
            $status = $data['status'] ?? null;
            $outputUrl = $data['output'] ?? null;

            if (!$bflId) {
                return response()->json(['error' => 'Missing BFL ID'], 400);
            }

            // Find the AI image by BFL ID
            $aiImage = AiImage::where('bfl_id', $bflId)->first();

            if (!$aiImage) {
                return response()->json(['error' => 'AI Image not found'], 404);
            }

            if ($status === 'completed' && $outputUrl) {
                // Download and store the generated image
                $imageContent = file_get_contents($outputUrl);
                if ($imageContent) {
                    $filename = 'ai-images/' . uniqid() . '.png';
                    Storage::disk('public')->put($filename, $imageContent);
                    
                    $aiImage->update([
                        'status' => 'completed',
                        'url' => $filename,
                        'origin_url' => $outputUrl,
                    ]);
                } else {
                    $aiImage->update(['status' => 'failed']);
                }
            } elseif ($status === 'failed') {
                $aiImage->update(['status' => 'failed']);
            }

            return response()->json(['status' => 'success']);

        } catch (\Exception $e) {
            Log::error('BFL Webhook processing failed: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Generic webhook handler for different AI services
     */
    public function aiService(Request $request, string $service): JsonResponse
    {
        try {
            $data = $request->all();
            Log::info("{$service} Webhook received:", $data);

            // Handle different services
            switch ($service) {
                case 'bfl':
                    return $this->bfl($request);
                case 'openai':
                    return $this->handleOpenAI($request);
                case 'stability':
                    return $this->handleStability($request);
                default:
                    return response()->json(['error' => 'Unsupported AI service'], 400);
            }

        } catch (\Exception $e) {
            Log::error("{$service} Webhook processing failed: " . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Handle OpenAI webhook (if they provide one)
     */
    private function handleOpenAI(Request $request): JsonResponse
    {
        // OpenAI typically doesn't provide webhooks, but this is here for future use
        return response()->json(['status' => 'success']);
    }

    /**
     * Handle Stability AI webhook (if they provide one)
     */
    private function handleStability(Request $request): JsonResponse
    {
        // Stability AI typically doesn't provide webhooks, but this is here for future use
        return response()->json(['status' => 'success']);
    }
}
