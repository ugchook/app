<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

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

    public function aiSlideshows(): HasMany
    {
        return $this->hasMany(AiSlideshow::class);
    }

    public function aiContents(): HasMany
    {
        return $this->hasMany(AiContent::class);
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

    public function googleUser(): HasOne
    {
        return $this->hasOne(GoogleUser::class);
    }

    public function workspaces(): BelongsToMany
    {
        return $this->belongsToMany(Workspace::class, 'workspace_users')
            ->withPivot('role', 'permissions', 'joined_at')
            ->withTimestamps();
    }

    public function ownedWorkspaces(): HasMany
    {
        return $this->hasMany(Workspace::class, 'owner_id');
    }

    public function getCurrentWorkspaceAttribute()
    {
        return $this->workspaces()->first();
    }

    /**
     * Check if user has active subscription
     */
    public function hasActiveSubscription(): bool
    {
        // TODO: Implement subscription logic
        // For now, return true to allow development
        return true;
    }

    /**
     * Get user credits
     */
    public function getCreditsAttribute(): int
    {
        // TODO: Implement credits logic
        // For now, return 100 to allow development
        return 100;
    }

    /**
     * Decrement user credits
     */
    public function decrementCredits(int $amount = 1): void
    {
        // TODO: Implement credits decrement logic
        // For now, do nothing to allow development
    }
}
