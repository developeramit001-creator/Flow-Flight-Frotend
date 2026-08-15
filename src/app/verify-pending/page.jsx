// src/app/verify-pending/page.jsx
'use client';

import { useRouter } from 'next/navigation';
import { Mail, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useResendVerificationMutation } from '@/store/api/authApi';

export default function VerifyPendingPage() {
    const router = useRouter();
    const [resend, { isLoading }] = useResendVerificationMutation();
    const email = typeof window !== 'undefined'
        ? localStorage.getItem('registerEmail') || ''
        : '';

    const handleResend = async () => {
        if (!email) {
            toast.error('No email found. Please try signing up again.');
            router.push('/signup');
            return;
        }

        try {
            const result = await resend({ email }).unwrap();
            if (result.success) {
                toast.success('Verification email sent again! 📧');
            }
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to resend email.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md rounded-2xl glass p-8 border border-white/20 dark:border-gray-800/50 shadow-2xl text-center"
            >
                <div className="mx-auto h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Mail className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                    Check Your Email 📧
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    We've sent a verification link to <br />
                    <strong className="text-indigo-600 dark:text-indigo-400">{email || 'your email'}</strong>
                </p>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        💡 Click the link in the email to verify your account.
                    </p>
                </div>

                <div className="mt-6 space-y-3">
                    <button
                        onClick={handleResend}
                        disabled={isLoading}
                        className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition disabled:opacity-70"
                    >
                        {isLoading ? 'Sending...' : 'Resend Verification Email'}
                    </button>
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                        Back to Login
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
