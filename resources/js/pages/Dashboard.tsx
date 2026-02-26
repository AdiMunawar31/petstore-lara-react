import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { PawPrint, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { PetCardSkeleton } from '@/Components/ui/Skeleton';
import { useInventory } from '@/Hooks/useStore';
import { usePets } from '@/Hooks/usePets';
import { StatCard } from '@/Components/feature/StatCard';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

// Lazy load chart komponen besar
const PetCard = lazy(() => import('@/Components/feature/PetCard'));

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;
    const { data: inventory } = useInventory();
    const { data: recentPets, isLoading } = usePets('available');

    console.log('recent pets : ', recentPets);
    console.log('recent inv : ', inventory);

    const stats = [
        { icon: PawPrint, label: 'Available', value: inventory?.available ?? 0, color: 'bg-d2y-green' },
        { icon: TrendingUp, label: 'Pending', value: inventory?.pending ?? 0, color: 'bg-d2y-orange' },
        { icon: ShoppingBag, label: 'Sold', value: inventory?.sold ?? 0, color: 'bg-d2y-red' },
        { icon: Users, label: 'Total Stok', value: Object.values(inventory ?? {}).reduce((a, b) => a + b, 0), color: 'bg-d2y-blue' },
    ];

    return (
        <AppLayout title="Dashboard">
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Selamat datang, {auth.user?.username ?? 'Pengguna'} 👋</h1>
                <p className="mt-1 text-sm text-d2y-gray-1">Berikut ringkasan kondisi toko hewan peliharaan Anda.</p>
            </motion.div>

            <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.06 }}
                    >
                        <StatCard {...stat} />
                    </motion.div>
                ))}
            </div>

            <div>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Pet Tersedia Terbaru</h2>
                    <a href="/pets" className="text-sm font-medium text-d2y-blue hover:underline">
                        Lihat semua
                    </a>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <PetCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <Suspense
                        fallback={
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <PetCardSkeleton key={i} />
                                ))}
                            </div>
                        }
                    >
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {recentPets?.slice(0, 8).map((pet, i) => (
                                <PetCard key={pet.id} pet={pet} showActions={false} index={i} />
                            ))}
                        </div>
                    </Suspense>
                )}
            </div>
        </AppLayout>
    );
}
