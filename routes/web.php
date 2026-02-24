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


// ─── Pets ─────────────────────────────────────────────────────────────────────

Route::get('/pets', function () {
    return Inertia::render('Pets/Index');
})->name('pets.index');

Route::get('/pets/create', function () {
    return Inertia::render('Pets/Create');
})->name('pets.create');

Route::get('/pets/{id}', function (string $id) {
    return Inertia::render('Pets/Show', ['id' => $id]);
})->name('pets.show');

Route::get('/pets/{id}/edit', function (string $id) {
    return Inertia::render('Pets/Edit', ['id' => $id]);
})->name('pets.edit');

// ─── Store ────────────────────────────────────────────────────────────────────

Route::get('/store', function () {
    return Inertia::render('Store/Index');
})->name('store.index');