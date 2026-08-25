// src/app/dashboard/workflows/edit/[id]/components/TeamOverview.jsx
'use client';

import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

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
    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 shadow-sm"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Team Overview</h3>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            {assignedCount} of {steps.length} steps assigned
                        </p>
                    </div>
                </div>
                <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${isFullyAssigned && isProjectHeadSet
                            ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}
                >
                    {isFullyAssigned && isProjectHeadSet ? '✅ Ready' : '⚠️ Pending'}
                </span>
            </div>

            <div className="mt-3">
                <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-gray-500">Assignment Progress</span>
                    <span className="font-medium text-indigo-600">{assignedCount} / {steps.length}</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{
                            width: `${steps.length ? (assignedCount / steps.length) * 100 : 0}%`,
                        }}
                        transition={{ duration: 0.6 }}
                        className="h-full rounded-full bg-indigo-500"
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
                {assignedCount === 0 ? (
                    <p className="text-xs text-gray-400">No assignments yet</p>
                ) : (
                    Object.entries(
                        Object.entries(assignedTo).reduce((acc, [index, userId]) => {
                            if (userId && userId.trim() !== '') {
                                if (!acc[userId]) acc[userId] = [];
                                acc[userId].push(parseInt(index) + 1);
                            }
                            return acc;
                        }, {})
                    ).map(([userId, stepsList]) => {
                        const name = getUserName(userId);
                        const isHead = userId === projectHead;
                        return (
                            <div
                                key={userId}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${isHead
                                        ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800'
                                        : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold ${isHead ? 'bg-yellow-500' : 'bg-indigo-500'
                                        }`}
                                >
                                    {name?.charAt(0) || 'U'}
                                </div>
                                <span className="text-xs font-medium text-gray-900 dark:text-white">
                                    {name} {isHead && '👑'}
                                </span>
                                <span className="text-[10px] text-gray-400">{stepsList.join(', ')}</span>
                            </div>
                        );
                    })
                )}
            </div>
        </motion.section>
    );
};

export default TeamOverview; // ✅ DEFAULT EXPORT
