import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petService } from '@/Services/petService';
import type { Pet, PetStatus, PetFormData } from '@/types';
import toast from 'react-hot-toast';

/**
 * Query Keys — identitas cache untuk setiap jenis query
 * Struktur hierarki memudahkan invalidasi yang presisi
 */
export const petKeys = {
    all: ['pets'] as const,
    lists: () => [...petKeys.all, 'list'] as const,
    list: (status: PetStatus | PetStatus[]) => [...petKeys.lists(), status] as const,
    details: () => [...petKeys.all, 'detail'] as const,
    detail: (id: number) => [...petKeys.details(), id] as const,
};

// ─── Query Hooks ──────────────────────────────────────────────────────────────

export function usePets(status: PetStatus | PetStatus[] = 'available') {
    return useQuery<Pet[], Error>({
        queryKey: petKeys.list(status),
        queryFn: () => petService.findByStatus(status),
        staleTime: 1000 * 60 * 3, // Data fresh selama 3 menit
        gcTime: 1000 * 60 * 10, // Simpan di cache 10 menit
        retry: 1,
        select: (data) => {
            return data.filter((p) => p.id && p.name);
        },
    });
}

export function usePet(petId: number | null) {
    return useQuery<Pet, Error>({
        queryKey: petKeys.detail(petId!),
        queryFn: () => petService.findById(petId!),
        enabled: petId !== null && petId > 0,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}

// ─── Mutation Hooks ───────────────────────────────────────────────────────────

export function useCreatePet() {
    const queryClient = useQueryClient();

    return useMutation<Pet, Error, PetFormData>({
        mutationFn: petService.create,
        onSuccess: (newPet) => {
            console.log('newPet : ', newPet);

            // Invalidate semua list agar data terbaru diambil
            queryClient.invalidateQueries({ queryKey: petKeys.lists() });
            toast.success(`${newPet.data.name} berhasil ditambahkan!`);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}

export function useUpdatePet() {
    const queryClient = useQueryClient();

    return useMutation<Pet, Error, Pet>({
        mutationFn: petService.update,
        onSuccess: (updatedPet) => {
            // Update cache langsung tanpa refetch (optimistic-like)
            queryClient.setQueryData(petKeys.detail(updatedPet.id), updatedPet);
            queryClient.invalidateQueries({ queryKey: petKeys.lists() });
            toast.success(`${updatedPet.data.name} berhasil diperbarui!`);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}

export function useDeletePet() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, number>({
        mutationFn: petService.delete,
        onSuccess: (_, petId) => {
            queryClient.removeQueries({
                queryKey: petKeys.detail(petId),
            });

            queryClient.invalidateQueries({
                queryKey: petKeys.lists(),
                exact: false,
            });

            toast.success('Pet berhasil dihapus!');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}
