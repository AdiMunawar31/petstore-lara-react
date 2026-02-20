import { type ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    onClick?: () => void;
    hover?: boolean;
}

const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
};

export default function Card({ children, className, padding = 'md', onClick, hover = false }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={clsx(
                'bg-white rounded-d2y-lg shadow-d2y',
                paddingClasses[padding],
                hover && 'transition-shadow duration-200 hover:shadow-d2y-md cursor-pointer',
                className,
            )}
        >
            {children}
        </div>
    );
}

export function CardSection({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={clsx('border-b border-d2y-gray-5 last:border-0', className)}>
            {children}
        </div>
    );
}
