import axios, { AxiosInstance, AxiosError } from 'axios';

const BASE_URL = import.meta.env.DEV ? '/api-proxy' : (import.meta.env.VITE_API_BASE_URL as string);

const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 15_000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => config,
    (error: AxiosError) => Promise.reject(error),
);

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string }>) => {
        const status = error.response?.status;
        const message = error.response?.data?.message ?? error.message;

        if (status === 401) {
            window.location.href = '/login';
        }

        if (status === 404) return Promise.reject(new Error('Data tidak ditemukan.'));
        if (status && status >= 500) return Promise.reject(new Error('Server error. Coba lagi nanti.'));

        return Promise.reject(new Error(message));
    },
);

export default apiClient;
