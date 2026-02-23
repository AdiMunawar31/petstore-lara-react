import { useEffect } from 'react';
import useAuthStore from '@/Store/authStore';

export default function GuestGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();

    const token = typeof window !== 'undefined' ? sessionStorage.getItem('auth_token') : null;

    useEffect(() => {
        if (isAuthenticated && token) {
            window.location.replace('/dashboard');
        }
    }, [isAuthenticated, token]);

    return <>{children}</>;
}
