'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus } from 'lucide-react';
import StepCard from './StepCard';

const WorkflowSteps = ({
    steps,
    assignedTo,
    stepDeadlines,
    stepAttachments,
    updateStep,
    removeStep,
    assignStep,
    removeAssignment,
    updateStepDeadline,
    moveStep,
    addStep,
    addStepAttachment,
    removeStepAttachment,
    onOpenAssignModal,
    getUserName,
    totalDays,
    projectStartDate,
    projectEndDate,
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
                delay: 0.3,
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
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

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">

                    {/* Icon */}

                    <motion.div
                        whileHover={{
                            scale: 1.05,
                        }}
                        whileTap={{
                            scale: 0.95,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 20,
                        }}
                        className="
                            w-8
                            h-8
                            rounded-lg
                            bg-gray-100
                            dark:bg-gray-800
                            flex
                            items-center
                            justify-center
                        "
                    >
                        <Layers
                            className="
                                w-4
                                h-4
                                text-gray-600
                                dark:text-gray-400
                            "
                        />
                    </motion.div>

                    <div>
                        <h3
                            className="
                                text-sm
                                font-semibold
                                text-gray-900
                                dark:text-white
                            "
                        >
                            Workflow Steps
                        </h3>

                        <p
                            className="
                                text-[11px]
                                text-gray-500
                                dark:text-gray-400
                            "
                        >
                            {steps.length}{' '}
                            {steps.length === 1
                                ? 'step'
                                : 'steps'}{' '}
                            • {totalDays} days
                        </p>
                    </div>
                </div>

                {/* ========================================
                    ADD STEP
                ======================================== */}

                <motion.button
                    type="button"
                    onClick={addStep}
                    whileHover={{
                        scale: 1.025,
                    }}
                    whileTap={{
                        scale: 0.94,
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 22,
                    }}
                    className="
                        group
                        flex
                        items-center
                        gap-1.5
                        px-3
                        py-1.5
                        text-xs
                        bg-indigo-50
                        dark:bg-indigo-950/30
                        text-indigo-600
                        dark:text-indigo-400
                        rounded-lg
                        hover:bg-indigo-100
                        dark:hover:bg-indigo-950/50
                        transition-colors
                        duration-200
                        font-medium
                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500/30
                    "
                >
                    <motion.span
                        whileHover={{
                            rotate: 90,
                        }}
                        transition={{
                            duration: 0.2,
                        }}
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </motion.span>

                    <span>Add Step</span>
                </motion.button>
            </div>

            {/* ============================================
                EMPTY STATE
            ============================================ */}

            <AnimatePresence mode="wait">
                {steps.length === 0 ? (
                    <motion.div
                        key="empty"
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
                            y: -8,
                        }}
                        transition={{
                            duration: 0.25,
                        }}
                        className="
                            mt-4
                            py-10
                            text-center
                            border-2
                            border-dashed
                            border-gray-200
                            dark:border-gray-700
                            rounded-xl
                        "
                    >
                        <motion.div
                            animate={{
                                y: [0, -3, 0],
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <Layers
                                className="
                                    w-10
                                    h-10
                                    text-gray-300
                                    dark:text-gray-600
                                    mx-auto
                                    mb-2
                                "
                            />
                        </motion.div>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                dark:text-gray-400
                            "
                        >
                            No steps yet
                        </p>

                        <p
                            className="
                                text-xs
                                text-gray-400
                                dark:text-gray-500
                                mt-0.5
                            "
                        >
                            Click "Add Step" to start
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="steps"
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        transition={{
                            duration: 0.25,
                        }}
                        className="
                            mt-4
                            space-y-2
                        "
                    >
                        <AnimatePresence
                            mode="popLayout"
                            initial={false}
                        >
                            {steps.map(
                                (
                                    step,
                                    index
                                ) => {
                                    const isAssigned =
                                        assignedTo[
                                        index
                                        ] &&
                                        assignedTo[
                                            index
                                        ].trim() !==
                                        '';

                                    const assigneeName =
                                        isAssigned
                                            ? getUserName(
                                                assignedTo[
                                                index
                                                ]
                                            )
                                            : 'Unassigned';

                                    return (
                                        <motion.div
                                            key={`workflow-step-${index}`}
                                            layout
                                            initial={{
                                                opacity: 0,
                                                y: 10,
                                                scale: 0.985,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                x: -18,
                                                scale: 0.98,
                                            }}
                                            transition={{
                                                duration: 0.25,
                                                ease: [
                                                    0.22,
                                                    1,
                                                    0.36,
                                                    1,
                                                ],
                                                layout: {
                                                    duration: 0.3,
                                                },
                                            }}
                                        >
                                            <StepCard
                                                step={step}
                                                index={index}
                                                isAssigned={
                                                    isAssigned
                                                }
                                                assigneeName={
                                                    assigneeName
                                                }
                                                onUpdateStep={
                                                    updateStep
                                                }
                                                onRemoveStep={
                                                    removeStep
                                                }
                                                onOpenAssignModal={
                                                    onOpenAssignModal
                                                }
                                                onRemoveAssignment={
                                                    removeAssignment
                                                }
                                                stepDeadline={
                                                    stepDeadlines[
                                                    index
                                                    ] || ''
                                                }
                                                onUpdateDeadline={
                                                    updateStepDeadline
                                                }
                                                onMoveStep={
                                                    moveStep
                                                }
                                                stepAttachments={
                                                    stepAttachments[
                                                    index
                                                    ] || []
                                                }
                                                onAddStepAttachment={
                                                    addStepAttachment
                                                }
                                                onRemoveStepAttachment={
                                                    removeStepAttachment
                                                }
                                                isFirst={
                                                    index ===
                                                    0
                                                }
                                                isLast={
                                                    index ===
                                                    steps.length -
                                                    1
                                                }
                                                projectStartDate={
                                                    projectStartDate
                                                }
                                                projectEndDate={
                                                    projectEndDate
                                                }
                                            />
                                        </motion.div>
                                    );
                                }
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
};

export default WorkflowSteps;
