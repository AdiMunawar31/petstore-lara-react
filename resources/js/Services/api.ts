import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * Service Layer — Konfigurasi Axios Instance
 *
 * Semua pemanggilan HTTP ke API eksternal melewati instance ini.
 * Tidak ada komponen yang boleh mengimport axios langsung.
 *
 * Keamanan:
 * - API Key tidak pernah dikirim dari client dalam format mentah
 * - Token autentikasi disimpan di memory (Zustand) dan dikirim via header
 * - Di mode development, request diproxy lewat Vite server (hindari CORS)
 * - Di mode production, request langsung ke VITE_API_BASE_URL
 */

// Tentukan base URL:
// Development → /api-proxy (diforward Vite ke petstore.swagger.io/v2)
// Production  → nilai VITE_API_BASE_URL di .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api-proxy';

const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 15_000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Sisipkan Authorization token ke setiap request secara otomatis
apiClient.interceptors.request.use(
    (config) => {
        // Ambil token dari sessionStorage (lebih aman dari localStorage)
        const token = sessionStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Tangani error global dan transform response
apiClient.interceptors.response.use(
    (response) => {
        // Langsung kembalikan data agar tidak perlu response.data di setiap service
        return response.data;
    },
    (error: AxiosError<{ message?: string }>) => {
        const status = error.response?.status;
        const message = error.response?.data?.message ?? error.message;

        // 401 Unauthorized → hapus session dan redirect ke login
        if (status === 401) {
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('auth_user');
            window.location.href = '/login';
        }

        // 404 Not Found → pesan yang lebih ramah
        if (status === 404) {
            return Promise.reject(new Error('Data tidak ditemukan.'));
        }

        // 500 Server Error
        if (status && status >= 500) {
            return Promise.reject(new Error('Server sedang bermasalah. Coba lagi nanti.'));
        }

        return Promise.reject(new Error(message));
    },
);

export default apiClient;
