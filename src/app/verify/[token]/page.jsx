// src/app/verify/[token]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useVerifyEmailQuery } from '@/store/api/authApi';
import toast from 'react-hot-toast';

export default function VerifyPage() {
    const router = useRouter();
    const params = useParams();
    const token = params.token;
    const [status, setStatus] = useState('verifying');

    // ✅ RTK Query se verify email
    const { data, error, isLoading } = useVerifyEmailQuery(token, {
        skip: !token,
    });

    useEffect(() => {
        if (data?.success) {
            setStatus('success');
            toast.success('Email verified successfully! 🎉');
            // 2 sec baad login par redirect
            setTimeout(() => {
                router.push('/login');
            }, 2500);
        } else if (error) {
            setStatus('error');
            toast.error(error?.data?.message || 'Verification failed');
        }
    }, [data, error, router]);

    // ============================================
    // LOADING
    // ============================================
    if (isLoading || status === 'verifying') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <Loader2 className="h-16 w-16 animate-spin text-indigo-600 mx-auto" />
                    <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                        Verifying your email...
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Please wait while we verify your account.
                    </p>
                </motion.div>
            </div>
        );
    }

    // ============================================
    // SUCCESS
    // ============================================
    if (status === 'success') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md rounded-2xl glass p-8 border border-white/20 dark:border-gray-800/50 shadow-2xl text-center"
                >
                    <div className="mx-auto h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                        ✅ Email Verified!
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Your email has been successfully verified. You can now login.
                    </p>
                    <div className="mt-4 h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full animate-pulse" style={{ width: '100%' }} />
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Redirecting to login...
                    </p>
                </motion.div>
            </div>
        );
    }

    // ============================================
    // ERROR
    // ============================================
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md rounded-2xl glass p-8 border border-white/20 dark:border-gray-800/50 shadow-2xl text-center"
            >
                <div className="mx-auto h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                    ❌ Verification Failed
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {error?.data?.message || 'Invalid or expired verification link.'}
                </p>
                <div className="mt-6 space-y-3">
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition"
                    >
                        Go to Login
                    </button>
                    <button
                        onClick={() => router.push('/resend-verification')}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                        Resend Verification Email
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
