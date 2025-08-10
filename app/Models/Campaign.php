<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Campaign extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'platform',
        'user_platform_id',
        'content_type',
        'content_description',
        'status',
        'configuration',
        'next_video_at',
    ];

    protected $casts = [
        'configuration' => 'array',
        'next_video_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
