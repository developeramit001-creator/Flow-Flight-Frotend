// src/app/dashboard/workflows/edit/[id]/components/TeamOverview.jsx
'use client';

import { motion } from 'framer-motion';
import { Users, User, Crown, CheckCircle2, AlertCircle } from 'lucide-react';

const TeamOverview = ({
    assignedTo,
    steps,
    projectHead,
    user,
    assignedCount,
    isFullyAssigned,
    isProjectHeadSet,
    getUserName,
}) => {
    // ✅ Get assignments summary
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

    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                        <Users className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Team Overview</h3>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            {assignedCount} of {totalSteps} steps assigned
                        </p>
                    </div>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium ${isFullyAssigned && isProjectHeadSet
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                    {isFullyAssigned && isProjectHeadSet ? (
                        <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Ready
                        </>
                    ) : (
                        <>
                            <AlertCircle className="w-3.5 h-3.5" />
                            Pending
                        </>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-[10px] mb-1">
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

            {/* Members Grid */}
            {Object.keys(assignments).length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                    <User className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">No assignments yet</p>
                    <p className="text-xs text-gray-400">Assign steps to team members</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                                {/* Avatar */}
                                <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${isHead
                                            ? 'bg-gradient-to-br from-amber-400 to-amber-600'
                                            : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                                        }`}
                                >
                                    {name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {name}
                                        {isHead && (
                                            <span className="ml-1 text-amber-500" title="Project Head">👑</span>
                                        )}
                                        {isYou && !isHead && (
                                            <span className="ml-1 text-xs text-gray-400">(You)</span>
                                        )}
                                    </p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                        Steps: {stepsList.join(', ')}
                                        {isHead && (
                                            <span className="ml-2 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                                                • Head
                                            </span>
                                        )}
                                    </p>
                                </div>

                                {/* Step count badge */}
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                    {stepsList.length}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Quick Stats */}
            {Object.keys(assignments).length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-4 text-[10px] text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {Object.keys(assignments).length} members
                    </span>
                    <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        {assignedCount} steps assigned
                    </span>
                    {isProjectHeadSet && (
                        <span className="flex items-center gap-1">
                            <Crown className="w-3.5 h-3.5 text-amber-500" />
                            Head: {getUserName(projectHead)}
                        </span>
                    )}
                </div>
            )}
        </motion.section>
    );
};

export default TeamOverview;
