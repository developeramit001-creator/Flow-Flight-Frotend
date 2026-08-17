'use client';

import { motion } from 'framer-motion';
import { FolderKanban, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    subtext?: string;
}

const StatCard = ({ title, value, icon: Icon, color, subtext }: StatCardProps) => (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                {subtext && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtext}</p>}
            </div>
            <div className={`p-3 rounded-xl ${color} shadow-lg shadow-${color}/20`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
        </div>
    </div>
);

export function StatsCards() {
    const stats = [
        { title: 'Total Projects', value: '12', icon: FolderKanban, color: 'bg-indigo-500', subtext: 'Active workspaces' },
        { title: 'In Progress', value: '7', icon: Clock, color: 'bg-blue-500', subtext: 'Ongoing work' },
        { title: 'Completed', value: '3', icon: CheckCircle, color: 'bg-green-500', subtext: 'This quarter' },
        { title: 'At Risk / Overdue', value: '2 / 5', icon: AlertTriangle, color: 'bg-red-500', subtext: 'Needs attention' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                >
                    <StatCard {...stat} />
                </motion.div>
            ))}
        </div>
    );
}
