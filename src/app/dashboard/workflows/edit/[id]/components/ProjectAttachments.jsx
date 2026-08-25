// src/app/dashboard/workflows/edit/[id]/components/ProjectAttachments.jsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import AttachmentItem from './AttachmentItem'; // ✅ DEFAULT IMPORT

const ATTACHMENT_TYPES = [
    { value: 'google-drive', label: 'Google Drive' },
    { value: 'dropbox', label: 'Dropbox' },
    { value: 'figma', label: 'Figma' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'loom', label: 'Loom' },
    { value: 'other', label: 'Other' },
];

const ProjectAttachments = ({ attachments, setAttachments }) => {
    const [showAddAttachment, setShowAddAttachment] = useState(false);
    const [newAttachment, setNewAttachment] = useState({ name: '', url: '', type: 'other' });

    const addAttachment = () => {
        if (!newAttachment.name.trim()) {
            toast.error('Please enter a file name.');
            return;
        }
        if (!newAttachment.url.trim()) {
            toast.error('Please enter a valid URL.');
            return;
        }

        setAttachments([
            ...attachments,
            {
                id: String(attachments.length + 1),
                name: newAttachment.name,
                url: newAttachment.url,
                type: newAttachment.type,
            },
        ]);
        setNewAttachment({ name: '', url: '', type: 'other' });
        setShowAddAttachment(false);
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
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 shadow-sm"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Link2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Project Attachments</h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">Add links to Figma, Google Drive, YouTube, etc.</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
                {attachments.length === 0 ? (
                    <p className="text-sm text-gray-400">No attachments added yet</p>
                ) : (
                    attachments.map((attachment) => (
                        <AttachmentItem
                            key={attachment.id}
                            attachment={attachment}
                            onRemove={removeAttachment}
                        />
                    ))
                )}
            </div>

            {showAddAttachment ? (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400">File Name</label>
                            <input
                                type="text"
                                value={newAttachment.name}
                                onChange={(e) =>
                                    setNewAttachment({ ...newAttachment, name: e.target.value })
                                }
                                placeholder="Project Brief.docx"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400">URL</label>
                            <input
                                type="url"
                                value={newAttachment.url}
                                onChange={(e) =>
                                    setNewAttachment({ ...newAttachment, url: e.target.value })
                                }
                                placeholder="https://..."
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400">Type</label>
                            <select
                                value={newAttachment.type}
                                onChange={(e) =>
                                    setNewAttachment({ ...newAttachment, type: e.target.value })
                                }
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                            >
                                {ATTACHMENT_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            onClick={() => setShowAddAttachment(false)}
                            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={addAttachment}
                            className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
                        >
                            Add Link
                        </button>
                    </div>
                </motion.div>
            ) : (
                <button
                    type="button"
                    onClick={() => setShowAddAttachment(true)}
                    className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline transition text-sm"
                >
                    <Plus className="w-4 h-4" /> Add Attachment Link
                </button>
            )}
        </motion.section>
    );
};

export default ProjectAttachments; // ✅ DEFAULT EXPORT
