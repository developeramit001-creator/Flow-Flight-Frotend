// src/app/(dashboard)/team/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, X, Check, Crown, Shield, User, Loader2, Send, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface Member {
    id: string;
    name: string;
    email: string;
    role: 'owner' | 'admin' | 'member' | 'guest';
    status: 'active' | 'pending';
    avatar: string;
}

// Mock team members
const MOCK_MEMBERS: Member[] = [
    { id: '1', name: 'Amit Sharma', email: 'amit@flowpilot.com', role: 'owner', status: 'active', avatar: 'AS' },
    { id: '2', name: 'Raj Verma', email: 'raj@flowpilot.com', role: 'member', status: 'active', avatar: 'RV' },
    { id: '3', name: 'Riya Patel', email: 'riya@flowpilot.com', role: 'member', status: 'active', avatar: 'RP' },
];

const ROLE_ICONS = {
    owner: Crown,
    admin: Shield,
    member: User,
    guest: User,
};

const ROLE_COLORS = {
    owner: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30',
    admin: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30',
    member: 'text-green-500 bg-green-50 dark:bg-green-950/30',
    guest: 'text-gray-500 bg-gray-50 dark:bg-gray-800',
};

export default function TeamPage() {
    const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<Member['role']>('member');
    const [pendingInvites, setPendingInvites] = useState<{ email: string; role: string; status: 'pending' }[]>([
        { email: 'karan@flowpilot.com', role: 'admin', status: 'pending' },
        { email: 'neha@flowpilot.com', role: 'member', status: 'pending' },
    ]);

    const handleInvite = async () => {
        if (!inviteEmail) {
            toast.error('Please enter an email address.');
            return;
        }

        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Add to pending invites
            setPendingInvites([...pendingInvites, { email: inviteEmail, role: inviteRole, status: 'pending' }]);

            toast.success(`Invite sent to ${inviteEmail}! 📧`);
            setInviteEmail('');
            setInviteRole('member');
            setShowInviteModal(false);
        } catch (error) {
            toast.error('Failed to send invite. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendInvite = (email: string) => {
        toast.success(`Invite resent to ${email}! 📧`);
    };

    const handleCancelInvite = (email: string) => {
        setPendingInvites(pendingInvites.filter((i) => i.email !== email));
        toast.success(`Invite to ${email} cancelled.`);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl mx-auto space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Users className="h-6 w-6 text-indigo-500" />
                        Team Members
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {members.length} active members • {pendingInvites.length} pending invites
                    </p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/30"
                >
                    <Mail className="h-5 w-5" />
                    Invite Member
                </button>
            </div>

            {/* Active Members */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Active Members</h3>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {members.map((member) => {
                        const RoleIcon = ROLE_ICONS[member.role];
                        return (
                            <div key={member.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                        {member.avatar}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[member.role]}`}>
                                        <RoleIcon className="h-3.5 w-3.5" />
                                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                        <Check className="h-3.5 w-3.5" />
                                        Active
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pending Invites */}
            {pendingInvites.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Pending Invites</h3>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {pendingInvites.map((invite, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-sm">
                                        {invite.email[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{invite.email}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Role: {invite.role} • Status: Pending
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleResendInvite(invite.email)}
                                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition"
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleCancelInvite(invite.email)}
                                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in-up">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Invite Team Member</h3>
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="colleague@company.com"
                                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                                <select
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value as Member['role'])}
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
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                {isLoading ? 'Sending...' : 'Send Invite'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
