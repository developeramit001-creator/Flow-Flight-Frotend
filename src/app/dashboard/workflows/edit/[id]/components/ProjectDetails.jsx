// src/app/dashboard/workflows/edit/[id]/components/ProjectDetails.jsx
'use client';

import { motion } from 'framer-motion';
import { BriefcaseBusiness } from 'lucide-react';

const PROJECT_STATUSES = [
    { value: 'planning', label: '📋 Planning' },
    { value: 'active', label: '🚀 Active' },
    { value: 'review', label: '👀 Review' },
    { value: 'completed', label: '✅ Completed' },
    { value: 'on-hold', label: '⏸️ On Hold' },
];

const PRIORITY_OPTIONS = [
    { value: 'low', label: '🟢 Low' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'high', label: '🟠 High' },
    { value: 'urgent', label: '🔴 Urgent' },
];

const ProjectDetails = ({
    projectName,
    setProjectName,
    projectDescription,
    setProjectDescription,
    projectStatus,
    setProjectStatus,
    projectPriority,
    setProjectPriority,
    projectCategory,
    setProjectCategory,
    projectTags,
    setProjectTags,
}) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 shadow-sm"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <BriefcaseBusiness className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Project Details</h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">Basic information about your project</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Project Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="e.g. Website Redesign"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Category
                    </label>
                    <input
                        type="text"
                        value={projectCategory}
                        onChange={(e) => setProjectCategory(e.target.value)}
                        placeholder="e.g. Design, Development, Marketing"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition text-sm"
                    />
                </div>
            </div>

            <div className="mt-3">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Description
                </label>
                <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe your project in detail..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition text-sm resize-y"
                />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Status
                    </label>
                    <select
                        value={projectStatus}
                        onChange={(e) => setProjectStatus(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition text-sm"
                    >
                        {PROJECT_STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Priority
                    </label>
                    <select
                        value={projectPriority}
                        onChange={(e) => setProjectPriority(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition text-sm"
                    >
                        {PRIORITY_OPTIONS.map((p) => (
                            <option key={p.value} value={p.value}>
                                {p.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Tags
                    </label>
                    <input
                        type="text"
                        value={projectTags}
                        onChange={(e) => setProjectTags(e.target.value)}
                        placeholder="e.g. design, frontend, api"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition text-sm"
                    />
                </div>
            </div>
        </motion.section>
    );
};

export default ProjectDetails;
