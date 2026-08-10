'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Send,
    Paperclip,
    Users,
    Pin,
    MoreVertical,
    Check,
    CheckCheck,
    Mic,
    Smile,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Message {
    id: number;
    sender: string;
    text: string;
    time: string;
    isOwn: boolean;
    seen: boolean;
    attachments?: string[];
}

const messages: Message[] = [
    { id: 1, sender: 'Raj', text: 'Camera ready hai. Drive link check karo.', time: '10:30 AM', isOwn: false, seen: true },
    { id: 2, sender: 'Amit', text: 'Great! I will check and update the script accordingly.', time: '10:32 AM', isOwn: true, seen: true },
    { id: 3, sender: 'Riya', text: "Don't forget to add captions in the video.", time: '10:35 AM', isOwn: false, seen: true },
    { id: 4, sender: 'Karan', text: 'Thumbnail concept attached. 📎 thumb_v1.png', time: '10:36 AM', isOwn: false, seen: false },
];

const teamMembers = ['Amit', 'Raj', 'Riya', 'Karan', 'John'];

export default function ChatDetailPage() {
    const params = useParams();
    const projectId = params.projectId;
    const [newMessage, setNewMessage] = useState('');
    const [showMentions, setShowMentions] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [showSelective, setShowSelective] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const handleSend = () => {
        if (!newMessage.trim()) {
            toast.error('Please enter a message.');
            return;
        }

        toast.success(selectedMembers.length > 0
            ? `Message sent to ${selectedMembers.join(', ')}`
            : 'Message sent to everyone!');
        setNewMessage('');
        setSelectedMembers([]);
        setShowSelective(false);
    };

    const handleMention = () => {
        setShowMentions(!showMentions);
    };

    const selectMemberForMention = (member: string) => {
        setNewMessage(newMessage + `@${member} `);
        setShowMentions(false);
    };

    const toggleMemberSelection = (member: string) => {
        setSelectedMembers(prev =>
            prev.includes(member) ? prev.filter(m => m !== member) : [...prev, member]
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full max-w-4xl mx-auto"
        >
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-900 rounded-t-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        Y
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">#YouTube-Video-25</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {teamMembers.length} members • 3 online
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                        <Pin className="h-5 w-5 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                        <Users className="h-5 w-5 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-950 p-4 overflow-y-auto space-y-3 min-h-[400px]">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] p-3 rounded-2xl ${msg.isOwn
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none shadow-sm'
                                }`}
                        >
                            {!msg.isOwn && (
                                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                                    {msg.sender}
                                </p>
                            )}
                            <p className="text-sm">{msg.text}</p>
                            <div className={`flex items-center gap-1 mt-1 text-xs ${msg.isOwn ? 'text-indigo-200' : 'text-gray-400'}`}>
                                <span>{msg.time}</span>
                                {msg.isOwn && (
                                    msg.seen ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Selective Chat Indicator */}
            {selectedMembers.length > 0 && (
                <div className="bg-indigo-50 dark:bg-indigo-950/30 px-4 py-2 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm text-indigo-700 dark:text-indigo-300">
                    <span>🔒 Sending to: </span>
                    {selectedMembers.map(m => (
                        <span key={m} className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 rounded-full text-xs">
                            {m}
                        </span>
                    ))}
                    <button
                        onClick={() => setSelectedMembers([])}
                        className="ml-auto text-xs hover:underline"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Message Input */}
            <div className="bg-white dark:bg-gray-900 rounded-b-xl border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowSelective(!showSelective)}
                        className={`p-2 rounded-lg transition ${showSelective ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`}
                    >
                        <Users className="h-5 w-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition text-gray-500">
                        <Paperclip className="h-5 w-5" />
                    </button>
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={selectedMembers.length > 0
                                ? `Message to ${selectedMembers.join(', ')}...`
                                : 'Type a message... (use @ to mention)'}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                        />

                        {/* Mentions Dropdown */}
                        {showMentions && (
                            <div className="absolute bottom-full left-0 mb-1 w-48 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                                {teamMembers.map(m => (
                                    <button
                                        key={m}
                                        onClick={() => selectMemberForMention(m)}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-2"
                                    >
                                        <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-xs font-bold">
                                            {m[0]}
                                        </div>
                                        {m}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleMention}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition text-gray-500"
                    >
                        @
                    </button>
                    <button
                        onClick={handleSend}
                        className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/30"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>

                {/* Selective Members */}
                {showSelective && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Select recipients:</p>
                        <div className="flex flex-wrap gap-2">
                            {teamMembers.map(m => (
                                <button
                                    key={m}
                                    onClick={() => toggleMemberSelection(m)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${selectedMembers.includes(m)
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowSelective(false)}
                            className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
