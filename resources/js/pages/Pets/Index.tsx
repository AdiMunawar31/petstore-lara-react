import { JSX, lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Grid, CheckCircle, Clock, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

import AppLayout from '@/Layouts/AppLayout';
import { PetCardSkeleton } from '@/Components/ui/Skeleton';
import EmptyState from '@/Components/ui/EmptyState';
import Button from '@/Components/ui/Button';
import Input from '@/Components/ui/Input';
import { PawPrint } from 'lucide-react';

import { usePets, useDeletePet } from '@/Hooks/usePets';
import type { Pet, PetStatus } from '@/types';

// Lazy
const PetCard = lazy(() => import('@/Components/feature/PetCard'));
const DeletePetModal = lazy(() => import('@/Components/feature/DeletePetModal'));

const STATUS_TABS: { label: string; value: PetStatus; icon: JSX.Element }[] = [
    { label: 'Available', value: 'available', icon: <CheckCircle size={16} /> },
    { label: 'Pending', value: 'pending', icon: <Clock size={16} /> },
    { label: 'Sold', value: 'sold', icon: <Tag size={16} /> },
];

const ITEMS_PER_PAGE = 8;
const SEARCH_DEBOUNCE = 800;

export default function PetIndex() {
    const [status, setStatus] = useState<PetStatus>('available');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [petToDelete, setPetToDelete] = useState<Pet | null>(null);

    const { data: pets = [], isLoading, isError, error } = usePets(status);
    const deletePet = useDeletePet();

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, SEARCH_DEBOUNCE);

        return () => clearTimeout(t);
    }, [search]);

    const filteredPets = useMemo(() => {
        if (!debouncedSearch.trim()) return pets;

        const keyword = debouncedSearch.toLowerCase();

        console.log('keyword : ', keyword);

        return pets.filter((pet) => pet.name.toLowerCase().includes(keyword));
    }, [pets, debouncedSearch]);

    console.log('filtered pets : ', filteredPets);

    const totalItems = filteredPets.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const paginatedPets = useMemo(() => {
        if (filteredPets.length === 0) return [];

        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredPets.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredPets, currentPage]);

    const from = totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const to = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

    const handleDeleteConfirm = (id: number) => {
        deletePet.mutate(id, {
            onSuccess: () => setPetToDelete(null),
        });
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, status]);

    function getPaginationRange(current: number, total: number, delta = 2) {
        const range: (number | '...')[] = [];
        const left = Math.max(2, current - delta);
        const right = Math.min(total - 1, current + delta);

        range.push(1);

        if (left > 2) range.push('...');

        for (let i = left; i <= right; i++) {
            range.push(i);
        }

        if (right < total - 1) range.push('...');

        if (total > 1) range.push(total);

        return range;
    }

    return (
        <AppLayout title="Pets">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Pets</h1>
                    <p className="text-sm text-slate-500">Kelola semua hewan peliharaan</p>
                </div>
                <Link href="/pets/create">
                    <Button icon={<Plus size={16} />}>Tambah Pet</Button>
                </Link>
            </div>

            <div className="mb-8 flex flex-col gap-4 lg:flex-row">
                <div className="relative flex-1">
                    <Input
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-4"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto">
                    {STATUS_TABS.map((tab) => {
                        const active = tab.value === status;
                        return (
                            <button
                                key={tab.value}
                                onClick={() => {
                                    setStatus(tab.value);
                                    setCurrentPage(1);
                                }}
                                className={`flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium ${
                                    active ? 'bg-blue-500 text-white' : 'border border-slate-200 bg-white hover:bg-slate-50'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {isError && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error?.message ?? 'Gagal memuat data pet'}
                </div>
            )}

            {isLoading && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                        <PetCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {!isLoading && !isError && paginatedPets.length === 0 && (
                <EmptyState icon={<PawPrint size={28} />} title="Tidak ada data" description="Data pet tidak ditemukan" />
            )}

            {!isLoading && paginatedPets.length > 0 && (
                <Suspense fallback={null}>
                    <AnimatePresence>
                        <motion.div
                            key={`${status}-${debouncedSearch}-${currentPage}`}
                            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {paginatedPets.map((pet, i) => (
                                <PetCard key={pet.id} pet={pet} index={i} onDelete={setPetToDelete} />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </Suspense>
            )}

            {!isLoading && totalPages > 1 && (
                <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-slate-200 pt-8 md:flex-row dark:border-slate-800">
                    <div className="text-sm text-slate-500">
                        Showing <span className="font-semibold">{from}</span> to <span className="font-semibold">{to}</span> of{' '}
                        <span className="font-semibold">{totalItems}</span> pets
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:opacity-50"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {getPaginationRange(currentPage, totalPages).map((page, i) =>
                            page === '...' ? (
                                <span key={`dots-${i}`} className="px-2 text-slate-400">
                                    …
                                </span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`h-10 w-10 rounded-lg font-medium ${
                                        currentPage === page ? 'bg-blue-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {page}
                                </button>
                            ),
                        )}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:opacity-50"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500">Go to page</span>
                        <input
                            type="number"
                            min={1}
                            max={totalPages}
                            value={currentPage}
                            onChange={(e) => setCurrentPage(Math.min(totalPages, Math.max(1, Number(e.target.value))))}
                            className="w-16 rounded-lg border border-slate-200 px-3 py-1 text-sm outline-none"
                        />
                    </div>
                </div>
            )}

            <Suspense fallback={null}>
                <DeletePetModal
                    pet={petToDelete}
                    open={!!petToDelete}
                    onClose={() => setPetToDelete(null)}
                    onConfirm={handleDeleteConfirm}
                    isLoading={deletePet.isPending}
                />
            </Suspense>
        </AppLayout>
    );
}
