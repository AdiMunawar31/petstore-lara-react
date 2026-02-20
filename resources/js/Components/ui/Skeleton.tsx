import { clsx } from 'clsx';

interface SkeletonProps {
    className?: string;
    rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export default function Skeleton({ className, rounded = 'md' }: SkeletonProps) {
    const roundedClasses = {
        sm: 'rounded',
        md: 'rounded-ios',
        lg: 'rounded-ios-lg',
        full: 'rounded-full',
    };

    return (
        <div
            className={clsx(
                'animate-pulse bg-ios-gray-5',
                roundedClasses[rounded],
                className,
            )}
        />
    );
}

export function PetCardSkeleton() {
    return (
        <div className="bg-white rounded-ios-lg shadow-ios p-4 space-y-3">
            <Skeleton className="h-40 w-full" rounded="md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16" rounded="full" />
            </div>
        </div>
    );
}
