import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * TanStack Query Client — konfigurasi global cache dan retry
 */
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 3, // 3 menit
            gcTime: 1000 * 60 * 10, // 10 menit
            retry: (failureCount, error) => {
                // Jangan retry untuk 404 dan 401
                const message = (error as Error).message ?? '';
                if (message.includes('tidak ditemukan') || message.includes('401')) return false;
                return failureCount < 1;
            },
            refetchOnWindowFocus: false, // Nonaktifkan refetch saat window focus
        },
    },
});

const appName = import.meta.env.VITE_APP_NAME || 'PETSTORE LARA REACT';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <QueryClientProvider client={queryClient}>
                <App {...props} />
            </QueryClientProvider>,
        );
    },
    progress: {
        color: '#007AFF', // Blue
        delay: 100, // Tampil hanya jika navigasi >100ms
    },
});
