// src/app/(auth)/invite/[token]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    CheckCircle, XCircle, Loader2, Building2, User, Mail,
    Clock, Calendar, Shield, ArrowRight, Sparkles, AlertCircle,
    Moon, Sun
} from 'lucide-react';
import { useAcceptInviteMutation, useGetInviteDetailsQuery } from '@/store/api/memberApi';
import { useSelector } from 'react-redux';
import { useTheme } from '@/providers/ThemeProvider';
import toast from 'react-hot-toast';

export default function AcceptInvitePage() {
    const router = useRouter();
    const params = useParams();
    const token = params.token;
    const { theme, toggleTheme } = useTheme();

    // ✅ RTK Query hooks
    const [acceptInvite, { isLoading: isAccepting }] = useAcceptInviteMutation();
    const user = useSelector((state) => state.auth.user);

    // ✅ Get invite details using RTK Query
    const {
        data: inviteResponse,
        isLoading: isInviteLoading,
        error: inviteError,
    } = useGetInviteDetailsQuery(token, {
        skip: !token,
    });

    // ✅ State
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if user is logged in
    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            ?.split('=')[1];
        setIsLoggedIn(!!token);
    }, []);

    // ✅ Data from RTK Query
    const inviteData = inviteResponse?.data;
    const error = inviteError?.data?.message || inviteError?.message || null;

    // ✅ Handle accept invite
    const handleAcceptInvite = async () => {
        if (!user?.id) {
            toast.error('Please login first to accept the invite.');
            router.push(`/login?redirect=/invite/${token}`);
            return;
        }

        try {
            const result = await acceptInvite({
                token,
                userId: user.id
            }).unwrap();

            if (result.success) {
                toast.success('You have joined the organization! 🎉');
                router.push('/dashboard');
            } else {
                toast.error(result.message || 'Failed to accept invite.');
            }
        } catch (error) {
            console.error('Accept invite error:', error);
            toast.error(error?.data?.message || 'Failed to accept invite. Please try again.');
        }
    };

    // ✅ Handle login redirect
    const handleLoginRedirect = () => {
        const email = inviteData?.email || '';
        router.push(`/login?redirect=/invite/${token}&email=${encodeURIComponent(email)}`);
    };

    // ✅ Handle signup redirect
    const handleSignupRedirect = () => {
        const email = inviteData?.email || '';
        const org = inviteData?.organization || '';
        router.push(`/signup?redirect=/invite/${token}&email=${encodeURIComponent(email)}&org=${encodeURIComponent(org)}`);
    };

    // ============================================
    // RENDER - LOADING
    // ============================================
    if (isInviteLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 relative">
                <button
                    onClick={toggleTheme}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? (
                        <Sun className="h-5 w-5 text-yellow-400" />
                    ) : (
                        <Moon className="h-5 w-5 text-gray-600" />
                    )}
                </button>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="relative">
                        <Loader2 className="h-16 w-16 animate-spin text-indigo-600 mx-auto" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950/50 animate-pulse" />
                        </div>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                        Verifying your invite...
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Please wait while we check your invitation.
                    </p>
                </motion.div>
            </div>
        );
    }

    // ============================================
    // RENDER - ERROR
    // ============================================
    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-4 relative">
                <button
                    onClick={toggleTheme}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? (
                        <Sun className="h-5 w-5 text-yellow-400" />
                    ) : (
                        <Moon className="h-5 w-5 text-gray-600" />
                    )}
                </button>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md rounded-2xl glass p-8 border border-white/20 dark:border-gray-800/50 shadow-2xl text-center"
                >
                    <div className="mx-auto h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                        ❌ Invite Invalid
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {error}
                    </p>
                    <div className="mt-6 space-y-3">
                        <button
                            onClick={() => router.push('/login')}
                            className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition"
                        >
                            Go to Login
                        </button>
                        <button
                            onClick={() => router.push('/signup')}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                            Create Account
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ============================================
    // RENDER - MAIN
    // ============================================
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-4 relative">
            {/* ✅ Dark Mode Toggle - Top Right */}
            <button
                onClick={toggleTheme}
                className="absolute top-4 right-4 z-50 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                    <Moon className="h-5 w-5 text-gray-600" />
                )}
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md rounded-2xl glass p-8 border border-white/20 dark:border-gray-800/50 shadow-2xl"
            >
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                        You've been invited! 🎉
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Join <strong className="text-indigo-600 dark:text-indigo-400">{inviteData?.organization}</strong>
                    </p>
                </div>

                {/* Invite Details */}
                <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
                    {/* Inviter */}
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center">
                            <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Invited by</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {inviteData?.inviter || 'Unknown'}
                            </p>
                        </div>
                    </div>

                    {/* Role */}
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center">
                            <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                {inviteData?.role || 'Member'}
                            </p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
                            <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {inviteData?.email || 'Not specified'}
                            </p>
                        </div>
                    </div>

                    {/* Sent At */}
                    {inviteData?.sentAt && (
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-950/50 flex items-center justify-center">
                                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Sent</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {new Date(inviteData.sentAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Expires At */}
                    {inviteData?.expiresAt && (
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                                <Calendar className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Expires</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {new Date(inviteData.expiresAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Banner */}
                {isLoggedIn && user ? (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            You are logged in as <strong>{user?.name || user?.email}</strong>
                        </p>
                    </div>
                ) : (
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Please login or sign up to accept this invite.
                        </p>
                    </div>
                )}

                {/* Actions */}
                {isLoggedIn && user ? (
                    <button
                        onClick={handleAcceptInvite}
                        disabled={isAccepting}
                        className="mt-6 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isAccepting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <CheckCircle className="h-5 w-5" />
                                Accept Invite
                            </>
                        )}
                    </button>
                ) : (
                    <div className="mt-6 space-y-3">
                        <button
                            onClick={handleLoginRedirect}
                            className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition flex items-center justify-center gap-2"
                        >
                            <ArrowRight className="h-4 w-4" />
                            Login to Accept
                        </button>
                        <button
                            onClick={handleSignupRedirect}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2"
                        >
                            <Sparkles className="h-4 w-4" />
                            Create Account
                        </button>
                    </div>
                )}

                <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                    This invite will expire in 7 days.
                </p>
            </motion.div>
        </div>
    );
}
