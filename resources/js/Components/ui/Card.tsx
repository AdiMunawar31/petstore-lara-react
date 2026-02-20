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
                'bg-white rounded-ios-lg shadow-ios',
                paddingClasses[padding],
                hover && 'transition-shadow duration-200 hover:shadow-ios-md cursor-pointer',
                className,
            )}
        >
            {children}
        </div>
    );
}

export function CardSection({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={clsx('border-b border-ios-gray-5 last:border-0', className)}>
            {children}
        </div>
    );
}
