<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AiLipSync extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'workspace_id',
        'user_id',
        'name',
        'type', // video_translation, video_dubbing
        'status', // pending, processing, completed, failed
        'input_video_path',
        'input_audio_path',
        'output_video_path',
        'output_audio_path',
        'source_language',
        'target_language',
        'transcription_text',
        'translated_text',
        'voice_id', // ElevenLabs voice ID for dubbing
        'lip_sync_settings',
        'ai_service', // wav2lip, sync_labs, etc.
        'service_job_id',
        'processing_time',
        'credits_used',
        'metadata',
        'error_message',
    ];

    protected $casts = [
        'lip_sync_settings' => 'array',
        'metadata' => 'array',
        'processing_time' => 'integer',
        'credits_used' => 'integer',
    ];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    public function isProcessing(): bool
    {
        return $this->status === 'processing';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function getTypeLabelAttribute(): string
    {
        return match($this->type) {
            'video_translation' => 'Video Translation',
            'video_dubbing' => 'Video Dubbing',
            default => 'Unknown'
        };
    }

    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'pending' => 'Pending',
            'processing' => 'Processing',
            'completed' => 'Completed',
            'failed' => 'Failed',
            default => 'Unknown'
        };
    }

    public function getAiServiceLabelAttribute(): string
    {
        return match($this->ai_service) {
            'wav2lip' => 'Wav2Lip',
            'sync_labs' => 'Sync Labs',
            'elevenlabs' => 'ElevenLabs',
            'hey_gen' => 'HeyGen',
            default => ucfirst(str_replace('_', ' ', $this->ai_service))
        };
    }

    public function getLanguagePairAttribute(): string
    {
        return "{$this->source_language} → {$this->target_language}";
    }
}