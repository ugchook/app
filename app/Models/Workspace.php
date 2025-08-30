<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Workspace extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'slug',
        'settings',
        'is_active',
        'subscription_plan',
        'subscription_expires_at',
        'credits_balance',
        'max_users',
        'max_storage_gb',
    ];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
        'subscription_expires_at' => 'datetime',
        'credits_balance' => 'integer',
        'max_users' => 'integer',
        'max_storage_gb' => 'integer',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'workspace_users')
            ->withPivot('role', 'permissions', 'joined_at')
            ->withTimestamps();
    }

    public function aiVoices(): HasMany
    {
        return $this->hasMany(AiVoice::class);
    }

    public function aiAvatars(): HasMany
    {
        return $this->hasMany(AiAvatar::class);
    }

    public function aiLipSyncs(): HasMany
    {
        return $this->hasMany(AiLipSync::class);
    }

    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class);
    }

    public function aiImages(): HasMany
    {
        return $this->hasMany(AiImage::class);
    }

    public function aiVideos(): HasMany
    {
        return $this->hasMany(AiVideo::class);
    }

    public function aiContents(): HasMany
    {
        return $this->hasMany(AiContent::class);
    }

    public function aiSlideshows(): HasMany
    {
        return $this->hasMany(AiSlideshow::class);
    }

    public function scheduledVideos(): HasMany
    {
        return $this->hasMany(ScheduledVideo::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function demos(): HasMany
    {
        return $this->hasMany(Demo::class);
    }

    public function music(): HasMany
    {
        return $this->hasMany(Music::class);
    }

    public function ads(): HasMany
    {
        return $this->hasMany(Ad::class);
    }

    public function hasActiveSubscription(): bool
    {
        if (!$this->subscription_expires_at) {
            return false;
        }
        return $this->subscription_expires_at->isFuture();
    }

    public function hasCredits(int $amount = 1): bool
    {
        return $this->credits_balance >= $amount;
    }

    public function decrementCredits(int $amount = 1): void
    {
        $this->decrement('credits_balance', $amount);
    }

    public function incrementCredits(int $amount = 1): void
    {
        $this->increment('credits_balance', $amount);
    }
}