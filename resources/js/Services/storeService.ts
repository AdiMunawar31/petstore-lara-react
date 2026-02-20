import apiClient from './api';
import type { Order, Inventory } from '@/types';

/**
 * Store Service — Operasi untuk resource /store
 *
 * GET    /store/inventory          → getInventory
 * POST   /store/order              → placeOrder
 * GET    /store/order/{orderId}    → getOrderById
 * DELETE /store/order/{orderId}    → deleteOrder
 */

export const storeService = {
    /**
     * Ambil jumlah stok per status (available, pending, sold)
     */
    getInventory: async (): Promise<Inventory> => {
        return apiClient.get('/store/inventory');
    },

    /**
     * Buat order baru untuk sebuah pet
     */
    placeOrder: async (order: Omit<Order, 'id'>): Promise<Order> => {
        return apiClient.post('/store/order', order);
    },

    /**
     * Ambil detail order berdasarkan ID
     */
    getOrderById: async (orderId: number): Promise<Order> => {
        return apiClient.get(`/store/order/${orderId}`);
    },

    /**
     * Hapus order berdasarkan ID
     */
    deleteOrder: async (orderId: number): Promise<void> => {
        return apiClient.delete(`/store/order/${orderId}`);
    },
};
