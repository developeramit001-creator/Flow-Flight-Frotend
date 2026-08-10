'use client';

import { motion } from 'framer-motion';
import { Users, Circle, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

interface TeamMember {
    name: string;
    role: string;
    tasks: number;
    workload: number;
    status: 'Busy' | 'Moderate' | 'Available' | 'High';
    email: string;
    avatar: string;
}

const teamMembers: TeamMember[] = [
    { name: 'Amit Sharma', role: 'Project Manager', tasks: 18, workload: 8, status: 'Busy', email: 'amit@flowpilot.com', avatar: 'AS' },
    { name: 'Rahul Verma', role: 'Video Editor', tasks: 8, workload: 8, status: 'Moderate', email: 'rahul@flowpilot.com', avatar: 'RV' },
    { name: 'Riya Patel', role: 'Graphic Designer', tasks: 5, workload: 5, status: 'Available', email: 'riya@flowpilot.com', avatar: 'RP' },
    { name: 'Karan Singh', role: 'Content Writer', tasks: 12, workload: 12, status: 'High', email: 'karan@flowpilot.com', avatar: 'KS' },
    { name: 'Neha Gupta', role: 'UI/UX Designer', tasks: 3, workload: 3, status: 'Available', email: 'neha@flowpilot.com', avatar: 'NG' },
];

const statusColors = {
    Busy: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    High: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    Moderate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    Available: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
};

const statusIcons = {
    Busy: '🔴',
    High: '🟠',
    Moderate: '🟡',
    Available: '🟢',
};

export default function TeamPage() {
    const handleContact = (name: string, email: string) => {
        toast.success(`Opening chat with ${name}...`);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-indigo-500" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Workload</h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><Circle className="h-2 w-2 fill-green-500 text-green-500" /> Available</span>
                    <span className="flex items-center gap-1"><Circle className="h-2 w-2 fill-yellow-500 text-yellow-500" /> Moderate</span>
                    <span className="flex items-center gap-1"><Circle className="h-2 w-2 fill-red-500 text-red-500" /> Busy</span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
                                <th className="p-4 font-medium">Member</th>
                                <th className="p-4 font-medium">Role</th>
                                <th className="p-4 font-medium">Active Tasks</th>
                                <th className="p-4 font-medium">Workload</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {teamMembers.map((member, idx) => (
                                <motion.tr
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                {member.avatar}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{member.role}</td>
                                    <td className="p-4 text-sm font-semibold text-gray-700 dark:text-gray-200">{member.tasks}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-32 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${member.workload > 10 ? 'bg-red-500' : member.workload > 5 ? 'bg-yellow-500' : 'bg-green-500'
                                                        }`}
                                                    style={{ width: `${(member.workload / 15) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500">{member.workload}/15</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusColors[member.status]}`}
                                        >
                                            <span>{statusIcons[member.status]}</span>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleContact(member.name, member.email)}
                                            className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 transition"
                                        >
                                            <Mail className="h-4 w-4" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center gap-3 text-sm text-indigo-700 dark:text-indigo-300">
                    <span className="text-lg">💡</span>
                    <p>
                        <strong>Tip:</strong> Team members with <span className="font-semibold">"Available"</span> status can take on new tasks.
                        Consider distributing workload evenly for better productivity.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
