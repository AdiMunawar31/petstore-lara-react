import { type ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import { Toaster } from 'react-hot-toast';
import GuestGuard from '@/Middleware/GuestGuard';

interface GuestLayoutProps {
    title?: string;
    children: ReactNode;
}

export default function GuestLayout({ title, children }: GuestLayoutProps) {
    return (
        <GuestGuard>
            <Head title={title ?? 'PetStore'} />
            <div className="flex min-h-screen items-center justify-center bg-d2y-gray-6 p-4 font-sans">{children}</div>
            <Toaster position="top-center" />
        </GuestGuard>
    );
}
