// src/app/dashboard/workflows/edit/[id]/components/ProjectDetails.jsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BriefcaseBusiness } from 'lucide-react';

// ============================================
// SHARED CUSTOM DROPDOWN
// ============================================

import CustomDropdown from '@/components/CustomDropdwon/CustomDropdown';

// ============================================
// PROJECT STATUS OPTIONS
// ============================================

const PROJECT_STATUSES = [
    {
        value: 'planning',
        label: 'Planning',
        icon: '📋',
    },
    {
        value: 'active',
        label: 'Active',
        icon: '🚀',
    },
    {
        value: 'review',
        label: 'Review',
        icon: '👀',
    },
    {
        value: 'completed',
        label: 'Completed',
        icon: '✅',
    },
    {
        value: 'on-hold',
        label: 'On Hold',
        icon: '⏸️',
    },
];

// ============================================
// PRIORITY OPTIONS
// ============================================

const PRIORITY_OPTIONS = [
    {
        value: 'low',
        label: 'Low',
        icon: '🟢',
    },
    {
        value: 'medium',
        label: 'Medium',
        icon: '🟡',
    },
    {
        value: 'high',
        label: 'High',
        icon: '🟠',
    },
    {
        value: 'urgent',
        label: 'Urgent',
        icon: '🔴',
    },
];

// ============================================
// ANIMATED INPUT
// ============================================

const AnimatedInput = ({
    label,
    required = false,
    value,
    onChange,
    placeholder,
    type = 'text',
    className = '',
}) => {
    const [isFocused, setIsFocused] =
        useState(false);

    return (
        <div className={className}>
            {/* Label */}

            <label
                className="
                    block
                    text-xs
                    font-medium
                    text-gray-700
                    dark:text-gray-300
                    mb-1.5
                "
            >
                {label}

                {required && (
                    <span className="text-red-500 ml-1">
                        *
                    </span>
                )}
            </label>

            {/* Input */}

            <motion.div
                className={`
                    relative
                    rounded-xl
                    border
                    transition-all
                    duration-200

                    ${isFocused
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
            >
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={() =>
                        setIsFocused(true)
                    }
                    onBlur={() =>
                        setIsFocused(false)
                    }
                    placeholder={
                        placeholder
                    }
                    className="
                        w-full
                        px-4
                        py-2.5
                        bg-transparent
                        text-gray-900
                        dark:text-white
                        text-sm
                        outline-none
                        rounded-xl
                        placeholder:text-gray-400
                        dark:placeholder:text-gray-500
                    "
                />
            </motion.div>
        </div>
    );
};

// ============================================
// ANIMATED TEXTAREA
// ============================================

const AnimatedTextarea = ({
    label,
    value,
    onChange,
    placeholder,
    rows = 3,
}) => {
    const [isFocused, setIsFocused] =
        useState(false);

    return (
        <div>
            {/* Label */}

            <label
                className="
                    block
                    text-xs
                    font-medium
                    text-gray-700
                    dark:text-gray-300
                    mb-1.5
                "
            >
                {label}
            </label>

            {/* Textarea */}

            <motion.div
                className={`
                    relative
                    rounded-xl
                    border
                    transition-all
                    duration-200

                    ${isFocused
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
            >
                <textarea
                    value={value}
                    onChange={onChange}
                    onFocus={() =>
                        setIsFocused(true)
                    }
                    onBlur={() =>
                        setIsFocused(false)
                    }
                    placeholder={
                        placeholder
                    }
                    rows={rows}
                    className="
                        w-full
                        px-4
                        py-2.5
                        bg-transparent
                        text-gray-900
                        dark:text-white
                        text-sm
                        outline-none
                        rounded-xl
                        resize-y
                        placeholder:text-gray-400
                        dark:placeholder:text-gray-500
                    "
                />
            </motion.div>
        </div>
    );
};

// ============================================
// MAIN COMPONENT
// ============================================

const ProjectDetails = ({
    projectName,
    setProjectName,

    projectDescription,
    setProjectDescription,

    projectStatus,
    setProjectStatus,

    projectPriority,
    setProjectPriority,

    projectCategory,
    setProjectCategory,

    projectTags,
    setProjectTags,
}) => {
    return (
        <motion.section
            initial={{
                opacity: 0,
                y: 12,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                delay: 0.05,
            }}
            className="
                bg-white
                dark:bg-gray-900
                rounded-2xl
                border
                border-gray-200
                dark:border-gray-700
                p-5
                sm:p-6
                shadow-sm
                hover:shadow-md
                transition-shadow
                duration-300
            "
        >
            {/* ========================================
                HEADER
            ======================================== */}

            <motion.div
                className="
                    flex
                    items-center
                    gap-3
                    mb-5
                "
                initial={{
                    opacity: 0,
                    x: -10,
                }}
                animate={{
                    opacity: 1,
                    x: 0,
                }}
                transition={{
                    delay: 0.1,
                }}
            >
                {/* Icon */}

                <div
                    className="
                        w-9
                        h-9
                        rounded-xl
                        bg-indigo-50
                        dark:bg-indigo-950/30
                        flex
                        items-center
                        justify-center
                    "
                >
                    <BriefcaseBusiness
                        className="
                            w-[18px]
                            h-[18px]
                            text-indigo-600
                            dark:text-indigo-400
                        "
                    />
                </div>

                {/* Heading */}

                <div>
                    <h3
                        className="
                            text-sm
                            font-bold
                            text-gray-900
                            dark:text-white
                        "
                    >
                        Project Details
                    </h3>

                    <p
                        className="
                            text-[11px]
                            text-gray-500
                            dark:text-gray-400
                        "
                    >
                        Basic information about your project
                    </p>
                </div>
            </motion.div>

            {/* ========================================
                FORM
            ======================================== */}

            <div className="space-y-4">
                {/* ====================================
                    PROJECT NAME + CATEGORY
                ==================================== */}

                <div
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        gap-4
                    "
                >
                    {/* Project Name */}

                    <AnimatedInput
                        label="Project Name"
                        required
                        value={
                            projectName
                        }
                        onChange={(e) =>
                            setProjectName(
                                e.target.value
                            )
                        }
                        placeholder="e.g. Website Redesign"
                    />

                    {/* Category */}

                    <AnimatedInput
                        label="Category"
                        value={
                            projectCategory
                        }
                        onChange={(e) =>
                            setProjectCategory(
                                e.target.value
                            )
                        }
                        placeholder="e.g. Design, Development"
                    />
                </div>

                {/* ====================================
                    DESCRIPTION
                ==================================== */}

                <AnimatedTextarea
                    label="Description"
                    value={
                        projectDescription
                    }
                    onChange={(e) =>
                        setProjectDescription(
                            e.target.value
                        )
                    }
                    placeholder="Describe your project in detail..."
                    rows={3}
                />

                {/* ====================================
                    STATUS + PRIORITY + TAGS
                ==================================== */}

                <div
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        gap-4
                    "
                >
                    {/* ==================================
                        STATUS + PRIORITY
                    ================================== */}

                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-4
                        "
                    >
                        {/* ==================================
                            STATUS
                        ================================== */}

                        <CustomDropdown
                            label="Status"
                            value={
                                projectStatus
                            }
                            onChange={(
                                value
                            ) =>
                                setProjectStatus(
                                    value
                                )
                            }
                            options={
                                PROJECT_STATUSES
                            }
                            placeholder="Select status..."
                        />

                        {/* ==================================
                            PRIORITY
                        ================================== */}

                        <CustomDropdown
                            label="Priority"
                            value={
                                projectPriority
                            }
                            onChange={(
                                value
                            ) =>
                                setProjectPriority(
                                    value
                                )
                            }
                            options={
                                PRIORITY_OPTIONS
                            }
                            placeholder="Select priority..."
                        />
                    </div>

                    {/* ==================================
                        TAGS
                    ================================== */}

                    <div>
                        <AnimatedInput
                            label="Tags"
                            value={
                                projectTags
                            }
                            onChange={(e) =>
                                setProjectTags(
                                    e.target.value
                                )
                            }
                            placeholder="design, frontend, api"
                        />
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default ProjectDetails;
