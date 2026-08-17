'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle, Users, Lock, Search, Plus } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Chat {
    id: string;
    name: string;
    type: 'project' | 'private' | 'group';
    lastMessage: string;
    time: string;
    unread: number;
    members: string[];
    online: boolean;
}

const chats: Chat[] = [
    {
        id: '1',
        name: '#YouTube-Video-25',
        type: 'project',
        lastMessage: 'Raj: Camera ready hai.',
        time: '10:30 AM',
        unread: 3,
        members: ['Amit', 'Raj', 'Riya', 'Karan', 'John'],
        online: true,
    },
    {
        id: '2',
        name: 'Raj (Private)',
        type: 'private',
        lastMessage: 'Boss: Script thoda tight karo.',
        time: '10:15 AM',
        unread: 2,
        members: ['Amit', 'Raj'],
        online: true,
    },
    {
        id: '3',
        name: 'Shoot Team',
        type: 'group',
        lastMessage: 'Riya: Thumbnail ready hai.',
        time: '9:45 AM',
        unread: 1,
        members: ['Amit', 'Raj', 'Riya'],
        online: false,
    },
    {
        id: '4',
        name: '#Company-Website',
        type: 'project',
        lastMessage: 'Karan: Design approved by client.',
        time: 'Yesterday',
        unread: 0,
        members: ['Amit', 'Karan', 'Neha'],
        online: false,
    },
];

const chatIcons = {
    project: MessageCircle,
    private: Lock,
    group: Users,
};

export default function ChatPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredChats = chats.filter((chat) =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalUnread = chats.reduce((acc, c) => acc + c.unread, 0);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">💬 Chats</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {totalUnread} unread messages across {chats.length} conversations
                    </p>
                </div>
                <button
                    onClick={() => toast.success('New chat dialog opened.')}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/30"
                >
                    <Plus className="h-5 w-5" />
                    New Chat
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition outline-none"
                />
            </div>

            {/* Chat List */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredChats.map((chat) => {
                        const Icon = chatIcons[chat.type];
                        return (
                            <Link key={chat.id} href={`/chat/${chat.id}`}>
                                <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        {/* Avatar */}
                                        <div className="relative">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                {chat.name.charAt(0)}
                                            </div>
                                            {chat.online && (
                                                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-900" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4 text-gray-400" />
                                                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                                    {chat.name}
                                                </h4>
                                                <span className="text-xs text-gray-400 ml-auto">{chat.time}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                {chat.lastMessage}
                                            </p>
                                        </div>

                                        {/* Unread */}
                                        {chat.unread > 0 && (
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                                {chat.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {filteredChats.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No chats found.</p>
                </div>
            )}
        </motion.div>
    );
}
