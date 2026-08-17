'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Calendar, User, Clock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface Step {
    id: string;
    name: string;
    role: string;
    days: number;
}

export default function NewProjectPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [steps, setSteps] = useState<Step[]>([
        { id: '1', name: '', role: '', days: 1 },
    ]);

    const addStep = () => {
        const newId = String(steps.length + 1);
        setSteps([...steps, { id: newId, name: '', role: '', days: 1 }]);
    };

    const removeStep = (id: string) => {
        if (steps.length <= 1) {
            toast.error('You need at least one step.');
            return;
        }
        setSteps(steps.filter((step) => step.id !== id));
    };

    const updateStep = (id: string, field: keyof Step, value: string | number) => {
        setSteps(
            steps.map((step) =>
                step.id === id ? { ...step, [field]: value } : step
            )
        );
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
            toast.success(`Project "${projectName}" created with ${steps.length} steps! 🎉`);
            router.push('/dashboard');
        } catch (error) {
            toast.error('Failed to create project. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
        >
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    🚀 Create Custom Project
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Define your own workflow steps with roles and time estimates.
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
                                placeholder="My Awesome Project"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Start Date
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

                    {/* Steps */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Workflow Steps
                            </h3>
                            <span className="text-sm bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full">
                                Total: {totalDays} days
                            </span>
                        </div>

                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className="grid grid-cols-12 gap-3 items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl mb-3 border border-gray-200 dark:border-gray-700"
                            >
                                <div className="col-span-5">
                                    <input
                                        type="text"
                                        placeholder="Step Name (e.g., Video Shoot)"
                                        value={step.name}
                                        onChange={(e) => updateStep(step.id, 'name', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                                        required
                                    />
                                </div>
                                <div className="col-span-4">
                                    <input
                                        type="text"
                                        placeholder="Role (e.g., Editor)"
                                        value={step.role}
                                        onChange={(e) => updateStep(step.id, 'role', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Days"
                                        value={step.days}
                                        onChange={(e) =>
                                            updateStep(step.id, 'days', parseInt(e.target.value) || 0)
                                        }
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                                    />
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removeStep(step.id)}
                                        className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addStep}
                            className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline transition"
                        >
                            <Plus className="h-4 w-4" />
                            Add Step
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.push('/dashboard')}
                            className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Project 🚀'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
