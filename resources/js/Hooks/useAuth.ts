import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { router } from '@inertiajs/react';
import { userService } from '@/Services/userService';
import useAuthStore from '@/Store/authStore';
import toast from 'react-hot-toast';

const VALID_USERS = [{ username: 'user1', password: 'user1' }];

/**
 * useAuth — Custom hook untuk operasi autentikasi
 *
 * Menggabungkan Zustand store dengan TanStack Query mutation
 * untuk login/logout yang terintegrasi dengan UI state.
 */
export function useAuth() {
    const { user, isAuthenticated, login, logout } = useAuthStore();

    // ─── Login Mutation ───────────────────────────────────────────────────────
    const loginMutation = useMutation<string, Error, { username: string; password: string }>({
        mutationFn: ({ username, password }) => userService.login(username, password),

        onSuccess: (_, { username, password }) => {
            const isValid = VALID_USERS.some((u) => u.username === username && u.password === password);

            if (!isValid) {
                toast.error('Username atau password salah');
                return;
            }

            // 🪙 TOKEN SIMULASI
            const fakeToken = btoa(`${username}:${Date.now()}`);

            login(username, fakeToken);
            toast.success(`Selamat datang, ${username}`);
            router.visit('/dashboard');
        },

        onError: () => {
            toast.error('Login gagal');
        },
    });

    // ─── Logout ───────────────────────────────────────────────────────────────
    const handleLogout = useCallback(async () => {
        try {
            await userService.logout();
        } catch {
            // Tetap logout meski API call gagal
        } finally {
            logout();
            router.visit('/login');
        }
    }, [logout]);

    return {
        user,
        isAuthenticated,
        login: loginMutation.mutate,
        logout: handleLogout,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,
    };
}
