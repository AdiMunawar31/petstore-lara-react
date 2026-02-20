import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { router } from '@inertiajs/react';
import { userService } from '@/Services/userService';
import useAuthStore from '@/Store/authStore';
import toast from 'react-hot-toast';

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
        onSuccess: (tokenResponse, { username }) => {
            // PetStore mengembalikan string seperti: "logged in user session:xxx"
            // Kita extract atau gunakan langsung sebagai token
            const token = typeof tokenResponse === 'string' ? tokenResponse : String(tokenResponse);

            login(username, token);
            toast.success(`Selamat datang, ${username}!`);
            router.visit('/dashboard');
        },
        onError: (error) => {
            toast.error(`Login gagal: ${error.message}`);
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
