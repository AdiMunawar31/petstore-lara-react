<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthSession
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->session()->has('auth_user')) {
             // Jika request datang dari Inertia (SPA navigation)
            if ($request->header('X-Inertia')) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }

            // Jika request biasa (reload, direct access)
            return redirect()->route('login');
        }

        return $next($request);
    }
}