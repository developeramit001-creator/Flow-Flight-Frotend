'use client';

import { useState, useEffect, useCallback } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import {
    GripVertical,
    ChevronUp,
    ChevronDown,
    Trash2,
    UserCheck,
    UserPlus,
    X,
    Link2,
    Clock,
    User,
    Plus,
    ExternalLink,
    Check,
    Paperclip,
    Calendar,
} from 'lucide-react';

import CustomDatePicker from './CustomDatePicker';
import CustomDropdown from '@/components/CustomDropdwon/CustomDropdown';

// =====================================================
// ATTACHMENT TYPES
// =====================================================

const ATTACHMENT_TYPES = [
    { value: 'google-drive', label: 'Google Drive', icon: '📁' },
    { value: 'dropbox', label: 'Dropbox', icon: '📁' },
    { value: 'figma', label: 'Figma', icon: '🎨' },
    { value: 'youtube', label: 'YouTube', icon: '▶️' },
    { value: 'loom', label: 'Loom', icon: '🎬' },
    { value: 'other', label: 'Other', icon: '🔗' },
];

const getAttachmentType = (type) => {
    return (
        ATTACHMENT_TYPES.find((item) => item.value === type) ||
        ATTACHMENT_TYPES[5]
    );
};

// =====================================================
// STEP CARD
// =====================================================

const StepCard = ({
    step = {},
    index,
    isAssigned,
    assigneeName,
    onUpdateStep,
    onRemoveStep,
    onOpenAssignModal,
    onRemoveAssignment,
    stepDeadline,
    onUpdateDeadline,
    onMoveStep,
    stepAttachments,
    onAddStepAttachment,
    onRemoveStepAttachment,
    isFirst,
    isLast,
    projectStartDate,
    projectEndDate,
}) => {
    const [isExpanded, setIsExpanded] = useState(index < 2);

    const [showAddAttachment, setShowAddAttachment] = useState(false);

    const [newAttachment, setNewAttachment] = useState({
        name: '',
        url: '',
        type: 'other',
    });

    const [isAddingAttachment, setIsAddingAttachment] = useState(false);

    // =====================================================
    // LOCAL STEP DATES STATE
    // =====================================================

    const [stepStartDate, setStepStartDate] = useState(
        step?.startDate || ''
    );

    const [stepEndDate, setStepEndDate] = useState(
        step?.endDate || ''
    );

    const [stepDays, setStepDays] = useState(
        Math.max(1, Number(step?.days) || 1)
    );

    const [endDateError, setEndDateError] = useState('');

    console.log(step, 'step=====');
    console.log(projectStartDate, 'projectStartDate');
    console.log(projectEndDate, 'projectEndDate');
    console.log(stepDays, 'stepDays');
    console.log(stepEndDate, 'stepEndDate');

    // =====================================================
    // SYNC WITH PARENT STATE
    // =====================================================

    useEffect(() => {
        setStepStartDate(step?.startDate || '');
    }, [step?.startDate]);

    useEffect(() => {
        setStepEndDate(step?.endDate || '');
    }, [step?.endDate]);

    useEffect(() => {
        setStepDays(
            Math.max(1, Number(step?.days) || 1)
        );
    }, [step?.days]);

    // =====================================================
    // PROJECT TIMELINE VALIDATION
    // =====================================================

    useEffect(() => {
        if (!stepStartDate) {
            setEndDateError('');
            return;
        }

        if (
            projectStartDate &&
            stepStartDate < projectStartDate
        ) {
            setEndDateError(
                `Step start date cannot be before the project start date (${projectStartDate}).`
            );
            return;
        }

        if (
            projectEndDate &&
            stepStartDate > projectEndDate
        ) {
            setEndDateError(
                `Step start date cannot be after the project end date (${projectEndDate}).`
            );
            return;
        }

        if (
            stepEndDate &&
            stepEndDate < stepStartDate
        ) {
            setEndDateError(
                'Step end date cannot be before the step start date.'
            );
            return;
        }

        if (
            projectEndDate &&
            stepEndDate &&
            stepEndDate > projectEndDate
        ) {
            setEndDateError(
                `Step end date (${stepEndDate}) is after the project end date (${projectEndDate}). Please reduce the duration or choose an earlier start date.`
            );
            return;
        }

        const days = Math.max(
            1,
            Number(stepDays) || 1
        );

        const calculatedEnd = calculateEndDate(
            stepStartDate,
            days
        );

        if (
            projectEndDate &&
            calculatedEnd &&
            calculatedEnd > projectEndDate
        ) {
            setEndDateError(
                `This ${days}-day step ends on ${calculatedEnd}, which is after the project end date (${projectEndDate}). Please reduce the duration or choose an earlier start date.`
            );
            return;
        }

        setEndDateError('');
    }, [
        stepStartDate,
        stepEndDate,
        stepDays,
        projectStartDate,
        projectEndDate,
    ]);

    // =====================================================
    // DATE HELPERS
    // =====================================================

    const getDateDifference = (startDate, endDate) => {
        if (!startDate || !endDate) return 0;

        const start = new Date(`${startDate}T00:00:00`);
        const end = new Date(`${endDate}T00:00:00`);

        return Math.ceil(
            (end - start) /
            (1000 * 60 * 60 * 24)
        );
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // =====================================================
    // CALCULATE END DATE FROM START + DURATION
    // Inclusive duration:
    // 1 day  = start + 0
    // 2 days = start + 1
    // 3 days = start + 2
    // =====================================================

    const calculateEndDate = (startDate, days) => {
        if (!startDate) return '';

        const start = new Date(
            `${startDate}T00:00:00`
        );

        const end = new Date(start);

        end.setDate(
            end.getDate() + (days - 1)
        );

        return formatDate(end);
    };

    // =====================================================
    // VALIDATE STEP DATES
    // =====================================================

    const validateStepDates = (
        startDate,
        endDate,
        days = stepDays
    ) => {
        if (!startDate) {
            setEndDateError('');
            return true;
        }

        // ---------------------------------------------
        // Start cannot be before project start
        // ---------------------------------------------

        if (
            projectStartDate &&
            startDate < projectStartDate
        ) {
            setEndDateError(
                `Start date cannot be before project start date (${projectStartDate}).`
            );

            return false;
        }

        // ---------------------------------------------
        // Start cannot be after project end
        // ---------------------------------------------

        if (
            projectEndDate &&
            startDate > projectEndDate
        ) {
            setEndDateError(
                `Start date cannot be after project end date (${projectEndDate}).`
            );

            return false;
        }

        if (!endDate) {
            setEndDateError('');
            return true;
        }

        // ---------------------------------------------
        // End cannot be before start
        // ---------------------------------------------

        const diffDays = getDateDifference(
            startDate,
            endDate
        );

        if (diffDays < 0) {
            setEndDateError(
                'End date cannot be before start date.'
            );

            return false;
        }

        // ---------------------------------------------
        // End cannot be after project end
        // ---------------------------------------------

        if (
            projectEndDate &&
            endDate > projectEndDate
        ) {
            setEndDateError(
                `End date cannot be after project end date (${projectEndDate}).`
            );

            return false;
        }

        // ---------------------------------------------
        // Duration must fit inside project timeline
        // ---------------------------------------------

        if (
            projectEndDate &&
            startDate
        ) {
            const calculatedEnd = calculateEndDate(
                startDate,
                days
            );

            if (
                calculatedEnd &&
                calculatedEnd > projectEndDate
            ) {
                setEndDateError(
                    `This ${days}-day step cannot fit within the project timeline ending ${projectEndDate}.`
                );

                return false;
            }
        }

        setEndDateError('');
        return true;
    };

    // =====================================================
    // START DATE CHANGE
    // =====================================================

    const handleStartDateChange = useCallback(
        (value) => {
            console.log(
                `📌 Step ${index}: Start date changed to ${value}`
            );

            if (!value) {
                setStepStartDate('');
                setStepEndDate('');

                onUpdateStep(
                    index,
                    'startDate',
                    ''
                );

                onUpdateStep(
                    index,
                    'endDate',
                    ''
                );

                setEndDateError('');

                return;
            }

            // ---------------------------------------------
            // Project boundary check
            // ---------------------------------------------

            if (
                projectStartDate &&
                value < projectStartDate
            ) {
                setEndDateError(
                    `Start date cannot be before project start date (${projectStartDate}).`
                );

                return;
            }

            if (
                projectEndDate &&
                value > projectEndDate
            ) {
                setEndDateError(
                    `Start date cannot be after project end date (${projectEndDate}).`
                );

                return;
            }

            // ---------------------------------------------
            // IMPORTANT:
            // Preserve current duration.
            //
            // Example:
            // 10 days
            // 03 Sep -> 12 Sep
            //
            // Change start:
            // 05 Sep -> 14 Sep
            //
            // Duration stays 10 days.
            // ---------------------------------------------

            const days = Math.max(
                1,
                Number(stepDays) || 1
            );

            const newEndDate =
                calculateEndDate(
                    value,
                    days
                );

            // ---------------------------------------------
            // New end must stay inside project
            // ---------------------------------------------

            if (
                projectEndDate &&
                newEndDate > projectEndDate
            ) {
                setEndDateError(
                    `This ${days}-day step cannot fit within the project timeline ending ${projectEndDate}.`
                );

                return;
            }

            setStepStartDate(value);
            setStepEndDate(newEndDate);

            onUpdateStep(
                index,
                'startDate',
                value
            );

            onUpdateStep(
                index,
                'endDate',
                newEndDate
            );

            setEndDateError('');

            console.log(
                `📊 Step ${index}: Duration preserved = ${days}`
            );

            console.log(
                `📌 Step ${index}: New end date = ${newEndDate}`
            );
        },
        [
            stepDays,
            projectStartDate,
            projectEndDate,
            index,
            onUpdateStep,
        ]
    );

    // =====================================================
    // END DATE CHANGE
    // =====================================================

    const handleEndDateChange = useCallback(
        (value) => {
            console.log(
                `📌 Step ${index}: End date changed to ${value}`
            );

            if (!value) {
                setStepEndDate('');

                onUpdateStep(
                    index,
                    'endDate',
                    ''
                );

                setEndDateError('');

                return;
            }

            if (!stepStartDate) {
                setStepEndDate(value);

                onUpdateStep(
                    index,
                    'endDate',
                    value
                );

                setEndDateError('');

                return;
            }

            // ---------------------------------------------
            // End cannot be before start
            // ---------------------------------------------

            const diffDays = getDateDifference(
                stepStartDate,
                value
            );

            if (diffDays < 0) {
                setEndDateError(
                    'End date cannot be before start date.'
                );

                return;
            }

            // ---------------------------------------------
            // End cannot be after project end
            // ---------------------------------------------

            if (
                projectEndDate &&
                value > projectEndDate
            ) {
                setEndDateError(
                    `End date cannot be after project end date (${projectEndDate}).`
                );

                return;
            }

            // ---------------------------------------------
            // Inclusive duration
            //
            // 03 -> 03 = 1
            // 03 -> 04 = 2
            // 03 -> 05 = 3
            // ---------------------------------------------

            const validDays =
                Math.max(1, diffDays + 1);

            setStepEndDate(value);
            setStepDays(validDays);

            onUpdateStep(
                index,
                'endDate',
                value
            );

            onUpdateStep(
                index,
                'days',
                validDays
            );

            setEndDateError('');

            console.log(
                `📊 Step ${index}: Days recalculated = ${validDays}`
            );
        },
        [
            stepStartDate,
            projectEndDate,
            index,
            onUpdateStep,
        ]
    );

    // =====================================================
    // DAYS CHANGE
    // =====================================================

    const handleDaysChange = useCallback(
        (newDays) => {
            const days = Math.max(
                1,
                Number(newDays) || 1
            );

            console.log(
                `📊 Step ${index}: Days changed to ${days}`
            );

            // ---------------------------------------------
            // Calculate new end from current start
            // ---------------------------------------------

            if (stepStartDate) {
                const newEndDate =
                    calculateEndDate(
                        stepStartDate,
                        days
                    );

                // -----------------------------------------
                // Do not allow duration outside project
                // -----------------------------------------

                if (
                    projectEndDate &&
                    newEndDate > projectEndDate
                ) {
                    setEndDateError(
                        `This ${days}-day duration exceeds the project end date (${projectEndDate}).`
                    );

                    return;
                }

                setStepDays(days);
                setStepEndDate(newEndDate);

                onUpdateStep(
                    index,
                    'days',
                    days
                );

                onUpdateStep(
                    index,
                    'endDate',
                    newEndDate
                );

                setEndDateError('');

                console.log(
                    `📌 Step ${index}: New end date = ${newEndDate}`
                );

                return;
            }

            // ---------------------------------------------
            // If start date does not exist yet,
            // only update duration.
            // ---------------------------------------------

            setStepDays(days);

            onUpdateStep(
                index,
                'days',
                days
            );

            setEndDateError('');
        },
        [
            stepStartDate,
            projectEndDate,
            index,
            onUpdateStep,
        ]
    );

    // =====================================================
    // ADD ATTACHMENT
    // =====================================================

    const handleAddAttachment = async () => {
        const name =
            newAttachment.name.trim();

        let url =
            newAttachment.url.trim();

        if (!name || !url) return;

        if (
            !url.startsWith('http://') &&
            !url.startsWith('https://')
        ) {
            url = `https://${url}`;
        }

        try {
            new URL(url);
        } catch {
            return;
        }

        setIsAddingAttachment(true);

        await new Promise((resolve) =>
            setTimeout(resolve, 180)
        );

        onAddStepAttachment(index, {
            name,
            url,
            type: newAttachment.type,
        });

        setNewAttachment({
            name: '',
            url: '',
            type: 'other',
        });

        setIsAddingAttachment(false);
        setShowAddAttachment(false);
    };

    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancelAttachment = () => {
        setNewAttachment({
            name: '',
            url: '',
            type: 'other',
        });

        setShowAddAttachment(false);
    };

    // =====================================================
    // DAYS - Local state used
    // =====================================================

    const currentDays =
        Math.max(1, stepDays);

    const decreaseDays = () => {
        if (currentDays <= 1) return;

        handleDaysChange(
            currentDays - 1
        );
    };

    const increaseDays = () => {
        handleDaysChange(
            currentDays + 1
        );
    };

    // =====================================================
    // TODAY'S DATE
    // =====================================================

    const todayDate = new Date();
    const today = formatDate(todayDate);

    const minDate =
        projectStartDate || today;

    // ---------------------------------------------
    // IMPORTANT:
    // Start date maximum must account for duration.
    //
    // Example:
    // Project: 10 Aug -> 20 Aug
    // Step: 10 days
    //
    // Latest valid start = 11 Aug
    // because:
    // 11 Aug + 9 = 20 Aug
    // ---------------------------------------------

    let startMaxDate =
        projectEndDate || undefined;

    if (
        projectEndDate &&
        stepDays > 0
    ) {
        const latestStart =
            new Date(
                `${projectEndDate}T00:00:00`
            );

        latestStart.setDate(
            latestStart.getDate() -
            (Math.max(1, stepDays) - 1)
        );

        startMaxDate =
            formatDate(latestStart);
    }

    const endMaxDate =
        projectEndDate || undefined;

    return (
        <motion.div
            layout
            initial={{
                opacity: 0,
                y: 8,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                x: -20,
            }}
            transition={{
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-visible hover:shadow-md transition-shadow duration-300"
        >
            {/* HEADER */}

            <div
                className="flex items-center gap-2 p-3 cursor-pointer rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                onClick={() =>
                    setIsExpanded(
                        !isExpanded
                    )
                }
            >
                {/* DRAG */}

                <motion.div
                    whileHover={{
                        scale: 1.05,
                    }}
                    className="cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400"
                    onClick={(e) =>
                        e.stopPropagation()
                    }
                >
                    <GripVertical className="w-4 h-4" />
                </motion.div>

                {/* NUMBER */}

                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full min-w-[28px] text-center">
                    {String(index + 1).padStart(
                        2,
                        '0'
                    )}
                </span>

                {/* STEP NAME */}

                <input
                    type="text"
                    value={step.name || ''}
                    onChange={(e) =>
                        onUpdateStep(
                            index,
                            'name',
                            e.target.value
                        )
                    }
                    onClick={(e) =>
                        e.stopPropagation()
                    }
                    placeholder="Step name..."
                    className="flex-1 min-w-0 bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-indigo-500 outline-none px-1 py-0.5 text-sm font-medium text-gray-900 dark:text-white"
                />

                {/* STATUS */}

                <span
                    className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${isAssigned
                        ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}
                >
                    {isAssigned
                        ? 'Assigned'
                        : 'Pending'}
                </span>

                {/* ACTIONS */}

                <div
                    className="flex items-center gap-1"
                    onClick={(e) =>
                        e.stopPropagation()
                    }
                >
                    <motion.button
                        type="button"
                        disabled={isFirst}
                        onClick={() =>
                            onMoveStep(
                                index,
                                'up'
                            )
                        }
                        whileHover={
                            !isFirst
                                ? {
                                    scale: 1.08,
                                }
                                : {}
                        }
                        whileTap={
                            !isFirst
                                ? {
                                    scale: 0.85,
                                }
                                : {}
                        }
                        className={`p-1 rounded-lg ${isFirst
                            ? 'text-gray-200 dark:text-gray-700'
                            : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-800'
                            }`}
                    >
                        <ChevronUp className="w-3.5 h-3.5" />
                    </motion.button>

                    <motion.button
                        type="button"
                        disabled={isLast}
                        onClick={() =>
                            onMoveStep(
                                index,
                                'down'
                            )
                        }
                        whileHover={
                            !isLast
                                ? {
                                    scale: 1.08,
                                }
                                : {}
                        }
                        whileTap={
                            !isLast
                                ? {
                                    scale: 0.85,
                                }
                                : {}
                        }
                        className={`p-1 rounded-lg ${isLast
                            ? 'text-gray-200 dark:text-gray-700'
                            : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-800'
                            }`}
                    >
                        <ChevronDown className="w-3.5 h-3.5" />
                    </motion.button>

                    <motion.button
                        type="button"
                        onClick={() =>
                            setIsExpanded(
                                !isExpanded
                            )
                        }
                        whileHover={{
                            scale: 1.08,
                        }}
                        whileTap={{
                            scale: 0.85,
                        }}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-800"
                    >
                        <motion.span
                            animate={{
                                rotate:
                                    isExpanded
                                        ? 180
                                        : 0,
                            }}
                        >
                            <ChevronDown className="w-3.5 h-3.5" />
                        </motion.span>
                    </motion.button>

                    <motion.button
                        type="button"
                        onClick={() =>
                            onRemoveStep(index)
                        }
                        whileHover={{
                            scale: 1.08,
                        }}
                        whileTap={{
                            scale: 0.82,
                        }}
                        className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                </div>
            </div>

            {/* EXPANDED */}

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{
                            height: 0,
                            opacity: 0,
                        }}
                        animate={{
                            height: 'auto',
                            opacity: 1,
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.25,
                        }}
                        className="overflow-visible"
                    >
                        <div className="border-t border-gray-100 dark:border-gray-800 p-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-xl">

                            {/* BASIC GRID - 4 Columns */}

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                                {/* ROLE */}

                                <div>
                                    <label className="flex items-center gap-1 mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                                        <User className="w-3.5 h-3.5" />
                                        Role
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            step.role ||
                                            ''
                                        }
                                        onChange={(e) =>
                                            onUpdateStep(
                                                index,
                                                'role',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Creative Director"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                                    />
                                </div>

                                {/* DURATION */}

                                <div>
                                    <label className="flex items-center gap-1 mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                                        <Clock className="w-3.5 h-3.5" />
                                        Duration (Days)
                                    </label>

                                    <div className="flex items-center h-[38px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">

                                        <button
                                            type="button"
                                            disabled={
                                                currentDays <=
                                                1
                                            }
                                            onClick={
                                                decreaseDays
                                            }
                                            className="w-10 h-full flex items-center justify-center border-r border-gray-100 dark:border-gray-800 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30"
                                        >
                                            −
                                        </button>

                                        <div className="flex-1 flex items-center justify-center gap-1">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {
                                                    currentDays
                                                }
                                            </span>

                                            <span className="text-[10px] text-gray-400">
                                                {currentDays ===
                                                    1
                                                    ? 'day'
                                                    : 'days'}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={
                                                increaseDays
                                            }
                                            className="w-10 h-full flex items-center justify-center border-l border-gray-100 dark:border-gray-800 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* ASSIGN */}

                                <div>
                                    <label className="flex items-center gap-1 mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                                        <UserCheck className="w-3.5 h-3.5" />
                                        Assign
                                    </label>

                                    <div className="flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onOpenAssignModal(
                                                    index
                                                )
                                            }
                                            className={`flex-1 h-[38px] px-2 rounded-lg border text-xs font-medium transition ${isAssigned
                                                ? 'border-green-300 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-300'
                                                : 'border-yellow-300 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-300'
                                                }`}
                                        >
                                            <span className="flex items-center justify-center gap-1 truncate">
                                                {isAssigned ? (
                                                    <>
                                                        <UserCheck className="w-3 h-3" />
                                                        <span className="truncate">
                                                            {
                                                                assigneeName
                                                            }
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus className="w-3 h-3" />
                                                        Assign
                                                    </>
                                                )}
                                            </span>
                                        </button>

                                        {isAssigned && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onRemoveAssignment(
                                                        index
                                                    )
                                                }
                                                className="w-[38px] rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                                            >
                                                <X className="w-4 h-4 mx-auto" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* DATES - Start & End with Pickers */}

                                <div className="col-span-2 sm:col-span-1">

                                    <label className="flex items-center gap-1 mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                                        <Calendar className="w-3.5 h-3.5" />
                                        Dates
                                    </label>

                                    <div className="flex flex-col gap-1.5">

                                        {/* Start Date Picker */}

                                        <CustomDatePicker
                                            value={
                                                stepStartDate
                                            }
                                            onChange={
                                                handleStartDateChange
                                            }
                                            placeholder="Start date"
                                            className="w-full"
                                            minDate={
                                                minDate
                                            }
                                            maxDate={
                                                startMaxDate
                                            }
                                        />

                                        {/* End Date Picker */}

                                        <div>
                                            <CustomDatePicker
                                                value={
                                                    stepEndDate
                                                }
                                                onChange={
                                                    handleEndDateChange
                                                }
                                                placeholder="End date"
                                                className="w-full"
                                                minDate={
                                                    stepStartDate ||
                                                    minDate
                                                }
                                                maxDate={
                                                    endMaxDate
                                                }
                                            />

                                            <AnimatePresence initial={false}>
                                                {endDateError && (
                                                    <motion.p
                                                        initial={{
                                                            opacity: 0,
                                                            y: -4,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            y: -4,
                                                        }}
                                                        className="flex items-center gap-1 mt-1 text-[10px] font-medium text-red-500"
                                                    >
                                                        <span className="w-1 h-1 rounded-full bg-red-500" />

                                                        {
                                                            endDateError
                                                        }
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* ================================================= */}
                            {/* ATTACHMENTS */}
                            {/* ================================================= */}

                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">

                                {/* HEADER */}

                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Paperclip className="w-4 h-4 text-indigo-500" />

                                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                Attachments
                                            </p>

                                            {stepAttachments?.length >
                                                0 && (
                                                    <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 text-[10px] font-bold">
                                                        {
                                                            stepAttachments.length
                                                        }
                                                    </span>
                                                )}
                                        </div>

                                        <p className="text-[11px] text-gray-400 mt-1">
                                            Add Figma, Google Drive, YouTube, Loom or other links
                                        </p>
                                    </div>

                                    {!showAddAttachment && (
                                        <motion.button
                                            type="button"
                                            onClick={() =>
                                                setShowAddAttachment(
                                                    true
                                                )
                                            }
                                            whileHover={{
                                                scale: 1.03,
                                            }}
                                            whileTap={{
                                                scale: 0.95,
                                            }}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            Add Attachment
                                        </motion.button>
                                    )}
                                </div>

                                {/* ATTACHMENT LIST */}

                                <AnimatePresence>
                                    {stepAttachments?.length >
                                        0 && (
                                            <motion.div
                                                layout
                                                className="flex flex-wrap gap-2 mb-3"
                                            >
                                                {stepAttachments.map(
                                                    (
                                                        attachment
                                                    ) => {
                                                        const typeData =
                                                            getAttachmentType(
                                                                attachment.type
                                                            );

                                                        return (
                                                            <motion.div
                                                                key={
                                                                    attachment.id
                                                                }
                                                                layout
                                                                initial={{
                                                                    opacity: 0,
                                                                    scale: 0.9,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    scale: 1,
                                                                }}
                                                                exit={{
                                                                    opacity: 0,
                                                                    scale: 0.9,
                                                                }}
                                                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm"
                                                            >
                                                                <span className="text-base">
                                                                    {
                                                                        typeData.icon
                                                                    }
                                                                </span>

                                                                <div className="min-w-0">
                                                                    <p className="max-w-[170px] truncate text-xs font-medium text-gray-700 dark:text-gray-200">
                                                                        {
                                                                            attachment.name
                                                                        }
                                                                    </p>

                                                                    <p className="text-[9px] text-gray-400">
                                                                        {
                                                                            typeData.label
                                                                        }
                                                                    </p>
                                                                </div>

                                                                <motion.a
                                                                    href={
                                                                        attachment.url
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    whileHover={{
                                                                        scale: 1.1,
                                                                    }}
                                                                    className="text-gray-400 hover:text-indigo-500"
                                                                >
                                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                                </motion.a>

                                                                <motion.button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        onRemoveStepAttachment(
                                                                            index,
                                                                            attachment.id
                                                                        )
                                                                    }
                                                                    whileHover={{
                                                                        scale: 1.1,
                                                                    }}
                                                                    className="text-gray-400 hover:text-red-500"
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                </motion.button>
                                                            </motion.div>
                                                        );
                                                    }
                                                )}
                                            </motion.div>
                                        )}
                                </AnimatePresence>

                                {/* ADD FORM */}

                                <AnimatePresence>
                                    {showAddAttachment && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                height: 0,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                height: 'auto',
                                            }}
                                            exit={{
                                                opacity: 0,
                                                height: 0,
                                            }}
                                            transition={{
                                                duration: 0.25,
                                            }}
                                            className="overflow-visible"
                                        >
                                            <div className="mt-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-indigo-50/30 dark:from-gray-800/50 dark:to-indigo-950/20">

                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center">
                                                            <Link2 className="w-4 h-4 text-indigo-600" />
                                                        </div>

                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                                Add attachment
                                                            </p>

                                                            <p className="text-[10px] text-gray-400">
                                                                Add a link or project resource
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleCancelAttachment
                                                        }
                                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-700"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                                                    <div>
                                                        <label className="block mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                                                            File Name
                                                        </label>

                                                        <input
                                                            type="text"
                                                            value={
                                                                newAttachment.name
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                setNewAttachment(
                                                                    {
                                                                        ...newAttachment,
                                                                        name: e.target.value,
                                                                    }
                                                                )
                                                            }
                                                            placeholder="Design File"
                                                            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                                                            URL
                                                        </label>

                                                        <input
                                                            type="url"
                                                            value={
                                                                newAttachment.url
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                setNewAttachment(
                                                                    {
                                                                        ...newAttachment,
                                                                        url: e.target.value,
                                                                    }
                                                                )
                                                            }
                                                            placeholder="https://..."
                                                            onKeyDown={(
                                                                e
                                                            ) => {
                                                                if (
                                                                    e.key ===
                                                                    'Enter' &&
                                                                    newAttachment.name.trim() &&
                                                                    newAttachment.url.trim()
                                                                ) {
                                                                    handleAddAttachment();
                                                                }
                                                            }}
                                                            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                                                            Attachment Type
                                                        </label>

                                                        <CustomDropdown
                                                            value={
                                                                newAttachment.type
                                                            }
                                                            onChange={(
                                                                value
                                                            ) =>
                                                                setNewAttachment(
                                                                    {
                                                                        ...newAttachment,
                                                                        type: value,
                                                                    }
                                                                )
                                                            }
                                                            options={
                                                                ATTACHMENT_TYPES
                                                            }
                                                            placeholder="Select type..."
                                                        />
                                                    </div>

                                                </div>

                                                <div className="flex justify-end gap-2 mt-4">

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleCancelAttachment
                                                        }
                                                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                    >
                                                        Cancel
                                                    </button>

                                                    <motion.button
                                                        type="button"
                                                        disabled={
                                                            isAddingAttachment ||
                                                            !newAttachment.name.trim() ||
                                                            !newAttachment.url.trim()
                                                        }
                                                        onClick={
                                                            handleAddAttachment
                                                        }
                                                        whileHover={{
                                                            scale: 1.02,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.96,
                                                        }}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isAddingAttachment ? (
                                                            <>
                                                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                                                Adding...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Check className="w-4 h-4" />
                                                                Add Attachment
                                                            </>
                                                        )}
                                                    </motion.button>

                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default StepCard;
