<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Workspace;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class WorkspaceController extends Controller
{
    /**
     * Display a listing of workspaces for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $workspaces = $user->workspaces()->with('users')->get();

        return response()->json([
            'success' => true,
            'data' => $workspaces,
            'message' => 'Workspaces retrieved successfully'
        ]);
    }

    /**
     * Store a newly created workspace.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'subscription_plan' => 'nullable|string|in:free,basic,pro,enterprise',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        
        // Check if user can create more workspaces
        $workspaceCount = $user->workspaces()->count();
        if ($workspaceCount >= 5) { // Limit to 5 workspaces per user
            return response()->json([
                'success' => false,
                'message' => 'You have reached the maximum number of workspaces allowed'
            ], 403);
        }

        $workspace = Workspace::create([
            'name' => $request->name,
            'description' => $request->description,
            'slug' => Str::slug($request->name) . '-' . Str::random(6),
            'subscription_plan' => $request->subscription_plan ?? 'free',
            'settings' => [
                'theme' => 'light',
                'language' => 'en',
                'timezone' => 'UTC'
            ]
        ]);

        // Add user as owner
        $workspace->users()->attach($user->id, [
            'role' => 'owner',
            'permissions' => ['*'],
            'joined_at' => now()
        ]);

        $workspace->load('users');

        return response()->json([
            'success' => true,
            'data' => $workspace,
            'message' => 'Workspace created successfully'
        ], 201);
    }

    /**
     * Display the specified workspace.
     */
    public function show(Workspace $workspace): JsonResponse
    {
        $user = Auth::user();
        
        if (!$workspace->users()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied to this workspace'
            ], 403);
        }

        $workspace->load(['users', 'aiVoices', 'aiAvatars', 'aiLipSyncs']);

        return response()->json([
            'success' => true,
            'data' => $workspace,
            'message' => 'Workspace retrieved successfully'
        ]);
    }

    /**
     * Update the specified workspace.
     */
    public function update(Request $request, Workspace $workspace): JsonResponse
    {
        $user = Auth::user();
        $workspaceUser = $workspace->users()->where('user_id', $user->id)->first();
        
        if (!$workspaceUser || !$workspaceUser->hasPermission('manage_content')) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied to update this workspace'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'settings' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $workspace->update($request->only(['name', 'description', 'settings']));

        return response()->json([
            'success' => true,
            'data' => $workspace,
            'message' => 'Workspace updated successfully'
        ]);
    }

    /**
     * Remove the specified workspace.
     */
    public function destroy(Workspace $workspace): JsonResponse
    {
        $user = Auth::user();
        $workspaceUser = $workspace->users()->where('user_id', $user->id)->first();
        
        if (!$workspaceUser || $workspaceUser->role !== 'owner') {
            return response()->json([
                'success' => false,
                'message' => 'Only workspace owners can delete workspaces'
            ], 403);
        }

        $workspace->delete();

        return response()->json([
            'success' => true,
            'message' => 'Workspace deleted successfully'
        ]);
    }

    /**
     * Add a user to the workspace.
     */
    public function addUser(Request $request, Workspace $workspace): JsonResponse
    {
        $user = Auth::user();
        $workspaceUser = $workspace->users()->where('user_id', $user->id)->first();
        
        if (!$workspaceUser || !$workspaceUser->canManageUsers()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied to manage users in this workspace'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'role' => 'required|string|in:admin,member,viewer',
            'permissions' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $newUser = User::where('email', $request->email)->first();
        
        if ($workspace->users()->where('user_id', $newUser->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'User is already a member of this workspace'
            ], 422);
        }

        $workspace->users()->attach($newUser->id, [
            'role' => $request->role,
            'permissions' => $request->permissions ?? [],
            'joined_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User added to workspace successfully'
        ]);
    }

    /**
     * Remove a user from the workspace.
     */
    public function removeUser(Request $request, Workspace $workspace): JsonResponse
    {
        $user = Auth::user();
        $workspaceUser = $workspace->users()->where('user_id', $user->id)->first();
        
        if (!$workspaceUser || !$workspaceUser->canManageUsers()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied to manage users in this workspace'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $userToRemove = $workspace->users()->where('user_id', $request->user_id)->first();
        
        if (!$userToRemove) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a member of this workspace'
            ], 422);
        }

        if ($userToRemove->role === 'owner') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot remove workspace owner'
            ], 422);
        }

        $workspace->users()->detach($request->user_id);

        return response()->json([
            'success' => true,
            'message' => 'User removed from workspace successfully'
        ]);
    }

    /**
     * Get workspace statistics.
     */
    public function statistics(Workspace $workspace): JsonResponse
    {
        $user = Auth::user();
        
        if (!$workspace->users()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied to this workspace'
            ], 403);
        }

        $stats = [
            'ai_voices_count' => $workspace->aiVoices()->count(),
            'ai_avatars_count' => $workspace->aiAvatars()->count(),
            'ai_lip_syncs_count' => $workspace->aiLipSyncs()->count(),
            'ai_images_count' => $workspace->aiImages()->count(),
            'ai_videos_count' => $workspace->aiVideos()->count(),
            'campaigns_count' => $workspace->campaigns()->count(),
            'users_count' => $workspace->users()->count(),
            'credits_balance' => $workspace->credits_balance,
            'subscription_status' => $workspace->hasActiveSubscription() ? 'active' : 'inactive',
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
            'message' => 'Workspace statistics retrieved successfully'
        ]);
    }
}