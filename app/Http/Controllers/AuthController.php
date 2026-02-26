<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = [
            'username' => 'user1',
            'password' => bcrypt('user1'),
        ];

        if (
            $data['username'] !== $user['username'] ||
            !Hash::check($data['password'], $user['password'])
        ) {
            return back()->withErrors([
                'username' => 'Username atau password salah.',
            ]);
        }

        $request->session()->put('auth_user', [
            'username' => $user['username'],
        ]);

        $request->session()->regenerate();

        return redirect()->intended('/dashboard');
    }

    public function logout(Request $request)
    {
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
