<?php

namespace App\Traits;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

trait AiTrait
{
    /**
     * Generate AI image using configured service
     */
    protected function generateImageWithAI($image, string $prompt): void
    {
        $service = env('AI_SERVICE', 'bfl'); // Default to BFL, can be changed
        
        switch ($service) {
            case 'bfl':
                $this->generateWithBFL($image, $prompt);
                break;
            case 'openai':
                $this->generateWithOpenAI($image, $prompt);
                break;
            case 'stability':
                $this->generateWithStability($image, $prompt);
                break;
            default:
                $this->generateWithBFL($image, $prompt); // Fallback to BFL
        }
    }

    /**
     * Generate image using BFL API
     */
    private function generateWithBFL($image, string $prompt): void
    {
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'x-key' => env('BFL_API_KEY'),
            ])->post('https://api.us1.bfl.ai/v1/flux-pro-1.1-ultra', [
                'prompt' => $prompt,
                'aspect_ratio' => '9:16',
                'raw' => true,
                'prompt_upsampling' => false,
                'seed' => 42,
                'safety_tolerance' => 2,
                'output_format' => 'png',
                'webhook_url' => env('APP_URL') . '/api/webhook/bfl'
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $image->update([
                    'bfl_id' => $data['id'] ?? null,
                ]);
            } else {
                $image->update(['status' => 'failed']);
                Log::error('BFL API failed: ' . $response->body());
            }

        } catch (\Exception $e) {
            $image->update(['status' => 'failed']);
            Log::error('BFL API call failed: ' . $e->getMessage());
        }
    }

    /**
     * Generate image using OpenAI DALL-E
     */
    private function generateWithOpenAI($image, string $prompt): void
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
                'Content-Type' => 'application/json',
            ])->post('https://api.openai.com/v1/images/generations', [
                'prompt' => $prompt,
                'n' => 1,
                'size' => '1024x1792', // 9:16 aspect ratio
                'response_format' => 'url'
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $imageUrl = $data['data'][0]['url'] ?? null;
                
                if ($imageUrl) {
                    $image->update([
                        'status' => 'completed',
                        'url' => $this->downloadAndStoreImage($imageUrl, 'openai'),
                        'origin_url' => $imageUrl,
                    ]);
                } else {
                    $image->update(['status' => 'failed']);
                }
            } else {
                $image->update(['status' => 'failed']);
                Log::error('OpenAI API failed: ' . $response->body());
            }

        } catch (\Exception $e) {
            $image->update(['status' => 'failed']);
            Log::error('OpenAI API call failed: ' . $e->getMessage());
        }
    }

    /**
     * Generate image using Stability AI
     */
    private function generateWithStability($image, string $prompt): void
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('STABILITY_API_KEY'),
                'Content-Type' => 'application/json',
            ])->post('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', [
                'text_prompts' => [
                    [
                        'text' => $prompt,
                        'weight' => 1
                    ]
                ],
                'cfg_scale' => 7,
                'height' => 1792,
                'width' => 1024,
                'samples' => 1,
                'steps' => 30,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $imageUrl = $data['artifacts'][0]['base64'] ?? null;
                
                if ($imageUrl) {
                    $image->update([
                        'status' => 'completed',
                        'url' => $this->downloadAndStoreImage($imageUrl, 'stability'),
                        'origin_url' => $imageUrl,
                    ]);
                } else {
                    $image->update(['status' => 'failed']);
                }
            } else {
                $image->update(['status' => 'failed']);
                Log::error('Stability AI API failed: ' . $response->body());
            }

        } catch (\Exception $e) {
            $image->update(['status' => 'failed']);
            Log::error('Stability AI API call failed: ' . $e->getMessage());
        }
    }

    /**
     * Download and store image from URL or base64
     */
    private function downloadAndStoreImage($imageData, string $service): string
    {
        try {
            $filename = 'ai-images/' . uniqid() . '.png';
            
            if ($service === 'stability') {
                // Handle base64 data
                $imageContent = base64_decode($imageData);
            } else {
                // Handle URL data
                $imageContent = file_get_contents($imageData);
            }
            
            if ($imageContent) {
                Storage::disk('public')->put($filename, $imageContent);
                return $filename;
            }
            
            return '';
        } catch (\Exception $e) {
            Log::error('Failed to store image: ' . $e->getMessage());
            return '';
        }
    }
}
