// src/app/page.jsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Sparkles,
    Zap,
    Users,
    Briefcase,
    CheckCircle,
    Moon,
    Sun,
    Shield,
    Rocket
} from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

export default function HomePage() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/50 transition-all duration-500">
            {/* Navbar */}
            <nav className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex justify-between items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                >
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <span className="text-lg font-bold text-white">FP</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        FlowPilot
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 md:gap-4"
                >
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-5 w-5 text-yellow-400" />
                        ) : (
                            <Moon className="h-5 w-5 text-gray-600" />
                        )}
                    </button>

                    <Link
                        href="/login"
                        className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/signup"
                        className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200"
                    >
                        Get Started
                    </Link>
                </motion.div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6 border border-indigo-200 dark:border-indigo-800">
                        <Sparkles className="h-4 w-4" />
                        Smart Project Management
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        Your Workflow,{' '}
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Our Engine
                        </span>
                    </h1>

                    <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        FlowPilot is a smart project management tool that helps individuals,
                        small teams, and large companies manage their work using ready-made
                        workflows or custom workflows.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            href="/signup"
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 group"
                        >
                            Get Started Free
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/login"
                            className="px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:border-indigo-500 dark:hover:border-indigo-400"
                        >
                            Sign In
                        </Link>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5">
                            <Shield className="h-4 w-4 text-indigo-500" />
                            Secure & Private
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Rocket className="h-4 w-4 text-indigo-500" />
                            100+ Workflows
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-indigo-500" />
                            Team Ready
                        </span>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {[
                        {
                            icon: Zap,
                            title: '100+ Workflows',
                            desc: 'Ready-made templates for YouTube, SEO, Web Dev, Marketing, and more.',
                            color: 'from-indigo-500 to-blue-500'
                        },
                        {
                            icon: Users,
                            title: 'Team Collaboration',
                            desc: 'Assign tasks, track progress, chat in real-time, and manage workload.',
                            color: 'from-purple-500 to-pink-500'
                        },
                        {
                            icon: Briefcase,
                            title: 'Client Portal',
                            desc: 'Share progress with clients securely. No internal chaos, only approved data.',
                            color: 'from-emerald-500 to-teal-500'
                        }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * (idx + 1) }}
                            className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-8 rounded-2xl border border-white/20 dark:border-gray-800/50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-default"
                        >
                            <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
