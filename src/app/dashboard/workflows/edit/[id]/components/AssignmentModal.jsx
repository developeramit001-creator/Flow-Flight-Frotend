// src/app/dashboard/workflows/edit/[id]/components/AssignmentModal.jsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, CheckCircle2 } from 'lucide-react';

const AssignmentModal = ({ isOpen, onClose, members, onAssign, currentAssignee, stepName, stepIndex }) => {
    const [selectedUser, setSelectedUser] = useState(currentAssignee || '');
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) return null;

    const filteredMembers = members.filter((m) =>
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-auto shadow-2xl border border-gray-200 dark:border-gray-700"
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Assign Step {stepIndex + 1}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stepName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search team members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredMembers.map((member) => (
                        <button
                            key={member.id}
                            onClick={() => setSelectedUser(member.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${selectedUser === member.id
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold ${selectedUser === member.id ? 'bg-indigo-500' : 'bg-gray-400 dark:bg-gray-600'
                                }`}>
                                {member.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {member.name}
                                    {member.id === currentAssignee && (
                                        <span className="ml-2 text-xs text-green-500">(Current)</span>
                                    )}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {member.email} • {member.role}
                                </p>
                            </div>
                            {selectedUser === member.id && (
                                <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium">
                        Cancel
                    </button>
                    <button
                        onClick={() => { onAssign(selectedUser); onClose(); }}
                        disabled={!selectedUser}
                        className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Assign Step
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AssignmentModal;
