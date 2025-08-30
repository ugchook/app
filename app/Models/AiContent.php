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

    /**
     * Get type attribute
     */
    public function getTypeAttribute($value)
    {
        return $value ?? 'Storytelling';
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
     * Get output attribute
     */
    public function getOutputAttribute($value)
    {
        return json_decode($value, true) ?? [];
    }

    /**
     * Set output attribute
     */
    public function setOutputAttribute($value)
    {
        $this->attributes['output'] = json_encode($value);
    }
}
