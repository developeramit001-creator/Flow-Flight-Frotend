'use client';

import { motion } from 'framer-motion';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentProjects } from '@/components/dashboard/RecentProjects';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import Link from 'next/link';
export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Stats */}
            <StatsCards />

            {/* Projects + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentProjects />
                </div>
                <div className="lg:col-span-1">
                    <ActivityFeed />
                </div>
            </div>
        </div>
    );
}
