import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    icon?: ReactNode;
    children?: ReactNode;
    fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
    primary:
        'bg-d2y-blue text-white hover:bg-blue-600 active:bg-blue-700 shadow-sm',
    secondary:
        'bg-white text-d2y-blue border border-d2y-gray-4 hover:bg-d2y-gray-6 active:bg-d2y-gray-5',
    ghost:
        'bg-transparent text-d2y-blue hover:bg-d2y-fill-secondary active:bg-d2y-fill-primary',
    danger:
        'bg-d2y-red text-white hover:bg-red-600 active:bg-red-700 shadow-sm',
};

const sizeClasses: Record<Size, string> = {
    sm: 'h-8 px-3 text-sm rounded-d2y gap-1.5',
    md: 'h-10 px-4 text-sm rounded-d2y gap-2',
    lg: 'h-12 px-6 text-base rounded-d2y-lg gap-2.5',
};

export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    children,
    fullWidth = false,
    disabled,
    className,
    ...props
}: ButtonProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.1 }}
            disabled={disabled || loading}
            className={clsx(
                'inline-flex items-center justify-center font-semibold transition-all duration-150',
                'disabled:opacity-40 disabled:cursor-not-allowed select-none',
                variantClasses[variant],
                sizeClasses[size],
                fullWidth && 'w-full',
                className,
            )}
            {...(props as object)}
        >
            {loading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                icon && <span className="shrink-0">{icon}</span>
            )}
            {children && <span>{children}</span>}
        </motion.button>
    );
}
