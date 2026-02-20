import { type SelectHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    children: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, children, className, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        className={clsx(
                            'w-full appearance-none rounded-d2y border bg-white px-3.5 py-2.5 text-sm text-gray-900 pr-10',
                            'transition-all duration-150',
                            'focus:outline-none focus:ring-2 focus:ring-d2y-blue focus:border-transparent',
                            error ? 'border-d2y-red' : 'border-d2y-gray-4',
                            className,
                        )}
                        {...props}
                    >
                        {children}
                    </select>
                    <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-d2y-gray-1 pointer-events-none"
                    />
                </div>
                {error && <p className="mt-1.5 text-xs text-d2y-red font-medium">{error}</p>}
            </div>
        );
    },
);

Select.displayName = 'Select';
export default Select;
