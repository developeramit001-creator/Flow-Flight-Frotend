// src/app/dashboard/workflows/edit/[id]/components/AssignmentModal.jsx
'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, User, CheckCircle2, Search, Users, UserCheck } from 'lucide-react';

const AssignmentModal = ({
    isOpen,
    onClose,
    members,
    onAssign,
    currentAssignee,
    stepName,
    stepIndex,
}) => {
    const [selectedUser, setSelectedUser] = useState(currentAssignee || '');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            setSelectedUser(currentAssignee || '');
            setSearchTerm('');
        }
    }, [isOpen, currentAssignee]);

    const filteredMembers = members.filter(
        (member) =>
            member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAssign = () => {
        if (!selectedUser) return;
        onAssign(selectedUser);
        onClose();
    };

    const getInitials = (name) => {
        return name?.charAt(0)?.toUpperCase() || 'U';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-auto shadow-2xl border border-gray-200 dark:border-gray-700"
                    >
                        {/* Top Accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-t-2xl" />

                        {/* Header */}
                        <div className="flex items-start justify-between mb-5">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center flex-shrink-0">
                                    <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Assign Step {stepIndex + 1}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[200px]">
                                        {stepName}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search team members..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-gray-400"
                            />
                        </div>

                        {/* Members List */}
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {filteredMembers.length === 0 ? (
                                <div className="py-8 text-center">
                                    <Users className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {searchTerm ? 'No members found' : 'No team members available'}
                                    </p>
                                </div>
                            ) : (
                                filteredMembers.map((member, index) => {
                                    const isSelected = selectedUser === member.id;
                                    const isCurrent = member.id === currentAssignee;

                                    return (
                                        <motion.button
                                            key={member.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            whileHover={{ y: -1 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedUser(member.id)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${isSelected
                                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 shadow-sm'
                                                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            {/* Avatar */}
                                            <div
                                                className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${isSelected ? 'bg-indigo-500' : 'bg-gray-400 dark:bg-gray-600'
                                                    }`}
                                            >
                                                {getInitials(member.name)}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                                    {member.name}
                                                    {isCurrent && (
                                                        <span className="ml-2 text-[10px] font-medium text-green-500 bg-green-50 dark:bg-green-950/30 px-1.5 py-0.5 rounded-full">
                                                            Current
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {member.email}
                                                </p>
                                                {member.role && (
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                                                        {member.role}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Check */}
                                            {isSelected && (
                                                <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                            )}
                                        </motion.button>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssign}
                                disabled={!selectedUser}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${selectedUser
                                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <UserCheck className="w-4 h-4" />
                                {selectedUser ? 'Assign Step' : 'Select Member'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AssignmentModal;
