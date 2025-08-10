<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScheduledVideo extends Model
{
    protected $fillable = [
        'user_id',
        'platform',
        'user_platform_id',
        'video_type',
        'video_id',
        'options',
        'schedule_at',
        'status',
        'note',
    ];

    protected $casts = [
        'options' => 'array',
        'schedule_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
