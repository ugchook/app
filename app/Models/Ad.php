<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ad extends Model
{
    protected $fillable = [
        'user_id',
        'hook_text',
        'video_id',
        'demo_id',
        'music_id',
        'configuration',
        'thumbnail_url',
        'url',
        'status',
        'source',
    ];

    protected $casts = [
        'configuration' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
