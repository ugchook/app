<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    /**
     * Handle the incoming request.
     * Override to conditionally enable SSR only for the welcome page.
     */
    public function handle(Request $request, \Closure $next)
    {
        // Only enable SSR for the welcome page (root path)
        if (!$this->shouldEnableSsr($request)) {
            // Temporarily disable SSR for non-welcome pages
            config(['inertia.ssr.enabled' => false]);
        }

        $response = parent::handle($request, $next);

        // Re-enable SSR after the request is handled
        if (!$this->shouldEnableSsr($request)) {
            config(['inertia.ssr.enabled' => true]);
        }

        return $response;
    }

    /**
     * Determine if SSR should be enabled for the current request.
     */
    protected function shouldEnableSsr(Request $request): bool
    {
        // Only enable SSR for the welcome page (root path)
        return $request->is('/') || $request->path() === '';
    }
}
