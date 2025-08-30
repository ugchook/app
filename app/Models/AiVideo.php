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

    /**
     * Get configuration attribute
     */
    public function getConfigurationAttribute($value)
    {
        return json_decode($value, true) ?? [];
    }

    /**
     * Set configuration attribute
     */
    public function setConfigurationAttribute($value)
    {
        $this->attributes['configuration'] = json_encode($value);
    }

    /**
     * Get metadata attribute
     */
    public function getMetadataAttribute($value)
    {
        return json_decode($value, true) ?? [];
    }

    /**
     * Set metadata attribute
     */
    public function setMetadataAttribute($value)
    {
        $this->attributes['metadata'] = json_encode($value);
    }

    /**
     * Get thumbnail_url attribute
     */
    public function getThumbnailUrlAttribute()
    {
        return $this->image_thumbnail ? asset('storage/' . $this->image_thumbnail) : null;
    }

    /**
     * Get duration attribute
     */
    public function getDurationAttribute($value)
    {
        return $value ?? 0;
    }
}
