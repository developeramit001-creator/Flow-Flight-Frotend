'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, Clock, AlertCircle, User, Calendar } from 'lucide-react';

const tasks = [
    { id: 1, name: 'Edit Video', project: 'YouTube Video #25', assignee: 'Rahul', dueDate: '22 Mar 2025', priority: 'High', status: 'In Progress' },
    { id: 2, name: 'Create Thumbnail', project: 'YouTube Video #25', assignee: 'Riya', dueDate: '20 Mar 2025', priority: 'Medium', status: 'Completed' },
    { id: 3, name: 'Client Feedback', project: 'Company Website', assignee: 'Amit', dueDate: '25 Mar 2025', priority: 'High', status: 'In Progress' },
    { id: 4, name: 'Design Homepage', project: 'Company Website', assignee: 'Neha', dueDate: '18 Mar 2025', priority: 'Low', status: 'Completed' },
    { id: 5, name: 'API Integration', project: 'Mobile App', assignee: 'Karan', dueDate: '30 Mar 2025', priority: 'Critical', status: 'At Risk' },
];

const priorityColors = {
    Critical: 'bg-red-600',
    High: 'bg-orange-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-blue-500',
};

const statusIcons = {
    'In Progress': Clock,
    'Completed': CheckCircle2,
    'At Risk': AlertCircle,
    'Not Started': Clock,
};

export default function TasksPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📋 All Tasks</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Track and manage all your tasks</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
                                <th className="p-4 font-medium">Task</th>
                                <th className="p-4 font-medium">Project</th>
                                <th className="p-4 font-medium">Assignee</th>
                                <th className="p-4 font-medium">Due Date</th>
                                <th className="p-4 font-medium">Priority</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {tasks.map((task, idx) => {
                                const StatusIcon = statusIcons[task.status as keyof typeof statusIcons] || Clock;
                                return (
                                    <motion.tr
                                        key={task.id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                                    >
                                        <td className="p-4 font-medium text-gray-900 dark:text-white">{task.name}</td>
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{task.project}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-[10px]">
                                                    {task.assignee[0]}
                                                </div>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{task.assignee}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{task.dueDate}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`flex items-center gap-1 text-sm ${task.status === 'Completed' ? 'text-green-600 dark:text-green-400' :
                                                    task.status === 'At Risk' ? 'text-red-600 dark:text-red-400' :
                                                        'text-blue-600 dark:text-blue-400'
                                                }`}>
                                                <StatusIcon className="h-4 w-4" />
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <Link
                                                href={`/tasks/${task.id}`}
                                                className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
