// src/app/dashboard/workflows/edit/[id]/components/ProjectSummary.jsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    File, Crown, Calendar, Users, Layers,
    Clock, CheckCircle2, AlertCircle,
    Sparkles, Building2, Tag, Hash,
    ArrowRight, Circle, User, CalendarDays,
    Timer, Briefcase
} from 'lucide-react';

const PROJECT_STATUSES = [
    { value: 'planning', label: 'Planning', icon: '📋', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { value: 'active', label: 'Active', icon: '🚀', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    { value: 'review', label: 'Review', icon: '👀', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    { value: 'completed', label: 'Completed', icon: '✅', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { value: 'on-hold', label: 'On Hold', icon: '⏸️', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
];

const STAT_ITEMS = [
    { key: 'steps', label: 'Total Steps', icon: Layers, color: 'text-indigo-500' },
    { key: 'days', label: 'Total Days', icon: Clock, color: 'text-amber-500' },
    { key: 'members', label: 'Team Members', icon: Users, color: 'text-emerald-500' },
];

const ProjectSummary = ({
    showSummary,
    projectName,
    projectClient,
    projectGoal,
    projectHead,
    projectTimeline,
    steps,
    members,
    totalDays,
    projectStatus,
    assignedTo,
    getUserName,
}) => {
    const statusInfo = PROJECT_STATUSES.find((s) => s.value === projectStatus) || PROJECT_STATUSES[0];
    const isReady = projectName && projectHead && steps.length > 0;

    // Count steps with assignments
    const assignedSteps = steps.filter(
        (_, index) => {
            const assigned = assignedTo?.[index];
            return Boolean(
                assigned &&
                String(assigned).trim() !== ''
            );
        }
    ).length;
    const completionPercentage = steps.length > 0 ? Math.round((assignedSteps / steps.length) * 100) : 0;

    return (
        <AnimatePresence>
            {showSummary && (
                <motion.section
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 dark:from-gray-900 dark:via-indigo-950/20 dark:to-purple-950/20 border border-indigo-200/50 dark:border-indigo-800/30 shadow-xl shadow-indigo-500/5"
                >
                    {/* Premium Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />

                    {/* Top Accent Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                    <div className="relative p-5 sm:p-6">
                        {/* ===== HEADER ===== */}
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-md opacity-30" />
                                    <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
                                        Project Summary
                                    </h3>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                                        Review all settings before creating
                                    </p>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusInfo.color}`}
                            >
                                <span>{statusInfo.icon}</span>
                                {statusInfo.label}
                            </motion.div>
                        </div>

                        {/* ===== MAIN INFO GRID ===== */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                            {/* Project Name */}
                            <motion.div
                                whileHover={{ y: -2 }}
                                className="group bg-white dark:bg-gray-800/50 rounded-xl p-3.5 border border-gray-200/70 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                                        <File className="w-4 h-4 text-indigo-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                                            Project Name
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                            {projectName || '—'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Client */}
                            <motion.div
                                whileHover={{ y: -2 }}
                                className="group bg-white dark:bg-gray-800/50 rounded-xl p-3.5 border border-gray-200/70 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                                        <Building2 className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                                            Client
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                            {projectClient || '—'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Project Head */}
                            <motion.div
                                whileHover={{ y: -2 }}
                                className="group bg-white dark:bg-gray-800/50 rounded-xl p-3.5 border border-gray-200/70 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50 transition-colors">
                                        <Crown className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                                            Project Head
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                            {projectHead ? getUserName(projectHead) : '—'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Status */}
                            <motion.div
                                whileHover={{ y: -2 }}
                                className="group bg-white dark:bg-gray-800/50 rounded-xl p-3.5 border border-gray-200/70 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${statusInfo.color.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')} bg-opacity-10 dark:bg-opacity-20`}>
                                        <Tag className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                                            Status
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                            {statusInfo.label}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* ===== PROJECT GOAL ===== */}
                        {projectGoal?.trim() && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 rounded-xl bg-white dark:bg-gray-800/50 p-4 border border-gray-200/70 dark:border-gray-700/50 shadow-sm"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 shrink-0">
                                        <Target className="w-4 h-4 text-purple-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                            Project Goal
                                        </p>
                                        <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                                            {projectGoal}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ===== TIMELINE SECTION ===== */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <motion.div
                                whileHover={{ y: -2 }}
                                className="bg-white dark:bg-gray-800/50 rounded-xl p-3.5 border border-gray-200/70 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Start Date</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {projectTimeline.start ? new Date(projectTimeline.start).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            }) : '—'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -2 }}
                                className="bg-white dark:bg-gray-800/50 rounded-xl p-3.5 border border-gray-200/70 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30">
                                        <CalendarDays className="w-4 h-4 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">End Date</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {projectTimeline.end ? new Date(projectTimeline.end).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            }) : '—'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* ===== STATS GRID ===== */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {STAT_ITEMS.map((item, idx) => (
                                <motion.div
                                    key={item.key}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ y: -2 }}
                                    className="bg-white dark:bg-gray-800/50 rounded-xl p-3 text-center border border-gray-200/70 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <div className={`flex items-center justify-center ${item.color} mb-1`}>
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                                        {item.key === 'steps' ? steps.length :
                                            item.key === 'days' ? totalDays :
                                                members.length}
                                    </p>
                                    <p className="text-[9px] font-medium text-gray-400 uppercase tracking-wider">
                                        {item.label}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* ===== PROGRESS SECTION ===== */}
                        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200/70 dark:border-gray-700/50 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Circle className="w-3 h-3 text-indigo-500 fill-indigo-500" />
                                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Assignment Progress
                                    </span>
                                </div>
                                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                    {completionPercentage}%
                                </span>
                            </div>

                            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completionPercentage}%` }}
                                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                />
                            </div>

                            <div className="flex justify-between mt-1.5">
                                <span className="text-[10px] text-gray-500">
                                    {assignedSteps} of {steps.length} steps assigned
                                </span>
                                <span className="text-[10px] text-gray-500">
                                    {steps.length - assignedSteps} remaining
                                </span>
                            </div>
                        </div>

                        {/* ===== READY STATUS ===== */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className={`mt-4 flex items-center justify-center gap-2.5 rounded-xl p-3 border ${isReady
                                ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/30'
                                : 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/30'
                                }`}
                        >
                            {isReady ? (
                                <>
                                    <div className="p-1 rounded-full bg-emerald-500/10">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                        ✅ Ready to create! All required fields are filled.
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="p-1 rounded-full bg-amber-500/10">
                                        <AlertCircle className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <div className="flex flex-wrap items-center gap-1 text-xs">
                                        <span className="font-semibold text-amber-700 dark:text-amber-400">
                                            ⚠️ Please complete:
                                        </span>
                                        <span className="text-amber-600 dark:text-amber-300 font-medium">
                                            {!projectName && '• Project Name '}
                                            {!projectHead && '• Project Head '}
                                            {steps.length === 0 && '• Add Steps'}
                                        </span>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                </motion.section>
            )}
        </AnimatePresence>
    );
};

export default ProjectSummary;
