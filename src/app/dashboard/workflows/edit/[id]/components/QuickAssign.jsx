// src/app/dashboard/workflows/edit/[id]/components/QuickAssign.jsx
'use client';

import { motion } from 'framer-motion';
import { Zap, Crown, User, Users, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const QuickAssign = ({ steps, members, user, setAssignedTo }) => {
    // Agar steps ya members nahi hain toh kuch mat dikhao
    if (!members?.length || !steps?.length) return null;

    const handleAssignToMe = () => {
        const newAssign = {};
        steps.forEach((_, i) => {
            newAssign[i] = user?.id || '';
        });
        setAssignedTo(newAssign);
        toast.success('All steps assigned to you! 🎯');
    };

    const handleAssignToMember = (memberId, memberName) => {
        const newAssign = {};
        steps.forEach((_, i) => {
            newAssign[i] = memberId;
        });
        setAssignedTo(newAssign);
        toast.success(`All steps assigned to ${memberName} ✅`);
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                    <Zap className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Quick Assign</h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        Assign all {steps.length} steps to one person instantly
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
                {/* Info Message */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span>Click below to assign all steps at once</span>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-2">
                    {/* Assign to Myself */}
                    <motion.button
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        onClick={handleAssignToMe}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200"
                    >
                        <Crown className="w-4 h-4" />
                        Assign to Me
                    </motion.button>

                    {/* Assign to Team Members */}
                    {members.slice(0, 3).map((member, index) => (
                        <motion.button
                            key={member.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.03, y: -1 }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            onClick={() => handleAssignToMember(member.id, member.name)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200"
                        >
                            <User className="w-4 h-4 text-gray-400" />
                            {member.name}
                        </motion.button>
                    ))}

                    {/* More Members Indicator */}
                    {members.length > 3 && (
                        <div className="flex items-center px-3 py-2.5 text-sm text-gray-400 dark:text-gray-500 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                            <Users className="w-4 h-4 mr-1.5" />
                            +{members.length - 3} more
                        </div>
                    )}
                </div>

                {/* Result Preview */}
                <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-800/30">
                    <div className="flex items-center gap-1 text-[10px] text-indigo-600 dark:text-indigo-400">
                        <Zap className="w-3 h-3" />
                        <span>Quick assign will assign <strong>all {steps.length} steps</strong> to selected member</span>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default QuickAssign;
