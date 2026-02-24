import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/ui/Card';
import PetForm from '@/Components/feature/PetForm';
import Skeleton from '@/Components/ui/Skeleton';
import { usePet, useUpdatePet } from '@/Hooks/usePets';
import type { PetFormData } from '@/types';

interface EditProps {
    id: string;
}

export default function PetEdit({ id }: EditProps) {
    const petId = parseInt(id, 10);
    const { data: pet, isLoading } = usePet(petId);
    const updatePet = useUpdatePet();

    const handleSubmit = (data: PetFormData) => {
        if (!pet) return;
        updatePet.mutate({ ...pet, ...data }, { onSuccess: () => router.visit(`/pets/${petId}`) });
    };

    return (
        <AppLayout title="Edit Pet">
            <div className="mx-auto max-w-lg">
                <Link
                    href={`/pets/${petId}`}
                    className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-d2y-blue transition-opacity hover:opacity-70"
                >
                    <ArrowLeft size={16} />
                    Kembali ke detail
                </Link>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <Card>
                        <h1 className="mb-5 text-lg font-bold text-gray-900">Edit Pet</h1>
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : (
                            <PetForm defaultValues={pet} onSubmit={handleSubmit} isLoading={updatePet.isPending} submitLabel="Simpan Perubahan" />
                        )}
                    </Card>
                </motion.div>
            </div>
        </AppLayout>
    );
}
