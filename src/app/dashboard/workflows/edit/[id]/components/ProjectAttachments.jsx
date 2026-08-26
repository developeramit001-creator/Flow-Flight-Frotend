// src/app/dashboard/workflows/edit/[id]/components/ProjectAttachments.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Plus, Check, ChevronDown, X } from 'lucide-react';
import toast from 'react-hot-toast';
import AttachmentItem from './AttachmentItem';

const ATTACHMENT_TYPES = [
    { value: 'google-drive', label: 'Google Drive', icon: '📁', color: 'text-green-600' },
    { value: 'dropbox', label: 'Dropbox', icon: '📁', color: 'text-blue-500' },
    { value: 'figma', label: 'Figma', icon: '🎨', color: 'text-pink-500' },
    { value: 'youtube', label: 'YouTube', icon: '▶️', color: 'text-red-500' },
    { value: 'loom', label: 'Loom', icon: '🎬', color: 'text-indigo-500' },
    { value: 'other', label: 'Other', icon: '🔗', color: 'text-gray-500' },
];

// ============================================
// CUSTOM DROPDOWN (Same as ProjectHeadTimeline)
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
                        <span className="text-sm">
                            {selectedOption ? selectedOption.icon : '🔗'}
                        </span>
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
                                <span className="text-base">{option.icon}</span>
                                <span>{option.label}</span>
                                {option.value === value && (
                                    <Check className="w-4 h-4 ml-auto text-indigo-500" />
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
const ProjectAttachments = ({ attachments, setAttachments }) => {
    const [showAddAttachment, setShowAddAttachment] = useState(false);
    const [newAttachment, setNewAttachment] = useState({ name: '', url: '', type: 'other' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addAttachment = async () => {
        if (!newAttachment.name.trim()) {
            toast.error('Please enter a file name.');
            return;
        }
        if (!newAttachment.url.trim()) {
            toast.error('Please enter a valid URL.');
            return;
        }

        // ✅ Validate URL
        let urlToSave = newAttachment.url.trim();
        if (!urlToSave.startsWith('http://') && !urlToSave.startsWith('https://')) {
            urlToSave = 'https://' + urlToSave;
        }

        try {
            new URL(urlToSave);
        } catch {
            toast.error('Please enter a valid URL');
            return;
        }

        setIsSubmitting(true);

        await new Promise(resolve => setTimeout(resolve, 300));

        setAttachments([
            ...attachments,
            {
                id: `att-${Date.now()}`,
                name: newAttachment.name.trim(),
                url: urlToSave,
                type: newAttachment.type,
                uploadedAt: new Date().toISOString(),
            },
        ]);
        setNewAttachment({ name: '', url: '', type: 'other' });
        setShowAddAttachment(false);
        setIsSubmitting(false);
        toast.success('Attachment added! 🎉');
    };

    const removeAttachment = (id) => {
        setAttachments(attachments.filter((a) => a.id !== id));
        toast.success('Attachment removed.');
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                        <Link2 className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Project Attachments</h3>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            {attachments.length} {attachments.length === 1 ? 'link' : 'links'} attached
                        </p>
                    </div>
                </div>
                {attachments.length > 0 && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        {attachments.length} files
                    </span>
                )}
            </div>

            {/* Attachments List */}
            <AnimatePresence mode="popLayout">
                {attachments.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl"
                    >
                        <Link2 className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">No attachments added yet</p>
                        <p className="text-xs text-gray-400">Add Figma, Google Drive, YouTube, or any link</p>
                    </motion.div>
                ) : (
                    <div className="space-y-2 mb-4">
                        {attachments.map((attachment, index) => (
                            <AttachmentItem
                                key={attachment.id}
                                attachment={attachment}
                                onRemove={removeAttachment}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Add Attachment Form - With Custom Dropdown */}
            <AnimatePresence>
                {showAddAttachment ? (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 dark:from-gray-800/50 dark:to-indigo-950/20 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3 mt-3">
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <Plus className="w-3.5 h-3.5 text-indigo-500" />
                                <span>Add a new link</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {/* File Name */}
                                <div>
                                    <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400">File Name</label>
                                    <motion.div
                                        className="relative rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition"
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <input
                                            type="text"
                                            value={newAttachment.name}
                                            onChange={(e) =>
                                                setNewAttachment({ ...newAttachment, name: e.target.value })
                                            }
                                            placeholder="e.g. Design File"
                                            className="w-full px-4 py-2.5 bg-transparent text-gray-900 dark:text-white text-sm outline-none rounded-xl placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        />
                                    </motion.div>
                                </div>

                                {/* URL */}
                                <div>
                                    <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400">URL</label>
                                    <motion.div
                                        className="relative rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition"
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <input
                                            type="url"
                                            value={newAttachment.url}
                                            onChange={(e) =>
                                                setNewAttachment({ ...newAttachment, url: e.target.value })
                                            }
                                            placeholder="https://..."
                                            className="w-full px-4 py-2.5 bg-transparent text-gray-900 dark:text-white text-sm outline-none rounded-xl placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        />
                                    </motion.div>
                                </div>

                                {/* Type - Custom Dropdown */}
                                <div>
                                    <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400">Type</label>
                                    <CustomDropdown
                                        value={newAttachment.type}
                                        onChange={(val) => setNewAttachment({ ...newAttachment, type: val })}
                                        options={ATTACHMENT_TYPES}
                                        placeholder="Select type..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddAttachment(false);
                                        setNewAttachment({ name: '', url: '', type: 'other' });
                                    }}
                                    className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={addAttachment}
                                    disabled={isSubmitting || !newAttachment.name.trim() || !newAttachment.url.trim()}
                                    className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Add Link
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={() => setShowAddAttachment(true)}
                        className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline transition text-sm group"
                    >
                        <span className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950/50 transition">
                            <Plus className="w-4 h-4" />
                        </span>
                        Add Attachment Link
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.section>
    );
};

export default ProjectAttachments;
