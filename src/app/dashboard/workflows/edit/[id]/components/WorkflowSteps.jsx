// src/app/dashboard/workflows/edit/[id]/components/WorkflowSteps.jsx
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
}) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 shadow-sm"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Layers className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Workflow Steps</h3>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            {steps.length} steps • {totalDays} days
                        </p>
                    </div>
                </div>
                <button
                    onClick={addStep}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition font-medium"
                >
                    <Plus className="w-3.5 h-3.5" /> Add Step
                </button>
            </div>

            {/* Empty State */}
            {steps.length === 0 ? (
                <div className="mt-4 py-10 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                    <Layers className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">No steps yet</p>
                    <p className="text-xs text-gray-400">Click "Add Step" to start</p>
                </div>
            ) : (
                /* Steps List */
                <div className="mt-4 space-y-2">
                    <AnimatePresence>
                        {steps.map((step, index) => {
                            const isAssigned = assignedTo[index] && assignedTo[index].trim() !== '';
                            const assigneeName = isAssigned ? getUserName(assignedTo[index]) : 'Unassigned';

                            return (
                                <StepCard
                                    key={`step-${index}`}
                                    step={step}
                                    index={index}
                                    isAssigned={isAssigned}
                                    assigneeName={assigneeName}
                                    onUpdateStep={updateStep}
                                    onRemoveStep={removeStep}
                                    onOpenAssignModal={onOpenAssignModal}
                                    onRemoveAssignment={removeAssignment}
                                    stepDeadline={stepDeadlines[index] || ''}
                                    onUpdateDeadline={updateStepDeadline}
                                    onMoveStep={moveStep}
                                    stepAttachments={stepAttachments[index] || []}
                                    onAddStepAttachment={addStepAttachment}
                                    onRemoveStepAttachment={removeStepAttachment}
                                    isFirst={index === 0}
                                    isLast={index === steps.length - 1}
                                />
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </motion.section>
    );
};

export default WorkflowSteps;
