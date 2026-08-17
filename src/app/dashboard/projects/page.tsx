'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FolderKanban, Plus, ArrowRight, Clock, Users, MoreVertical } from 'lucide-react';

const projects = [
    { id: 1, name: 'YouTube Video #25', progress: 68, status: 'In Progress', members: 4, dueDate: '25 Apr 2025' },
    { id: 2, name: 'Company Website', progress: 80, status: 'In Progress', members: 3, dueDate: '15 May 2025' },
    { id: 3, name: 'Mobile App (Client)', progress: 45, status: 'At Risk', members: 5, dueDate: '30 Apr 2025' },
    { id: 4, name: 'Marketing Campaign', progress: 20, status: 'Not Started', members: 2, dueDate: '10 Jun 2025' },
];

export default function ProjectsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📁 All Projects</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage all your projects from one place</p>
                </div>
                <Link
                    href="/projects/new"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/30"
                >
                    <Plus className="h-5 w-5" />
                    New Project
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {projects.map((project, idx) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition group"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50">
                                        <FolderKanban className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <Link href={`/tasks/${project.id}`}>
                                            <h3 className="font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                                                {project.name}
                                            </h3>
                                        </Link>
                                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Users className="h-3 w-3" />
                                                {project.members} members
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                Due: {project.dueDate}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${project.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                                                    project.status === 'At Risk' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                                                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                                }`}>
                                                {project.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{project.progress}%</span>
                                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${project.progress > 70 ? 'bg-green-500' :
                                                    project.progress > 40 ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                                }`}
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>
                                <Link
                                    href={`/tasks/${project.id}`}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
