<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiSlideshow extends Model
{
    protected $fillable = [
        'user_id',
        'prompt',
        'input',
        'output_image',
        'output_video',
        'status',
        'source',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
