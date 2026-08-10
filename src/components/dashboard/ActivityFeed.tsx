'use client';

import { motion } from 'framer-motion';
import { Circle, Clock } from 'lucide-react';

const activities = [
    { user: 'Raj', action: 'started Video Shoot', project: 'YouTube Video #25', time: '5 min ago', color: 'bg-green-500' },
    { user: 'Karan', action: 'is editing Intro Scene', project: 'Company Website', time: '12 min ago', color: 'bg-yellow-500' },
    { user: 'Riya', action: 'completed Thumbnail Design', project: 'YouTube Video #25', time: '1 hour ago', color: 'bg-blue-500' },
    { user: 'Amit', action: 'approved Logo Concept', project: 'Brand Identity', time: '2 hours ago', color: 'bg-purple-500' },
];

export function ActivityFeed() {
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm h-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Live Activity
            </h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
                {activities.map((activity, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                    >
                        <div className={`h-2 w-2 rounded-full ${activity.color} mt-2 flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">{activity.user}</span>
                                {' '}{activity.action}{' '}
                                <span className="text-gray-500 dark:text-gray-400">on {activity.project}</span>
                            </p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Clock className="h-3 w-3" />
                                {activity.time}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
