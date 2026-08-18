// src/app/dashboard/team/page.jsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Mail, X, Check, Crown, Shield, User,
    Loader2, Send, Copy, AlertCircle, RefreshCw, UserPlus,
    Clock, Repeat, CheckCircle, XCircle, UserMinus
} from 'lucide-react';
import {
    useGetMembersQuery,
    useInviteMemberMutation,
    useRemoveMemberMutation,
    useGetPendingInvitesQuery,
    useResendInviteMutation  // ✅ IMPORT
} from '@/store/api/memberApi';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

// ============================================
// ROLES (Sirf Display Ke Liye)
// ============================================
const ROLES = {
    owner: { label: 'Owner', icon: Crown, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30' },
    admin: { label: 'Admin', icon: Shield, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
    member: { label: 'Member', icon: User, color: 'text-green-500 bg-green-50 dark:bg-green-950/30' },
    guest: { label: 'Guest', icon: User, color: 'text-gray-500 bg-gray-50 dark:bg-gray-800' },
};

// ============================================
// LOADING SKELETON
// ============================================
const MemberSkeleton = () => (
    <div className="flex items-center justify-between p-4 animate-pulse">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div>
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded mt-1" />
            </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
    </div>
);

const InviteSkeleton = () => (
    <div className="flex items-center justify-between p-4 animate-pulse">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div>
                <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded mt-1" />
            </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
    </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function TeamPage() {
    // ✅ Get orgId and user from Redux store
    const organization = useSelector((state) => state.auth.organization);
    const user = useSelector((state) => state.auth.user);
    const orgId = organization?.id;

    // ============================================
    // RTK QUERY HOOKS
    // ============================================
    const {
        data: membersData,
        isLoading: membersLoading,
        error: membersError,
        refetch: refetchMembers
    } = useGetMembersQuery(orgId, {
        skip: !orgId,
    });

    const {
        data: invitesData,
        isLoading: invitesLoading,
        error: invitesError,
        refetch: refetchInvites
    } = useGetPendingInvitesQuery(orgId, {
        skip: !orgId,
    });

    const [inviteMember, { isLoading: isInviting }] = useInviteMemberMutation();
    const [removeMember, { isLoading: isRemoving }] = useRemoveMemberMutation();
    const [resendInvite, { isLoading: isResending }] = useResendInviteMutation(); // ✅ RTK Query

    // ============================================
    // STATE
    // ============================================
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('member');
    const [copySuccess, setCopySuccess] = useState(false);
    const [cancelling, setCancelling] = useState(null);
    const [resendingEmail, setResendingEmail] = useState(null);

    // ✅ Data from RTK Query
    const members = membersData?.data?.members || [];
    const userRole = membersData?.data?.role || 'member';
    const totalMembers = membersData?.data?.total || 0;
    const pendingInvites = invitesData?.data?.invites || [];
    const totalPending = invitesData?.data?.total || 0;

    const isLoading = membersLoading || invitesLoading;
    const error = membersError || invitesError;

    // ============================================
    // HANDLE INVITE
    // ============================================
    const handleInvite = async () => {
        if (!inviteEmail) {
            toast.error('Please enter an email address.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        try {
            await inviteMember({ orgId, email: inviteEmail, role: inviteRole }).unwrap();
            toast.success(`Invite sent to ${inviteEmail}! 📧`);
            setInviteEmail('');
            setInviteRole('member');
            setShowInviteModal(false);
            refetchInvites();
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to send invite');
        }
    };

    // ============================================
    // HANDLE REMOVE MEMBER
    // ============================================
    const handleRemoveMember = async (memberId, name) => {
        if (!confirm(`Are you sure you want to remove ${name} from the team?`)) {
            return;
        }

        try {
            await removeMember({ orgId, memberId }).unwrap();
            toast.success(`${name} removed from team.`);
            refetchMembers();
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to remove member');
        }
    };

    // ============================================
    // HANDLE CANCEL INVITE
    // ============================================
    const handleCancelInvite = async (inviteId, email) => {
        if (!confirm(`Cancel invite to ${email}?`)) return;

        setCancelling(inviteId);
        try {
            const res = await fetch(`/api/${orgId}/invites/${inviteId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();

            if (data.success) {
                toast.success(`Invite to ${email} cancelled.`);
                refetchInvites();
            } else {
                toast.error(data.message || 'Failed to cancel invite');
            }
        } catch (error) {
            toast.error('Failed to cancel invite');
        } finally {
            setCancelling(null);
        }
    };

    // ============================================
    // HANDLE RESEND INVITE (RTK Query)
    // ============================================
    const handleResendInvite = async (email) => {
        setResendingEmail(email);
        try {
            await resendInvite({ orgId, email }).unwrap();
            toast.success(`Invite resent to ${email}! 📧`);
            refetchInvites();
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to resend invite');
        } finally {
            setResendingEmail(null);
        }
    };

    // ============================================
    // HANDLE COPY LINK
    // ============================================
    const handleCopyLink = () => {
        const link = `${window.location.origin}/invite/abc123`;
        navigator.clipboard.writeText(link);
        setCopySuccess(true);
        toast.success('Invite link copied!');
        setTimeout(() => setCopySuccess(false), 3000);
    };

    // ============================================
    // GET TIME AGO
    // ============================================
    const getTimeAgo = (date) => {
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

    // ============================================
    // RENDER - LOADING
    // ============================================
    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse" />
                    </div>
                    <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {[1, 2, 3, 4].map((i) => (
                            <MemberSkeleton key={i} />
                        ))}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {[1, 2].map((i) => (
                            <InviteSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ============================================
    // RENDER - ERROR
    // ============================================
    if (error) {
        return (
            <div className="max-w-5xl mx-auto">
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                    <h3 className="mt-4 text-lg font-semibold text-red-700 dark:text-red-300">
                        Something went wrong
                    </h3>
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {error?.data?.message || 'Failed to load data.'}
                    </p>
                    <button
                        onClick={() => { refetchMembers(); refetchInvites(); }}
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
            className="max-w-5xl mx-auto space-y-6"
        >
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Users className="h-6 w-6 text-indigo-500" />
                        Team Members
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {totalMembers} active members • {totalPending} pending invites
                    </p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition shadow-lg shadow-indigo-500/30"
                >
                    <UserPlus className="h-5 w-5" />
                    Invite Member
                </button>
            </div>

            {/* ACTIVE MEMBERS */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Active Members
                    </h3>
                    <button
                        onClick={refetchMembers}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Refresh
                    </button>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {members.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <Users className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                            <p className="mt-2">No members yet. Invite your team to get started!</p>
                        </div>
                    ) : (
                        members.map((member) => {
                            const RoleInfo = ROLES[member.role] || ROLES.member;
                            const RoleIcon = RoleInfo.icon;
                            const isCurrentUser = member.id === user?.id;

                            return (
                                <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                            {member.avatar || member.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {member.name} {isCurrentUser && (
                                                    <span className="text-xs text-gray-400 font-normal">(You)</span>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${RoleInfo.color}`}>
                                            <RoleIcon className="h-3.5 w-3.5" />
                                            {RoleInfo.label}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                            <Check className="h-3.5 w-3.5" />
                                            Active
                                        </span>
                                        {member.role !== 'owner' && !isCurrentUser && (
                                            <button
                                                onClick={() => handleRemoveMember(member.id, member.name)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
                                                title="Remove member"
                                            >
                                                <UserMinus className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* PENDING INVITES */}
            {pendingInvites.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            Pending Invites
                        </h3>
                        <button
                            onClick={refetchInvites}
                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Refresh
                        </button>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {pendingInvites.map((invite) => (
                            <motion.div
                                key={invite.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                        {invite.email[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{invite.email}</p>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${invite.role === 'admin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                                                    invite.role === 'member' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                                }`}>
                                                {invite.role.charAt(0).toUpperCase() + invite.role.slice(1)}
                                            </span>
                                            <span className="text-xs text-yellow-500 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                Pending
                                            </span>
                                            <span className="text-xs text-gray-400">• {getTimeAgo(invite.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Resend Button - RTK Query */}
                                    <button
                                        onClick={() => handleResendInvite(invite.email)}
                                        disabled={isResending || resendingEmail === invite.email}
                                        className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 transition disabled:opacity-50"
                                        title="Resend invite"
                                    >
                                        {isResending || resendingEmail === invite.email ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Repeat className="h-4 w-4" />
                                        )}
                                    </button>
                                    {/* Cancel Button */}
                                    <button
                                        onClick={() => handleCancelInvite(invite.id, invite.email)}
                                        disabled={cancelling === invite.id}
                                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-red-500 dark:text-red-400 transition disabled:opacity-50"
                                        title="Cancel invite"
                                    >
                                        {cancelling === invite.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <XCircle className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* INVITE MODAL */}
            <AnimatePresence>
                {showInviteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in-up">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Invite Team Member
                                </h3>
                                <button
                                    onClick={() => setShowInviteModal(false)}
                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                                >
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Send an invite to join your organization.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        placeholder="colleague@company.com"
                                        className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Role
                                    </label>
                                    <select
                                        value={inviteRole}
                                        onChange={(e) => setInviteRole(e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="member">Member</option>
                                        <option value="guest">Guest</option>
                                    </select>
                                </div>

                                <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-lg">
                                    <p className="text-xs text-indigo-700 dark:text-indigo-300">
                                        💡 <strong>Role Permissions:</strong><br />
                                        • <strong>Admin</strong> – Can manage projects and members<br />
                                        • <strong>Member</strong> – Can create and work on tasks<br />
                                        • <strong>Guest</strong> – View-only access
                                    </p>
                                </div>

                                <button
                                    onClick={handleCopyLink}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                >
                                    <Copy className="h-4 w-4" />
                                    {copySuccess ? 'Copied!' : 'Copy Invite Link'}
                                </button>
                            </div>

                            <div className="flex gap-2 mt-6">
                                <button
                                    onClick={() => setShowInviteModal(false)}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleInvite}
                                    disabled={isInviting}
                                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 transition flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isInviting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                    {isInviting ? 'Sending...' : 'Send Invite'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
