import apiClient from './api';
import type { User, UserFormData } from '@/types';

/**
 * User Service — Operasi untuk resource /user
 *
 * POST   /user/createWithList  → createWithList
 * GET    /user/{username}      → getUserByUsername
 * PUT    /user/{username}      → updateUser
 * DELETE /user/{username}      → deleteUser
 * GET    /user/login           → login
 * GET    /user/logout          → logout
 * POST   /user/createWithArray → createWithArray
 * POST   /user                 → createUser
 */

export const userService = {
    /**
     * Login ke sistem
     * Return: string session token dari server
     */
    login: async (username: string, password: string): Promise<string> => {
        return apiClient.get(`/user/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
    },

    /**
     * Logout dari sistem
     */
    logout: async (): Promise<void> => {
        return apiClient.get('/user/logout');
    },

    /**
     * Ambil data user berdasarkan username
     */
    getByUsername: async (username: string): Promise<User> => {
        return apiClient.get(`/user/${encodeURIComponent(username)}`);
    },

    /**
     * Buat user baru
     */
    create: async (data: UserFormData): Promise<void> => {
        return apiClient.post('/user', data);
    },

    /**
     * Update user berdasarkan username
     */
    update: async (username: string, data: Partial<UserFormData>): Promise<void> => {
        return apiClient.put(`/user/${encodeURIComponent(username)}`, data);
    },

    /**
     * Hapus user berdasarkan username
     */
    delete: async (username: string): Promise<void> => {
        return apiClient.delete(`/user/${encodeURIComponent(username)}`);
    },

    /**
     * Buat banyak user sekaligus (array)
     */
    createWithArray: async (users: UserFormData[]): Promise<void> => {
        return apiClient.post('/user/createWithArray', users);
    },

    /**
     * Buat banyak user sekaligus (list)
     */
    createWithList: async (users: UserFormData[]): Promise<void> => {
        return apiClient.post('/user/createWithList', users);
    },
};
