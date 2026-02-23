import { type ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import { Toaster } from 'react-hot-toast';

interface GuestLayoutProps {
    title?: string;
    children: ReactNode;
}

export default function GuestLayout({ title, children }: GuestLayoutProps) {
    return (
        <>
            <Head title={title ?? 'PetStore'} />
            <div className="min-h-screen bg-ios-gray-6 flex items-center justify-center p-4 font-sans">
                {children}
            </div>
            <Toaster position="top-center" />
        </>
    );
}
