'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    Settings,
    Calendar,
    Clock,
    Users,
    Bell,
    Shield,
    Palette,
    Save,
    Loader2,
    Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [workingDays, setWorkingDays] = useState({
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
    });

    const [autoShift, setAutoShift] = useState(true);
    const [notifyNext, setNotifyNext] = useState(true);
    const [bufferDays, setBufferDays] = useState(2);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            toast.success('Settings saved successfully! 🎉');
        } catch (error) {
            toast.error('Failed to save settings. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleDay = (day: keyof typeof workingDays) => {
        setWorkingDays({ ...workingDays, [day]: !workingDays[day] });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto space-y-6"
        >
            <div className="flex items-center gap-3">
                <Settings className="h-6 w-6 text-indigo-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Workspace Settings</h2>
            </div>

            <div className="space-y-6">
                {/* Working Days */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="h-5 w-5 text-indigo-500" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Working Days</h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Select the days your team works. Off days will be skipped in timeline calculations.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(workingDays).map(([day, value]) => (
                            <button
                                key={day}
                                onClick={() => toggleDay(day as keyof typeof workingDays)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${value
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Auto-Shift Settings */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-5 w-5 text-indigo-500" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Auto-Shift & Dependencies</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Enable Auto-Shift
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Dependent tasks will automatically shift when a task is delayed.
                                </p>
                            </div>
                            <button
                                onClick={() => setAutoShift(!autoShift)}
                                className={`relative h-6 w-11 rounded-full transition ${autoShift ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                            >
                                <span
                                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${autoShift ? 'right-0.5' : 'left-0.5'
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Notify Next Assignee
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Send notification when a task is completed.
                                </p>
                            </div>
                            <button
                                onClick={() => setNotifyNext(!notifyNext)}
                                className={`relative h-6 w-11 rounded-full transition ${notifyNext ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                            >
                                <span
                                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${notifyNext ? 'right-0.5' : 'left-0.5'
                                        }`}
                                />
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Buffer Days <span className="text-xs text-gray-400">(Extra padding)</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="10"
                                value={bufferDays}
                                onChange={(e) => setBufferDays(parseInt(e.target.value) || 0)}
                                className="mt-1 w-24 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Adds extra days to all task estimates for safety.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    {isLoading ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </motion.div>
    );
}
