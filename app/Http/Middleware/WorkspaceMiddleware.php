<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class WorkspaceMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        $workspaceId = $request->header('X-Workspace-ID');
        
        if (!$workspaceId) {
            // Try to get from user's current workspace
            $currentWorkspace = $user->currentWorkspace;
            if ($currentWorkspace) {
                $request->headers->set('X-Workspace-ID', $currentWorkspace->id);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'No workspace selected. Please select a workspace first.'
                ], 400);
            }
        } else {
            // Validate that user has access to this workspace
            $workspace = \App\Models\Workspace::find($workspaceId);
            if (!$workspace || !$workspace->users()->where('user_id', $user->id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied to this workspace'
                ], 403);
            }
        }

        return $next($request);
    }
}