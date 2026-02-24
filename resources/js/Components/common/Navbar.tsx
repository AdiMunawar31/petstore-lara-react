import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PawPrint, LayoutDashboard, ShoppingBag, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import useAuthStore from '@/Store/authStore';
import { userService } from '@/Services/userService';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import LogoutConfirmModal from '../feature/LogoutConfirmModal';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/pets', label: 'Pets', icon: PawPrint },
    { href: '/store', label: 'Store', icon: ShoppingBag },
];

export default function Navbar() {
    const { url } = usePage();
    const { user, logout } = useAuthStore();
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogoutConfirm = async () => {
        setIsLoggingOut(true);

        try {
            await userService.logout();
        } catch {
            // ignore backend error
        } finally {
            logout();
            setIsLoggingOut(false);
            setLogoutOpen(false);
            toast.success('Sampai jumpa!');
            router.visit('/login');
        }
    };

    return (
        <header className="fixed inset-x-0 top-0 z-40">
            <div className="border-b border-d2y-gray-5/60 bg-white/70 shadow-d2y backdrop-blur-d2y">
                <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
                    <Link href="/dashboard" className="mr-4 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-d2y bg-d2y-blue shadow-sm">
                            <PawPrint size={16} className="text-white" />
                        </div>
                        <span className="hidden text-sm font-bold text-gray-900 sm:block">PetStore</span>
                    </Link>

                    <nav className="flex flex-1 items-center gap-1">
                        {navItems.map(({ href, label, icon: Icon }) => {
                            const isActive = url === href || url.startsWith(href + '/');
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={clsx(
                                        'relative flex items-center gap-1.5 rounded-d2y px-3 py-1.5 text-sm font-medium transition-all duration-150',
                                        isActive ? 'text-d2y-blue' : 'text-d2y-gray-1 hover:bg-d2y-gray-6 hover:text-gray-800',
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="absolute inset-0 rounded-d2y bg-blue-50"
                                            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                        />
                                    )}
                                    <span className="relative flex items-center gap-1.5">
                                        <Icon size={15} />
                                        <span className="hidden sm:block">{label}</span>
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="ml-auto flex items-center gap-2">
                        {user && <span className="hidden text-xs font-medium text-d2y-gray-1 md:block">{user.username}</span>}
                        <button
                            onClick={() => setLogoutOpen(true)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-d2y-gray-1 transition-all hover:bg-red-50 hover:text-d2y-red"
                            title="Logout"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <LogoutConfirmModal open={logoutOpen} onClose={() => setLogoutOpen(false)} onConfirm={handleLogoutConfirm} isLoading={isLoggingOut} />
        </header>
    );
}
