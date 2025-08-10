<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('auth/forgot-password', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status == Password::RESET_LINK_SENT) {
            $message = __($status);
            
            // Check if this is an API request
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'status' => true,
                    'message' => $message,
                ]);
            }

            return back()->with('status', $message);
        }

        $message = __($status);
        
        // Check if this is an API request
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'status' => false,
                'message' => $message,
            ], 400);
        }

        throw ValidationException::withMessages([
            'email' => [$message],
        ]);
    }
}
