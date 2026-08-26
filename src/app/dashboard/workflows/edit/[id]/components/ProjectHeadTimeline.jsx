// src/app/dashboard/workflows/edit/[id]/components/ProjectHeadTimeline.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, CheckCircle2, ChevronDown, User, Clock } from 'lucide-react';
import CustomDatePicker from './CustomDatePicker';

// ============================================
// CUSTOM DROPDOWN
// ============================================
const CustomDropdown = ({ value, onChange, options, placeholder = 'Select...', className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef(null);
    const [dropdownWidth, setDropdownWidth] = useState('100%');

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        if (isOpen && containerRef.current) {
            const width = containerRef.current.offsetWidth;
            setDropdownWidth(`${width}px`);
        }
    }, [isOpen]);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <motion.div
                className={`relative rounded-xl border transition-all duration-200 cursor-pointer ${isFocused || isOpen
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                    } bg-white dark:bg-gray-900`}
                whileTap={{ scale: 0.99 }}
                onClick={() => setIsOpen(!isOpen)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    setTimeout(() => {
                        setIsFocused(false);
                        setIsOpen(false);
                    }, 200);
                }}
                tabIndex={0}
            >
                <div className="flex items-center justify-between px-4 py-2.5">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className={`text-sm ${selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                    </div>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-400"
                    >
                        <ChevronDown className="w-4 h-4" />
                    </motion.div>
                </div>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        style={{ width: dropdownWidth, minWidth: '200px' }}
                        className="absolute z-50 mt-1.5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden"
                    >
                        {options.map((option) => (
                            <motion.button
                                key={option.value}
                                whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.08)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                    setIsFocused(false);
                                }}
                                className={`w-full px-4 py-2.5 text-sm text-left transition-colors flex items-center gap-2 ${option.value === value
                                        ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-medium'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
                                {option.label}
                                {option.value === value && (
                                    <CheckCircle2 className="w-4 h-4 ml-auto text-indigo-500" />
                                )}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ============================================
// MAIN COMPONENT
// ============================================
const ProjectHeadTimeline = ({
    projectHead,
    setProjectHead,
    projectTimeline,
    setProjectTimeline,
    members,
    user,
    getUserName,
}) => {
    const headOptions = members.map((m) => ({
        value: m.id,
        label: `${m.name} ${m.id === user?.id ? '(You)' : ''}`,
    }));

    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            {/* Header */}
            <motion.div
                className="flex items-center gap-3 mb-5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
                    <Crown className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Project Head & Timeline</h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">Who leads and when</p>
                </div>
            </motion.div>

            {/* Form */}
            <div className="space-y-4">
                {/* Project Head */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Project Head <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                        <CustomDropdown
                            value={projectHead || ''}
                            onChange={setProjectHead}
                            options={headOptions}
                            placeholder="Select project head..."
                            className="flex-1"
                        />
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setProjectHead(user?.id || '')}
                            className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition font-medium text-sm whitespace-nowrap flex items-center gap-1.5"
                        >
                            <Crown className="w-3.5 h-3.5" />
                            Assign Me
                        </motion.button>
                    </div>

                    {projectHead && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 flex items-center gap-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-900"
                        >
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm text-emerald-700 dark:text-emerald-300">
                                Head: <strong>{getUserName(projectHead)}</strong>
                            </span>
                        </motion.div>
                    )}
                </div>

                {/* Timeline - With Custom Date Picker */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CustomDatePicker
                        label="Start Date"
                        value={projectTimeline.start}
                        onChange={(val) => setProjectTimeline({ ...projectTimeline, start: val })}
                        placeholder="Select start date"
                    />
                    <CustomDatePicker
                        label="Expected End Date"
                        value={projectTimeline.end}
                        onChange={(val) => setProjectTimeline({ ...projectTimeline, end: val })}
                        placeholder="Select end date"
                    />
                </div>

                {/* Timeline Preview */}
                {(projectTimeline.start || projectTimeline.end) && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-800/30"
                    >
                        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4 text-indigo-500" />
                            <span>
                                {projectTimeline.start || 'Not set'}
                                <span className="mx-2 text-gray-300">→</span>
                                {projectTimeline.end || 'Not set'}
                            </span>
                            {projectTimeline.start && projectTimeline.end && (
                                <span className="ml-auto font-medium text-indigo-600 dark:text-indigo-400">
                                    {Math.ceil(
                                        (new Date(projectTimeline.end) - new Date(projectTimeline.start)) /
                                        (1000 * 60 * 60 * 24)
                                    )}{' '}
                                    days
                                </span>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.section>
    );
};

export default ProjectHeadTimeline;
