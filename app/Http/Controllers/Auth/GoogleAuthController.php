<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\GoogleUser;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleAuthController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirect(): RedirectResponse
    {
        $clientId = config('services.google.client_id');
        $redirectUri = config('services.google.redirect');
        
        if (!$clientId || !$redirectUri) {
            return redirect()->route('login')->with('error', 'Google OAuth not configured.');
        }

        $params = [
            'client_id' => $clientId,
            'redirect_uri' => $redirectUri,
            'response_type' => 'code',
            'scope' => 'openid email profile',
        ];

        $googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);
        
        return redirect($googleAuthUrl);
    }

    /**
     * Handle Google OAuth callback
     */
    public function callback(Request $request): RedirectResponse
    {
        $code = $request->get('code');
        
        if (!$code) {
            return redirect()->route('login')->with('error', 'Authorization code not received.');
        }

        try {
            // Exchange code for access token
            $tokenResponse = Http::asForm()->post('https://oauth2.googleapis.com/token', [
                'code' => $code,
                'client_id' => config('services.google.client_id'),
                'client_secret' => config('services.google.client_secret'),
                'redirect_uri' => config('services.google.redirect'),
                'grant_type' => 'authorization_code',
            ]);

            if (!$tokenResponse->successful()) {
                Log::error('Google OAuth token exchange failed', $tokenResponse->json());
                return redirect()->route('login')->with('error', 'Failed to authenticate with Google.');
            }

            $tokenData = $tokenResponse->json();
            $accessToken = $tokenData['access_token'];

            // Get user info from Google
            $userInfoResponse = Http::withHeaders([
                'Authorization' => "Bearer {$accessToken}",
            ])->get('https://www.googleapis.com/oauth2/v2/userinfo');

            if (!$userInfoResponse->successful()) {
                Log::error('Google OAuth user info failed', $userInfoResponse->json());
                return redirect()->route('login')->with('error', 'Failed to get user information from Google.');
            }

            $userInfo = $userInfoResponse->json();

            // Check if user exists
            $user = User::where('email', $userInfo['email'])->first();

            if (!$user) {
                // Create new user
                $user = User::create([
                    'name' => $userInfo['name'],
                    'email' => $userInfo['email'],
                    'password' => '', // Google users don't have passwords
                    'email_verified_at' => now(), // Google users are automatically verified
                ]);

                // Create Google user record
                GoogleUser::create([
                    'user_id' => $user->id,
                    'google_id' => $userInfo['id'],
                    'email' => $userInfo['email'],
                    'name' => $userInfo['name'],
                    'picture' => $userInfo['picture'],
                ]);

                // TODO: Send welcome email
                // $this->sendGoogleWelcomeEmail($user);
            } else {
                // Check if user has Google account linked
                $googleUser = $user->googleUser;
                
                if (!$googleUser) {
                    // Link Google account to existing user
                    GoogleUser::create([
                        'user_id' => $user->id,
                        'google_id' => $userInfo['id'],
                        'email' => $userInfo['email'],
                        'name' => $userInfo['name'],
                        'picture' => $userInfo['picture'],
                    ]);
                }
            }

            // Log in the user
            Auth::login($user);

            return redirect()->route('dashboard');

        } catch (\Exception $e) {
            Log::error('Google OAuth error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->route('login')->with('error', 'An error occurred during Google authentication.');
        }
    }
}
