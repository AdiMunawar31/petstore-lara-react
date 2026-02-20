import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeService } from '@/Services/storeService';
import type { Inventory, Order } from '@/types';
import toast from 'react-hot-toast';

export const storeKeys = {
    all: ['store'] as const,
    inventory: () => [...storeKeys.all, 'inventory'] as const,
    orders: () => [...storeKeys.all, 'orders'] as const,
    order: (id: number) => [...storeKeys.orders(), id] as const,
};

export function useInventory() {
    return useQuery<Inventory, Error>({
        queryKey: storeKeys.inventory(),
        queryFn: storeService.getInventory,
        staleTime: 1000 * 60 * 2,
    });
}

export function useOrder(orderId: number | null) {
    return useQuery<Order, Error>({
        queryKey: storeKeys.order(orderId!),
        queryFn: () => storeService.getOrderById(orderId!),
        enabled: orderId !== null && orderId > 0,
    });
}

export function usePlaceOrder() {
    const queryClient = useQueryClient();
    return useMutation<Order, Error, Omit<Order, 'id'>>({
        mutationFn: storeService.placeOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: storeKeys.inventory() });
            toast.success('Order berhasil dibuat!');
        },
        onError: (error) => toast.error(error.message),
    });
}

export function useDeleteOrder() {
    const queryClient = useQueryClient();
    return useMutation<void, Error, number>({
        mutationFn: storeService.deleteOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: storeKeys.all });
            toast.success('Order berhasil dibatalkan!');
        },
        onError: (error) => toast.error(error.message),
    });
}
