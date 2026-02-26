// resources/js/Hooks/useAuth.ts
import { useCallback } from 'react';
import { router, usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';
import type { PageProps } from '@/types';
import { useState } from 'react';

export function useAuth() {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user ?? null;
    const isAuthenticated = user !== null;

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    const login = useCallback(async ({ username, password }: { username: string; password: string }) => {
        setIsLoggingIn(true);
        setLoginError(null);

        try {
            await new Promise<void>((resolve, reject) => {
                router.post(
                    '/login',
                    { username, password },
                    {
                        onSuccess: () => {
                            toast.success(`Selamat datang, ${username}!`);
                            resolve();
                        },
                        onError: (errors) => {
                            const msg = errors.username ?? errors.password ?? 'Login gagal';
                            setLoginError(msg);
                            toast.error(msg);
                            reject(new Error(msg));
                        },
                        onFinish: () => setIsLoggingIn(false),
                    },
                );
            });
        } catch {
            // error sudah di-handle di onError
        }
    }, []);

    const logout = useCallback(() => {
        router.post(
            '/logout',
            {},
            {
                onSuccess: () => {
                    toast.success('Sampai jumpa!');
                    // router.visit('/login', { replace: true });
                    window.location.href = '/login';
                },
            },
        );
    }, []);

    return {
        user,
        isAuthenticated,
        login,
        logout,
        isLoggingIn,
        loginError,
    };
}
