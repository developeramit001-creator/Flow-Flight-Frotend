// src/app/(auth)/login/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, Eye, EyeOff, Sparkles, AlertCircle, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLoginMutation, useResendVerificationMutation } from '@/store/api/authApi';
import { useTheme } from '@/providers/ThemeProvider';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const [login, { isLoading }] = useLoginMutation();
    const [resend, { isLoading: isResending }] = useResendVerificationMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [showResend, setShowResend] = useState(false);
    const [resendEmail, setResendEmail] = useState('');

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const result = await login(formData).unwrap();
            if (result.success) {
                toast.success('Welcome back! 🎉', {
                    icon: '👋',
                    duration: 3000,
                });
                console.log('Redirecting to dashboard...');
                router.push('/dashboard');
            }
        } catch (error) {
            const message = error?.data?.message || 'Invalid credentials. Please try again.';

            if (error?.data?.error === 'EMAIL_NOT_VERIFIED' || message.includes('verify')) {
                setShowResend(true);
                setResendEmail(formData.email);
                toast.error('Please verify your email before logging in.', {
                    icon: '📧',
                    duration: 5000,
                });
            } else {
                toast.error(message, {
                    icon: '❌',
                    duration: 4000,
                });
            }
        }
    };

    const handleResendVerification = async () => {
        if (!resendEmail) {
            toast.error('No email found. Please try logging in again.');
            return;
        }

        try {
            const result = await resend({ email: resendEmail }).unwrap();
            if (result.success) {
                toast.success('Verification email sent again! 📧', {
                    icon: '✅',
                    duration: 3000,
                });
                setShowResend(false);
            }
        } catch (error) {
            const message = error?.data?.message || 'Failed to resend verification email.';
            toast.error(message, {
                icon: '❌',
                duration: 4000,
            });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md rounded-2xl glass p-8 border border-white/20 dark:border-gray-800/50 shadow-2xl"
            >
                {/* Dark Mode Toggle - Top Right */}
                <div className="absolute top-4 right-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-5 w-5 text-yellow-400" />
                        ) : (
                            <Moon className="h-5 w-5 text-gray-600" />
                        )}
                    </button>
                </div>

                {/* Logo */}
                <div className="text-center">
                    <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <Sparkles className="h-7 w-7 text-white" />
                    </div>
                    <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Sign in to your FlowPilot workspace
                    </p>
                </div>

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address
                            </label>
                            <div className="mt-1 relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                                        } bg-white dark:bg-gray-900 pl-10 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none`}
                                    placeholder="you@company.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={`w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                                        } bg-white dark:bg-gray-900 pl-10 pr-10 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Resend Verification */}
                    {showResend && (
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Your email is not verified. Please check your inbox.
                            </p>
                            <button
                                type="button"
                                onClick={handleResendVerification}
                                disabled={isResending}
                                className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium disabled:opacity-50"
                            >
                                {isResending ? 'Sending...' : 'Resend verification email'}
                            </button>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            'Sign In'
                        )}
                    </button>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        New here?{' '}
                        <Link
                            href="/signup"
                            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition"
                        >
                            Create account
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
