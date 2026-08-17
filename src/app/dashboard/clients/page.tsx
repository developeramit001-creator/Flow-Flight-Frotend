'use client';

import { motion } from 'framer-motion';
import { Eye, CheckCircle, Clock, AlertCircle, Star, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Deliverable {
    id: number;
    name: string;
    submittedOn: string;
    status: 'Approved' | 'Pending' | 'Rejected';
    description: string;
}

const deliverables: Deliverable[] = [
    {
        id: 1,
        name: 'Homepage Design',
        submittedOn: '15 Mar 2025',
        status: 'Approved',
        description: 'Complete homepage design with hero section and features.',
    },
    {
        id: 2,
        name: 'Inner Pages Design',
        submittedOn: '18 Mar 2025',
        status: 'Pending',
        description: 'About, Services, and Contact pages design.',
    },
    {
        id: 3,
        name: 'Logo Concept',
        submittedOn: '10 Mar 2025',
        status: 'Approved',
        description: 'Minimalist logo design with color variations.',
    },
];

const statusColors = {
    Approved: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30',
    Pending: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30',
    Rejected: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30',
};

const statusIcons = {
    Approved: CheckCircle,
    Pending: Clock,
    Rejected: AlertCircle,
};

export default function ClientsPage() {
    const [feedback, setFeedback] = useState<{ [key: number]: string }>({});
    const [rating, setRating] = useState<{ [key: number]: number }>({});

    const handleReview = (id: number) => {
        toast.success('Review submitted! Thank you for your feedback.');
    };

    const handleApprove = (id: number) => {
        toast.success('Deliverable approved! 🎉');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto space-y-6"
        >
            {/* Client Welcome */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-500/20">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">👋 Welcome back, John</h2>
                        <p className="text-indigo-100 mt-1">Client Dashboard</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-indigo-200">Overall Progress</p>
                        <p className="text-3xl font-bold">65%</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-indigo-400/30">
                    <div>
                        <p className="text-sm text-indigo-200">Timeframe</p>
                        <p className="text-lg font-semibold">10 Mar → 25 Apr <span className="text-sm font-normal text-indigo-200">(46 Days)</span></p>
                    </div>
                    <div>
                        <p className="text-sm text-indigo-200">Status</p>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/30 rounded-full text-sm">
                            <CheckCircle className="h-4 w-4" />
                            On Track
                        </span>
                    </div>
                </div>
            </div>

            {/* Deliverables */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Recent Deliverables</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{deliverables.length} items</span>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {deliverables.map((deliverable) => {
                        const StatusIcon = statusIcons[deliverable.status];
                        const isPending = deliverable.status === 'Pending';

                        return (
                            <div key={deliverable.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{deliverable.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{deliverable.description}</p>
                                        <p className="text-xs text-gray-400 mt-1">Submitted: {deliverable.submittedOn}</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span
                                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusColors[deliverable.status]}`}
                                        >
                                            <StatusIcon className="h-3.5 w-3.5" />
                                            {deliverable.status}
                                        </span>

                                        {isPending && (
                                            <div className="flex items-center gap-2">
                                                {/* Rating */}
                                                <div className="flex items-center gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            onClick={() => setRating({ ...rating, [deliverable.id]: star })}
                                                            className={`text-lg transition ${(rating[deliverable.id] || 0) >= star
                                                                    ? 'text-yellow-400'
                                                                    : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                                                                }`}
                                                        >
                                                            ★
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Feedback */}
                                                <input
                                                    type="text"
                                                    placeholder="Add feedback..."
                                                    value={feedback[deliverable.id] || ''}
                                                    onChange={(e) =>
                                                        setFeedback({ ...feedback, [deliverable.id]: e.target.value })
                                                    }
                                                    className="w-32 md:w-40 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                                                />

                                                <button
                                                    onClick={() => handleApprove(deliverable.id)}
                                                    className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-500 transition"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReview(deliverable.id)}
                                                    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                                >
                                                    Review
                                                </button>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => toast.success('Opening deliverable...')}
                                            className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 transition"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Client Note */}
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 text-sm text-blue-700 dark:text-blue-300">
                    <MessageCircle className="h-5 w-5" />
                    <p>
                        <strong>Note:</strong> You can review, approve, or request changes for any deliverable.
                        Your feedback helps the team improve faster!
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
