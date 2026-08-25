// src/components/AttachmentsManager.jsx
'use client';

import { useState } from 'react';
import {
    Paperclip, X, Link2, File, Image, Video,
    FileText, FileSpreadsheet, FileArchive,
    Plus, Trash2, ExternalLink, Clock, User,
    Link as LinkIcon, Globe, FolderOpen,
    Copy, Check, Send, Github,
    Figma as FigmaIcon,
    Youtube as YoutubeIcon,
    Instagram as InstagramIcon,
    Twitter as TwitterIcon,
    Linkedin as LinkedinIcon,
    Share2, Sparkles, HelpCircle, MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// ============================================
// PLATFORM ICON MAP
// ============================================
const getPlatformIcon = (url) => {
    const domain = url?.toLowerCase() || '';

    if (domain.includes('figma.com')) return FigmaIcon;
    if (domain.includes('youtube.com') || domain.includes('youtu.be')) return YoutubeIcon;
    if (domain.includes('github.com')) return Github;
    if (domain.includes('instagram.com')) return InstagramIcon;
    if (domain.includes('twitter.com') || domain.includes('x.com')) return TwitterIcon;
    if (domain.includes('linkedin.com')) return LinkedinIcon;
    if (domain.includes('drive.google.com')) return FileText;
    if (domain.includes('dropbox.com')) return FolderOpen;
    if (domain.includes('notion.so')) return FileText;
    if (domain.includes('miro.com')) return FileText;
    if (domain.includes('slack.com')) return Share2;
    return LinkIcon;
};

// ============================================
// PLATFORM COLORS - ORIGINAL BRAND COLORS
// ============================================
const getPlatformColors = (url) => {
    const domain = url?.toLowerCase() || '';

    if (domain.includes('figma.com')) {
        return { bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-500', border: 'border-pink-200 dark:border-pink-800' };
    }
    if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
        return { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-500', border: 'border-red-200 dark:border-red-800' };
    }
    if (domain.includes('drive.google.com')) {
        return { bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-600', border: 'border-green-200 dark:border-green-800' };
    }
    if (domain.includes('dropbox.com')) {
        return { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-500', border: 'border-blue-200 dark:border-blue-800' };
    }
    if (domain.includes('github.com')) {
        return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-700' };
    }
    if (domain.includes('linkedin.com')) {
        return { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-600', border: 'border-blue-200 dark:border-blue-800' };
    }
    if (domain.includes('instagram.com')) {
        return { bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-500', border: 'border-pink-200 dark:border-pink-800' };
    }
    if (domain.includes('twitter.com') || domain.includes('x.com')) {
        return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-700' };
    }
    if (domain.includes('notion.so')) {
        return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-700' };
    }
    return { bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-500', border: 'border-indigo-200 dark:border-indigo-800' };
};

// ============================================
// PRESET COLORS - ORIGINAL BRAND COLORS
// ============================================
const PRESET_COLORS = {
    'Figma': { bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-500', border: 'border-pink-300 dark:border-pink-700' },
    'YouTube': { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-500', border: 'border-red-300 dark:border-red-700' },
    'Google Drive': { bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-600', border: 'border-green-300 dark:border-green-700' },
    'Dropbox': { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-500', border: 'border-blue-300 dark:border-blue-700' },
    'Notion': { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-700' },
    'GitHub': { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-700' },
    'LinkedIn': { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-600', border: 'border-blue-300 dark:border-blue-700' },
    'Instagram': { bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-500', border: 'border-pink-300 dark:border-pink-700' },
    'Twitter/X': { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-700' },
    'Other': { bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-500', border: 'border-indigo-300 dark:border-indigo-700' },
};

// ============================================
// QUICK LINK PRESETS
// ============================================
const QUICK_LINKS = [
    { name: 'Figma', icon: FigmaIcon, placeholder: 'figma.com/file/your-file-id', example: 'figma.com/file/abc123/design-file' },
    { name: 'YouTube', icon: YoutubeIcon, placeholder: 'youtube.com/watch?v=video-id', example: 'youtube.com/watch?v=abc123' },
    { name: 'Google Drive', icon: FileText, placeholder: 'drive.google.com/file/d/file-id/view', example: 'drive.google.com/file/d/abc123/view' },
    { name: 'Dropbox', icon: FolderOpen, placeholder: 'dropbox.com/s/your-file-id', example: 'dropbox.com/s/abc123/file.pdf' },
    { name: 'Notion', icon: FileText, placeholder: 'notion.so/workspace/page-id', example: 'notion.so/workspace/page-id' },
    { name: 'GitHub', icon: Github, placeholder: 'github.com/username/repo', example: 'github.com/username/repo' },
    { name: 'LinkedIn', icon: LinkedinIcon, placeholder: 'linkedin.com/in/username', example: 'linkedin.com/in/username' },
    { name: 'Instagram', icon: InstagramIcon, placeholder: 'instagram.com/p/post-id', example: 'instagram.com/p/abc123' },
    { name: 'Twitter/X', icon: TwitterIcon, placeholder: 'twitter.com/username/status/tweet-id', example: 'twitter.com/username/status/123' },
];

// ============================================
// SINGLE ATTACHMENT COMPONENT
// ============================================
const AttachmentItem = ({ attachment, onRemove, onDownload, showRemove = true }) => {
    const Icon = getPlatformIcon(attachment.url);
    const colors = getPlatformColors(attachment.url);
    const isLink = attachment.url?.startsWith('http');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (attachment.url) {
            navigator.clipboard.writeText(attachment.url);
            setCopied(true);
            toast.success('Link copied!');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="group flex items-center gap-3 p-3 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
        >
            <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${colors.bg} ${colors.text}`}>
                <Icon className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {attachment.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="truncate max-w-[200px]">{attachment.url}</span>
                    {attachment.uploadedAt && (
                        <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(attachment.uploadedAt).toLocaleDateString()}
                            </span>
                        </>
                    )}
                    {attachment.uploadedBy && (
                        <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {attachment.uploadedBy}
                            </span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {isLink && (
                    <>
                        <button
                            onClick={handleCopy}
                            className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition"
                            title="Copy link"
                        >
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </button>
                        <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition"
                            title="Open link"
                        >
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </>
                )}
                {showRemove && (
                    <button
                        onClick={() => onRemove?.(attachment.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
                        title="Remove"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

// ============================================
// ATTACHMENTS MANAGER COMPONENT
// ============================================
export const AttachmentsManager = ({
    title = 'Links & Attachments',
    description = 'Add links to Figma, Google Drive, Dropbox, and more',
    attachments = [],
    onAddAttachments,
    onRemoveAttachment,
    onDownloadAttachment,
    maxFiles = 20,
    showAddButton = true,
    className = '',
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newLink, setNewLink] = useState('');
    const [newLinkName, setNewLinkName] = useState('');
    const [selectedPreset, setSelectedPreset] = useState(null);

    const handleAddLink = () => {
        if (!newLink.trim()) {
            toast.error('Please enter a URL');
            return;
        }

        let urlToSave = newLink.trim();
        if (!urlToSave.startsWith('http://') && !urlToSave.startsWith('https://')) {
            urlToSave = 'https://' + urlToSave;
        }

        try {
            new URL(urlToSave);
        } catch {
            toast.error('Please enter a valid URL');
            return;
        }

        if (!newLinkName.trim()) {
            toast.error('Please enter a name for the link');
            return;
        }

        if (attachments.length >= maxFiles) {
            toast.error(`Maximum ${maxFiles} links allowed`);
            return;
        }

        if (onAddAttachments) {
            onAddAttachments([{
                id: Date.now() + Math.random() * 1000,
                name: newLinkName.trim(),
                url: urlToSave,
                isLink: true,
                uploadedAt: new Date().toISOString(),
                uploadedBy: 'Current User',
            }]);
        }

        setNewLink('');
        setNewLinkName('');
        setSelectedPreset(null);
        setIsAdding(false);
        toast.success('Link added successfully! 🎯');
    };

    const handlePresetSelect = (preset) => {
        if (selectedPreset?.name === preset.name) {
            setSelectedPreset(null);
            setNewLink('');
            setNewLinkName('');
        } else {
            setSelectedPreset(preset);
            setNewLinkName(preset.name);
            setNewLink('');
        }
    };

    const clearPreset = () => {
        setSelectedPreset(null);
        setNewLink('');
        setNewLinkName('');
    };

    return (
        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/30">
                        <Paperclip className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {attachments.length} {attachments.length === 1 ? 'link' : 'links'} attached
                            {maxFiles && ` • ${attachments.length}/${maxFiles} limit`}
                        </p>
                    </div>
                </div>
                {showAddButton && attachments.length < maxFiles && (
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition font-medium"
                    >
                        <Plus className="h-4 w-4" />
                        Add Link
                    </button>
                )}
            </div>

            {/* Add Link Section */}
            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                    {/* Quick Presets */}
                    <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Quick add from popular platforms</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {QUICK_LINKS.map((preset) => {
                                const Icon = preset.icon;
                                const isActive = selectedPreset?.name === preset.name;
                                const colors = PRESET_COLORS[preset.name] || PRESET_COLORS['Figma'];

                                return (
                                    <button
                                        key={preset.name}
                                        onClick={() => handlePresetSelect(preset)}
                                        className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${isActive
                                                ? `${colors.bg} ${colors.text} border ${colors.border} shadow-sm`
                                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {preset.name}
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                                            {preset.example}
                                        </span>
                                    </button>
                                );
                            })}

                            {/* Other Button */}
                            <button
                                onClick={() => {
                                    setSelectedPreset(null);
                                    setNewLink('');
                                    setNewLinkName('');
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${selectedPreset === null && newLinkName === ''
                                        ? 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 shadow-sm'
                                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm'
                                    }`}
                                title="Add any custom link"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                                Other
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center my-3">
                        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                        <span className="px-3 text-xs text-gray-400 dark:text-gray-500 font-medium">OR</span>
                        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                    </div>

                    {/* Custom Link */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Add any custom link</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={newLink}
                                    onChange={(e) => setNewLink(e.target.value)}
                                    className={`w-full px-3 py-2 rounded-lg border text-sm transition ${selectedPreset
                                            ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200'
                                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                                        } focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition placeholder-gray-400 dark:placeholder-gray-500`}
                                    placeholder={selectedPreset ? `e.g., ${selectedPreset.example}` : 'https://any-platform.com/...'}
                                />
                                {selectedPreset && (
                                    <p className="text-[10px] text-indigo-500 dark:text-indigo-400 mt-1">
                                        💡 Format: {selectedPreset.example}
                                    </p>
                                )}
                                {!selectedPreset && (
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                                        💡 Enter any URL (e.g., Slack, Miro, Trello, etc.)
                                    </p>
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Link name (e.g., Design File)"
                                    value={newLinkName}
                                    onChange={(e) => setNewLinkName(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handleAddLink}
                                    disabled={!newLink || !newLinkName}
                                    className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    <Link2 className="h-4 w-4 inline mr-1.5" />
                                    Add Link
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3 flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        Supports any platform • Click preset icons or "Other" for custom links
                    </p>
                </motion.div>
            )}

            {/* Attachments List */}
            {attachments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                        <Globe className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium">No links added yet</p>
                    <p className="text-xs">Add Figma, Google Drive, Dropbox, or any custom link</p>
                </div>
            ) : (
                <AnimatePresence>
                    <div className="space-y-2">
                        {attachments.map((attachment) => (
                            <AttachmentItem
                                key={attachment.id}
                                attachment={attachment}
                                onRemove={onRemoveAttachment}
                                onDownload={onDownloadAttachment}
                            />
                        ))}
                    </div>
                </AnimatePresence>
            )}
        </div>
    );
};

export default AttachmentsManager;
