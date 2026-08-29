
'use client';

import { useState } from 'react';
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
} from 'lucide-react';

import CustomDatePicker from './CustomDatePicker';
import CustomDropdown from '@/components/CustomDropdwon/CustomDropdown';

// =====================================================
// ATTACHMENT TYPES
// =====================================================

const ATTACHMENT_TYPES = [
    {
        value: 'google-drive',
        label: 'Google Drive',
        icon: '📁',
    },
    {
        value: 'dropbox',
        label: 'Dropbox',
        icon: '📁',
    },
    {
        value: 'figma',
        label: 'Figma',
        icon: '🎨',
    },
    {
        value: 'youtube',
        label: 'YouTube',
        icon: '▶️',
    },
    {
        value: 'loom',
        label: 'Loom',
        icon: '🎬',
    },
    {
        value: 'other',
        label: 'Other',
        icon: '🔗',
    },
];

const getAttachmentType = (type) => {
    return (
        ATTACHMENT_TYPES.find(
            (item) => item.value === type
        ) || ATTACHMENT_TYPES[5]
    );
};

// =====================================================
// STEP CARD
// =====================================================

const StepCard = ({
    step,
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
}) => {
    const [isExpanded, setIsExpanded] =
        useState(false);

    const [showAddAttachment, setShowAddAttachment] =
        useState(false);

    const [newAttachment, setNewAttachment] =
        useState({
            name: '',
            url: '',
            type: 'other',
        });

    const [isAddingAttachment, setIsAddingAttachment] =
        useState(false);

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
    // DAYS
    // =====================================================

    const currentDays = Math.max(
        1,
        Number(step.days) || 1
    );

    const decreaseDays = () => {
        if (currentDays <= 1) return;

        onUpdateStep(
            index,
            'days',
            currentDays - 1
        );
    };

    const increaseDays = () => {
        onUpdateStep(
            index,
            'days',
            currentDays + 1
        );
    };

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
                ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                ],
            }}
            className="
                bg-white
                dark:bg-gray-900
                rounded-xl
                border
                border-gray-200
                dark:border-gray-700
                overflow-visible
                hover:shadow-md
                transition-shadow
                duration-300
            "
        >
            {/* HEADER */}

            <div
                className="
                    flex
                    items-center
                    gap-2
                    p-3
                    cursor-pointer
                    rounded-xl
                    hover:bg-gray-50
                    dark:hover:bg-gray-800/50
                    transition-colors
                    duration-200
                "
                onClick={() =>
                    setIsExpanded(!isExpanded)
                }
            >
                {/* DRAG */}

                <motion.div
                    whileHover={{
                        scale: 1.05,
                    }}
                    className="
                        cursor-grab
                        active:cursor-grabbing
                        text-gray-300
                        dark:text-gray-600
                        hover:text-gray-500
                        dark:hover:text-gray-400
                    "
                    onClick={(e) =>
                        e.stopPropagation()
                    }
                >
                    <GripVertical className="w-4 h-4" />
                </motion.div>

                {/* NUMBER */}

                <span
                    className="
                        text-xs
                        font-bold
                        text-gray-500
                        dark:text-gray-400
                        bg-gray-100
                        dark:bg-gray-800
                        px-2
                        py-0.5
                        rounded-full
                        min-w-[28px]
                        text-center
                    "
                >
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
                    className="
                        flex-1
                        min-w-0
                        bg-transparent
                        border-b
                        border-transparent
                        hover:border-gray-300
                        dark:hover:border-gray-600
                        focus:border-indigo-500
                        outline-none
                        px-1
                        py-0.5
                        text-sm
                        font-medium
                        text-gray-900
                        dark:text-white
                    "
                />

                {/* STATUS */}

                <span
                    className={`
                        hidden
                        sm:inline-flex
                        items-center
                        px-2
                        py-0.5
                        rounded-full
                        text-[10px]
                        font-medium
                        ${isAssigned
                            ? `
                                    bg-green-50
                                    text-green-600
                                    dark:bg-green-900/20
                                    dark:text-green-400
                                `
                            : `
                                    bg-yellow-50
                                    text-yellow-600
                                    dark:bg-yellow-900/20
                                    dark:text-yellow-400
                                `
                        }
                    `}
                >
                    {isAssigned
                        ? 'Assigned'
                        : 'Pending'}
                </span>

                {/* ACTIONS */}

                <div
                    className="
                        flex
                        items-center
                        gap-1
                    "
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
                        className={`
                            p-1
                            rounded-lg
                            ${isFirst
                                ? `
                                        text-gray-200
                                        dark:text-gray-700
                                    `
                                : `
                                        text-gray-400
                                        hover:text-gray-700
                                        hover:bg-gray-100
                                        dark:hover:text-white
                                        dark:hover:bg-gray-800
                                    `
                            }
                        `}
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
                        className={`
                            p-1
                            rounded-lg
                            ${isLast
                                ? `
                                        text-gray-200
                                        dark:text-gray-700
                                    `
                                : `
                                        text-gray-400
                                        hover:text-gray-700
                                        hover:bg-gray-100
                                        dark:hover:text-white
                                        dark:hover:bg-gray-800
                                    `
                            }
                        `}
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
                        className="
                            p-1
                            rounded-lg
                            text-gray-400
                            hover:text-gray-700
                            hover:bg-gray-100
                            dark:hover:text-white
                            dark:hover:bg-gray-800
                        "
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
                        className="
                            p-1
                            rounded-lg
                            text-gray-400
                            hover:text-red-500
                            hover:bg-red-50
                            dark:hover:bg-red-950/30
                        "
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
                        <div
                            className="
                                border-t
                                border-gray-100
                                dark:border-gray-800
                                p-3
                                bg-gray-50/50
                                dark:bg-gray-900/50
                                rounded-b-xl
                            "
                        >
                            {/* BASIC GRID */}

                            <div
                                className="
                                    grid
                                    grid-cols-2
                                    sm:grid-cols-4
                                    gap-3
                                "
                            >
                                {/* ROLE */}

                                <div>
                                    <label
                                        className="
                                            flex
                                            items-center
                                            gap-1
                                            mb-1.5
                                            text-xs
                                            font-semibold
                                            text-gray-600
                                            dark:text-gray-300
                                        "
                                    >
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
                                        className="
                                            w-full
                                            px-3
                                            py-2
                                            rounded-lg
                                            border
                                            border-gray-200
                                            dark:border-gray-700
                                            bg-white
                                            dark:bg-gray-900
                                            text-xs
                                            text-gray-900
                                            dark:text-white
                                            outline-none
                                            focus:border-indigo-500
                                            focus:ring-2
                                            focus:ring-indigo-500/10
                                        "
                                    />
                                </div>

                                {/* DURATION */}

                                <div>
                                    <label
                                        className="
                                            flex
                                            items-center
                                            gap-1
                                            mb-1.5
                                            text-xs
                                            font-semibold
                                            text-gray-600
                                            dark:text-gray-300
                                        "
                                    >
                                        <Clock className="w-3.5 h-3.5" />
                                        Duration
                                    </label>

                                    <div
                                        className="
                                            flex
                                            items-center
                                            h-[38px]
                                            rounded-lg
                                            border
                                            border-gray-200
                                            dark:border-gray-700
                                            bg-white
                                            dark:bg-gray-900
                                            overflow-hidden
                                        "
                                    >
                                        <button
                                            type="button"
                                            disabled={
                                                currentDays <=
                                                1
                                            }
                                            onClick={
                                                decreaseDays
                                            }
                                            className="
                                                w-10
                                                h-full
                                                flex
                                                items-center
                                                justify-center
                                                border-r
                                                border-gray-100
                                                dark:border-gray-800
                                                text-gray-400
                                                hover:text-indigo-600
                                                hover:bg-indigo-50
                                                disabled:opacity-30
                                            "
                                        >
                                            −
                                        </button>

                                        <div
                                            className="
                                                flex-1
                                                flex
                                                items-center
                                                justify-center
                                                gap-1
                                            "
                                        >
                                            <span
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-gray-900
                                                    dark:text-white
                                                "
                                            >
                                                {currentDays}
                                            </span>

                                            <span
                                                className="
                                                    text-[10px]
                                                    text-gray-400
                                                "
                                            >
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
                                            className="
                                                w-10
                                                h-full
                                                flex
                                                items-center
                                                justify-center
                                                border-l
                                                border-gray-100
                                                dark:border-gray-800
                                                text-gray-400
                                                hover:text-indigo-600
                                                hover:bg-indigo-50
                                            "
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* ASSIGN */}

                                <div>
                                    <label
                                        className="
                                            flex
                                            items-center
                                            gap-1
                                            mb-1.5
                                            text-xs
                                            font-semibold
                                            text-gray-600
                                            dark:text-gray-300
                                        "
                                    >
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
                                            className={`
                                                flex-1
                                                h-[38px]
                                                px-2
                                                rounded-lg
                                                border
                                                text-xs
                                                font-medium
                                                transition
                                                ${isAssigned
                                                    ? `
                                                            border-green-300
                                                            bg-green-50
                                                            text-green-700
                                                            dark:bg-green-950/20
                                                            dark:text-green-300
                                                        `
                                                    : `
                                                            border-yellow-300
                                                            bg-yellow-50
                                                            text-yellow-700
                                                            dark:bg-yellow-950/20
                                                            dark:text-yellow-300
                                                        `
                                                }
                                            `}
                                        >
                                            <span
                                                className="
                                                    flex
                                                    items-center
                                                    justify-center
                                                    gap-1
                                                    truncate
                                                "
                                            >
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
                                                className="
                                                    w-[38px]
                                                    rounded-lg
                                                    text-gray-400
                                                    hover:text-red-500
                                                    hover:bg-red-50
                                                "
                                            >
                                                <X className="w-4 h-4 mx-auto" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* DEADLINE */}

                                <div>
                                    <CustomDatePicker
                                        label="Deadline"
                                        value={
                                            stepDeadline ||
                                            ''
                                        }
                                        onChange={(value) =>
                                            onUpdateDeadline(
                                                index,
                                                value
                                            )
                                        }
                                        placeholder="Select deadline"
                                    />
                                </div>
                            </div>

                            {/* ================================================= */}
                            {/* ATTACHMENTS */}
                            {/* ================================================= */}

                            <div
                                className="
                                    mt-4
                                    pt-4
                                    border-t
                                    border-gray-200
                                    dark:border-gray-700
                                "
                            >
                                {/* HEADER */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        mb-3
                                    "
                                >
                                    <div>
                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                            "
                                        >
                                            <Paperclip className="w-4 h-4 text-indigo-500" />

                                            <p
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-gray-800
                                                    dark:text-gray-200
                                                "
                                            >
                                                Attachments
                                            </p>

                                            {stepAttachments?.length >
                                                0 && (
                                                    <span
                                                        className="
                                                        min-w-[20px]
                                                        h-5
                                                        px-1.5
                                                        flex
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-indigo-50
                                                        dark:bg-indigo-950/30
                                                        text-indigo-600
                                                        text-[10px]
                                                        font-bold
                                                    "
                                                    >
                                                        {
                                                            stepAttachments.length
                                                        }
                                                    </span>
                                                )}
                                        </div>

                                        <p
                                            className="
                                                text-[11px]
                                                text-gray-400
                                                mt-1
                                            "
                                        >
                                            Add Figma, Google
                                            Drive, YouTube,
                                            Loom or other links
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
                                            className="
                                                flex
                                                items-center
                                                gap-1.5
                                                px-3
                                                py-2
                                                rounded-lg
                                                bg-indigo-50
                                                dark:bg-indigo-950/30
                                                text-indigo-600
                                                dark:text-indigo-400
                                                text-xs
                                                font-semibold
                                                hover:bg-indigo-100
                                            "
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
                                                className="
                                                flex
                                                flex-wrap
                                                gap-2
                                                mb-3
                                            "
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
                                                                className="
                                                                flex
                                                                items-center
                                                                gap-2
                                                                px-3
                                                                py-2
                                                                rounded-lg
                                                                border
                                                                border-gray-200
                                                                dark:border-gray-700
                                                                bg-white
                                                                dark:bg-gray-900
                                                                shadow-sm
                                                            "
                                                            >
                                                                <span className="text-base">
                                                                    {
                                                                        typeData.icon
                                                                    }
                                                                </span>

                                                                <div className="min-w-0">
                                                                    <p
                                                                        className="
                                                                        max-w-[170px]
                                                                        truncate
                                                                        text-xs
                                                                        font-medium
                                                                        text-gray-700
                                                                        dark:text-gray-200
                                                                    "
                                                                    >
                                                                        {
                                                                            attachment.name
                                                                        }
                                                                    </p>

                                                                    <p
                                                                        className="
                                                                        text-[9px]
                                                                        text-gray-400
                                                                    "
                                                                    >
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
                                                                    className="
                                                                    text-gray-400
                                                                    hover:text-indigo-500
                                                                "
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
                                                                    className="
                                                                    text-gray-400
                                                                    hover:text-red-500
                                                                "
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
                                            <div
                                                className="
                                                    mt-2
                                                    p-4
                                                    rounded-xl
                                                    border
                                                    border-gray-200
                                                    dark:border-gray-700
                                                    bg-gradient-to-br
                                                    from-gray-50
                                                    to-indigo-50/30
                                                    dark:from-gray-800/50
                                                    dark:to-indigo-950/20
                                                "
                                            >
                                                {/* TITLE */}

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        justify-between
                                                        mb-3
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                        "
                                                    >
                                                        <div
                                                            className="
                                                                w-8
                                                                h-8
                                                                rounded-lg
                                                                bg-indigo-100
                                                                dark:bg-indigo-950/40
                                                                flex
                                                                items-center
                                                                justify-center
                                                            "
                                                        >
                                                            <Link2 className="w-4 h-4 text-indigo-600" />
                                                        </div>

                                                        <div>
                                                            <p
                                                                className="
                                                                    text-sm
                                                                    font-semibold
                                                                    text-gray-800
                                                                    dark:text-white
                                                                "
                                                            >
                                                                Add attachment
                                                            </p>

                                                            <p
                                                                className="
                                                                    text-[10px]
                                                                    text-gray-400
                                                                "
                                                            >
                                                                Add a link or
                                                                project resource
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleCancelAttachment
                                                        }
                                                        className="
                                                            w-7
                                                            h-7
                                                            rounded-lg
                                                            flex
                                                            items-center
                                                            justify-center
                                                            text-gray-400
                                                            hover:bg-white
                                                            dark:hover:bg-gray-800
                                                            hover:text-gray-700
                                                        "
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* INPUT GRID */}

                                                <div
                                                    className="
                                                        grid
                                                        grid-cols-1
                                                        sm:grid-cols-3
                                                        gap-3
                                                    "
                                                >
                                                    {/* NAME */}

                                                    <div>
                                                        <label
                                                            className="
                                                                block
                                                                mb-1.5
                                                                text-xs
                                                                font-semibold
                                                                text-gray-600
                                                                dark:text-gray-300
                                                            "
                                                        >
                                                            File Name
                                                        </label>

                                                        <input
                                                            type="text"
                                                            value={
                                                                newAttachment.name
                                                            }
                                                            onChange={(e) =>
                                                                setNewAttachment(
                                                                    {
                                                                        ...newAttachment,
                                                                        name: e
                                                                            .target
                                                                            .value,
                                                                    }
                                                                )
                                                            }
                                                            placeholder="Design File"
                                                            className="
                                                                w-full
                                                                px-3
                                                                py-2.5
                                                                rounded-lg
                                                                border
                                                                border-gray-300
                                                                dark:border-gray-600
                                                                bg-white
                                                                dark:bg-gray-900
                                                                text-sm
                                                                text-gray-900
                                                                dark:text-white
                                                                outline-none
                                                                focus:border-indigo-500
                                                                focus:ring-2
                                                                focus:ring-indigo-500/10
                                                            "
                                                        />
                                                    </div>

                                                    {/* URL */}

                                                    <div>
                                                        <label
                                                            className="
                                                                block
                                                                mb-1.5
                                                                text-xs
                                                                font-semibold
                                                                text-gray-600
                                                                dark:text-gray-300
                                                            "
                                                        >
                                                            URL
                                                        </label>

                                                        <input
                                                            type="url"
                                                            value={
                                                                newAttachment.url
                                                            }
                                                            onChange={(e) =>
                                                                setNewAttachment(
                                                                    {
                                                                        ...newAttachment,
                                                                        url: e
                                                                            .target
                                                                            .value,
                                                                    }
                                                                )
                                                            }
                                                            placeholder="https://..."
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key ===
                                                                    'Enter'
                                                                ) {
                                                                    e.preventDefault();

                                                                    if (
                                                                        newAttachment.name.trim() &&
                                                                        newAttachment.url.trim()
                                                                    ) {
                                                                        handleAddAttachment();
                                                                    }
                                                                }
                                                            }}
                                                            className="
                                                                w-full
                                                                px-3
                                                                py-2.5
                                                                rounded-lg
                                                                border
                                                                border-gray-300
                                                                dark:border-gray-600
                                                                bg-white
                                                                dark:bg-gray-900
                                                                text-sm
                                                                text-gray-900
                                                                dark:text-white
                                                                outline-none
                                                                focus:border-indigo-500
                                                                focus:ring-2
                                                                focus:ring-indigo-500/10
                                                            "
                                                        />
                                                    </div>

                                                    {/* TYPE */}

                                                    <div>
                                                        <label
                                                            className="
                                                                block
                                                                mb-1.5
                                                                text-xs
                                                                font-semibold
                                                                text-gray-600
                                                                dark:text-gray-300
                                                            "
                                                        >
                                                            Attachment Type
                                                        </label>

                                                        <CustomDropdown
                                                            value={
                                                                newAttachment.type
                                                            }
                                                            onChange={(value) =>
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

                                                {/* ACTIONS */}

                                                <div
                                                    className="
                                                        flex
                                                        justify-end
                                                        gap-2
                                                        mt-4
                                                    "
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleCancelAttachment
                                                        }
                                                        className="
                                                            px-4
                                                            py-2
                                                            rounded-lg
                                                            border
                                                            border-gray-300
                                                            dark:border-gray-600
                                                            text-sm
                                                            font-medium
                                                            text-gray-700
                                                            dark:text-gray-300
                                                            hover:bg-gray-100
                                                            dark:hover:bg-gray-800
                                                        "
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
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            px-4
                                                            py-2
                                                            rounded-lg
                                                            bg-indigo-600
                                                            hover:bg-indigo-500
                                                            text-white
                                                            text-sm
                                                            font-semibold
                                                            disabled:opacity-50
                                                            disabled:cursor-not-allowed
                                                        "
                                                    >
                                                        {isAddingAttachment ? (
                                                            <>
                                                                <span
                                                                    className="
                                                                        w-4
                                                                        h-4
                                                                        rounded-full
                                                                        border-2
                                                                        border-white/30
                                                                        border-t-white
                                                                        animate-spin
                                                                    "
                                                                />

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
