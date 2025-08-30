<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ElevenLabsService
{
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.elevenlabs.api_key');
        $this->baseUrl = config('services.elevenlabs.base_url');
    }

    /**
     * Get all available voices
     */
    public function getVoices(): array
    {
        try {
            $response = Http::withHeaders([
                'xi-api-key' => $this->apiKey
            ])->get($this->baseUrl . '/voices');

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('ElevenLabs API error: ' . $response->body());
            return [];

        } catch (\Exception $e) {
            Log::error('ElevenLabs service error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get a specific voice by ID
     */
    public function getVoice(string $voiceId): ?array
    {
        try {
            $response = Http::withHeaders([
                'xi-api-key' => $this->apiKey
            ])->get($this->baseUrl . '/voices/' . $voiceId);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('ElevenLabs API error getting voice: ' . $response->body());
            return null;

        } catch (\Exception $e) {
            Log::error('ElevenLabs service error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Convert text to speech
     */
    public function textToSpeech(string $text, string $voiceId, array $settings = []): ?string
    {
        try {
            $defaultSettings = [
                'model_id' => 'eleven_monolingual_v1',
                'voice_settings' => [
                    'stability' => 0.5,
                    'similarity_boost' => 0.5
                ]
            ];

            $settings = array_merge($defaultSettings, $settings);

            $response = Http::withHeaders([
                'xi-api-key' => $this->apiKey,
                'Content-Type' => 'application/json'
            ])->post($this->baseUrl . '/text-to-speech/' . $voiceId, [
                'text' => $text,
                'model_id' => $settings['model_id'],
                'voice_settings' => $settings['voice_settings']
            ]);

            if ($response->successful()) {
                return $response->body();
            }

            Log::error('ElevenLabs TTS API error: ' . $response->body());
            return null;

        } catch (\Exception $e) {
            Log::error('ElevenLabs TTS service error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Clone a voice from audio sample
     */
    public function cloneVoice(string $name, string $audioPath, array $settings = []): ?array
    {
        try {
            $defaultSettings = [
                'description' => 'Voice cloned from audio sample',
                'labels' => ['cloned']
            ];

            $settings = array_merge($defaultSettings, $settings);

            $response = Http::withHeaders([
                'xi-api-key' => $this->apiKey
            ])->attach(
                'files',
                file_get_contents($audioPath),
                basename($audioPath)
            )->post($this->baseUrl . '/voices/add', [
                'name' => $name,
                'description' => $settings['description'],
                'labels' => json_encode($settings['labels'])
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('ElevenLabs voice cloning API error: ' . $response->body());
            return null;

        } catch (\Exception $e) {
            Log::error('ElevenLabs voice cloning service error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Delete a cloned voice
     */
    public function deleteVoice(string $voiceId): bool
    {
        try {
            $response = Http::withHeaders([
                'xi-api-key' => $this->apiKey
            ])->delete($this->baseUrl . '/voices/' . $voiceId);

            return $response->successful();

        } catch (\Exception $e) {
            Log::error('ElevenLabs voice deletion service error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get available models
     */
    public function getModels(): array
    {
        try {
            $response = Http::withHeaders([
                'xi-api-key' => $this->apiKey
            ])->get($this->baseUrl . '/models');

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('ElevenLabs models API error: ' . $response->body());
            return [];

        } catch (\Exception $e) {
            Log::error('ElevenLabs models service error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get user subscription info
     */
    public function getUserSubscription(): ?array
    {
        try {
            $response = Http::withHeaders([
                'xi-api-key' => $this->apiKey
            ])->get($this->baseUrl . '/user/subscription');

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('ElevenLabs subscription API error: ' . $response->body());
            return null;

        } catch (\Exception $e) {
            Log::error('ElevenLabs subscription service error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Check if API key is valid
     */
    public function isApiKeyValid(): bool
    {
        try {
            $response = Http::withHeaders([
                'xi-api-key' => $this->apiKey
            ])->get($this->baseUrl . '/user');

            return $response->successful();

        } catch (\Exception $e) {
            return false;
        }
    }
}