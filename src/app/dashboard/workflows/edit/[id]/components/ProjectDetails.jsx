// src/app/dashboard/workflows/edit/[id]/components/ProjectDetails.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BriefcaseBusiness, ChevronDown } from 'lucide-react';

const PROJECT_STATUSES = [
    { value: 'planning', label: '📋 Planning' },
    { value: 'active', label: '🚀 Active' },
    { value: 'review', label: '👀 Review' },
    { value: 'completed', label: '✅ Completed' },
    { value: 'on-hold', label: '⏸️ On Hold' },
];

const PRIORITY_OPTIONS = [
    { value: 'low', label: '🟢 Low' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'high', label: '🟠 High' },
    { value: 'urgent', label: '🔴 Urgent' },
];

// ============================================
// SIMPLE ANIMATED INPUT
// ============================================
const AnimatedInput = ({ label, required, value, onChange, placeholder, type = 'text', className = '' }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={className}>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <motion.div
                className={`relative rounded-xl border transition-all duration-200 ${isFocused
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                    } bg-white dark:bg-gray-900`}
                whileTap={{ scale: 0.99 }}
            >
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 bg-transparent text-gray-900 dark:text-white text-sm outline-none rounded-xl placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
            </motion.div>
        </div>
    );
};

// ============================================
// SIMPLE ANIMATED TEXTAREA
// ============================================
const AnimatedTextarea = ({ label, value, onChange, placeholder, rows = 3 }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {label}
            </label>
            <motion.div
                className={`relative rounded-xl border transition-all duration-200 ${isFocused
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                    } bg-white dark:bg-gray-900`}
                whileTap={{ scale: 0.99 }}
            >
                <textarea
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    rows={rows}
                    className="w-full px-4 py-2.5 bg-transparent text-gray-900 dark:text-white text-sm outline-none rounded-xl resize-y placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
            </motion.div>
        </div>
    );
};

// ============================================
// CUSTOM DROPDOWN - FIXED
// ============================================
const CustomDropdown = ({ label, value, onChange, options, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef(null);
    const [dropdownWidth, setDropdownWidth] = useState('100%');

    const selectedOption = options.find((opt) => opt.value === value);

    const handleSelect = (optionValue) => {
        onChange({ target: { value: optionValue } });
        setIsOpen(false);
        setIsFocused(false);
    };

    // ✅ Calculate dropdown width on open
    useEffect(() => {
        if (isOpen && containerRef.current) {
            const width = containerRef.current.offsetWidth;
            setDropdownWidth(`${width}px`);
        }
    }, [isOpen]);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {label}
            </label>

            {/* Dropdown Trigger */}
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
                    <span className={`text-sm ${selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                        {selectedOption ? selectedOption.label : 'Select...'}
                    </span>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-400"
                    >
                        <ChevronDown className="w-4 h-4" />
                    </motion.div>
                </div>
            </motion.div>

            {/* Dropdown Options - Fixed Width */}
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
                                onClick={() => handleSelect(option.value)}
                                className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${option.value === value
                                        ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-medium'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {option.label}
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
const ProjectDetails = ({
    projectName,
    setProjectName,
    projectDescription,
    setProjectDescription,
    projectStatus,
    setProjectStatus,
    projectPriority,
    setProjectPriority,
    projectCategory,
    setProjectCategory,
    projectTags,
    setProjectTags,
}) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            {/* Header */}
            <motion.div
                className="flex items-center gap-3 mb-5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                    <BriefcaseBusiness className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Project Details</h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">Basic information about your project</p>
                </div>
            </motion.div>

            {/* Form */}
            <div className="space-y-4">
                {/* Name + Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AnimatedInput
                        label="Project Name"
                        required
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="e.g. Website Redesign"
                    />
                    <AnimatedInput
                        label="Category"
                        value={projectCategory}
                        onChange={(e) => setProjectCategory(e.target.value)}
                        placeholder="e.g. Design, Development"
                    />
                </div>

                {/* Description */}
                <AnimatedTextarea
                    label="Description"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe your project in detail..."
                    rows={3}
                />

                {/* Status + Priority + Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <CustomDropdown
                            label="Status"
                            value={projectStatus}
                            onChange={(e) => setProjectStatus(e.target.value)}
                            options={PROJECT_STATUSES}
                        />
                        <CustomDropdown
                            label="Priority"
                            value={projectPriority}
                            onChange={(e) => setProjectPriority(e.target.value)}
                            options={PRIORITY_OPTIONS}
                        />
                    </div>
                    <div>
                        <AnimatedInput
                            label="Tags"
                            value={projectTags}
                            onChange={(e) => setProjectTags(e.target.value)}
                            placeholder="design, frontend, api"
                        />
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default ProjectDetails;
