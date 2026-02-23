import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser } from '@/types';

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;

    // Actions
    login: (username: string, token: string) => void;
    logout: () => void;
    getToken: () => string | null;
}

/**
 * Auth Store — Global state untuk autentikasi
 *
 * Menggunakan Zustand dengan persist middleware.
 * State disimpan di sessionStorage (bukan localStorage) untuk keamanan:
 * - Otomatis hilang saat tab/browser ditutup
 * - Tidak bisa diakses oleh tab lain
 *
 * Token juga disimpan di sessionStorage terpisah agar mudah diakses
 * oleh Axios interceptor tanpa harus import store (hindari circular dependency).
 */
const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,

            login: (username: string, token: string) => {
                const user: AuthUser = { username, token };
                set({ user, isAuthenticated: true });

                sessionStorage.setItem('auth_token', token);
                sessionStorage.setItem('auth_user', JSON.stringify(user));
            },

            logout: () => {
                set({ user: null, isAuthenticated: false });

                sessionStorage.removeItem('auth_token');
                sessionStorage.removeItem('auth_user');
            },

            getToken: () => {
                return get().user?.token ?? null;
            },
        }),
        {
            name: 'auth-session',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        },
    ),
);

export default useAuthStore;
