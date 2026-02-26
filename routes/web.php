<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| API Proxy (Petstore / External API)
|--------------------------------------------------------------------------
| Semua request /api-proxy/* akan diteruskan ke API eksternal
| Digunakan untuk DEV agar tidak kena CORS
*/
Route::prefix('api-proxy')->group(function () {
    Route::any('{path}', function (Request $request, string $path) {

        $url = "https://petstore.swagger.io/v2/{$path}";

        try {
            $response = Http::timeout(15)
                ->acceptJson()
                ->withOptions([
                    'http_errors' => false,
                ])
                ->send(
                    $request->method(),
                    $url,
                    [
                        'query' => $request->query(),
                        'json'  => $request->except(['_token']),
                    ]
                );

            return response()->json(
                $response->json(),
                $response->status()
            );

        } catch (\Throwable $e) {
            Log::error('API Proxy Error', [
                'url' => $url,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'External API failed',
                'error'   => $e->getMessage(),
            ], 502);
        }
    })->where('path', '.*');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
});

Route::middleware('auth.session')->group(function () {
    Route::redirect('/', '/dashboard');

    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');

    Route::prefix('pets')->name('pets.')->group(function () {
        Route::get('/', fn() => Inertia::render('Pets/Index'))->name('index');
        Route::get('/create', fn() => Inertia::render('Pets/Create'))->name('create');
        Route::get('/{id}', fn(string $id) => Inertia::render('Pets/Show', compact('id')))->name('show');
        Route::get('/{id}/edit', fn(string $id) => Inertia::render('Pets/Edit', compact('id')))->name('edit');
    });

    Route::get('/store', fn() => Inertia::render('Store/Index'))->name('store.index');
    Route::get('/users', fn() => Inertia::render('User/Index'))->name('users.index');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

Route::fallback(fn() => redirect('/login'));