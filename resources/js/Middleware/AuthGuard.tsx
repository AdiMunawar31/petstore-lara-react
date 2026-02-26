import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import React from 'react';

console.log('React version root:', React.version);

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { auth } = usePage<PageProps>().props;
    console.log('auth : ', auth);

    if (!auth?.user) return null;

    return <>{children}</>;
}
