import { type ReactNode, lazy, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/common/Navbar';
import { Toaster } from 'react-hot-toast';

// Lazy load ReactQueryDevtools hanya di development (bukan di bundle production)
const ReactQueryDevtools = import.meta.env.DEV
    ? lazy(() =>
          import('@tanstack/react-query-devtools').then((mod) => ({
              default: mod.ReactQueryDevtools,
          })),
      )
    : null;

interface AppLayoutProps {
    title?: string;
    children: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '6xl' | 'full';
}

const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full',
};

export default function AppLayout({ title, children, maxWidth = '6xl' }: AppLayoutProps) {
    return (
        <>
            <Head title={title ?? 'PetStore'} />

            {/* Background */}
            <div className="bg-ios-gray-6 min-h-screen font-sans">
                <Navbar />

                {/* Content — offset by navbar height */}
                <main className={`${maxWidthClasses[maxWidth]} mx-auto px-4 pt-20 pb-10 sm:px-6`}>{children}</main>
            </div>

            {/* Toast notifications */}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#fff',
                        color: '#1c1c1e',
                        fontSize: '14px',
                        fontWeight: 500,
                        borderRadius: '12px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                        padding: '12px 16px',
                    },
                    success: { iconTheme: { primary: '#34C759', secondary: '#fff' } },
                    error: { iconTheme: { primary: '#FF3B30', secondary: '#fff' } },
                }}
            />

            {/* Dev tools */}
            {ReactQueryDevtools && (
                <Suspense fallback={null}>
                    <ReactQueryDevtools initialIsOpen={false} />
                </Suspense>
            )}
        </>
    );
}
