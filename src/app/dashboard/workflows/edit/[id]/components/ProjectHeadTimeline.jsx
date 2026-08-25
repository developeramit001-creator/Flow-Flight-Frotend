// src/app/dashboard/workflows/edit/[id]/components/ProjectHeadTimeline.jsx
'use client';

import { motion } from 'framer-motion';
import { Crown, CheckCircle2 } from 'lucide-react';

const ProjectHeadTimeline = ({
    projectHead,
    setProjectHead,
    projectTimeline,
    setProjectTimeline,
    members,
    user,
    getUserName,
}) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 shadow-sm"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Crown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Project Head & Timeline</h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">Who leads and when</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Project Head <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                        <select
                            value={projectHead || ''}
                            onChange={(e) => setProjectHead(e.target.value)}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition text-sm"
                        >
                            <option value="">Select head...</option>
                            {members.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.name} {m.id === user?.id ? '(You)' : ''}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => setProjectHead(user?.id || '')}
                            className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition font-medium text-sm whitespace-nowrap"
                        >
                            Assign Me
                        </button>
                    </div>
                    {projectHead && (
                        <p className="mt-1.5 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Head: {getUserName(projectHead)}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={projectTimeline.start}
                        onChange={(e) => setProjectTimeline({ ...projectTimeline, start: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Expected End Date
                    </label>
                    <input
                        type="date"
                        value={projectTimeline.end}
                        onChange={(e) => setProjectTimeline({ ...projectTimeline, end: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition text-sm"
                    />
                </div>
            </div>
        </motion.section>
    );
};

export default ProjectHeadTimeline;
