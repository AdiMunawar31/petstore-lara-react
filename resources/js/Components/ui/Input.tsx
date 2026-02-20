import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, leftIcon, rightIcon, className, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-d2y-gray-1">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={clsx(
                            'w-full rounded-d2y border bg-white px-3.5 py-2.5 text-sm text-gray-900',
                            'placeholder:text-d2y-gray-2',
                            'transition-all duration-150',
                            'focus:outline-none focus:ring-2 focus:ring-d2y-blue focus:border-transparent',
                            error
                                ? 'border-d2y-red focus:ring-d2y-red'
                                : 'border-d2y-gray-4',
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            className,
                        )}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-d2y-gray-1">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1.5 text-xs text-d2y-red font-medium">{error}</p>
                )}
                {hint && !error && (
                    <p className="mt-1.5 text-xs text-d2y-gray-1">{hint}</p>
                )}
            </div>
        );
    },
);

Input.displayName = 'Input';
export default Input;
