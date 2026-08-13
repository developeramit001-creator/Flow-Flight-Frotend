// src/app/(auth)/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Building2, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        orgName: '',
    });
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        orgName?: string;
    }>({});

    const validate = () => {
        const newErrors: any = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (!formData.orgName) newErrors.orgName = 'Organization name is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const user = {
                id: '1',
                name: formData.name,
                email: formData.email,
                role: 'owner',
                organization: formData.orgName
            };

            const expires = new Date();
            expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
            document.cookie = `auth-token=mock-token; expires=${expires.toUTCString()}; path=/;`;
            localStorage.setItem('user', JSON.stringify(user));

            toast.success(`Welcome ${formData.name}! Organization "${formData.orgName}" created! 🎉`);
            router.push('/');
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-8 rounded-2xl glass p-8 border border-white/20 dark:border-gray-800/50 shadow-2xl"
            >
                <div className="text-center">
                    <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <span className="text-2xl font-bold text-white">FP</span>
                    </div>
                    <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Create account</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Start your workflow journey</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                            <div className="mt-1 relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-900 pl-10 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none`}
                                    placeholder="Amit Sharma"
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <div className="mt-1 relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-900 pl-10 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none`}
                                    placeholder="you@company.com"
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <div className="mt-1 relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={`w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-900 pl-10 pr-10 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Organization Name</label>
                            <div className="mt-1 relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.orgName}
                                    onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                                    className={`w-full rounded-lg border ${errors.orgName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-900 pl-10 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none`}
                                    placeholder="Your Company Name"
                                />
                                {errors.orgName && <p className="mt-1 text-xs text-red-500">{errors.orgName}</p>}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
                    </button>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                            Sign in
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
