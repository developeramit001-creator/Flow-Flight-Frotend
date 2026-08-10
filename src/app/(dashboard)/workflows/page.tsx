'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { ALL_WORKFLOWS } from '@/lib/constants/workflows';
import toast from 'react-hot-toast';

export default function WorkflowsPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [isCreating, setIsCreating] = useState(false);

    const categories = useMemo(() => {
        const cats = ALL_WORKFLOWS.map((w) => w.category);
        return ['All', ...new Set(cats)];
    }, []);

    const filteredWorkflows = useMemo(() => {
        return ALL_WORKFLOWS.filter((wf) => {
            const matchesSearch =
                wf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                wf.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || wf.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);

    // const handleSelectWorkflow = async (workflowId: string) => {
    //     setIsCreating(true);
    //     try {
    //         await new Promise((resolve) => setTimeout(resolve, 1500));
    //         toast.success('Project created successfully! 🎉');
    //         router.push(`/tasks/${workflowId}`);
    //     } catch (error) {
    //         toast.error('Failed to create project. Please try again.');
    //     } finally {
    //         setIsCreating(false);
    //     }
    // };

    const handleSelectWorkflow = async (workflowId: string) => {
        setIsCreating(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            // ✅ Yahan change karo – Edit page par le jao
            router.push(`/projects/edit/${workflowId}`);
        } catch (error) {
            toast.error('Failed to load workflow. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Choose Your Workflow 🚀
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Select a template to start instantly. We have {ALL_WORKFLOWS.length}+ ready-made flows.
                    </p>
                </div>
                <button
                    onClick={() => router.push('/projects/new')}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/30"
                >
                    <Plus className="h-5 w-5" />
                    Custom Workflow
                </button>
            </div>

            {/* Search + Categories */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search workflows (e.g., YouTube, SEO, App)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedCategory === cat
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {isCreating ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                    <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                        Creating your project...
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredWorkflows.map((wf, idx) => (
                        <motion.div
                            key={wf.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            onClick={() => handleSelectWorkflow(wf.id)}
                            className="group cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:-translate-y-1"
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-3xl">{wf.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                        {wf.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                        {wf.description}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        <span className="text-xs px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full">
                                            {wf.category}
                                        </span>
                                        <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                                            {wf.steps.length} Steps
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* ✅ FIX: step.name use karo, step object nahi */}
                            <div className="mt-3 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 overflow-hidden">
                                {wf.steps.slice(0, 3).map((step, idx) => (
                                    <span key={idx} className="truncate">
                                        • {step.name} {idx < 2 && '→'}
                                    </span>
                                ))}
                                {wf.steps.length > 3 && <span>...</span>}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {filteredWorkflows.length === 0 && !isCreating && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                        No workflows found matching your search.
                    </p>
                </div>
            )}
        </div>
    );
}
