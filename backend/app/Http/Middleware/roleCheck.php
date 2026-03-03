<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class roleCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $guard, $role): Response
    {
        if (Auth::guard($guard)->user()->role != $role) {
            return response()->json([
                'status' => 'Forbidden Access'
            ], 403);
        }
        return $next($request);
    }
}
