// src/app/dashboard/invitations/page.jsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, CheckCircle, XCircle, Loader2, Building2, User,
    Clock, Calendar, Shield, RefreshCw, AlertCircle, ExternalLink
} from 'lucide-react';
import { useGetMyInvitesQuery, useAcceptInviteMutation, useRejectInviteMutation } from '@/store/api/memberApi';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Link from 'next/link';

// ============================================
// INVITE CARD
// ============================================
const InviteCard = ({ invite, onAccept, onReject, isAccepting, isRejecting }) => {
    const timeAgo = (date) => {
        const now = new Date();
        const diffMs = now - new Date(date);
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const isExpired = new Date(invite.expires_at) < new Date();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className={`bg-white dark:bg-gray-900 rounded-xl border ${isExpired ? 'border-red-200 dark:border-red-800' : 'border-gray-200 dark:border-gray-700'
                } p-5 shadow-sm hover:shadow-md transition-all duration-300`}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left - Details */}
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {invite.organization_name?.charAt(0) || 'O'}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                {invite.organization_name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    <User className="h-3.5 w-3.5" />
                                    {invite.inviter_name}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Shield className="h-3.5 w-3.5" />
                                    <span className="capitalize">{invite.role}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {timeAgo(invite.sent_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right - Actions */}
                <div className="flex items-center gap-3">
                    {/* Expired Badge */}
                    {isExpired && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Expired
                        </span>
                    )}

                    {/* Accept Button */}
                    <button
                        onClick={() => onAccept(invite.id, invite.token)}
                        disabled={isAccepting || isExpired}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition ${isExpired
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                                : 'bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-500/30'
                            }`}
                    >
                        {isAccepting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <CheckCircle className="h-4 w-4" />
                        )}
                        Accept
                    </button>

                    {/* Reject Button */}
                    <button
                        onClick={() => onReject(invite.id)}
                        disabled={isRejecting || isExpired}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition ${isExpired
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                                : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50'
                            }`}
                    >
                        {isRejecting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <XCircle className="h-4 w-4" />
                        )}
                        Reject
                    </button>

                    {/* View Organization Link */}
                    {!isExpired && (
                        <Link
                            href={`/invite/${invite.token}`}
                            className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                        >
                            <ExternalLink className="h-4 w-4" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Expires At */}
            <div className="mt-3 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Expires: {new Date(invite.expires_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                })}
            </div>
        </motion.div>
    );
};

// ============================================
// LOADING SKELETON
// ============================================
const InviteSkeleton = () => (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div>
                        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
        </div>
    </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function InvitationsPage() {
    const user = useSelector((state) => state.auth.user);

    // ✅ RTK Query hooks
    const {
        data: invitesData,
        isLoading,
        error,
        refetch
    } = useGetMyInvitesQuery(undefined, {
        skip: !user?.id,
    });

    const [acceptInvite, { isLoading: isAccepting }] = useAcceptInviteMutation();
    const [rejectInvite, { isLoading: isRejecting }] = useRejectInviteMutation();

    // ✅ States for individual loading
    const [acceptingId, setAcceptingId] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);

    // ✅ Data
    const invites = invitesData?.data?.invites || [];
    const totalInvites = invitesData?.data?.total || 0;

    // ============================================
    // HANDLE ACCEPT INVITE
    // ============================================
    const handleAccept = async (inviteId, token) => {
        if (!user?.id) {
            toast.error('Please login first.');
            return;
        }

        setAcceptingId(inviteId);
        try {
            const result = await acceptInvite({
                token,
                userId: user.id
            }).unwrap();

            if (result.success) {
                toast.success('You have joined the organization! 🎉');
                refetch();
            } else {
                toast.error(result.message || 'Failed to accept invite.');
            }
        } catch (error) {
            console.error('Accept invite error:', error);
            toast.error(error?.data?.message || 'Failed to accept invite.');
        } finally {
            setAcceptingId(null);
        }
    };

    // ============================================
    // HANDLE REJECT INVITE
    // ============================================
    const handleReject = async (inviteId) => {
        if (!confirm('Are you sure you want to reject this invitation?')) {
            return;
        }

        setRejectingId(inviteId);
        try {
            const result = await rejectInvite(inviteId).unwrap();

            if (result.success) {
                toast.success('Invite rejected successfully.');
                refetch();
            } else {
                toast.error(result.message || 'Failed to reject invite.');
            }
        } catch (error) {
            console.error('Reject invite error:', error);
            toast.error(error?.data?.message || 'Failed to reject invite.');
        } finally {
            setRejectingId(null);
        }
    };

    // ============================================
    // RENDER - LOADING
    // ============================================
    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse" />
                    </div>
                    <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>
                {/* Invites Skeleton */}
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <InviteSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    // ============================================
    // RENDER - ERROR
    // ============================================
    if (error) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                    <h3 className="mt-4 text-lg font-semibold text-red-700 dark:text-red-300">
                        Failed to load invitations
                    </h3>
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {error?.data?.message || 'Something went wrong. Please try again.'}
                    </p>
                    <button
                        onClick={refetch}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition flex items-center gap-2 mx-auto"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // ============================================
    // RENDER - MAIN
    // ============================================
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto space-y-6"
        >
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Mail className="h-6 w-6 text-indigo-500" />
                        My Invitations
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        You have {totalInvites} pending invitation{totalInvites !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={refetch}
                    className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            {/* INVITES LIST */}
            {totalInvites === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <div className="mx-auto h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Mail className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                        No pending invitations
                    </h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        You don't have any pending invitations. When someone invites you to join their organization, it will appear here.
                    </p>
                </div>
            ) : (
                <AnimatePresence>
                    <div className="space-y-4">
                        {invites.map((invite) => (
                            <InviteCard
                                key={invite.id}
                                invite={invite}
                                onAccept={handleAccept}
                                onReject={handleReject}
                                isAccepting={acceptingId === invite.id}
                                isRejecting={rejectingId === invite.id}
                            />
                        ))}
                    </div>
                </AnimatePresence>
            )}

            {/* EXPIRED INVITES NOTE */}
            {invites.some(invite => new Date(invite.expires_at) < new Date()) && (
                <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-sm text-yellow-700 dark:text-yellow-300 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium">Expired invites</p>
                        <p className="text-yellow-600 dark:text-yellow-400">
                            Some invites have expired. You can remove them by rejecting.
                        </p>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
