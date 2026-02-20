import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
        >
            {icon && (
                <div className="w-16 h-16 rounded-ios-xl bg-ios-gray-6 flex items-center justify-center mb-4 text-ios-gray-2">
                    {icon}
                </div>
            )}
            <h3 className="text-base font-semibold text-gray-800 mb-1">{title}</h3>
            {description && <p className="text-sm text-ios-gray-1 max-w-xs mb-5">{description}</p>}
            {action}
        </motion.div>
    );
}
