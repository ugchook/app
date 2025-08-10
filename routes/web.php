<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // AI Avatar routes
    Route::prefix('ai-avatar')->group(function () {
        Route::get('ai-image', function () {
            return Inertia::render('ai-avatar/ai-image');
        })->name('ai-avatar.ai-image');
        
        Route::get('ai-video', function () {
            return Inertia::render('ai-avatar/ai-video');
        })->name('ai-avatar.ai-video');
    });

    // AI UGC routes
    Route::get('ai-ugc', function () {
        return Inertia::render('ai-ugc/ugc-ads');
    })->name('ai-ugc');

    // AI Slideshow routes
    Route::prefix('ai-slideshow')->group(function () {
        Route::get('list', function () {
            return Inertia::render('ai-slideshow/list');
        })->name('ai-slideshow.list');
        
        Route::get('generate/{id}', function ($id) {
            return Inertia::render('ai-slideshow/generate', ['id' => $id]);
        })->name('ai-slideshow.generate');
    });

    // AI Content routes
    Route::prefix('ai-content')->group(function () {
        Route::get('list', function () {
            return Inertia::render('ai-content/list');
        })->name('ai-content.list');
        
        Route::get('generate/{id}', function ($id) {
            return Inertia::render('ai-content/generate', ['id' => $id]);
        })->name('ai-content.generate');
    });

    // Campaign routes
    Route::prefix('campaign')->group(function () {
        Route::get('list', function () {
            return Inertia::render('campaign/list');
        })->name('campaign.list');
        
        Route::get('create', function () {
            return Inertia::render('campaign/create');
        })->name('campaign.create');
        
        Route::get('edit/{id}', function ($id) {
            return Inertia::render('campaign/edit', ['id' => $id]);
        })->name('campaign.edit');
    });

    // Schedule routes
    Route::prefix('schedule')->group(function () {
        Route::get('calendar', function () {
            return Inertia::render('schedule/calendar');
        })->name('schedule.calendar');
        
        Route::get('videos', function () {
            return Inertia::render('schedule/videos');
        })->name('schedule.videos');
    });

    // Settings routes
    Route::prefix('settings')->group(function () {
        Route::get('/', function () {
            return Inertia::render('settings/index');
        })->name('settings.index');
        
        Route::get('password', function () {
            return Inertia::render('settings/password');
        })->name('settings.password');
        
        Route::get('products', function () {
            return Inertia::render('settings/products');
        })->name('settings.products');
        
        Route::get('demos', function () {
            return Inertia::render('settings/demos');
        })->name('settings.demos');
        
        Route::get('connected-accounts', function () {
            return Inertia::render('settings/connected-accounts');
        })->name('settings.connected-accounts');
    });

    // Profile routes
    Route::get('profile', function () {
        return Inertia::render('profile/index');
    })->name('profile');

    // FAQ routes
    Route::get('faq', function () {
        return Inertia::render('faq/index');
    })->name('faq');

    // Subscription routes
    Route::get('subscription', function () {
        return Inertia::render('subscription/index');
    })->name('subscription');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
