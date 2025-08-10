<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiContent extends Model
{
    protected $fillable = [
        'user_id',
        'prompt',
        'input',
        'output',
        'status',
        'source',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
