<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'guard' => App\Http\Middleware\ensureGuard::class,
            'role' => App\Http\Middleware\roleCheck::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function(ValidationException $e, $req) {
            return response()->json([
                'status' => 'input invalid',
                'error' => $e->errors()
            ], 400);
        });

        $exceptions->render(function(AuthenticationException $e, $req) {
            return response()->json([
                'status' => 'Unauthenticated',
                'message' => 'token is invalid or expired'
            ], 401);
        });
    })->create();
