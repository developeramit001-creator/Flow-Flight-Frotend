// src/app/dashboard/layout.jsx
'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({ children }) {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* ✅ Left Sidebar */}
            <Sidebar />

            {/* ✅ Right Content */}
            <div className="flex-1 flex flex-col overflow-hidden ml-64">
                {/* ✅ Top Header */}
                <Header />

                {/* ✅ Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
