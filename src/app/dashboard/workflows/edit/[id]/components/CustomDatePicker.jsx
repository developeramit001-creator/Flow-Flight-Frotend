'use client';

import {
    useState,
    useRef,
    useEffect,
    useCallback,
} from 'react';

import { createPortal } from 'react-dom';

import {
    motion,
    AnimatePresence,
} from 'framer-motion';

import {
    Calendar,
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

import {
    DayPicker,
} from 'react-day-picker';

import 'react-day-picker/dist/style.css';

import {
    format,
} from 'date-fns';

// ============================================
// CONSTANTS
// ============================================

const CALENDAR_WIDTH = 320;
const VIEWPORT_GAP = 8;
const DROPDOWN_GAP = 6;

// ============================================
// CUSTOM DATE PICKER
// ============================================

const CustomDatePicker = ({
    label,
    value,
    onChange,
    placeholder = 'Select date',
    className = '',
    minDate,
    maxDate,
}) => {
    // ============================================
    // STATE
    // ============================================

    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [mounted, setMounted] = useState(false);

    // ============================================
    // REFS
    // ============================================

    const containerRef = useRef(null);
    const triggerRef = useRef(null);
    const calendarRef = useRef(null);
    const animationFrameRef = useRef(null);

    // ============================================
    // POSITION
    // ============================================

    const [dropdownPosition, setDropdownPosition] = useState({
        top: 0,
        left: 0,
        width: CALENDAR_WIDTH,
        placement: 'bottom',
    });

    // ============================================
    // SELECTED DATE
    // ============================================

    const selectedDate = value
        ? new Date(`${value}T00:00:00`)
        : undefined;

    // ✅ DEFAULT MONTH - Selected date or today
    const defaultMonth = selectedDate || new Date();

    // ============================================
    // MOUNT
    // ============================================

    useEffect(() => {
        setMounted(true);

        return () => {
            setMounted(false);
        };
    }, []);

    // ============================================
    // FORMAT DISPLAY DATE
    // ============================================

    const formatDisplayDate = (dateStr) => {
        if (!dateStr) {
            return '';
        }

        try {
            const date = new Date(`${dateStr}T00:00:00`);
            return format(date, 'MMM d, yyyy');
        } catch {
            return '';
        }
    };

    // ============================================
    // CANCEL RAF
    // ============================================

    const cancelPositionUpdate = useCallback(() => {
        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
    }, []);

    // ============================================
    // GET CALENDAR HEIGHT
    // ============================================

    const getCalendarHeight = useCallback(() => {
        if (calendarRef.current) {
            const rect = calendarRef.current.getBoundingClientRect();
            if (rect.height > 0) {
                return rect.height;
            }
        }
        return 390;
    }, []);

    // ============================================
    // UPDATE POSITION
    // ============================================

    const updateDropdownPosition = useCallback(() => {
        if (!triggerRef.current) {
            return;
        }

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const calendarHeight = getCalendarHeight();

        const calendarWidth = Math.min(
            CALENDAR_WIDTH,
            window.innerWidth - VIEWPORT_GAP * 2
        );

        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        const shouldOpenTop = spaceBelow < calendarHeight + DROPDOWN_GAP && spaceAbove > calendarHeight;

        let top;

        if (shouldOpenTop) {
            top = triggerRect.top - calendarHeight - DROPDOWN_GAP;
        } else {
            top = triggerRect.bottom + DROPDOWN_GAP;
        }

        let left = triggerRect.left;

        if (left + calendarWidth > window.innerWidth - VIEWPORT_GAP) {
            left = window.innerWidth - calendarWidth - VIEWPORT_GAP;
        }

        if (left < VIEWPORT_GAP) {
            left = VIEWPORT_GAP;
        }

        setDropdownPosition({
            top,
            left,
            width: calendarWidth,
            placement: shouldOpenTop ? 'top' : 'bottom',
        });
    }, [getCalendarHeight]);

    // ============================================
    // SCHEDULE POSITION UPDATE
    // ============================================

    const schedulePositionUpdate = useCallback(() => {
        if (animationFrameRef.current !== null) {
            return;
        }

        animationFrameRef.current = requestAnimationFrame(() => {
            animationFrameRef.current = null;
            updateDropdownPosition();
        });
    }, [updateDropdownPosition]);

    // ============================================
    // POSITION + SCROLL
    // ============================================

    useEffect(() => {
        if (!isOpen) {
            cancelPositionUpdate();
            return;
        }

        requestAnimationFrame(() => {
            updateDropdownPosition();
            requestAnimationFrame(() => {
                updateDropdownPosition();
            });
        });

        const handleScroll = (event) => {
            if (calendarRef.current && calendarRef.current.contains(event.target)) {
                return;
            }
            schedulePositionUpdate();
        };

        const handleResize = () => {
            schedulePositionUpdate();
        };

        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleResize);
            cancelPositionUpdate();
        };
    }, [isOpen, updateDropdownPosition, schedulePositionUpdate, cancelPositionUpdate]);

    // ============================================
    // OUTSIDE CLICK
    // ============================================

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleClickOutside = (event) => {
            const clickedTrigger = containerRef.current?.contains(event.target);
            const clickedCalendar = calendarRef.current?.contains(event.target);

            if (!clickedTrigger && !clickedCalendar) {
                setIsOpen(false);
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // ============================================
    // ESCAPE
    // ============================================

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                setIsFocused(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    // ============================================
    // TOGGLE
    // ============================================

    const toggleOpen = () => {
        setIsOpen((previous) => {
            const next = !previous;
            setIsFocused(next);
            return next;
        });
    };

    // ============================================
    // DATE SELECT
    // ============================================

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

    // ============================================
    // CLEAR
    // ============================================

    const handleClear = () => {
        onChange('');
        setIsOpen(false);
        setIsFocused(false);
    };

    // ============================================
    // TODAY
    // ============================================

    const handleToday = () => {
        const today = new Date();
        const todayString = format(today, 'yyyy-MM-dd');

        if (minDate && todayString < minDate) {
            return;
        }

        if (maxDate && todayString > maxDate) {
            return;
        }

        handleDateSelect(today);
    };

    // ============================================
    // CALENDAR PORTAL
    // ============================================

    const calendarContent = mounted && isOpen
        ? createPortal(
            <AnimatePresence>
                <motion.div
                    ref={calendarRef}
                    initial={{
                        opacity: 0,
                        y: dropdownPosition.placement === 'top' ? 8 : -8,
                        scale: 0.97,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                    }}
                    exit={{
                        opacity: 0,
                        y: dropdownPosition.placement === 'top' ? 8 : -8,
                        scale: 0.97,
                    }}
                    transition={{
                        duration: 0.15,
                        ease: 'easeOut',
                    }}
                    style={{
                        position: 'fixed',
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                        width: `${dropdownPosition.width}px`,
                        maxWidth: 'calc(100vw - 16px)',
                        zIndex: 999999,
                    }}
                    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl p-3"
                >
                    {/* ====================================
                        CALENDAR
                    ==================================== */}

                    <div className="w-full overflow-hidden">
                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            defaultMonth={defaultMonth}  // ✅ FIX: Selected date or today
                            disabled={{
                                before: minDate
                                    ? new Date(`${minDate}T00:00:00`)
                                    : undefined,
                                after: maxDate
                                    ? new Date(`${maxDate}T00:00:00`)
                                    : undefined,
                            }}
                            className="!bg-transparent w-full !m-0"
                            styles={{
                                root: {
                                    width: '100%',
                                    background: 'transparent',
                                    margin: '0',
                                },
                                months: {
                                    width: '100%',
                                },
                                month: {
                                    width: '100%',
                                },
                                month_grid: {
                                    width: '100%',
                                    tableLayout: 'fixed',
                                },
                                weekdays: {
                                    width: '100%',
                                },
                                week: {
                                    width: '100%',
                                },
                                day: {
                                    width: '100%',
                                    height: '38px',
                                    borderRadius: '8px',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer',
                                },
                                day_button: {
                                    width: '100%',
                                    height: '38px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
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
                            components={{
                                Chevron: ({ orientation }) =>
                                    orientation === 'left' ? (
                                        <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    ),
                            }}
                        />
                    </div>

                    {/* ====================================
                        FOOTER
                    ==================================== */}

                    <div className="flex justify-center gap-6 mt-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={handleToday}
                            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline transition"
                        >
                            Today
                        </button>

                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition"
                        >
                            Clear
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>,
            document.body
        )
        : null;

    // ============================================
    // RENDER
    // ============================================

    return (
        <div
            className={`relative ${className}`}
            ref={containerRef}
        >
            {/* ========================================
                LABEL
            ======================================== */}

            {label && (
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {label}
                </label>
            )}

            {/* ========================================
                TRIGGER
            ======================================== */}

            <div ref={triggerRef}>
                <motion.div
                    className={`
                        relative
                        rounded-xl
                        border
                        transition-all
                        duration-200
                        cursor-pointer

                        ${isFocused || isOpen
                            ? `
                                border-indigo-500
                                ring-2
                                ring-indigo-500/20
                              `
                            : `
                                border-gray-200
                                dark:border-gray-700
                                hover:border-indigo-300
                                dark:hover:border-indigo-600
                              `
                        }

                        bg-white
                        dark:bg-gray-900
                    `}
                    whileTap={{
                        scale: 0.99,
                    }}
                    onClick={toggleOpen}
                    tabIndex={0}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            toggleOpen();
                        }

                        if (event.key === 'Escape') {
                            setIsOpen(false);
                            setIsFocused(false);
                        }
                    }}
                >
                    <div className="flex items-center px-4 py-2.5">
                        {/* CALENDAR ICON */}

                        <Calendar className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />

                        {/* DATE */}

                        <span
                            className={`
                                text-sm
                                truncate

                                ${value
                                    ? `
                                        text-gray-900
                                        dark:text-white
                                      `
                                    : `
                                        text-gray-400
                                        dark:text-gray-500
                                      `
                                }
                            `}
                        >
                            {value
                                ? formatDisplayDate(value)
                                : placeholder}
                        </span>

                        {/* CLEAR */}

                        {value && (
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleClear();
                                }}
                                className="ml-auto text-gray-400 hover:text-red-500 transition p-0.5 rounded"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* ========================================
                PORTAL CALENDAR
            ======================================== */}

            {calendarContent}
        </div>
    );
};

export default CustomDatePicker;
