<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AiImage extends Model
{
    protected $fillable = [
        'user_id',
        'prompt',
        'options',
        'url',
        'bfl_id',
        'origin_url',
        'status',
    ];

    protected $casts = [
        'options' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function videos(): HasMany
    {
        return $this->hasMany(AiVideo::class, 'image_id');
    }
}
