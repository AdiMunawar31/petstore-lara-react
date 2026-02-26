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
    getInventory: async (): Promise<Inventory> => {
        const { data } = await apiClient.get<Inventory>('/store/inventory');
        return data;
    },

    placeOrder: async (order: Omit<Order, 'id'>): Promise<Order> => {
        const { data } = await apiClient.post<Order>('/store/order', order);
        return data;
    },

    getOrderById: async (orderId: number): Promise<Order> => {
        const { data } = await apiClient.get<Order>(`/store/order/${orderId}`);
        return data;
    },

    deleteOrder: async (orderId: number): Promise<void> => {
        return apiClient.delete(`/store/order/${orderId}`);
    },
};
