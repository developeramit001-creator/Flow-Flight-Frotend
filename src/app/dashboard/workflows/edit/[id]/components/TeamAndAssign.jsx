// src/app/dashboard/workflows/edit/[id]/components/TeamAndAssign.jsx
'use client';

import { motion } from 'framer-motion';
import {
    Users, User, Crown, CheckCircle2, AlertCircle,
    Zap, Sparkles, UserPlus, ArrowRight, UserCheck,
    Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const TeamAndAssign = ({
    assignedTo,
    steps,
    projectHead,
    user,
    assignedCount,
    isFullyAssigned,
    isProjectHeadSet,
    getUserName,
    members,
    setAssignedTo,
}) => {
    // ============================================
    // GET ASSIGNMENTS
    // ============================================
    const getAssignments = () => {
        const assignments = {};
        Object.entries(assignedTo).forEach(([index, userId]) => {
            if (userId && userId.trim() !== '') {
                if (!assignments[userId]) assignments[userId] = [];
                assignments[userId].push(parseInt(index) + 1);
            }
        });
        return assignments;
    };

    const assignments = getAssignments();
    const totalSteps = steps.length;
    const progress = totalSteps > 0 ? Math.round((assignedCount / totalSteps) * 100) : 0;

    // ============================================
    // QUICK ASSIGN HANDLERS
    // ============================================
    const handleAssignToMe = () => {
        const newAssign = {};
        steps.forEach((_, i) => {
            newAssign[i] = user?.id || '';
        });
        setAssignedTo(newAssign);
        toast.success('All steps assigned to you! 🎯');
    };

    const handleAssignToMember = (memberId, memberName) => {
        const newAssign = {};
        steps.forEach((_, i) => {
            newAssign[i] = memberId;
        });
        setAssignedTo(newAssign);
        toast.success(`All steps assigned to ${memberName} ✅`);
    };

    // ============================================
    // GET ACTIVE ASSIGNEE
    // ============================================
    const getActiveAssignee = () => {
        if (Object.values(assignedTo).every(id => id === user?.id)) {
            return 'me';
        }
        for (const member of members) {
            if (Object.values(assignedTo).every(id => id === member.id)) {
                return member.id;
            }
        }
        return null;
    };

    const activeAssignee = getActiveAssignee();

    // ============================================
    // ✅ FILTER MEMBERS - Remove logged-in user from list
    // ============================================
    const otherMembers = members.filter(m => m.id !== user?.id);

    // ============================================
    // RENDER
    // ============================================
    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            {/* ============================================
                HEADER
            ============================================ */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                        <Users className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Team & Assignments</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {assignedCount} of {totalSteps} steps assigned
                        </p>
                    </div>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${isFullyAssigned && isProjectHeadSet
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                    {isFullyAssigned && isProjectHeadSet ? (
                        <>
                            <CheckCircle2 className="w-4 h-4" />
                            Ready
                        </>
                    ) : (
                        <>
                            <AlertCircle className="w-4 h-4" />
                            Pending
                        </>
                    )}
                </div>
            </div>

            {/* ============================================
                PROGRESS BAR
            ============================================ */}
            <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-semibold text-indigo-600">{progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                    />
                </div>
            </div>

            {/* ============================================
                TWO COLUMN LAYOUT
            ============================================ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* ==========================================
                    LEFT: TEAM MEMBERS
                ========================================== */}
                <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Team Members ({Object.keys(assignments).length})
                    </p>

                    {Object.keys(assignments).length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                            <User className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">No assignments yet</p>
                            <p className="text-xs text-gray-400">Assign steps to team members</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {Object.entries(assignments).map(([userId, stepsList]) => {
                                const name = getUserName(userId);
                                const isHead = userId === projectHead;
                                const isYou = userId === user?.id;

                                return (
                                    <div
                                        key={userId}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${isHead
                                            ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                                            : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                                            }`}
                                    >
                                        <div
                                            className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${isHead
                                                ? 'bg-gradient-to-br from-amber-400 to-amber-600'
                                                : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                                                }`}
                                        >
                                            {name?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {name}
                                                {isHead && (
                                                    <span className="ml-1 text-amber-500">👑</span>
                                                )}
                                                {isYou && !isHead && (
                                                    <span className="ml-1 text-xs text-gray-400">(You)</span>
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Steps: {stepsList.join(', ')}
                                                {isHead && (
                                                    <span className="ml-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
                                                        • Head
                                                    </span>
                                                )}
                                            </p>
                                        </div>

                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                            {stepsList.length}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Quick Stats */}
                    {Object.keys(assignments).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4" />
                                {Object.keys(assignments).length} members
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                {assignedCount} assigned
                            </span>
                            {isProjectHeadSet && (
                                <span className="flex items-center gap-1.5">
                                    <Crown className="w-4 h-4 text-amber-500" />
                                    Head: {getUserName(projectHead)}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* ==========================================
                    RIGHT: QUICK ASSIGN
                ========================================== */}
                <div className="lg:border-l lg:border-gray-200 dark:lg:border-gray-700 lg:pl-5">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Quick Assign ({otherMembers.length + 1} members)
                    </p>

                    {/* Info Message */}
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-xs text-gray-600 dark:text-gray-300 border border-blue-200 dark:border-blue-800/30 mb-3">
                        <Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>Assign all <strong>{steps.length}</strong> steps to one person instantly</span>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-2">
                        {/* ✅ "Me" button - Always visible */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            onClick={handleAssignToMe}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeAssignee === 'me'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                : 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800'
                                }`}
                        >
                            {activeAssignee === 'me' ? (
                                <UserCheck className="w-4 h-4" />
                            ) : (
                                <Crown className="w-4 h-4" />
                            )}
                            Me
                            {activeAssignee === 'me' && (
                                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">Active</span>
                            )}
                        </motion.button>

                        {/* ✅ Other members (excluding logged-in user) */}
                        {otherMembers.slice(0, 4).map((member, index) => {
                            const isActive = activeAssignee === member.id;

                            return (
                                <motion.button
                                    key={member.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => handleAssignToMember(member.id, member.name)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                                        }`}
                                >
                                    {isActive ? (
                                        <UserCheck className="w-4 h-4" />
                                    ) : (
                                        <UserPlus className="w-4 h-4" />
                                    )}
                                    {member.name.split(' ')[0]}
                                    {isActive && (
                                        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">Active</span>
                                    )}
                                </motion.button>
                            );
                        })}

                        {/* More Members Indicator */}
                        {otherMembers.length > 4 && (
                            <div className="flex items-center px-3 py-2.5 text-sm text-gray-400 dark:text-gray-500 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                                <Users className="w-4 h-4 mr-1.5" />
                                +{otherMembers.length - 4} more
                            </div>
                        )}
                    </div>

                    {/* Result Preview */}
                    <div className="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-800/30">
                        <ArrowRight className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs text-indigo-600 dark:text-indigo-400">
                            All <strong>{steps.length}</strong> steps will be assigned to selected member
                        </span>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default TeamAndAssign;
