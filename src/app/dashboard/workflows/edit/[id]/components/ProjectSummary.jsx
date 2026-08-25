// src/app/dashboard/workflows/edit/[id]/components/ProjectSummary.jsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { File, Crown, Calendar, Users, Layers, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const PROJECT_STATUSES = [
    { value: 'planning', label: '📋 Planning' },
    { value: 'active', label: '🚀 Active' },
    { value: 'review', label: '👀 Review' },
    { value: 'completed', label: '✅ Completed' },
    { value: 'on-hold', label: '⏸️ On Hold' },
];

const ProjectSummary = ({
    showSummary,
    projectName,
    projectHead,
    projectTimeline,
    steps,
    members,
    totalDays,
    projectStatus,
    getUserName,
}) => {
    const statusLabel = PROJECT_STATUSES.find((s) => s.value === projectStatus)?.label || '—';

    return (
        <AnimatePresence>
            {showSummary && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-800/30 p-5 sm:p-6 shadow-sm"
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                            <File className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Project Summary</h3>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                Review all settings before creating project
                            </p>
                        </div>
                    </div>

                    {/* Summary Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {/* Project Name */}
                        <div className="bg-white dark:bg-gray-900/50 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700">
                            <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                                <File className="w-3 h-3" /> Project Name
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {projectName || '—'}
                            </p>
                        </div>

                        {/* Project Head */}
                        <div className="bg-white dark:bg-gray-900/50 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700">
                            <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                                <Crown className="w-3 h-3" /> Project Head
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {projectHead ? getUserName(projectHead) : '—'}
                            </p>
                        </div>

                        {/* Start Date */}
                        <div className="bg-white dark:bg-gray-900/50 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700">
                            <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                                <Calendar className="w-3 h-3" /> Start Date
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {projectTimeline.start || '—'}
                            </p>
                        </div>

                        {/* End Date */}
                        <div className="bg-white dark:bg-gray-900/50 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700">
                            <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                                <Calendar className="w-3 h-3" /> End Date
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {projectTimeline.end || '—'}
                            </p>
                        </div>

                        {/* Total Steps */}
                        <div className="bg-white dark:bg-gray-900/50 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700">
                            <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                                <Layers className="w-3 h-3" /> Total Steps
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{steps.length}</p>
                        </div>

                        {/* Total Days */}
                        <div className="bg-white dark:bg-gray-900/50 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700">
                            <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                                <Clock className="w-3 h-3" /> Total Days
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{totalDays}</p>
                        </div>

                        {/* Team Members */}
                        <div className="bg-white dark:bg-gray-900/50 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700">
                            <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                                <Users className="w-3 h-3" /> Team Members
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{members.length}</p>
                        </div>

                        {/* Status */}
                        <div className="bg-white dark:bg-gray-900/50 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700">
                            <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Status
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {statusLabel}
                            </p>
                        </div>
                    </div>

                    {/* Ready Status */}
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-900/30 rounded-xl p-2 border border-gray-200 dark:border-gray-700">
                        {projectName && projectHead && steps.length > 0 ? (
                            <>
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span className="font-medium text-green-600 dark:text-green-400">✅ Project is ready to create!</span>
                            </>
                        ) : (
                            <>
                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                                <span className="font-medium text-yellow-600 dark:text-yellow-400">
                                    ⚠️ Please fill all required fields
                                    {!projectName && ' • Project Name'}
                                    {!projectHead && ' • Project Head'}
                                    {steps.length === 0 && ' • Add Steps'}
                                </span>
                            </>
                        )}
                    </div>
                </motion.section>
            )}
        </AnimatePresence>
    );
};

export default ProjectSummary;
