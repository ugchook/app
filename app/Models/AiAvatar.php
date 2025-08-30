<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AiAvatar extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'workspace_id',
        'user_id',
        'name',
        'type', // text_to_image, image_to_video
        'status', // pending, processing, completed, failed
        'prompt',
        'negative_prompt',
        'input_image_path',
        'output_image_path',
        'output_video_path',
        'generation_settings',
        'ai_service', // stable_diffusion, midjourney, dalle, etc.
        'service_job_id',
        'processing_time',
        'credits_used',
        'metadata',
        'error_message',
    ];

    protected $casts = [
        'generation_settings' => 'array',
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
            'text_to_image' => 'Text to Image',
            'image_to_video' => 'Image to Video',
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
            'stable_diffusion' => 'Stable Diffusion',
            'midjourney' => 'Midjourney',
            'dalle' => 'DALL-E',
            'leonardo' => 'Leonardo AI',
            default => ucfirst(str_replace('_', ' ', $this->ai_service))
        };
    }
}