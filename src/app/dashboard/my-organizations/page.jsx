// src/app/dashboard/my-organizations/page.jsx
'use client';

import { motion } from 'framer-motion';
import {
    Building2, Users, Crown, Shield, User, Calendar,
    CheckCircle, Clock, ArrowRight, RefreshCw, AlertCircle,
    Mail, UserCheck, UserPlus
} from 'lucide-react';
import { useGetMyOrganizationsQuery, useGetMyInvitesQuery } from '@/store/api/memberApi';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import toast from 'react-hot-toast';

// ============================================
// ROLE BADGE
// ============================================
const RoleBadge = ({ role }) => {
    const roleConfig = {
        owner: { label: 'Owner', icon: Crown, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30', border: 'border-yellow-200 dark:border-yellow-800' },
        admin: { label: 'Admin', icon: Shield, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800' },
        member: { label: 'Member', icon: User, color: 'text-green-500 bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800' },
        guest: { label: 'Guest', icon: User, color: 'text-gray-500 bg-gray-50 dark:bg-gray-800', border: 'border-gray-200 dark:border-gray-700' },
    };

    const config = roleConfig[role] || roleConfig.member;
    const Icon = config.icon;

    return (
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.color} ${config.border}`}>
            <Icon className="h-3.5 w-3.5" />
            {config.label}
        </span>
    );
};

// ============================================
// ORGANIZATION CARD
// ============================================
const OrgCard = ({ org }) => {
    const isOwner = org.is_owner;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-xl transition-all duration-300 group"
        >
            <div className="flex items-start gap-4">
                {/* Logo */}
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0`}>
                    {org.name?.charAt(0) || 'O'}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {org.name}
                        </h3>
                        {isOwner && (
                            <span className="text-xs bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded-full">
                                Owner
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <RoleBadge role={org.role} />
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            Joined: {new Date(org.joined_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </span>
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Active
                        </span>
                    </div>
                </div>

                {/* Action */}
                <Link
                    href={`/dashboard`}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                    <ArrowRight className="h-5 w-5" />
                </Link>
            </div>
        </motion.div>
    );
};

// ============================================
// INVITE CARD
// ============================================
const InviteCard = ({ invite }) => {
    const timeAgo = (date) => {
        const diffMs = new Date() - new Date(date);
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
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -2 }}
            className={`bg-white dark:bg-gray-900 rounded-xl border p-4 hover:shadow-xl transition-all duration-300 ${isExpired
                    ? 'border-red-200 dark:border-red-800 opacity-60'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {invite.organization_name?.charAt(0) || 'O'}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                            {invite.organization_name}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>From: {invite.inviter_name}</span>
                            <span>•</span>
                            <span>Role: <span className="capitalize">{invite.role}</span></span>
                            <span>•</span>
                            <span>{timeAgo(invite.sent_at)}</span>
                        </div>
                    </div>
                </div>

                {isExpired ? (
                    <span className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Expired
                    </span>
                ) : (
                    <Link
                        href={`/invite/${invite.token}`}
                        className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
                    >
                        View Invite
                    </Link>
                )}
            </div>
        </motion.div>
    );
};

// ============================================
// LOADING SKELETON
// ============================================
const OrgSkeleton = () => (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
        <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1">
                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="flex items-center gap-3 mt-2">
                    <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
            </div>
        </div>
    </div>
);

const InviteSkeleton = () => (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div>
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded mt-1" />
                </div>
            </div>
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
    </div>
);

// ============================================
// 📊 STAT CARD (Premium)
// ============================================
const StatCard = ({ icon: Icon, label, value, color, delay }) => {
    const colorMap = {
        indigo: 'from-indigo-500 to-purple-500',
        yellow: 'from-yellow-400 to-amber-500',
        green: 'from-green-400 to-emerald-500',
        rose: 'from-rose-400 to-pink-500',
        blue: 'from-blue-500 to-cyan-500',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center hover:shadow-xl transition-all duration-300 group"
        >
            <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${colorMap[color]} shadow-lg mb-2 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
        </motion.div>
    );
};

// ============================================
// 🎯 MAIN COMPONENT
// ============================================
export default function MyOrganizationsPage() {
    const user = useSelector((state) => state.auth.user);

    const {
        data: orgsData,
        isLoading: orgsLoading,
        error: orgsError,
        refetch: refetchOrgs
    } = useGetMyOrganizationsQuery(undefined, {
        skip: !user?.id,
    });

    const {
        data: invitesData,
        isLoading: invitesLoading,
        error: invitesError,
        refetch: refetchInvites
    } = useGetMyInvitesQuery(undefined, {
        skip: !user?.id,
    });

    const isLoading = orgsLoading || invitesLoading;
    const organizations = orgsData?.data?.organizations || [];
    const pendingInvites = invitesData?.data?.invites || [];

    const ownerCount = organizations.filter(o => o.role === 'owner').length;
    const memberCount = organizations.filter(o => o.role === 'admin' || o.role === 'member').length;

    // ============================================
    // RENDER - LOADING
    // ============================================
    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-9 w-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                        <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded-lg mt-1 animate-pulse" />
                    </div>
                    <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                    ))}
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <OrgSkeleton key={i} />
                    ))}
                </div>
                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <InviteSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    // ============================================
    // RENDER - MAIN (Stats TOP, Orgs BOTTOM)
    // ============================================
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto space-y-6 py-4"
        >
            {/* 🚀 HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Building2 className="h-7 w-7 text-indigo-500" />
                        My Organizations
                        <span className="text-sm font-normal bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full">
                            {organizations.length}
                        </span>
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {organizations.length} organization{organizations.length !== 1 ? 's' : ''} • {pendingInvites.length} pending invite{pendingInvites.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={() => { refetchOrgs(); refetchInvites(); }}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-lg transition-all duration-300"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            {/* 📊 STATS - TOP (Moved from Bottom) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    icon={Building2}
                    label="Organizations"
                    value={organizations.length}
                    color="indigo"
                    delay={0.05}
                />
                <StatCard
                    icon={Crown}
                    label="As Owner"
                    value={ownerCount}
                    color="yellow"
                    delay={0.1}
                />
                <StatCard
                    icon={Users}
                    label="As Member"
                    value={memberCount}
                    color="green"
                    delay={0.15}
                />
                <StatCard
                    icon={Mail}
                    label="Pending Invites"
                    value={pendingInvites.length}
                    color="rose"
                    delay={0.2}
                />
            </div>

            {/* 🏢 ORGANIZATIONS LIST */}
            {organizations.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center"
                >
                    <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 flex items-center justify-center">
                        <Building2 className="h-10 w-10 text-indigo-400" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                        No organizations yet
                    </h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        You haven't joined any organization yet. Create one or accept an invite!
                    </p>
                    <Link
                        href="/workspace"
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
                    >
                        <UserPlus className="h-4 w-4" />
                        Create Organization
                    </Link>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    {organizations.map((org) => (
                        <OrgCard key={org.id} org={org} />
                    ))}
                </div>
            )}

            {/* ✉️ PENDING INVITES */}
            {pendingInvites.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Mail className="h-5 w-5 text-yellow-500" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Pending Invites
                        </h3>
                        <span className="text-xs font-medium bg-yellow-100 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400 px-2.5 py-0.5 rounded-full">
                            {pendingInvites.length}
                        </span>
                    </div>
                    <div className="space-y-3">
                        {pendingInvites.map((invite) => (
                            <InviteCard key={invite.id} invite={invite} />
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
