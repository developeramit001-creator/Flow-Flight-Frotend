// src/app/page.jsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Users, Briefcase, CheckCircle } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
            {/* Navbar */}
            <nav className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                        <span className="text-sm font-bold text-white">FP</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        FlowPilot
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/signup"
                        className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
                        <Sparkles className="h-4 w-4" />
                        Workflow Engine
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        Your Workflow,{' '}
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Our Engine
                        </span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        FlowPilot is a smart project management tool that helps individuals,
                        small teams, and large companies manage their work using ready-made
                        workflows or custom workflows.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            href="/signup"
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                        >
                            Get Started Free
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            href="/login"
                            className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            Sign In
                        </Link>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-6 rounded-2xl border border-white/20 dark:border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center mx-auto">
                            <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">100+ Workflows</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                            Ready-made templates for YouTube, SEO, Web Dev, Marketing, and more.
                        </p>
                    </div>

                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-6 rounded-2xl border border-white/20 dark:border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center mx-auto">
                            <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Team Collaboration</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                            Assign tasks, track progress, chat in real-time, and manage workload.
                        </p>
                    </div>

                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-6 rounded-2xl border border-white/20 dark:border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center mx-auto">
                            <Briefcase className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Client Portal</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                            Share progress with clients securely. No internal chaos, only approved data.
                        </p>
                    </div>
                </motion.div>

                {/* Who Can Use */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-8 rounded-2xl border border-white/20 dark:border-gray-800/50 shadow-xl"
                >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Who Can Use FlowPilot?</h3>
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-indigo-600" />
                            Freelancers
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-indigo-600" />
                            YouTubers
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-indigo-600" />
                            Marketing Agencies
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-indigo-600" />
                            Web Dev Teams
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-indigo-600" />
                            Startups
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-indigo-600" />
                            Large Companies
                        </div>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-12"
                >
                    <Link
                        href="/signup"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200"
                    >
                        Start Your Free Trial
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        No credit card required. Free forever for small teams.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
