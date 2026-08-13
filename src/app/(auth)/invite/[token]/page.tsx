// src/app/(auth)/invite/[token]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Building2, User, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AcceptInvitePage() {
    const router = useRouter();
    const params = useParams();
    const token = params.token;

    const [isLoading, setIsLoading] = useState(true);
    const [inviteData, setInviteData] = useState<{
        organization: string;
        inviter: string;
        role: string;
        email: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [accepting, setAccepting] = useState(false);

    // Verify invite token
    useEffect(() => {
        const verifyInvite = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Mock invite data
                setInviteData({
                    organization: 'FlowPilot Inc.',
                    inviter: 'Amit Sharma',
                    role: 'member',
                    email: 'user@example.com',
                });
                setIsLoading(false);
            } catch (error) {
                setError('Invalid or expired invite link.');
                setIsLoading(false);
            }
        };

        verifyInvite();
    }, [token]);

    const handleAcceptInvite = async () => {
        setAccepting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Set mock auth
            const expires = new Date();
            expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
            document.cookie = `auth-token=mock-token; expires=${expires.toUTCString()}; path=/;`;

            toast.success('You have joined the organization! 🎉');
            router.push('/');
        } catch (error) {
            toast.error('Failed to accept invite. Please try again.');
        } finally {
            setAccepting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Verifying your invite...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
                <div className="text-center">
                    <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                    <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Invite Invalid</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md rounded-2xl glass p-8 border border-white/20 dark:border-gray-800/50 shadow-2xl text-center"
            >
                <div className="mx-auto h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>

                <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">You've been invited!</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Join <strong className="text-indigo-600 dark:text-indigo-400">{inviteData?.organization}</strong>
                </p>

                <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-left space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">
                            Invited by: <strong>{inviteData?.inviter}</strong>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">
                            Role: <strong className="capitalize">{inviteData?.role}</strong>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">
                            Email: <strong>{inviteData?.email}</strong>
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleAcceptInvite}
                    disabled={accepting}
                    className="mt-6 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {accepting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
                    {accepting ? 'Joining...' : 'Accept Invite'}
                </button>

                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    By accepting, you agree to join this organization.
                </p>
            </motion.div>
        </div>
    );
}
