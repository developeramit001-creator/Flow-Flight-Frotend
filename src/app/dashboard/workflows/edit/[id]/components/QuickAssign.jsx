// src/app/dashboard/workflows/edit/[id]/components/QuickAssign.jsx
'use client';

import { motion } from 'framer-motion';
import { Zap, Crown } from 'lucide-react';
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
            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 sm:p-5 text-white shadow-lg shadow-indigo-500/30"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left Side - Title */}
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded-lg">
                        <Zap className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="font-semibold text-sm">Quick Assign</span>
                        <p className="text-[10px] text-indigo-200">All steps to one person</p>
                    </div>
                </div>

                {/* Right Side - Buttons */}
                <div className="flex flex-wrap gap-1.5">
                    {/* Assign to Myself */}
                    <button
                        onClick={handleAssignToMe}
                        className="px-3 py-1.5 rounded-lg bg-white text-indigo-700 text-xs font-bold hover:scale-105 hover:shadow-lg transition-all duration-200"
                    >
                        <Crown className="w-3 h-3 inline mr-1" /> Myself
                    </button>

                    {/* Assign to Team Members (max 3) */}
                    {members.slice(0, 3).map((member) => (
                        <button
                            key={member.id}
                            onClick={() => handleAssignToMember(member.id, member.name)}
                            className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-medium hover:bg-white/20 hover:scale-105 transition-all duration-200"
                        >
                            {member.name}
                        </button>
                    ))}

                    {/* More members indicator */}
                    {members.length > 3 && (
                        <span className="px-2 py-1.5 text-xs text-indigo-200 flex items-center">
                            +{members.length - 3} more
                        </span>
                    )}
                </div>
            </div>
        </motion.section>
    );
};

export default QuickAssign;
