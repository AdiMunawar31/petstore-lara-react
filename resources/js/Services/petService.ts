import apiClient from './api';
import type { Pet, PetStatus, PetFormData } from '@/types';

/**
 * Pet Service — Semua operasi CRUD untuk resource /pet
 *
 * Endpoint yang diimplementasikan:
 * POST   /pet/{petId}/uploadImage  → uploadPetImage
 * POST   /pet                      → createPet
 * PUT    /pet                      → updatePet
 * GET    /pet/findByStatus         → getPetsByStatus
 * GET    /pet/{petId}              → getPetById
 * POST   /pet/{petId}              → updatePetById (form data)
 * DELETE /pet/{petId}              → deletePet
 */

export const petService = {
    // ✅ Fix 4: array query params pakai URLSearchParams().append berulang
    findByStatus: async (status: PetStatus | PetStatus[] = 'available'): Promise<Pet[]> => {
        const params = new URLSearchParams();
        const statuses = Array.isArray(status) ? status : [status];
        statuses.forEach((s) => params.append('status', s));
        const { data } = await apiClient.get<Pet[]>(`/pet/findByStatus?${params.toString()}`);
        console.log('data pets status : ', data);
        return data;
    },

    /**
     * Ambil detail satu pet berdasarkan ID
     */
    findById: async (petId: number): Promise<Pet> => {
        const { data } = await apiClient.get<Pet>(`/pet/${petId}`);
        return data;
    },

    /**
     * Tambah pet baru ke store
     */
    create: async (data: PetFormData): Promise<Pet> => {
        return apiClient.post('/pet', data);
    },

    /**
     * Update pet yang sudah ada (menggunakan body JSON penuh)
     */
    update: async (data: Pet): Promise<Pet> => {
        return apiClient.put('/pet', data);
    },

    /**
     * Update pet menggunakan form data (name & status saja)
     */
    updateById: async (petId: number, name: string, status: PetStatus): Promise<void> => {
        const formData = new URLSearchParams();
        formData.append('name', name);
        formData.append('status', status);
        return apiClient.post(`/pet/${petId}`, formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
    },

    /**
     * Hapus pet berdasarkan ID
     */
    delete: async (petId: number): Promise<void> => {
        return apiClient.delete(`/pet/${petId}`);
    },
};
