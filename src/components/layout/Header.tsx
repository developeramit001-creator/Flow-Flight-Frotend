// src/components/layout/Header.tsx
'use client';

import { Search, Bell, Moon, Sun, ChevronDown } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { useState } from 'react';

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

const notifications = [
    { id: 1, text: 'Rahul assigned you a task - Edit Video', time: '10:30 AM', read: false },
    { id: 2, text: 'Task "Shoot" is due tomorrow', time: '11:15 AM', read: false },
    { id: 3, text: 'Riya completed task "Thumbnail"', time: 'Yesterday', read: true },
    { id: 4, text: 'New comment on "Video Editing"', time: '2 days ago', read: true },
];

export function Header() {
    const { theme, toggleTheme } = useTheme();
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl px-4 md:px-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks, projects, or team..."
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleTheme}
                    className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-950">
                                <span className="sr-only">{unreadCount} notifications</span>
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden z-50 animate-fade-in-up">
                            <div className="p-3 border-b border-gray-100 dark:border-gray-800 font-semibold text-sm flex items-center justify-between">
                                <span>Notifications</span>
                                <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                                    Mark all read
                                </button>
                            </div>
                            <div className="max-h-72 overflow-y-auto">
                                {notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={cn(
                                            "px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition border-b border-gray-50 dark:border-gray-800 last:border-0",
                                            !n.read && "bg-indigo-50/50 dark:bg-indigo-950/20"
                                        )}
                                    >
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{n.text}</p>
                                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-2 py-1 transition">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                        AS
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
            </div>
        </header>
    );
}
