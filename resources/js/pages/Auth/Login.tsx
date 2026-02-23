import { useState } from 'react';
import { motion } from 'framer-motion';
import { PawPrint, User, Lock, Eye, EyeOff } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';
import Input from '@/Components/ui/Input';
import Button from '@/Components/ui/Button';
import { useAuth } from '@/Hooks/useAuth';

export default function Login() {
    const [username, setUsername] = useState('user1');
    const [password, setPassword] = useState('user1');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoggingIn } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) return;
        login({ username: username.trim(), password: password.trim() });
    };

    return (
        <GuestLayout title="Login">
            <main className="flex flex-1 items-center justify-center p-6 sm:p-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-110"
                >
                    {/* Card */}
                    <div className="rounded-ios-2xl shadow-ios-lg overflow-hidden border border-gray-100 bg-white shadow-md">
                        <div className="p-8 sm:p-10">
                            {/* Header */}
                            <div className="mb-10 text-center">
                                <div className="rounded-ios-xl bg-ios-blue shadow-ios mx-auto mb-5 flex h-14 w-14 items-center justify-center">
                                    <PawPrint className="text-black" size={26} />
                                </div>
                                <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">Sign in</h1>
                                <p className="text-ios-gray-1 text-sm leading-relaxed">
                                    Manage your pet&apos;s world, from appointments to health tracking.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input
                                    label="Username"
                                    type="text"
                                    placeholder="name@example.com"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    leftIcon={<User size={15} />}
                                    autoComplete="username"
                                />

                                <Input
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    leftIcon={<Lock size={15} />}
                                    rightIcon={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-ios-gray-2 hover:text-ios-gray-1 transition"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    }
                                    autoComplete="current-password"
                                />

                                <Button type="submit" fullWidth size="lg" loading={isLoggingIn} className="shadow-ios-md mt-2 active:scale-[0.98]">
                                    Sign In
                                </Button>
                            </form>

                            {/* Demo Box */}
                            <div className="rounded-ios-lg bg-ios-gray-6 mt-10 border border-gray-100 p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="text-ios-blue text-xs font-bold tracking-widest uppercase">Quick Demo Access</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-700">
                                    <div>
                                        User: <span className="font-mono font-semibold text-gray-900">user1</span>
                                    </div>
                                    <div>
                                        Pass: <span className="font-mono font-semibold text-gray-900">user1</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-ios-gray-2 mt-8 flex justify-center gap-6 text-xs font-medium tracking-widest uppercase">
                        <a href="#" className="hover:text-ios-blue transition">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-ios-blue transition">
                            Terms
                        </a>
                        <a href="#" className="hover:text-ios-blue transition">
                            Support
                        </a>
                    </div>
                </motion.div>
            </main>
        </GuestLayout>
    );
}
