import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PawPrint, LayoutDashboard, ShoppingBag, Users, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import useAuthStore from '@/Store/authStore';
import { userService } from '@/Services/userService';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/pets', label: 'Pets', icon: PawPrint },
    { href: '/store', label: 'Store', icon: ShoppingBag },
];

export default function Navbar() {
    const { url } = usePage();
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        try {
            await userService.logout();
        } catch {
            /* tetap logout */
        }
        logout();
        toast.success('Sampai jumpa!');
        router.visit('/login');
    };

    return (
        <header className="fixed inset-x-0 top-0 z-40">
            <div className="backdrop-blur-ios border-ios-gray-5/60 shadow-ios border-b bg-white/70">
                <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
                    <Link href="/dashboard" className="mr-4 flex items-center gap-2">
                        <div className="bg-ios-blue rounded-ios flex h-8 w-8 items-center justify-center shadow-sm">
                            <PawPrint size={16} className="text-black" />
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
                                        'rounded-ios relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all duration-150',
                                        isActive ? 'text-ios-blue' : 'text-ios-gray-1 hover:bg-ios-gray-6 hover:text-gray-800',
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="rounded-ios absolute inset-0 bg-blue-50"
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
                        {user && <span className="text-ios-gray-1 hidden text-xs font-medium md:block">{user.username}</span>}
                        <button
                            onClick={handleLogout}
                            className="text-ios-gray-1 hover:text-ios-red flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-red-50"
                            title="Logout"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
