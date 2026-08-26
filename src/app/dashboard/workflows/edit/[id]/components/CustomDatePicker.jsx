// src/app/dashboard/workflows/edit/[id]/components/CustomDatePicker.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';

const CustomDatePicker = ({
    label,
    value,
    onChange,
    placeholder = 'Select date',
    className = '',
    minDate,
    maxDate,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef(null);

    const selectedDate = value ? new Date(value) : undefined;

    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return format(date, 'MMM d, yyyy');
    };

    const handleDateSelect = (date) => {
        if (date) {
            const formatted = format(date, 'yyyy-MM-dd');
            onChange(formatted);
        } else {
            onChange('');
        }
        setIsOpen(false);
        setIsFocused(false);
    };

    const handleClear = () => {
        onChange('');
        setIsOpen(false);
    };

    // ✅ Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        setIsFocused(!isOpen);
    };

    return (
        // ✅ FIX 1: relative class add karo
        <div className={`relative ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {label}
                </label>
            )}

            {/* Trigger */}
            <motion.div
                className={`relative rounded-xl border transition-all duration-200 cursor-pointer ${isFocused || isOpen
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                    } bg-white dark:bg-gray-900`}
                whileTap={{ scale: 0.99 }}
                onClick={toggleOpen}
                tabIndex={0}
            >
                <div className="flex items-center px-4 py-2.5">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span className={`text-sm ${value ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                        {value ? formatDisplayDate(value) : placeholder}
                    </span>
                    {value && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClear();
                            }}
                            className="ml-auto text-gray-400 hover:text-red-500 transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </motion.div>

            {/* ✅ FIX 2: Calendar dropdown position aur z-index fix */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        // ✅ z-index high, position absolute left-0 top-full
                        className="absolute left-0 top-full z-[9999] mt-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl p-3 min-w-[280px] w-full sm:w-[320px]"
                    >
                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            disabled={{
                                before: minDate ? new Date(minDate) : undefined,
                                after: maxDate ? new Date(maxDate) : undefined,
                            }}
                            className="!bg-transparent"
                            styles={{
                                root: {
                                    background: 'transparent',
                                },
                                day: {
                                    borderRadius: '8px',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer',
                                },
                                day_selected: {
                                    backgroundColor: '#6366F1',
                                    color: 'white',
                                    fontWeight: '600',
                                },
                                day_today: {
                                    backgroundColor: '#EEF2FF',
                                    color: '#4F46E5',
                                    fontWeight: '600',
                                },
                                day_hidden: {
                                    visibility: 'hidden',
                                },
                            }}
                            // ✅ FIX 3: react-day-picker v10 mein Chevron use karo
                            components={{
                                Chevron: ({ orientation }) =>
                                    orientation === 'left' ? (
                                        <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    ),
                            }}
                        />
                        <div className="flex justify-center gap-4 mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                            <button
                                onClick={() => {
                                    const today = new Date();
                                    handleDateSelect(today);
                                }}
                                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline transition"
                            >
                                Today
                            </button>
                            <button
                                onClick={handleClear}
                                className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition"
                            >
                                Clear
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomDatePicker;
