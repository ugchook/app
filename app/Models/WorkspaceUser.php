<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class WorkspaceUser extends Pivot
{
    protected $table = 'workspace_users';

    protected $fillable = [
        'user_id',
        'workspace_id',
        'role',
        'permissions',
        'joined_at',
    ];

    protected $casts = [
        'permissions' => 'array',
        'joined_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }

    public function hasPermission(string $permission): bool
    {
        if ($this->role === 'owner') {
            return true;
        }

        if ($this->role === 'admin') {
            return in_array($permission, ['manage_users', 'manage_content', 'manage_billing']);
        }

        return in_array($permission, $this->permissions ?? []);
    }

    public function canManageUsers(): bool
    {
        return $this->hasPermission('manage_users');
    }

    public function canManageContent(): bool
    {
        return $this->hasPermission('manage_content');
    }

    public function canManageBilling(): bool
    {
        return $this->hasPermission('manage_billing');
    }
}