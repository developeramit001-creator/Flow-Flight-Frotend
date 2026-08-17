'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    Paperclip,
    Clock,
    User,
    Calendar,
    MessageCircle,
    Play,
    FileText,
    Video,
    Image as ImageIcon,
    Link2,
    MoreVertical,
    AlertCircle,
    Plus,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Subtask {
    id: number;
    name: string;
    done: boolean;
}

export default function TaskDetailPage() {
    const params = useParams();
    const taskId = params.id;

    // Mock Task Data
    const task = {
        name: 'Shoot Video',
        status: 'In Progress',
        assignee: 'Raj',
        startDate: '20 Mar 2025',
        endDate: '21 Mar 2025',
        priority: 'High',
        progress: 60,
        timeEstimate: '1 Day',
        timeSpent: '4 Hours',
        description: 'Record all required clips as per the script and shot list.',
        subtasks: [
            { id: 1, name: 'Prepare Camera', done: true },
            { id: 2, name: 'Location Setup', done: true },
            { id: 3, name: 'Record Intro', done: false },
            { id: 4, name: 'Record Main Content', done: false },
            { id: 5, name: 'B-roll Shots', done: false },
            { id: 6, name: 'Backup Footage', done: false },
        ],
        attachments: [
            { name: 'Shot List.pdf', icon: FileText, color: 'text-red-500' },
            { name: 'Reference Video.mp4', icon: Video, color: 'text-blue-500' },
            { name: 'Location Image.jpg', icon: ImageIcon, color: 'text-green-500' },
        ],
        comments: [
            { user: 'Raj', date: '10 Mar', text: 'Camera ready. Starting shoot.' },
            { user: 'Karan', date: '09 Mar', text: 'Check the script once more.' },
        ],
    };

    const [completedSubtasks, setCompletedSubtasks] = useState<number[]>(
        task.subtasks.filter((s) => s.done).map((s) => s.id)
    );
    const [newComment, setNewComment] = useState('');

    // ✅ FIXED: prev ko andar use karo
    const toggleSubtask = (id: number) => {
        setCompletedSubtasks((prev) => {
            const isCompleted = prev.includes(id);
            const newList = isCompleted ? prev.filter((i) => i !== id) : [...prev, id];

            // ✅ Toast yahan ANDAR daalo
            toast.success(isCompleted ? 'Subtask unmarked' : 'Subtask completed! 🎉');

            return newList;
        });
    };

    const progress = Math.round((completedSubtasks.length / task.subtasks.length) * 100);

    const handleAddComment = () => {
        if (!newComment.trim()) {
            toast.error('Please enter a comment.');
            return;
        }
        toast.success('Comment added!');
        setNewComment('');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
        >
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                    {task.name}
                                </h1>
                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 animate-pulse">
                                    {task.status}
                                </span>
                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                                    {task.priority} Priority
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    <User className="h-4 w-4" /> {task.assignee}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" /> {task.startDate} → {task.endDate}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" /> {task.timeSpent} spent
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16">
                                <svg className="h-16 w-16 -rotate-90 transform" viewBox="0 0 36 36">
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="16"
                                        fill="none"
                                        className="stroke-gray-200 dark:stroke-gray-700"
                                        strokeWidth="3"
                                    />
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="16"
                                        fill="none"
                                        className="stroke-indigo-600 transition-all duration-1000 ease-out"
                                        strokeWidth="3"
                                        strokeDasharray="100"
                                        strokeDashoffset={100 - progress}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-white">
                                    {progress}%
                                </span>
                            </div>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                                <MoreVertical className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                Description
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{task.description}</p>
                        </div>

                        {/* Subtasks */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                Subtasks ({completedSubtasks.length}/{task.subtasks.length})
                            </h3>
                            <div className="space-y-2">
                                {task.subtasks.map((st) => (
                                    <div
                                        key={st.id}
                                        onClick={() => toggleSubtask(st.id)}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer group transition"
                                    >
                                        <div
                                            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition ${completedSubtasks.includes(st.id)
                                                    ? 'bg-indigo-600 border-indigo-600'
                                                    : 'border-gray-300 dark:border-gray-600 group-hover:border-indigo-400'
                                                }`}
                                        >
                                            {completedSubtasks.includes(st.id) && (
                                                <CheckCircle2 className="h-3 w-3 text-white" />
                                            )}
                                        </div>
                                        <span
                                            className={`text-sm font-medium ${completedSubtasks.includes(st.id)
                                                    ? 'line-through text-gray-400 dark:text-gray-500'
                                                    : 'text-gray-700 dark:text-gray-200'
                                                }`}
                                        >
                                            {st.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Attachments */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Paperclip className="h-4 w-4" />
                                Attachments
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {task.attachments.map((file, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition cursor-pointer group"
                                    >
                                        <file.icon className={`h-5 w-5 ${file.color}`} />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {file.name}
                                        </span>
                                        <Link2 className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
                                    </div>
                                ))}
                                <button className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-400 transition text-sm text-gray-500">
                                    <Plus className="h-4 w-4" />
                                    Add Link
                                </button>
                            </div>
                        </div>

                        {/* Time Log */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                Time Log
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Estimate: <strong className="text-gray-700 dark:text-white">{task.timeEstimate}</strong>
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Spent: <strong className="text-gray-700 dark:text-white">{task.timeSpent}</strong>
                                        </span>
                                    </div>
                                    <button className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                                        Log Time
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Comments */}
                    <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-gray-800 pt-4 lg:pt-0 lg:pl-6">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            Comments ({task.comments.length})
                        </h3>
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                            {task.comments.map((c, idx) => (
                                <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                                            {c.user}
                                        </span>
                                        <span className="text-gray-400">{c.date}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{c.text}</p>
                                </div>
                            ))}
                        </div>

                        {/* Add Comment */}
                        <div className="mt-4 relative">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                placeholder="Write a comment... (use @ to mention)"
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 pr-10 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                            />
                            <button
                                onClick={handleAddComment}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition"
                            >
                                <Play className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800/30 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>Last updated: Today at 10:30 AM</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            {completedSubtasks.length}/{task.subtasks.length} subtasks done
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
