'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const projects = [
    { name: 'YouTube Video #25', progress: 68, status: 'In Progress', statusColor: 'bg-blue-500' },
    { name: 'Company Website', progress: 80, status: 'In Progress', statusColor: 'bg-blue-500' },
    { name: 'Mobile App (Client)', progress: 45, status: 'At Risk', statusColor: 'bg-red-500' },
    { name: 'Marketing Campaign', progress: 20, status: 'In Progress', statusColor: 'bg-blue-500' },
];

export function RecentProjects() {
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Projects</h3>
                <Link href="/projects" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                    View All <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
            <div className="space-y-4">
                {projects.map((project, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-800 dark:text-gray-200">{project.name}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${project.statusColor} text-white`}>
                                    {project.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="flex-1 max-w-xs">
                                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${project.progress > 70 ? 'bg-green-500' : project.progress > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                    {project.progress}%
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
