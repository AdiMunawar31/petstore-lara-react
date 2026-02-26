import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/ui/Card';
import PetForm from '@/Components/feature/PetForm';
import { useCreatePet } from '@/Hooks/usePets';
import { router } from '@inertiajs/react';
import type { PetFormData } from '@/types';
import { nanoid } from 'nanoid';

export default function PetCreate() {
    const createPet = useCreatePet();

    const generateNumericId = () => Number(nanoid(12).replace(/\D/g, '').slice(0, 15));

    const handleSubmit = (data: PetFormData) => {
        const payload: PetFormData = {
            ...data,
            id: generateNumericId(),
        };

        createPet.mutate(payload, {
            onSuccess: () => router.visit(`/pets`),
        });
    };

    return (
        <AppLayout title="Tambah Pet">
            <div className="mx-auto max-w-lg">
                <Link
                    href="/pets"
                    className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-d2y-blue transition-opacity hover:opacity-70"
                >
                    <ArrowLeft size={16} />
                    Kembali ke daftar
                </Link>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <Card>
                        <h1 className="mb-5 text-lg font-bold text-gray-900">Tambah Pet Baru</h1>
                        <PetForm onSubmit={handleSubmit} isLoading={createPet.isPending} submitLabel="Tambah Pet" />
                    </Card>
                </motion.div>
            </div>
        </AppLayout>
    );
}
