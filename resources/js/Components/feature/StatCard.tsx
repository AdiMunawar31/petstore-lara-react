import { motion } from 'framer-motion';

export function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number | string; color: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-4 rounded-d2y-lg bg-white p-4 shadow-d2y"
        >
            <div className={`flex h-11 w-11 items-center justify-center rounded-d2y ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
            <div>
                <p className="text-xs font-medium text-d2y-gray-1">{label}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
        </motion.div>
    );
}
