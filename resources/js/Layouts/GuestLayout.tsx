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
            <div className="bg-ios-gray-6 flex min-h-screen items-center justify-center p-4 font-sans">{children}</div>
            <Toaster position="top-center" />
        </GuestGuard>
    );
}
