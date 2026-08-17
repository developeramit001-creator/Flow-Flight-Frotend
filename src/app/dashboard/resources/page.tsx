'use client';

import { motion } from 'framer-motion';
import {
    Library,
    FolderOpen,
    FileText,
    Image as ImageIcon,
    Video,
    Code,
    Layers,
    Search,
    Plus,
    Download,
    Clock,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Resource {
    id: number;
    name: string;
    type: string;
    icon: any;
    items: number;
    version: string;
    lastUpdated: string;
}

const resources: Resource[] = [
    { id: 1, name: 'Brand Guidelines', type: 'Brand Assets', icon: Layers, items: 12, version: 'v2.1', lastUpdated: '2 days ago' },
    { id: 2, name: 'SOP Templates', type: 'Templates', icon: FileText, items: 8, version: 'v1.3', lastUpdated: '1 week ago' },
    { id: 3, name: 'Project Documents', type: 'Documents', icon: FolderOpen, items: 5, version: 'v3.0', lastUpdated: '3 days ago' },
    { id: 4, name: 'Media Assets', type: 'Media', icon: ImageIcon, items: 34, version: 'v2.0', lastUpdated: '5 hours ago' },
    { id: 5, name: 'Code Snippets', type: 'Code', icon: Code, items: 19, version: 'v1.2', lastUpdated: '1 day ago' },
    { id: 6, name: 'Video Tutorials', type: 'Media', icon: Video, items: 7, version: 'v1.0', lastUpdated: '2 weeks ago' },
];

const categories = ['All', 'Brand Assets', 'Templates', 'Documents', 'Media', 'Code'];

export default function ResourcesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredResources = resources.filter((r) => {
        const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || r.type === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDownload = (name: string) => {
        toast.success(`Downloading ${name}...`);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Library className="h-6 w-6 text-indigo-500" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resource Library</h2>
                    <span className="text-sm bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                        {resources.length} collections
                    </span>
                </div>
                <button
                    onClick={() => toast.success('New resource upload dialog opened.')}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/30"
                >
                    <Plus className="h-5 w-5" />
                    Add Resource
                </button>
            </div>

            {/* Search + Categories */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition outline-none"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map((resource, idx) => (
                    <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition group cursor-pointer"
                    >
                        <div className="flex items-start justify-between">
                            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition">
                                <resource.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-gray-500">
                                {resource.type}
                            </span>
                        </div>
                        <h4 className="mt-4 font-semibold text-gray-900 dark:text-white">{resource.name}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <FolderOpen className="h-3.5 w-3.5" />
                                {resource.items} items
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {resource.lastUpdated}
                            </span>
                            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                                {resource.version}
                            </span>
                        </div>
                        <button
                            onClick={() => handleDownload(resource.name)}
                            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:border-indigo-300 dark:hover:border-indigo-700 transition text-gray-600 dark:text-gray-300"
                        >
                            <Download className="h-4 w-4" />
                            Download
                        </button>
                    </motion.div>
                ))}
            </div>

            {filteredResources.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No resources found.</p>
                </div>
            )}
        </motion.div>
    );
}
