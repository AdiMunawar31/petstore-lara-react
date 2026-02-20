import { type ReactNode } from 'react';
import { clsx } from 'clsx';
import type { BadgeVariant } from '@/types';

interface BadgeProps {
    variant?: BadgeVariant;
    children: ReactNode;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    available: 'bg-green-100 text-green-700',
    pending:   'bg-yellow-100 text-yellow-700',
    sold:      'bg-red-100 text-red-600',
    placed:    'bg-blue-100 text-blue-700',
    approved:  'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    default:   'bg-gray-100 text-gray-600',
};

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
    return (
        <span
            className={clsx(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide',
                variantStyles[variant],
                className,
            )}
        >
            {children}
        </span>
    );
}
