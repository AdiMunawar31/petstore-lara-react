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
            className="group rounded-ios-lg shadow-ios hover:shadow-ios-md overflow-hidden bg-white transition-all duration-200"
        >
            {/* Image */}
            <Link href={`/pets/${pet.id}`}>
                <div className="bg-ios-gray-6 relative h-40 overflow-hidden">
                    {imageUrl && isValidUrl(imageUrl) ? (
                        <img
                            src={imageUrl}
                            alt={pet.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '';
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <PawPrint size={36} className="text-ios-gray-3" />
                        </div>
                    )}

                    <div className="absolute top-2.5 right-2.5">
                        <Badge variant={pet.status}>{pet.status}</Badge>
                    </div>
                </div>
            </Link>

            <div className="p-3.5">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <Link href={`/pets/${pet.id}`}>
                            <h3 className="hover:text-ios-blue truncate text-sm font-semibold text-gray-900 transition-colors">{pet.name}</h3>
                        </Link>
                        {pet.category?.name && <p className="text-ios-gray-1 mt-0.5 truncate text-xs">{pet.category.name}</p>}
                        {pet.tags && pet.tags.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                                {pet.tags.slice(0, 2).map((tag) => (
                                    <span key={tag.id} className="bg-ios-gray-6 text-ios-gray-1 inline-block rounded-full px-2 py-0.5 text-xs">
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <span className="text-ios-gray-2 bg-ios-gray-6 rounded-ios shrink-0 px-2 py-1 font-mono text-xs">#{pet.id}</span>
                </div>

                {showActions && (
                    <div className="border-ios-gray-5 mt-3 flex gap-2 border-t pt-3">
                        <Link
                            href={`/pets/${pet.id}/edit`}
                            className="rounded-ios text-ios-blue flex h-8 flex-1 items-center justify-center gap-1.5 bg-blue-50 text-xs font-semibold transition-colors hover:bg-blue-100"
                        >
                            <Pencil size={12} />
                            Edit
                        </Link>
                        <button
                            onClick={() => onDelete?.(pet)}
                            className="rounded-ios text-ios-red flex h-8 flex-1 items-center justify-center gap-1.5 bg-red-50 text-xs font-semibold transition-colors hover:bg-red-100"
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
