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

    /**
     * Get type attribute
     */
    public function getTypeAttribute($value)
    {
        return $value ?? 'Educational Listical';
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
        if ($this->output_video) {
            return json_decode($this->output_video, true) ?? [];
        }
        return json_decode($this->output_image, true) ?? [];
    }

    /**
     * Set output attribute
     */
    public function setOutputAttribute($value)
    {
        // For slideshows, we store in output_image by default
        $this->attributes['output_image'] = json_encode($value);
    }
}
