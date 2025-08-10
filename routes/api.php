<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AiImageController;
use App\Http\Controllers\Api\AiVideoController;
use App\Http\Controllers\Api\CampaignController;

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
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('image')->group(function () {
        Route::get('/list', [AiImageController::class, 'index']);
        Route::post('/generate', [AiImageController::class, 'store']);
        Route::get('/{aiImage}', [AiImageController::class, 'show']);
    });

    // AI Video routes
    Route::prefix('video')->group(function () {
        Route::get('/list', [AiVideoController::class, 'index']);
        Route::post('/generate', [AiVideoController::class, 'store']);
        Route::get('/{aiVideo}', [AiVideoController::class, 'show']);
    });

    // Campaign routes
    Route::prefix('campaign')->group(function () {
        Route::get('/list', [CampaignController::class, 'index']);
        Route::post('/create', [CampaignController::class, 'store']);
        Route::get('/{campaign}', [CampaignController::class, 'show']);
        Route::put('/{campaign}', [CampaignController::class, 'update']);
        Route::delete('/{campaign}', [CampaignController::class, 'destroy']);
    });
});
