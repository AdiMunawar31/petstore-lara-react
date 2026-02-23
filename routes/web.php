<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─── Guest Routes ─────────────────────────────────────────────────────────────

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::get('/', function () {
    return redirect('/dashboard');
});

// ─── Authenticated Routes ─────────────────────────────────────────────────────
// Catatan: Karena tidak menggunakan Laravel Auth, guard diabaikan.
// Autentikasi dihandle sepenuhnya di sisi React (Zustand + sessionStorage).

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');