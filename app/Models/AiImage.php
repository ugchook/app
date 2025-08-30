<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class AiImage extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'workspace_id',
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

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function videos(): HasMany
    {
        return $this->hasMany(AiVideo::class, 'image_id');
    }

    public function getImageUrlAttribute()
    {
        if ($this->url) {
            return asset('storage/' . $this->url);
        }
        return null;
    }

    public function getThumbnailUrlAttribute()
    {
        if ($this->url) {
            return asset('storage/' . $this->url);
        }
        return null;
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
}
