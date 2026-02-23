import { useEffect } from 'react';
import { router } from '@inertiajs/react';
import useAuthStore from '@/Store/authStore';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, logout } = useAuthStore();

    const token = typeof window !== 'undefined' ? sessionStorage.getItem('auth_token') : null;

    const isValidSession = isAuthenticated && Boolean(token);

    useEffect(() => {
        if (!isValidSession) {
            logout();
            window.location.replace('/login');
        }
    }, [isValidSession, logout]);

    if (!isValidSession) return null;

    return <>{children}</>;
}
