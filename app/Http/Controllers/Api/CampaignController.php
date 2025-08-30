<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CampaignController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $page = $request->get('page', 1);
        $limit = $request->get('limit', 12);
        $status = $request->get('status', 'all');

        $query = Campaign::where('user_id', $user->id);

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $campaigns = $query->orderBy('created_at', 'desc')
            ->paginate($limit, ['*'], 'page', $page);

        // Calculate next video time for each campaign
        $campaigns->getCollection()->transform(function ($campaign) {
            $config = json_decode($campaign->configuration, true);
            $scheduleTimes = $config['scheduleTimes'] ?? [];
            
            if (!empty($scheduleTimes)) {
                $campaign->nextVideoAt = $this->calculateNextVideoTime($scheduleTimes);
            } else {
                $campaign->nextVideoAt = null;
            }
            
            return $campaign;
        });

        return response()->json([
            'status' => true,
            'campaigns' => $campaigns->items(),
            'totalPage' => $campaigns->lastPage(),
            'currentPage' => $campaigns->currentPage(),
            'total' => $campaigns->total()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        
        // Check subscription
        if (!$user->hasActiveSubscription()) {
            return response()->json([
                'status' => false,
                'message' => 'Active subscription required'
            ], 400);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'contentType' => 'required|string|in:ai-avatar,ai-content,ai-slideshow',
            'contentDescription' => 'required|string|max:2000',
            'configuration' => 'required|array',
            'autoPublishAccount' => 'nullable|string'
        ]);

        // Create campaign
        $campaign = Campaign::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'content_type' => $request->contentType,
            'content_description' => $request->contentDescription,
            'status' => 'active',
            'configuration' => json_encode($request->configuration),
            'user_platform_id' => $request->autoPublishAccount
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Campaign created successfully',
            'data' => $campaign
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Campaign $campaign)
    {
        $user = $request->user();
        
        if ($campaign->user_id !== $user->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        }

        // Calculate next video time
        $config = json_decode($campaign->configuration, true);
        $scheduleTimes = $config['scheduleTimes'] ?? [];
        
        if (!empty($scheduleTimes)) {
            $campaign->nextVideoAt = $this->calculateNextVideoTime($scheduleTimes);
        }

        return response()->json([
            'status' => true,
            'campaign' => $campaign
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Campaign $campaign)
    {
        $user = $request->user();
        
        if ($campaign->user_id !== $user->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'contentDescription' => 'sometimes|string|max:2000',
            'status' => 'sometimes|string|in:active,inactive,deleted',
            'configuration' => 'sometimes|array',
            'autoPublishAccount' => 'nullable|string'
        ]);

        $updateData = $request->only(['name', 'contentDescription', 'status', 'autoPublishAccount']);
        
        if ($request->has('configuration')) {
            $updateData['configuration'] = json_encode($request->configuration);
        }

        if ($request->has('autoPublishAccount')) {
            $updateData['user_platform_id'] = $request->autoPublishAccount;
        }

        $campaign->update($updateData);

        return response()->json([
            'status' => true,
            'message' => 'Campaign updated successfully',
            'data' => $campaign
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Campaign $campaign)
    {
        $user = $request->user();
        
        if ($campaign->user_id !== $user->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        }

        $campaign->delete();

        return response()->json([
            'status' => true,
            'message' => 'Campaign deleted successfully'
        ]);
    }

    /**
     * Calculate next video time based on schedule times
     */
    private function calculateNextVideoTime($scheduleTimes)
    {
        if (empty($scheduleTimes)) {
            return null;
        }

        $now = now();
        $nextTime = null;

        foreach ($scheduleTimes as $time) {
            $timeParts = explode(':', $time);
            $hour = (int) $timeParts[0];
            $minute = (int) $timeParts[1];

            $todayTime = $now->copy()->setTime($hour, $minute, 0);
            
            // If time has passed today, check tomorrow
            if ($todayTime->isPast()) {
                $todayTime->addDay();
            }

            if ($nextTime === null || $todayTime->lt($nextTime)) {
                $nextTime = $todayTime;
            }
        }

        return $nextTime ? $nextTime->toISOString() : null;
    }

    /**
     * Get content type name
     */
    public static function getContentTypeName($type)
    {
        switch ($type) {
            case 'ai-avatar':
                return 'AI Avatar';
            case 'ai-content':
                return 'AI Content';
            case 'ai-slideshow':
                return 'AI Slideshow';
            default:
                return ucfirst(str_replace('-', ' ', $type));
        }
    }

    /**
     * Get content type icon
     */
    public static function getContentTypeIcon($type)
    {
        switch ($type) {
            case 'ai-avatar':
                return '👤';
            case 'ai-content':
                return '📝';
            case 'ai-slideshow':
                return '🎬';
            default:
                return '📄';
        }
    }
}
