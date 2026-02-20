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
        'bg-ios-blue text-white hover:bg-blue-600 active:bg-blue-700 shadow-sm',
    secondary:
        'bg-white text-ios-blue border border-ios-gray-4 hover:bg-ios-gray-6 active:bg-ios-gray-5',
    ghost:
        'bg-transparent text-ios-blue hover:bg-ios-fill-secondary active:bg-ios-fill-primary',
    danger:
        'bg-ios-red text-white hover:bg-red-600 active:bg-red-700 shadow-sm',
};

const sizeClasses: Record<Size, string> = {
    sm: 'h-8 px-3 text-sm rounded-ios gap-1.5',
    md: 'h-10 px-4 text-sm rounded-ios gap-2',
    lg: 'h-12 px-6 text-base rounded-ios-lg gap-2.5',
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
