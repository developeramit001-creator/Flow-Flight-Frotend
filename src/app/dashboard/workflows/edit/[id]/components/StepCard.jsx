// src/app/dashboard/workflows/edit/[id]/components/StepCard.jsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GripVertical,
    ChevronUp,
    ChevronDown,
    ChevronRight,
    Trash2,
    UserCheck,
    UserPlus,
    X,
    Link2,
    Clock,
    Calendar,
    User
} from 'lucide-react';

const StepCard = ({
    step,
    index,
    isAssigned,
    assigneeName,
    onUpdateStep,
    onRemoveStep,
    onOpenAssignModal,
    onRemoveAssignment,
    stepDeadline,
    onUpdateDeadline,
    onMoveStep,
    stepAttachments,
    onAddStepAttachment,
    onRemoveStepAttachment,
    isFirst,
    isLast,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.04 }}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200"
        >
            {/* Step Header */}
            <div
                className="flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {/* Drag Handle */}
                <div className="cursor-grab text-gray-300 hover:text-gray-500">
                    <GripVertical className="w-4 h-4" />
                </div>

                {/* Step Number */}
                <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full min-w-[28px] text-center">
                    {String(index + 1).padStart(2, '0')}
                </span>

                {/* Step Name Input */}
                <input
                    type="text"
                    value={step.name}
                    onChange={(e) => onUpdateStep(index, 'name', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Step name..."
                    className="flex-1 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 outline-none px-1 py-0.5 text-sm font-medium text-gray-900 dark:text-white transition"
                />

                {/* Status Badge */}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium hidden sm:inline-block ${isAssigned
                        ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                    {isAssigned ? '✅ Assigned' : '⏳ Pending'}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-0.5">
                    <button
                        onClick={(e) => { e.stopPropagation(); onMoveStep(index, 'up'); }}
                        disabled={isFirst}
                        className={`p-1 rounded transition ${isFirst ? 'text-gray-200 dark:text-gray-700' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                    >
                        <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                        className="p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                    >
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemoveStep(index); }}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Step Details - Expandable */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-gray-100 dark:border-gray-800 p-3 bg-gray-50/50 dark:bg-gray-900/50">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {/* Role */}
                                <div>
                                    <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                        <User className="w-3 h-3 inline mr-0.5" /> Role
                                    </label>
                                    <input
                                        type="text"
                                        value={step.role || ''}
                                        onChange={(e) => onUpdateStep(index, 'role', e.target.value)}
                                        placeholder="e.g. Designer"
                                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                                    />
                                </div>

                                {/* Days */}
                                <div>
                                    <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                        <Clock className="w-3 h-3 inline mr-0.5" /> Days
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={step.days || 1}
                                        onChange={(e) => onUpdateStep(index, 'days', parseInt(e.target.value) || 1)}
                                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                                    />
                                </div>

                                {/* Assign */}
                                <div className="col-span-1">
                                    <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                        <UserCheck className="w-3 h-3 inline mr-0.5" /> Assign
                                    </label>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => onOpenAssignModal(index)}
                                            className={`flex-1 px-2 py-1.5 rounded-lg border text-xs transition ${isAssigned
                                                    ? 'border-green-300 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300'
                                                    : 'border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100'
                                                }`}
                                        >
                                            {isAssigned ? (
                                                <span className="flex items-center gap-1">
                                                    <UserCheck className="w-3 h-3" />
                                                    {assigneeName?.length > 8 ? assigneeName.substring(0, 8) + '..' : assigneeName}
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    <UserPlus className="w-3 h-3" /> Assign
                                                </span>
                                            )}
                                        </button>
                                        {isAssigned && (
                                            <button
                                                onClick={() => onRemoveAssignment(index)}
                                                className="px-2 py-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Deadline */}
                                <div>
                                    <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                        <Calendar className="w-3 h-3 inline mr-0.5" /> Deadline
                                    </label>
                                    <input
                                        type="date"
                                        value={stepDeadline || ''}
                                        onChange={(e) => onUpdateDeadline(index, e.target.value)}
                                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                                    />
                                </div>
                            </div>

                            {/* Step Attachments */}
                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex flex-wrap gap-1.5">
                                    {(stepAttachments || []).map((att) => (
                                        <span
                                            key={att.id}
                                            className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-[10px]"
                                        >
                                            <Link2 className="w-2.5 h-2.5 text-indigo-500" />
                                            {att.name}
                                            <button
                                                onClick={() => onRemoveStepAttachment(index, att.id)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <X className="w-2.5 h-2.5" />
                                            </button>
                                        </span>
                                    ))}
                                    <button
                                        onClick={() => {
                                            const name = prompt('Enter attachment name:');
                                            const url = prompt('Enter URL:');
                                            if (name && url) {
                                                onAddStepAttachment(index, { id: Date.now(), name, url, type: 'other' });
                                            }
                                        }}
                                        className="text-[10px] text-indigo-600 hover:underline"
                                    >
                                        + Add Link
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default StepCard;
