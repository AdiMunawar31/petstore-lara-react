// resources/js/Pages/Store/Index.tsx
import { lazy, Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    RefreshCw,
    Package,
    TrendingUp,
    Search,
    Trash2,
    Plus,
    CheckCircle2,
    Clock,
    Truck,
    XCircle,
    ChevronRight,
    BarChart3,
} from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import Button from '@/Components/ui/Button';
import Input from '@/Components/ui/Input';
import Select from '@/Components/ui/Select';
import Modal from '@/Components/ui/Modal';
import Skeleton from '@/Components/ui/Skeleton';
import { useInventory, usePlaceOrder, useOrder, useDeleteOrder } from '@/Hooks/useStore';
import { useQueryClient } from '@tanstack/react-query';
import { storeKeys } from '@/Hooks/useStore';
import type { Order, OrderStatus } from '@/types';
import { clsx } from 'clsx';

// ─── Status config ────────────────────────────────────────────────────────────
const ORDER_STATUS_CONFIG: Record<
    OrderStatus,
    {
        label: string;
        color: string;
        bg: string;
        border: string;
        icon: React.ElementType;
    }
> = {
    placed: {
        label: 'Placed',
        icon: Clock,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
    },
    approved: {
        label: 'Approved',
        icon: CheckCircle2,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
    },
    delivered: {
        label: 'Delivered',
        icon: Truck,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
    },
};

const INVENTORY_CONFIG: Record<string, { color: string; bg: string; gradient: string; icon: React.ElementType }> = {
    available: {
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        gradient: 'from-emerald-500 to-teal-500',
        icon: CheckCircle2,
    },
    pending: {
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        gradient: 'from-amber-500 to-orange-500',
        icon: Clock,
    },
    sold: {
        color: 'text-rose-600',
        bg: 'bg-rose-50',
        gradient: 'from-rose-500 to-pink-500',
        icon: XCircle,
    },
};

// ─── Inventory Stat Card ──────────────────────────────────────────────────────
function InventoryCard({ status, value, index, total }: { status: string; value: number; index: number; total: number }) {
    const cfg = INVENTORY_CONFIG[status] ?? {
        color: 'text-slate-600',
        bg: 'bg-slate-50',
        gradient: 'from-slate-400 to-slate-500',
        icon: Package,
    };
    const Icon = cfg.icon;
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group shadow-card hover:shadow-card-md relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900"
        >
            <div className={`absolute inset-x-0 top-0 h-0.5 bg-linear-to-r ${cfg.gradient} opacity-70`} />

            <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${cfg.bg}`}>
                    <Icon size={18} className={cfg.color} />
                </div>
                <span className={`text-xs font-bold tracking-widest uppercase ${cfg.color}`}>{pct}%</span>
            </div>

            <div className="mt-4">
                <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">{status}</p>
                <p className="font-display mt-1 text-4xl font-bold text-slate-900 dark:text-white">{value.toLocaleString()}</p>
            </div>

            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-full rounded-full bg-linear-to-r ${cfg.gradient}`}
                />
            </div>
        </motion.div>
    );
}

// ─── Order Lookup Card ────────────────────────────────────────────────────────
function OrderLookupSection() {
    const [searchId, setSearchId] = useState('');
    const [activeId, setActiveId] = useState<number | null>(null);
    const { data: order, isLoading, isError, error } = useOrder(activeId);
    const deleteOrder = useDeleteOrder();
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const id = parseInt(searchId.trim(), 10);
        if (isNaN(id) || id <= 0) return;
        setActiveId(id);
    };

    const handleDelete = () => {
        if (!activeId) return;
        deleteOrder.mutate(activeId, {
            onSuccess: () => {
                setActiveId(null);
                setSearchId('');
                setDeleteConfirm(false);
            },
        });
    };

    const statusCfg = order ? ORDER_STATUS_CONFIG[order.status] : null;
    const StatusIcon = statusCfg?.icon;

    return (
        <div className="shadow-card rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
                <h2 className="flex items-center gap-2.5 text-sm font-bold text-slate-900 dark:text-white">
                    <Search size={15} className="text-slate-400" />
                    Cari Order by ID
                </h2>
            </div>

            <div className="p-6">
                <form onSubmit={handleSearch} className="flex gap-3">
                    <Input type="number" placeholder="Masukkan Order ID..." value={searchId} onChange={(e) => setSearchId(e.target.value)} min="1" />
                    <Button type="submit" loading={isLoading} size="md" icon={<Search size={14} />}>
                        Cari
                    </Button>
                </form>

                <AnimatePresence mode="wait">
                    {isLoading && activeId && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 space-y-2">
                            <Skeleton className="h-5 w-1/3" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-2/3" />
                        </motion.div>
                    )}

                    {isError && !isLoading && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-4 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 dark:border-red-900/30 dark:bg-red-950/30"
                        >
                            <XCircle size={16} className="shrink-0 text-red-500" />
                            <p className="text-sm text-red-600 dark:text-red-400">{error?.message ?? 'Order tidak ditemukan.'}</p>
                        </motion.div>
                    )}

                    {order && !isLoading && !isError && (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className={clsx('mt-4 overflow-hidden rounded-xl border', statusCfg?.border ?? 'border-slate-200')}
                        >
                            <div className={clsx('flex items-center justify-between px-4 py-3', statusCfg?.bg ?? 'bg-slate-50')}>
                                <div className="flex items-center gap-2.5">
                                    {StatusIcon && <StatusIcon size={15} className={statusCfg?.color} />}
                                    <span className={clsx('text-sm font-bold', statusCfg?.color)}>{statusCfg?.label ?? order.status}</span>
                                </div>
                                <span className="font-mono text-xs font-semibold text-slate-500">#{order.id}</span>
                            </div>

                            <div className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
                                {[
                                    { label: 'Pet ID', value: `#${order.petId}` },
                                    { label: 'Quantity', value: order.quantity },
                                    {
                                        label: 'Ship Date',
                                        value: new Date(order.shipDate).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        }),
                                    },
                                    { label: 'Complete', value: order.complete ? 'Ya' : 'Belum' },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex items-center justify-between px-4 py-2.5">
                                        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                            {label}
                                        </span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{String(value)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
                                <Button variant="danger" size="sm" icon={<Trash2 size={13} />} onClick={() => setDeleteConfirm(true)}>
                                    Batalkan Order
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Modal open={deleteConfirm} onClose={() => setDeleteConfirm(false)} title="Batalkan Order" size="sm">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                        <Trash2 size={22} className="text-red-500" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                            Yakin ingin membatalkan order <span className="font-bold text-slate-900 dark:text-white">#{activeId}</span>?
                        </p>
                        <p className="mt-1 text-xs text-slate-400">Tindakan ini tidak dapat dibatalkan.</p>
                    </div>
                    <div className="flex w-full gap-3">
                        <Button variant="secondary" fullWidth onClick={() => setDeleteConfirm(false)}>
                            Batal
                        </Button>
                        <Button variant="danger" fullWidth loading={deleteOrder.isPending} onClick={handleDelete}>
                            Ya, Batalkan
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

// ─── Place Order Form ─────────────────────────────────────────────────────────
function PlaceOrderSection() {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        petId: '',
        quantity: '1',
        shipDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        status: 'placed' as OrderStatus,
    });

    const placeOrder = usePlaceOrder();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        placeOrder.mutate(
            {
                petId: parseInt(form.petId, 10),
                quantity: parseInt(form.quantity, 10),
                shipDate: new Date(form.shipDate).toISOString(),
                status: form.status,
                complete: false,
            },
            { onSuccess: () => setOpen(false) },
        );
    };

    return (
        <>
            <Button icon={<Plus size={15} />} onClick={() => setOpen(true)}>
                Buat Order
            </Button>

            <Modal open={open} onClose={() => setOpen(false)} title="Buat Order Baru" size="md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Pet ID"
                        type="number"
                        placeholder="contoh: 1"
                        value={form.petId}
                        onChange={(e) => setForm({ ...form, petId: e.target.value })}
                        required
                        min="1"
                    />
                    <Input
                        label="Quantity"
                        type="number"
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                        required
                        min="1"
                        max="99"
                    />
                    <Input
                        label="Tanggal Pengiriman"
                        type="date"
                        value={form.shipDate}
                        onChange={(e) => setForm({ ...form, shipDate: e.target.value })}
                        required
                    />
                    <Select label="Status Awal" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as OrderStatus })}>
                        <option value="placed">Placed</option>
                        <option value="approved">Approved</option>
                        <option value="delivered">Delivered</option>
                    </Select>

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="secondary" fullWidth onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button type="submit" fullWidth loading={placeOrder.isPending}>
                            Buat Order
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

// ─── Other Inventory Table ────────────────────────────────────────────────────
function OtherInventorySection({ entries }: { entries: [string, number][] }) {
    if (entries.length === 0) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="shadow-card rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
            <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
                <h2 className="flex items-center gap-2.5 text-sm font-bold text-slate-900 dark:text-white">
                    <BarChart3 size={15} className="text-slate-400" />
                    Status Tambahan
                    <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {entries.length}
                    </span>
                </h2>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
                {entries.map(([key, val], i) => (
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.04 }}
                        className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >
                        <div className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                            <span className="text-sm text-slate-700 capitalize dark:text-slate-300">{key}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{val.toLocaleString()}</span>
                            <ChevronRight size={14} className="text-slate-300 dark:text-slate-600" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StoreIndex() {
    const { data: inventory, isLoading, isRefetching } = useInventory();
    const queryClient = useQueryClient();

    const handleRefresh = () => queryClient.invalidateQueries({ queryKey: storeKeys.inventory() });

    const mainStatuses = ['available', 'pending', 'sold'];
    const mainEntries = mainStatuses.map((s) => [s, inventory?.[s] ?? 0] as [string, number]);
    const otherEntries = Object.entries(inventory ?? {}).filter(([k]) => !mainStatuses.includes(k));
    const total = Object.values(inventory ?? {}).reduce((a, b) => a + b, 0);

    return (
        <AppLayout title="Store">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mb-8 flex items-start justify-between gap-4"
            >
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Store</h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Inventori stok dan manajemen order</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" icon={<RefreshCw size={13} className={isRefetching ? 'animate-spin' : ''} />} onClick={handleRefresh}>
                        Refresh
                    </Button>
                    <PlaceOrderSection />
                </div>
            </motion.div>

            {!isLoading && total > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-6 flex items-center justify-between rounded-2xl border border-slate-100 bg-linear-to-r from-blue-100 to-indigo-100 px-6 py-4 dark:border-blue-900/30 dark:from-blue-950/40 dark:to-indigo-950/40"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40">
                            <ShoppingBag size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold tracking-wider text-blue-600 uppercase dark:text-blue-400">Total Inventori</p>
                            <p className="font-display text-2xl font-bold text-blue-700 dark:text-blue-300">{total.toLocaleString()} unit</p>
                        </div>
                    </div>
                    <TrendingUp size={28} className="text-blue-500 dark:text-blue-800" />
                </motion.div>
            )}

            {isLoading ? (
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="shadow-card rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                            <Skeleton className="mb-4 h-10 w-10 rounded-xl" />
                            <Skeleton className="mb-1 h-3 w-16" />
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="mt-4 h-1.5 w-full rounded-full" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {mainEntries.map(([status, value], i) => (
                        <InventoryCard key={status} status={status} value={value} index={i} total={total} />
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <OrderLookupSection />
                <OtherInventorySection entries={otherEntries} />
            </div>
        </AppLayout>
    );
}
