// src/app/dashboard/workflows/edit/[id]/components/ProjectHeadTimeline.jsx

'use client';

import { motion } from 'framer-motion';

import {
    Crown,
    CheckCircle2,
    Clock,
} from 'lucide-react';

import CustomDatePicker from './CustomDatePicker';

import CustomDropdown from '@/components/CustomDropdwon/CustomDropdown';

// ============================================
// MAIN COMPONENT
// ============================================

const ProjectHeadTimeline = ({
    projectHead,
    setProjectHead,
    projectTimeline,
    setProjectTimeline,
    members,
    user,
    getUserName,
}) => {
    // ============================================
    // PROJECT HEAD OPTIONS
    // ============================================

    const headOptions = members.map((member) => ({
        value: member.id,
        label: `${member.name}${member.id === user?.id ? ' (You)' : ''}`,
        icon: '👤',
    }));

    // ============================================
    // RENDER
    // ============================================

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
                delay: 0.1,
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
            {/* ============================================
                HEADER
            ============================================ */}

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
                {/* ICON */}

                <div
                    className="
                        w-9
                        h-9
                        rounded-xl
                        bg-amber-50
                        dark:bg-amber-950/30
                        flex
                        items-center
                        justify-center
                    "
                >
                    <Crown
                        className="
                            w-[18px]
                            h-[18px]
                            text-amber-600
                            dark:text-amber-400
                        "
                    />
                </div>

                {/* TITLE */}

                <div>
                    <h3
                        className="
                            text-sm
                            font-bold
                            text-gray-900
                            dark:text-white
                        "
                    >
                        Project Head & Timeline
                    </h3>

                    <p
                        className="
                            text-[11px]
                            text-gray-500
                            dark:text-gray-400
                        "
                    >
                        Who leads and when
                    </p>
                </div>
            </motion.div>

            {/* ============================================
                FORM
            ============================================ */}

            <div className="space-y-4">

                {/* ========================================
                    PROJECT HEAD
                ======================================== */}

                <div>
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
                        Project Head{' '}
                        <span className="text-red-500">
                            *
                        </span>
                    </label>

                    <div
                        className="
                            flex
                            gap-2
                        "
                    >
                        {/* ====================================
                            REUSABLE CUSTOM DROPDOWN
                        ==================================== */}

                        <CustomDropdown
                            value={
                                projectHead || ''
                            }
                            onChange={
                                setProjectHead
                            }
                            options={
                                headOptions
                            }
                            placeholder="Select project head..."
                            className="flex-1"
                        />

                        {/* ====================================
                            ASSIGN ME
                        ==================================== */}

                        <motion.button
                            type="button"
                            whileHover={{
                                scale: 1.02,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            onClick={() =>
                                setProjectHead(
                                    user?.id || ''
                                )
                            }
                            className="
                                px-4
                                py-2.5
                                bg-indigo-50
                                dark:bg-indigo-950/30
                                text-indigo-600
                                dark:text-indigo-400
                                rounded-xl
                                hover:bg-indigo-100
                                dark:hover:bg-indigo-950/50
                                transition
                                font-medium
                                text-sm
                                whitespace-nowrap
                                flex
                                items-center
                                gap-1.5
                            "
                        >
                            <Crown
                                className="
                                    w-3.5
                                    h-3.5
                                "
                            />

                            Assign Me
                        </motion.button>
                    </div>

                    {/* ====================================
                        SELECTED PROJECT HEAD
                    ==================================== */}

                    {projectHead && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 5,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="
                                mt-2
                                flex
                                items-center
                                gap-2
                                p-2.5
                                bg-emerald-50
                                dark:bg-emerald-950/20
                                rounded-lg
                                border
                                border-emerald-100
                                dark:border-emerald-900
                            "
                        >
                            <CheckCircle2
                                className="
                                    w-4
                                    h-4
                                    text-emerald-500
                                    flex-shrink-0
                                "
                            />

                            <span
                                className="
                                    text-sm
                                    text-emerald-700
                                    dark:text-emerald-300
                                "
                            >
                                Head:{' '}
                                <strong>
                                    {getUserName(
                                        projectHead
                                    )}
                                </strong>
                            </span>
                        </motion.div>
                    )}
                </div>

                {/* ========================================
                    TIMELINE
                ======================================== */}

                <div
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        gap-4
                    "
                >
                    {/* ====================================
                        START DATE
                    ==================================== */}

                    <CustomDatePicker
                        label="Start Date"
                        value={
                            projectTimeline.start
                        }
                        onChange={(value) =>
                            setProjectTimeline({
                                ...projectTimeline,
                                start: value,
                            })
                        }
                        placeholder="Select start date"
                    />

                    {/* ====================================
                        END DATE
                    ==================================== */}

                    <CustomDatePicker
                        label="Expected End Date"
                        value={
                            projectTimeline.end
                        }
                        onChange={(value) =>
                            setProjectTimeline({
                                ...projectTimeline,
                                end: value,
                            })
                        }
                        placeholder="Select end date"
                    />
                </div>

                {/* ========================================
                    TIMELINE PREVIEW
                ======================================== */}

                {(projectTimeline.start ||
                    projectTimeline.end) && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 5,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="
                            p-3
                            rounded-xl
                            bg-gradient-to-r
                            from-indigo-50
                            to-purple-50
                            dark:from-indigo-950/30
                            dark:to-purple-950/30
                            border
                            border-indigo-100
                            dark:border-indigo-800/30
                        "
                        >
                            <div
                                className="
                                flex
                                items-center
                                gap-3
                                text-xs
                                text-gray-600
                                dark:text-gray-400
                            "
                            >
                                {/* CLOCK */}

                                <Clock
                                    className="
                                    w-4
                                    h-4
                                    text-indigo-500
                                    flex-shrink-0
                                "
                                />

                                {/* DATES */}

                                <span>
                                    {projectTimeline.start ||
                                        'Not set'}

                                    <span
                                        className="
                                        mx-2
                                        text-gray-300
                                    "
                                    >
                                        →
                                    </span>

                                    {projectTimeline.end ||
                                        'Not set'}
                                </span>

                                {/* DAYS */}

                                {projectTimeline.start &&
                                    projectTimeline.end && (
                                        <span
                                            className="
                                            ml-auto
                                            font-medium
                                            text-indigo-600
                                            dark:text-indigo-400
                                            whitespace-nowrap
                                        "
                                        >
                                            {Math.ceil(
                                                (
                                                    new Date(
                                                        projectTimeline.end
                                                    ) -
                                                    new Date(
                                                        projectTimeline.start
                                                    )
                                                ) /
                                                (
                                                    1000 *
                                                    60 *
                                                    60 *
                                                    24
                                                )
                                            )}{' '}
                                            days
                                        </span>
                                    )}
                            </div>
                        </motion.div>
                    )}
            </div>
        </motion.section>
    );
};

export default ProjectHeadTimeline;
