import { type ReactNode, lazy, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/common/Navbar';
import { Toaster } from 'react-hot-toast';
import AuthGuard from '@/Middleware/AuthGuard';

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
        <AuthGuard>
            <Head title={title ?? 'PetStore'} />

            <div className="min-h-screen bg-d2y-gray-6 font-sans">
                <Navbar />

                <main className={`${maxWidthClasses[maxWidth]} mx-auto px-4 pt-24 pb-32 sm:px-6`}>{children}</main>
            </div>

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

            {ReactQueryDevtools && (
                <Suspense fallback={null}>
                    <ReactQueryDevtools initialIsOpen={false} />
                </Suspense>
            )}
        </AuthGuard>
    );
}
