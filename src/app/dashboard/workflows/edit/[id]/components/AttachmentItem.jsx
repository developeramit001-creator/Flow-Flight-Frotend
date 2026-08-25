// src/app/dashboard/workflows/edit/[id]/components/AttachmentItem.jsx
'use client';

import { motion } from 'framer-motion';
import { X, ExternalLink, FolderOpen, Image, Video, Link2 } from 'lucide-react';

const ATTACHMENT_TYPES = [
    { value: 'google-drive', label: 'Google Drive', icon: FolderOpen, color: 'text-blue-500' },
    { value: 'dropbox', label: 'Dropbox', icon: FolderOpen, color: 'text-blue-400' },
    { value: 'figma', label: 'Figma', icon: Image, color: 'text-purple-500' },
    { value: 'youtube', label: 'YouTube', icon: Video, color: 'text-red-500' },
    { value: 'loom', label: 'Loom', icon: Video, color: 'text-indigo-500' },
    { value: 'other', label: 'Other', icon: Link2, color: 'text-gray-500' },
];

const AttachmentItem = ({ attachment, onRemove }) => {
    const typeInfo = ATTACHMENT_TYPES.find((t) => t.value === attachment.type);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition group"
        >
            {typeInfo && <typeInfo.icon className={`w-4 h-4 ${typeInfo.color}`} />}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                {attachment.name}
            </span>
            <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-indigo-600 transition"
            >
                <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
                onClick={() => onRemove(attachment.id)}
                className="text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </motion.div>
    );
};

export default AttachmentItem; // ✅ DEFAULT EXPORT
