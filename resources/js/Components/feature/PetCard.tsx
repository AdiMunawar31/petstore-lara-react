import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { PawPrint, Pencil, Trash2 } from 'lucide-react';
import { Link } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import type { Pet } from '@/types';

const DeletePetModal = lazy(() => import('./DeletePetModal'));

interface PetCardProps {
    pet: Pet;
    onDelete?: (pet: Pet) => void;
    showActions?: boolean;
    index?: number;
}

export default function PetCard({ pet, onDelete, showActions = true, index = 0 }: PetCardProps) {
    const imageUrl = pet.photoUrls?.[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="group overflow-hidden rounded-d2y-lg bg-white shadow-d2y transition-all duration-200 hover:shadow-d2y-md"
        >
            {/* Image */}
            <Link href={`/pets/${pet.id}`}>
                <div className="relative h-40 overflow-hidden bg-d2y-gray-6">
                    {/* {imageUrl && isValidUrl(imageUrl) ? (
                        <img
                            src={imageUrl}
                            alt={pet.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '';
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    ) : ( */}
                    <div className="flex h-full w-full items-center justify-center">
                        <PawPrint size={36} className="text-d2y-gray-3" />
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                        <Badge variant={pet.status}>{pet.status}</Badge>
                    </div>
                </div>
            </Link>

            <div className="p-3.5">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <Link href={`/pets/${pet.id}`}>
                            <h3 className="truncate text-sm font-semibold text-gray-900 transition-colors hover:text-d2y-blue">{pet.name}</h3>
                        </Link>
                        {pet.category?.name && <p className="mt-0.5 truncate text-xs text-d2y-gray-1">{pet.category.name}</p>}
                        {pet.tags && pet.tags.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                                {pet.tags.slice(0, 2).map((tag) => (
                                    <span key={tag.id} className="inline-block rounded-full bg-d2y-gray-6 px-2 py-0.5 text-xs text-d2y-gray-1">
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <span className="shrink-0 rounded-d2y bg-d2y-gray-6 px-2 py-1 font-mono text-xs text-d2y-gray-2">#{pet.id}</span>
                </div>

                {showActions && (
                    <div className="mt-3 flex gap-2 border-t border-d2y-gray-5 pt-3">
                        <Link
                            href={`/pets/${pet.id}/edit`}
                            className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-d2y bg-blue-50 text-xs font-semibold text-d2y-blue transition-colors hover:bg-blue-100"
                        >
                            <Pencil size={12} />
                            Edit
                        </Link>
                        <button
                            onClick={() => onDelete?.(pet)}
                            className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-d2y bg-red-50 text-xs font-semibold text-d2y-red transition-colors hover:bg-red-100"
                        >
                            <Trash2 size={12} />
                            Hapus
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}
