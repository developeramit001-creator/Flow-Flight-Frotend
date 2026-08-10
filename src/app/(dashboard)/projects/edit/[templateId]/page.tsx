'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    Plus, Trash2, Calendar, User, Clock, Loader2,
    ArrowLeft, GripVertical, Users, Pencil, X, Check,
    ChevronUp, ChevronDown, Link2, FileText, Video,
    Image, FolderOpen, ExternalLink, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_WORKFLOWS } from '@/lib/constants/workflows';
import toast from 'react-hot-toast';

interface Step {
    id: string;
    name: string;
    role: string;
    days: number;
    assignees: string[];
    startDate?: string;
    endDate?: string;
    isEditing?: boolean;
}

interface Attachment {
    id: string;
    name: string;
    url: string;
    type: 'google-drive' | 'dropbox' | 'figma' | 'youtube' | 'loom' | 'other';
    icon: any;
}

// Mock team members (fake data)
const TEAM_MEMBERS = [
    { id: '1', name: 'Amit Sharma', role: 'Project Manager', avatar: 'AS', email: 'amit@flowpilot.com' },
    { id: '2', name: 'Raj Verma', role: 'Videographer', avatar: 'RV', email: 'raj@flowpilot.com' },
    { id: '3', name: 'Riya Patel', role: 'Graphic Designer', avatar: 'RP', email: 'riya@flowpilot.com' },
    { id: '4', name: 'Karan Singh', role: 'Video Editor', avatar: 'KS', email: 'karan@flowpilot.com' },
    { id: '5', name: 'Neha Gupta', role: 'Content Writer', avatar: 'NG', email: 'neha@flowpilot.com' },
    { id: '6', name: 'Kuldeep Yadav', role: 'Senior Editor', avatar: 'KY', email: 'kuldeep@flowpilot.com' },
    { id: '7', name: 'Sumit Kumar', role: 'Assistant', avatar: 'SK', email: 'sumit@flowpilot.com' },
    { id: '8', name: 'Sachin Mehta', role: 'Sound Engineer', avatar: 'SM', email: 'sachin@flowpilot.com' },
    { id: '9', name: 'Mohit Singh', role: 'Lighting Expert', avatar: 'MS', email: 'mohit@flowpilot.com' },
];

// Attachment type options
const ATTACHMENT_TYPES = [
    { value: 'google-drive', label: 'Google Drive', icon: FolderOpen, color: 'text-blue-500' },
    { value: 'dropbox', label: 'Dropbox', icon: FolderOpen, color: 'text-blue-400' },
    { value: 'figma', label: 'Figma', icon: Image, color: 'text-purple-500' },
    { value: 'youtube', label: 'YouTube', icon: Video, color: 'text-red-500' },
    { value: 'loom', label: 'Loom', icon: Video, color: 'text-indigo-500' },
    { value: 'other', label: 'Other', icon: Link2, color: 'text-gray-500' },
];

export default function EditWorkflowPage() {
    const router = useRouter();
    const params = useParams();
    const templateId = params.templateId as string;

    const [isLoading, setIsLoading] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [steps, setSteps] = useState<Step[]>([]);
    const [editingStepId, setEditingStepId] = useState<string | null>(null);

    // ✅ New: Attachments State
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [newAttachment, setNewAttachment] = useState<{ name: string; url: string; type: string }>({
        name: '',
        url: '',
        type: 'other',
    });
    const [showAddAttachment, setShowAddAttachment] = useState(false);

    // Load workflow template
    useEffect(() => {
        if (templateId) {
            const template = ALL_WORKFLOWS.find(w => w.id === templateId);
            if (template) {
                setProjectName(template.name);
                setSteps(template.steps.map((s, index) => ({
                    id: String(index + 1),
                    name: s.name,
                    role: s.role || '',
                    days: s.days || 1,
                    assignees: [],
                    startDate: '',
                    endDate: '',
                    isEditing: false,
                })));

                const today = new Date();
                today.setDate(today.getDate() + 1);
                setStartDate(today.toISOString().split('T')[0]);

                // ✅ Add some mock attachments for demo
                setAttachments([
                    { id: '1', name: 'Project Brief.docx', url: 'https://drive.google.com/file/d/123', type: 'google-drive', icon: FolderOpen },
                    { id: '2', name: 'Reference Video.mp4', url: 'https://youtube.com/watch?v=abc', type: 'youtube', icon: Video },
                    { id: '3', name: 'Logo Design.fig', url: 'https://figma.com/file/xyz', type: 'figma', icon: Image },
                ]);
            } else {
                toast.error('Workflow template not found.');
                router.push('/workflows');
            }
        }
    }, [templateId, router]);

    // Auto-calculate dates
    useEffect(() => {
        if (startDate && steps.length > 0) {
            const updatedSteps = steps.map((step, index) => {
                const prevSteps = steps.slice(0, index);
                const totalDaysBefore = prevSteps.reduce((acc, s) => acc + (Number(s.days) || 0), 0);
                const start = new Date(startDate);
                start.setDate(start.getDate() + totalDaysBefore);

                const end = new Date(start);
                end.setDate(end.getDate() + (Number(step.days) || 0));

                return {
                    ...step,
                    startDate: start.toISOString().split('T')[0],
                    endDate: end.toISOString().split('T')[0],
                };
            });
            setSteps(updatedSteps);
        }
    }, [startDate, steps.map(s => s.days).join(',')]);

    const addStep = () => {
        const newId = String(steps.length + 1);
        setSteps([...steps, {
            id: newId,
            name: '',
            role: '',
            days: 1,
            assignees: [],
            startDate: '',
            endDate: '',
            isEditing: true,
        }]);
        setEditingStepId(newId);
    };

    const removeStep = (id: string) => {
        if (steps.length <= 1) {
            toast.error('You need at least one step.');
            return;
        }
        setSteps(steps.filter((step) => step.id !== id));
        toast.success('Step removed!');
    };

    const updateStep = (id: string, field: keyof Step, value: any) => {
        setSteps(
            steps.map((step) => {
                if (step.id === id) {
                    return { ...step, [field]: value };
                }
                return step;
            })
        );
    };

    const toggleAssignee = (stepId: string, memberId: string) => {
        setSteps(
            steps.map((step) => {
                if (step.id === stepId) {
                    const currentAssignees = step.assignees || [];
                    const exists = currentAssignees.includes(memberId);
                    return {
                        ...step,
                        assignees: exists
                            ? currentAssignees.filter(id => id !== memberId)
                            : [...currentAssignees, memberId],
                    };
                }
                return step;
            })
        );
    };

    const moveStep = (id: string, direction: 'up' | 'down') => {
        const index = steps.findIndex(s => s.id === id);
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === steps.length - 1) return;

        const newSteps = [...steps];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
        setSteps(newSteps);
    };

    // ✅ Attachment Functions
    const addAttachment = () => {
        if (!newAttachment.name.trim()) {
            toast.error('Please enter a file name.');
            return;
        }
        if (!newAttachment.url.trim()) {
            toast.error('Please enter a valid URL.');
            return;
        }

        const typeInfo = ATTACHMENT_TYPES.find(t => t.value === newAttachment.type);
        setAttachments([
            ...attachments,
            {
                id: String(attachments.length + 1),
                name: newAttachment.name,
                url: newAttachment.url,
                type: newAttachment.type as any,
                icon: typeInfo?.icon || Link2,
            }
        ]);
        setNewAttachment({ name: '', url: '', type: 'other' });
        setShowAddAttachment(false);
        toast.success('Attachment added! 🎉');
    };

    const removeAttachment = (id: string) => {
        setAttachments(attachments.filter(a => a.id !== id));
        toast.success('Attachment removed.');
    };

    const totalDays = steps.reduce((acc, s) => acc + (Number(s.days) || 0), 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!projectName.trim()) {
            toast.error('Please enter a project name.');
            return;
        }

        const invalidStep = steps.find((s) => !s.name.trim());
        if (invalidStep) {
            toast.error('Please fill all step names.');
            return;
        }

        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const projectData = {
                name: projectName,
                startDate,
                steps: steps.map(s => ({
                    name: s.name,
                    role: s.role,
                    days: s.days,
                    assignees: s.assignees.map(id => TEAM_MEMBERS.find(m => m.id === id)?.name || id),
                    startDate: s.startDate,
                    endDate: s.endDate,
                })),
                attachments: attachments.map(a => ({
                    name: a.name,
                    url: a.url,
                    type: a.type,
                })),
                totalDays,
            };
            console.log('Project Data:', projectData);

            toast.success(`Project "${projectName}" created with ${steps.length} steps! 🎉`);
            router.push('/');
        } catch (error) {
            toast.error('Failed to create project. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getAssigneeNames = (assigneeIds: string[]) => {
        return assigneeIds
            .map(id => TEAM_MEMBERS.find(m => m.id === id)?.name || id)
            .join(', ');
    };

    const getAssigneeAvatars = (assigneeIds: string[]) => {
        return assigneeIds.map(id => TEAM_MEMBERS.find(m => m.id === id));
    };

    // ✅ Get attachment type info
    const getAttachmentType = (type: string) => {
        return ATTACHMENT_TYPES.find(t => t.value === type);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto"
        >
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl p-6 md:p-8">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/workflows')}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Workflows
                </button>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    ✏️ Edit Workflow: {projectName || 'Loading...'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Customize steps, assign team members, set timelines, and attach resources.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Project Name
                            </label>
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Project Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Steps Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Users className="h-4 w-4 text-indigo-500" />
                                Workflow Steps
                            </h3>
                            <span className="text-sm bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full">
                                Total: {totalDays} days
                            </span>
                        </div>

                        <AnimatePresence>
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl mb-3 border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="cursor-grab text-gray-400 hover:text-gray-600 mt-2">
                                            <GripVertical className="h-5 w-5" />
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                                                    Step {index + 1}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={step.name}
                                                    onChange={(e) => updateStep(step.id, 'name', e.target.value)}
                                                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                                                    placeholder="Step name..."
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div>
                                                    <label className="text-xs text-gray-500 dark:text-gray-400">Role</label>
                                                    <input
                                                        type="text"
                                                        value={step.role}
                                                        onChange={(e) => updateStep(step.id, 'role', e.target.value)}
                                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                                                        placeholder="Role..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> Days
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={step.days}
                                                        onChange={(e) => updateStep(step.id, 'days', parseInt(e.target.value) || 0)}
                                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" /> Dates
                                                    </label>
                                                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600">
                                                        {step.startDate ? `${step.startDate} → ${step.endDate}` : 'Set start date'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1.5">
                                                    <Users className="h-3 w-3" /> Assign Team Members
                                                </label>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {getAssigneeAvatars(step.assignees).filter(Boolean).map((member) => (
                                                        <span
                                                            key={member?.id}
                                                            className="flex items-center gap-1 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full text-xs"
                                                        >
                                                            <span className="h-5 w-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">
                                                                {member?.avatar}
                                                            </span>
                                                            {member?.name}
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleAssignee(step.id, member!.id)}
                                                                className="hover:text-red-500 transition"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </span>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const unassigned = TEAM_MEMBERS.filter(
                                                                m => !(step.assignees || []).includes(m.id)
                                                            );
                                                            if (unassigned.length > 0) {
                                                                toggleAssignee(step.id, unassigned[0].id);
                                                            } else {
                                                                toast.info('All team members already assigned.');
                                                            }
                                                        }}
                                                        className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline transition"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                        Add Member
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => moveStep(step.id, 'up')}
                                                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-400 hover:text-gray-600"
                                                disabled={index === 0}
                                            >
                                                <ChevronUp className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveStep(step.id, 'down')}
                                                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-400 hover:text-gray-600"
                                                disabled={index === steps.length - 1}
                                            >
                                                <ChevronDown className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeStep(step.id)}
                                                className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition text-gray-400 hover:text-red-500 mt-1"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <button
                            type="button"
                            onClick={addStep}
                            className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline transition mt-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Step
                        </button>
                    </div>

                    {/* ✅ NEW: Attachments Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                            <Link2 className="h-4 w-4 text-indigo-500" />
                            Project Attachments
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            Add links from Google Drive, Dropbox, Figma, YouTube, Loom, or any other URL.
                        </p>

                        {/* Attachment List */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {attachments.map((attachment) => {
                                const typeInfo = getAttachmentType(attachment.type);
                                return (
                                    <div
                                        key={attachment.id}
                                        className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition group"
                                    >
                                        {typeInfo && <typeInfo.icon className={`h-4 w-4 ${typeInfo.color}`} />}
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {attachment.name}
                                        </span>
                                        <a
                                            href={attachment.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-indigo-600 transition"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(attachment.id)}
                                            className="text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Add Attachment */}
                        {showAddAttachment ? (
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400">File Name</label>
                                        <input
                                            type="text"
                                            value={newAttachment.name}
                                            onChange={(e) => setNewAttachment({ ...newAttachment, name: e.target.value })}
                                            placeholder="Project Brief.docx"
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400">URL</label>
                                        <input
                                            type="url"
                                            value={newAttachment.url}
                                            onChange={(e) => setNewAttachment({ ...newAttachment, url: e.target.value })}
                                            placeholder="https://drive.google.com/..."
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400">Type</label>
                                        <select
                                            value={newAttachment.type}
                                            onChange={(e) => setNewAttachment({ ...newAttachment, type: e.target.value })}
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
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowAddAttachment(true)}
                                className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline transition text-sm"
                            >
                                <Plus className="h-4 w-4" />
                                Add Attachment Link
                            </button>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
                            <div className="flex flex-wrap items-center gap-6 text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                    📋 <strong className="text-gray-900 dark:text-white">{steps.length}</strong> Steps
                                </span>
                                <span className="text-gray-600 dark:text-gray-400">
                                    ⏱️ <strong className="text-gray-900 dark:text-white">{totalDays}</strong> Total Days
                                </span>
                                {startDate && (
                                    <span className="text-gray-600 dark:text-gray-400">
                                        📅 Start: <strong className="text-gray-900 dark:text-white">{startDate}</strong>
                                    </span>
                                )}
                                {steps.some(s => s.assignees.length > 0) && (
                                    <span className="text-gray-600 dark:text-gray-400">
                                        👥 <strong className="text-gray-900 dark:text-white">
                                            {steps.filter(s => s.assignees.length > 0).length}</strong> Steps Assigned
                                    </span>
                                )}
                                <span className="text-gray-600 dark:text-gray-400">
                                    🗓️ End: <strong className="text-gray-900 dark:text-white">
                                        {steps.length > 0 && steps[steps.length - 1].endDate || '...'}
                                    </strong>
                                </span>
                                {attachments.length > 0 && (
                                    <span className="text-gray-600 dark:text-gray-400">
                                        📎 <strong className="text-gray-900 dark:text-white">{attachments.length}</strong> Attachments
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-wrap justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.push('/workflows')}
                            className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Project 🚀'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
