import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function GuestGuard({ children }: { children: React.ReactNode }) {
    const { auth } = usePage<PageProps>().props;

    useEffect(() => {
        if (auth?.user) {
            window.location.replace('/dashboard');
        }
    }, [auth?.user]);

    if (auth?.user) return null;

    return <>{children}</>;
}
