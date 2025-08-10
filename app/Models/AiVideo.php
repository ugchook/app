<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiVideo extends Model
{
    protected $fillable = [
        'user_id',
        'prompt',
        'image_id',
        'image_thumbnail',
        'options',
        'url',
        'fal_id',
        'fal_url',
        'status',
        'source',
    ];

    protected $casts = [
        'options' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function image(): BelongsTo
    {
        return $this->belongsTo(AiImage::class, 'image_id');
    }
}
