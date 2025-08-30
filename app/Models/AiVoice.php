<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AiVoice extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'workspace_id',
        'user_id',
        'name',
        'type', // text_to_speech, speech_to_text, speech_to_speech, voice_clone
        'status', // pending, processing, completed, failed
        'input_text',
        'input_audio_path',
        'output_audio_path',
        'output_text',
        'voice_id', // ElevenLabs voice ID
        'voice_settings',
        'elevenlabs_job_id',
        'processing_time',
        'credits_used',
        'metadata',
        'error_message',
    ];

    protected $casts = [
        'voice_settings' => 'array',
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
            'text_to_speech' => 'Text to Speech',
            'speech_to_text' => 'Speech to Text',
            'speech_to_speech' => 'Speech to Speech',
            'voice_clone' => 'Voice Clone',
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
}