import { lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Pencil, Trash2, PawPrint, Tag, Grid3x3, ImageIcon } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';
import Card from '@/Components/ui/Card';
import Skeleton from '@/Components/ui/Skeleton';
import { usePet, useDeletePet } from '@/Hooks/usePets';

const DeletePetModal = lazy(() => import('@/Components/feature/DeletePetModal'));

interface ShowProps {
    id: string;
}

export default function PetShow({ id }: ShowProps) {
    const petId = parseInt(id, 10);
    const { data: pet, isLoading, isError } = usePet(petId);
    const deletePet = useDeletePet();
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleDelete = () => {
        deletePet.mutate(petId, {
            onSuccess: () => router.visit('/pets'),
        });
    };

    if (isLoading) {
        return (
            <AppLayout title="Pet Detail">
                <div className="mx-auto max-w-2xl space-y-4">
                    <Skeleton className="h-64 w-full" rounded="lg" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
            </AppLayout>
        );
    }

    if (isError || !pet) {
        return (
            <AppLayout title="Tidak Ditemukan">
                <div className="mx-auto max-w-2xl py-16 text-center">
                    <PawPrint size={48} className="mx-auto mb-4 text-d2y-gray-3" />
                    <h2 className="mb-2 text-xl font-semibold text-gray-800">Pet tidak ditemukan</h2>
                    <Link href="/pets">
                        <Button variant="ghost">Kembali ke daftar</Button>
                    </Link>
                </div>
            </AppLayout>
        );
    }

    const imageUrl = pet.photoUrls?.[0];

    return (
        <AppLayout title={pet.name}>
            <div className="mx-auto max-w-2xl">
                {/* Back */}
                <Link
                    href="/pets"
                    className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-d2y-blue transition-opacity hover:opacity-70"
                >
                    <ArrowLeft size={16} />
                    Kembali
                </Link>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
                    {/* Hero image */}
                    <div className="relative h-72 overflow-hidden rounded-d2y-xl bg-d2y-gray-6 shadow-d2y">
                        {imageUrl ? (
                            <img src={imageUrl} alt={pet.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <PawPrint size={64} className="text-d2y-gray-3" />
                            </div>
                        )}
                        <div className="absolute top-4 right-4">
                            <Badge variant={pet.status}>{pet.status}</Badge>
                        </div>
                    </div>

                    {/* Info card */}
                    <Card>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{pet.name}</h1>
                                <p className="mt-0.5 text-sm text-d2y-gray-1">ID: #{pet.id}</p>
                            </div>
                            <Badge variant={pet.status} className="mt-1">
                                {pet.status}
                            </Badge>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-d2y-gray-5 pt-4">
                            <div className="flex items-center gap-2">
                                <Grid3x3 size={15} className="text-d2y-gray-2" />
                                <div>
                                    <p className="text-xs text-d2y-gray-1">Kategori</p>
                                    <p className="text-sm font-semibold text-gray-800">{pet.category?.name ?? '—'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <ImageIcon size={15} className="text-d2y-gray-2" />
                                <div>
                                    <p className="text-xs text-d2y-gray-1">Foto</p>
                                    <p className="text-sm font-semibold text-gray-800">{pet.photoUrls?.length ?? 0} gambar</p>
                                </div>
                            </div>
                        </div>

                        {pet.tags && pet.tags.length > 0 && (
                            <div className="mt-4 border-t border-d2y-gray-5 pt-4">
                                <div className="mb-2 flex items-center gap-1.5">
                                    <Tag size={13} className="text-d2y-gray-2" />
                                    <p className="text-xs font-medium text-d2y-gray-1">Tags</p>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {pet.tags.map((tag) => (
                                        <span key={tag.id} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-d2y-blue">
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>

                    <div className="flex gap-3">
                        <Link href={`/pets/${pet.id}/edit`} className="flex-1">
                            <Button variant="secondary" fullWidth icon={<Pencil size={15} />}>
                                Edit Pet
                            </Button>
                        </Link>
                        <Button variant="danger" fullWidth icon={<Trash2 size={15} />} onClick={() => setDeleteOpen(true)} className="flex-1">
                            Hapus
                        </Button>
                    </div>
                </motion.div>
            </div>

            <Suspense fallback={null}>
                <DeletePetModal
                    pet={pet}
                    open={deleteOpen}
                    onClose={() => setDeleteOpen(false)}
                    onConfirm={handleDelete}
                    isLoading={deletePet.isPending}
                />
            </Suspense>
        </AppLayout>
    );
}
