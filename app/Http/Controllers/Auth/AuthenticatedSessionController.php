<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    // /**
    //  * Handle an incoming authentication request.
    //  */
    public function store(LoginRequest $request): RedirectResponse
    {
        //todo
        $request->authenticate();

        $request->session()->regenerate();
        
        return redirect()->intended(route('main', absolute: false));
    }

    // public function store(LoginRequest $request): RedirectResponse
    // {
    //     // Get the validated credentials
    //     $credentials = $request->only('email', 'password');

    //     // Append secret key from .env to password
    //     $credentials['password'] .= env('PASSWORD_KEY');

    //     // Get the user by email
    //     $user = \App\Models\User::where('email', $credentials['email'])->first();

    //     // Check password manually with appended key
    //     if (! $user || ! \Illuminate\Support\Facades\Hash::check($credentials['password'], $user->password)) {
    //         throw \Illuminate\Validation\ValidationException::withMessages([
    //             'email' => __('auth.failed'),
    //         ]);
    //     }

    //     // Log the user in
    //     \Illuminate\Support\Facades\Auth::login($user, $request->boolean('remember'));

    //     // Regenerate session for security
    //     $request->session()->regenerate();

    //     // Redirect to intended route
    //     return redirect()->intended(route('dashboard', absolute: false));
    // }    

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
