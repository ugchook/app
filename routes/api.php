<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AiImageController;
use App\Http\Controllers\Api\AiVideoController;
use App\Http\Controllers\Api\AiContentController;
use App\Http\Controllers\Api\AiSlideshowController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\WebhookController;
use App\Http\Controllers\Api\WorkspaceController;
use App\Http\Controllers\Api\AiVoiceController;
use App\Http\Controllers\Api\AiAvatarController;
use App\Http\Controllers\Api\AiLipSyncController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// AI Image routes
Route::prefix('ai-image')->group(function () {
    Route::get('/', [AiImageController::class, 'index']);
    Route::post('/', [AiImageController::class, 'store']);
    Route::get('/{aiImage}', [AiImageController::class, 'show']);
    Route::put('/{aiImage}', [AiImageController::class, 'update']);
    Route::delete('/{aiImage}', [AiImageController::class, 'destroy']);
});

// AI Video routes
Route::prefix('ai-video')->group(function () {
    Route::get('/', [AiVideoController::class, 'index']);
    Route::post('/', [AiVideoController::class, 'store']);
    Route::get('/{aiVideo}', [AiVideoController::class, 'show']);
    Route::put('/{aiVideo}', [AiVideoController::class, 'update']);
    Route::delete('/{aiVideo}', [AiVideoController::class, 'destroy']);
});

// AI Content routes
Route::prefix('ai-content')->group(function () {
    Route::get('/', [AiContentController::class, 'index']);
    Route::post('/', [AiContentController::class, 'store']);
    Route::get('/{aiContent}', [AiContentController::class, 'show']);
    Route::put('/{aiContent}', [AiContentController::class, 'update']);
    Route::delete('/{aiContent}', [AiContentController::class, 'destroy']);
});

// AI Slideshow routes
Route::prefix('ai-slideshow')->group(function () {
    Route::get('/', [AiSlideshowController::class, 'index']);
    Route::post('/', [AiSlideshowController::class, 'store']);
    Route::get('/{aiSlideshow}', [AiSlideshowController::class, 'show']);
    Route::put('/{aiSlideshow}', [AiSlideshowController::class, 'update']);
    Route::delete('/{aiSlideshow}', [AiSlideshowController::class, 'destroy']);
});

// Campaign routes
Route::prefix('campaign')->group(function () {
    Route::get('/', [CampaignController::class, 'index']);
    Route::post('/', [CampaignController::class, 'store']);
    Route::get('/{campaign}', [CampaignController::class, 'show']);
    Route::put('/{campaign}', [CampaignController::class, 'update']);
    Route::delete('/{campaign}', [CampaignController::class, 'destroy']);
});

// Workspace routes
Route::prefix('workspace')->group(function () {
    Route::get('/', [WorkspaceController::class, 'index']);
    Route::post('/', [WorkspaceController::class, 'store']);
    Route::get('/{workspace}', [WorkspaceController::class, 'show']);
    Route::put('/{workspace}', [WorkspaceController::class, 'update']);
    Route::delete('/{workspace}', [WorkspaceController::class, 'destroy']);
    Route::post('/{workspace}/add-user', [WorkspaceController::class, 'addUser']);
    Route::post('/{workspace}/remove-user', [WorkspaceController::class, 'removeUser']);
    Route::get('/{workspace}/statistics', [WorkspaceController::class, 'statistics']);
});

// AI Voice routes
Route::prefix('ai-voice')->group(function () {
    Route::get('/', [AiVoiceController::class, 'index']);
    Route::post('/', [AiVoiceController::class, 'store']);
    Route::get('/{aiVoice}', [AiVoiceController::class, 'show']);
    Route::put('/{aiVoice}', [AiVoiceController::class, 'update']);
    Route::delete('/{aiVoice}', [AiVoiceController::class, 'destroy']);
    Route::get('/available-voices', [AiVoiceController::class, 'getAvailableVoices']);
});

// AI Avatar routes
Route::prefix('ai-avatar')->group(function () {
    Route::get('/', [AiAvatarController::class, 'index']);
    Route::post('/', [AiAvatarController::class, 'store']);
    Route::get('/{aiAvatar}', [AiAvatarController::class, 'show']);
    Route::put('/{aiAvatar}', [AiAvatarController::class, 'update']);
    Route::delete('/{aiAvatar}', [AiAvatarController::class, 'destroy']);
    Route::get('/available-services', [AiAvatarController::class, 'getAvailableServices']);
});

// AI LipSync routes
Route::prefix('ai-lip-sync')->group(function () {
    Route::get('/', [AiLipSyncController::class, 'index']);
    Route::post('/', [AiLipSyncController::class, 'store']);
    Route::get('/{aiLipSync}', [AiLipSyncController::class, 'show']);
    Route::put('/{aiLipSync}', [AiLipSyncController::class, 'update']);
    Route::delete('/{aiLipSync}', [AiLipSyncController::class, 'destroy']);
    Route::get('/available-services', [AiLipSyncController::class, 'getAvailableServices']);
    Route::get('/supported-languages', [AiLipSyncController::class, 'getSupportedLanguages']);
});

// Webhook routes
Route::post('/webhook/{service}', [WebhookController::class, 'aiService']);
Route::post('/webhook/bfl', [WebhookController::class, 'bfl']);
