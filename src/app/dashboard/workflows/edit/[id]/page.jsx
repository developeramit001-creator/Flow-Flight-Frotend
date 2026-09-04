// src/app/dashboard/workflows/edit/[id]/page.jsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
    Loader2,
    ArrowLeft,
    Send,
    Check,
    Eye,
    Target,
    Layers,
    Users,
    Zap,
    File,
    Crown,
    Link2,
    BriefcaseBusiness,
} from 'lucide-react';
import Link from 'next/link';

import {
    useGetTemplateQuery,
    useCreateWorkflowMutation,
} from '@/store/api/workflowApi';

import { useGetMembersQuery } from '@/store/api/memberApi';

// Import Components
import ProjectDetails from './components/ProjectDetails';
import ProjectHeadTimeline from './components/ProjectHeadTimeline';
import ProjectAttachments from './components/ProjectAttachments';
import TeamOverview from './components/TeamOverview';
import QuickAssign from './components/QuickAssign';
import WorkflowSteps from './components/WorkflowSteps';
import ProjectSummary from './components/ProjectSummary';
import AssignmentModal from './components/AssignmentModal';
import TeamAndAssign from './components/TeamAndAssign';

// ============================================
// MAIN COMPONENT
// ============================================

export default function EditWorkflowPage({ params }) {
    const { id: workflowId } = use(params);

    const router = useRouter();
    const searchParams = useSearchParams();
    const orgId = searchParams.get('orgId');

    const user = useSelector(
        (state) => state.auth.user
    );

    // ============================================
    // STATE - Project Details
    // ============================================

    const [projectName, setProjectName] =
        useState('');

    const [projectDescription, setProjectDescription] =
        useState('');

    const [projectClient, setProjectClient] =
        useState('');

    const [projectGoal, setProjectGoal] =
        useState('');

    const [projectStatus, setProjectStatus] =
        useState('planning');

    const [projectPriority, setProjectPriority] =
        useState('medium');

    const [projectCategory, setProjectCategory] =
        useState('');

    const [projectTags, setProjectTags] =
        useState('');

    const [projectHead, setProjectHead] =
        useState(null);

    const [projectTimeline, setProjectTimeline] =
        useState({
            start: '',
            end: '',
        });

    // ============================================
    // STATE - Attachments
    // ============================================

    const [attachments, setAttachments] =
        useState([]);

    // ============================================
    // STATE - Steps
    // ============================================

    const [steps, setSteps] =
        useState([]);

    const [assignedTo, setAssignedTo] =
        useState({});

    const [stepDeadlines, setStepDeadlines] =
        useState({});

    const [stepAttachments, setStepAttachments] =
        useState({});

    // ============================================
    // STATE - UI
    // ============================================

    const [isSaving, setIsSaving] =
        useState(false);

    const [assignModal, setAssignModal] =
        useState({
            open: false,
            stepIndex: null,
        });

    const [showSummary, setShowSummary] =
        useState(false);

    // ============================================
    // API HOOKS
    // ============================================

    const {
        data: templateData,
        isLoading: templateLoading,
    } = useGetTemplateQuery(
        workflowId,
        {
            skip: !workflowId,
        }
    );

    const {
        data: membersData,
        isLoading: membersLoading,
    } = useGetMembersQuery(
        orgId,
        {
            skip: !orgId,
        }
    );

    const [
        createWorkflow,
        {
            isLoading: isCreating,
        },
    ] = useCreateWorkflowMutation();

    const members =
        membersData?.data?.members || [];

    // ============================================
    // LOCAL DATE HELPER
    // ============================================
    // IMPORTANT: Date-only values must stay in local time.
    // toISOString() converts local midnight to UTC and can shift
    // Sep 2 -> Sep 1 in India/timezones ahead of UTC.
    const formatLocalDate = (date) => {
        if (!date || Number.isNaN(date.getTime())) return '';

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    // ============================================
    // LOAD TEMPLATE
    // ============================================

    useEffect(() => {
        if (templateData?.data) {
            const template =
                templateData.data;

            // Map steps from template
            const templateSteps =
                (template.steps || []).map(
                    (s, index) => ({
                        id: String(index + 1),
                        name: s.name || '',
                        role: s.role || '',
                        days: s.days || 1,
                        assignees: [],
                        startDate: '',
                        endDate: '',
                    })
                );

            setProjectName(
                template.name
            );

            setProjectCategory(
                template.category || ''
            );

            setSteps(
                templateSteps
            );

            setProjectHead(
                user?.id || null
            );

            // Default assignments
            const defaultAssign = {};
            const defaultDeadlines = {};
            const defaultAttachments = {};

            (template.steps || []).forEach(
                (_, index) => {
                    defaultAssign[index] =
                        user?.id || '';

                    defaultDeadlines[index] =
                        '';

                    defaultAttachments[index] =
                        [];
                }
            );

            setAssignedTo(
                defaultAssign
            );

            setStepDeadlines(
                defaultDeadlines
            );

            setStepAttachments(
                defaultAttachments
            );

            // ============================================
            // AUTO-CALCULATE PROJECT TIMELINE
            // ============================================

            const today =
                new Date();

            const startDate = formatLocalDate(today);

            // Calculate total days from all steps
            const totalDays =
                templateSteps.reduce(
                    (acc, s) =>
                        acc +
                        (Number(s.days) ||
                            0),
                    0
                );

            const endDate =
                new Date(today);

            endDate.setDate(
                endDate.getDate() +
                Math.max(0, totalDays - 1)
            );

            console.log(
                '📅 Timeline calculated:',
                {
                    start: startDate,
                    end: formatLocalDate(endDate),
                    totalDays:
                        totalDays,
                    steps:
                        templateSteps.length,
                }
            );

            setProjectTimeline({
                start: startDate,
                end: formatLocalDate(endDate),
            });
        }
    }, [
        templateData,
        user,
    ]);

    // ============================================
    // AUTO-CALCULATE STEP DATES
    //
    // IMPORTANT:
    // This runs ONLY when project start changes.
    //
    // Each step keeps its own current duration.
    //
    // Example:
    // Step = 10 days
    // Project start changes to 10 Aug
    //
    // Step becomes:
    // 10 Aug -> 19 Aug
    //
    // It does NOT use old start/end gap.
    // ============================================

    useEffect(() => {
        if (
            !projectTimeline.start ||
            steps.length === 0
        ) {
            return;
        }

        console.log(
            '🔄 Project start changed'
        );

        console.log(
            '📅 New project start:',
            projectTimeline.start
        );

        const updatedSteps =
            steps.map(
                (step, index) => {
                    const days =
                        Math.max(
                            1,
                            Number(
                                step.days
                            ) || 1
                        );

                    const start =
                        new Date(
                            `${projectTimeline.start}T00:00:00`
                        );

                    const end =
                        new Date(start);

                    // Inclusive duration
                    //
                    // 1 day  = +0
                    // 2 days = +1
                    // 3 days = +2
                    //
                    end.setDate(
                        end.getDate() +
                        (days - 1)
                    );

                    const formattedStart = formatLocalDate(start);

                    const formattedEnd = formatLocalDate(end);

                    console.log(
                        `📌 Step ${index + 1}:`,
                        {
                            days,
                            startDate:
                                formattedStart,
                            endDate:
                                formattedEnd,
                        }
                    );

                    return {
                        ...step,
                        startDate:
                            formattedStart,
                        endDate:
                            formattedEnd,
                    };
                }
            );

        setSteps(
            updatedSteps
        );

        const updatedDeadlines =
            {};

        updatedSteps.forEach(
            (step, index) => {
                updatedDeadlines[index] =
                    step.endDate || '';
            }
        );

        setStepDeadlines(
            updatedDeadlines
        );
    }, [
        projectTimeline.start,
    ]);

    // ============================================
    // STEP CRUD
    // ============================================

    const addStep = () => {
        const newIndex =
            steps.length;

        setSteps([
            ...steps,
            {
                id: String(newIndex + 1),
                name: '',
                role: '',
                days: 1,
                assignees: [],
                startDate:
                    projectTimeline.start || '',
                endDate:
                    projectTimeline.start || '',
            },
        ]);

        setAssignedTo({
            ...assignedTo,
            [newIndex]:
                user?.id || '',
        });

        setStepDeadlines({
            ...stepDeadlines,
            [newIndex]: '',
        });

        setStepAttachments({
            ...stepAttachments,
            [newIndex]: [],
        });
    };

    const removeStep = (
        index
    ) => {
        if (
            !confirm(
                `Remove "${steps[index]?.name ||
                'Step'
                }"?`
            )
        ) {
            return;
        }

        setSteps(
            steps.filter(
                (_, i) =>
                    i !== index
            )
        );

        const newAssigned = {
            ...assignedTo,
        };

        const newDeadlines = {
            ...stepDeadlines,
        };

        const newAttachments = {
            ...stepAttachments,
        };

        delete newAssigned[index];
        delete newDeadlines[index];
        delete newAttachments[index];

        const reindexedAssigned =
            {};

        const reindexedDeadlines =
            {};

        const reindexedAttachments =
            {};

        Object.keys(
            newAssigned
        ).forEach(
            (key, i) => {
                reindexedAssigned[i] =
                    newAssigned[key];

                reindexedDeadlines[i] =
                    newDeadlines[key] ||
                    '';

                reindexedAttachments[i] =
                    newAttachments[key] ||
                    [];
            }
        );

        setAssignedTo(
            reindexedAssigned
        );

        setStepDeadlines(
            reindexedDeadlines
        );

        setStepAttachments(
            reindexedAttachments
        );
    };

    // ============================================
    // UPDATE STEP
    // ============================================

    const updateStep = (
        index,
        field,
        value
    ) => {
        setSteps(
            (currentSteps) => {
                const newSteps = [
                    ...currentSteps,
                ];

                newSteps[index] = {
                    ...newSteps[index],
                    [field]: value,
                };

                return newSteps;
            }
        );

    };

    // ============================================
    // ASSIGNMENT
    // ============================================

    const assignStep = (
        index,
        userId
    ) => {
        setAssignedTo({
            ...assignedTo,
            [index]: userId,
        });
    };

    const removeAssignment = (
        index
    ) => {
        setAssignedTo({
            ...assignedTo,
            [index]: '',
        });
    };

    // ============================================
    // STEP DEADLINE
    // ============================================

    const updateStepDeadline = (
        index,
        value
    ) => {
        setStepDeadlines({
            ...stepDeadlines,
            [index]: value,
        });
    };

    // ============================================
    // MOVE STEP
    // ============================================

    const moveStep = (
        index,
        direction
    ) => {
        if (
            direction === 'up' &&
            index === 0
        ) {
            return;
        }

        if (
            direction === 'down' &&
            index ===
            steps.length - 1
        ) {
            return;
        }

        const newSteps = [
            ...steps,
        ];

        const targetIndex =
            direction === 'up'
                ? index - 1
                : index + 1;

        [
            newSteps[index],
            newSteps[targetIndex],
        ] = [
                newSteps[targetIndex],
                newSteps[index],
            ];

        setSteps(
            newSteps
        );

        const newAssigned =
            {};

        Object.keys(
            assignedTo
        ).forEach((key) => {
            const idx =
                parseInt(key);

            if (
                idx === index
            ) {
                newAssigned[
                    targetIndex
                ] =
                    assignedTo[idx];
            } else if (
                idx ===
                targetIndex
            ) {
                newAssigned[index] =
                    assignedTo[idx];
            } else {
                newAssigned[idx] =
                    assignedTo[idx];
            }
        });

        setAssignedTo(
            newAssigned
        );
    };

    // ============================================
    // STEP ATTACHMENTS
    // ============================================

    const addStepAttachment = (
        index,
        attachment
    ) => {
        const current =
            stepAttachments[index] ||
            [];

        setStepAttachments({
            ...stepAttachments,
            [index]: [
                ...current,
                {
                    ...attachment,
                    id: Date.now(),
                },
            ],
        });
    };

    const removeStepAttachment = (
        stepIndex,
        attachmentId
    ) => {
        const current =
            stepAttachments[
            stepIndex
            ] || [];

        setStepAttachments({
            ...stepAttachments,
            [stepIndex]:
                current.filter(
                    (a) =>
                        a.id !==
                        attachmentId
                ),
        });
    };

    // ============================================
    // HELPERS
    // ============================================

    const getUserName = (
        userId
    ) => {
        if (
            userId === user?.id
        ) {
            return `${user?.name} (You)`;
        }

        const member =
            members.find(
                (m) =>
                    m.id ===
                    userId
            );

        return (
            member?.name ||
            'Unassigned'
        );
    };

    const isFullyAssigned =
        () => {
            return Object.values(
                assignedTo
            ).every(
                (id) =>
                    id &&
                    id.trim() !==
                    ''
            );
        };

    const isProjectHeadSet =
        () => {
            return (
                projectHead &&
                projectHead.trim() !==
                ''
            );
        };

    const totalDays =
        steps.reduce(
            (acc, s) =>
                acc +
                (Number(
                    s.days
                ) || 0),
            0
        );

    const assignedCount =
        Object.values(
            assignedTo
        ).filter(
            (id) =>
                id &&
                id.trim() !==
                ''
        ).length;

    // ============================================
    // PREVIEW
    // ============================================

    const handlePreview = () => {
        setShowSummary((current) => {
            const nextValue = !current;

            if (nextValue) {
                // Wait for AnimatePresence/DOM to render the summary,
                // then smoothly bring it into view.
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        document
                            .getElementById('project-summary-preview')
                            ?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start',
                            });
                    }, 80);
                });
            }

            return nextValue;
        });
    };

    // ============================================
    // SAVE
    // ============================================

    const handleSave =
        async () => {
            if (
                !projectName.trim()
            ) {
                toast.error(
                    'Please enter a project name'
                );

                return;
            }

            if (
                steps.length === 0
            ) {
                toast.error(
                    'Please add at least one step'
                );

                return;
            }

            for (
                let i = 0;
                i < steps.length;
                i++
            ) {
                if (
                    !steps[i].name.trim()
                ) {
                    toast.error(
                        `Step ${i + 1
                        } name is required`
                    );

                    return;
                }

                if (
                    !steps[i].role.trim()
                ) {
                    toast.error(
                        `Step ${i + 1
                        } role is required`
                    );

                    return;
                }
            }

            if (
                !isProjectHeadSet()
            ) {
                toast.error(
                    'Please assign a project head'
                );

                return;
            }

            // ========================================
            // PROJECT TIMELINE VALIDATION
            // ========================================

            if (
                projectTimeline.start &&
                projectTimeline.end
            ) {
                const projectStartDate =
                    new Date(
                        `${projectTimeline.start}T00:00:00`
                    );

                const projectEndDate =
                    new Date(
                        `${projectTimeline.end}T00:00:00`
                    );

                // ----------------------------------------
                // Project timeline itself
                // cannot have end before start.
                // ----------------------------------------

                if (
                    projectEndDate <
                    projectStartDate
                ) {
                    toast.error(
                        'Project end date cannot be before project start date.'
                    );

                    return;
                }

                // ----------------------------------------
                // Every step must remain completely
                // inside project timeline.
                // ----------------------------------------

                for (
                    let i = 0;
                    i < steps.length;
                    i++
                ) {
                    const step =
                        steps[i];

                    // ------------------------------------
                    // STEP START DATE
                    // ------------------------------------

                    if (
                        step.startDate
                    ) {
                        const stepStartDate =
                            new Date(
                                `${step.startDate}T00:00:00`
                            );

                        if (
                            stepStartDate <
                            projectStartDate
                        ) {
                            toast.error(
                                `Step ${i + 1
                                } (${step.name
                                }) starts on ${step.startDate
                                }, before project start date (${projectTimeline.start
                                }).`
                            );

                            return;
                        }

                        if (
                            stepStartDate >
                            projectEndDate
                        ) {
                            toast.error(
                                `Step ${i + 1
                                } (${step.name
                                }) starts on ${step.startDate
                                }, after project end date (${projectTimeline.end
                                }).`
                            );

                            return;
                        }
                    }

                    // ------------------------------------
                    // STEP END DATE
                    // ------------------------------------

                    if (
                        step.endDate
                    ) {
                        const stepEndDate =
                            new Date(
                                `${step.endDate}T00:00:00`
                            );

                        if (
                            stepEndDate <
                            projectStartDate
                        ) {
                            toast.error(
                                `Step ${i + 1
                                } (${step.name
                                }) ends on ${step.endDate
                                }, before project start date (${projectTimeline.start
                                }).`
                            );

                            return;
                        }

                        if (
                            stepEndDate >
                            projectEndDate
                        ) {
                            toast.error(
                                `Step ${i + 1
                                } (${step.name
                                }) ends on ${step.endDate
                                }, which is after project end date (${projectTimeline.end
                                }).`
                            );

                            return;
                        }
                    }

                    // ------------------------------------
                    // STEP START CANNOT BE AFTER END
                    // ------------------------------------

                    if (
                        step.startDate &&
                        step.endDate
                    ) {
                        const stepStartDate =
                            new Date(
                                `${step.startDate}T00:00:00`
                            );

                        const stepEndDate =
                            new Date(
                                `${step.endDate}T00:00:00`
                            );

                        if (
                            stepEndDate <
                            stepStartDate
                        ) {
                            toast.error(
                                `Step ${i + 1
                                } (${step.name
                                }) has an end date before its start date.`
                            );

                            return;
                        }
                    }
                }
            }

            setIsSaving(
                true
            );

            try {
                const orgIdToUse =
                    orgId ||
                    membersData
                        ?.data
                        ?.members?.[0]
                        ?.organization_id;

                if (
                    !orgIdToUse
                ) {
                    toast.error(
                        'Please select an organization first'
                    );

                    setIsSaving(
                        false
                    );

                    return;
                }

                const payload = {
                    templateId:
                        workflowId,

                    organizationId:
                        orgIdToUse,

                    name:
                        projectName,

                    description:
                        projectDescription,

                    client:
                        projectClient,

                    goal:
                        projectGoal,

                    status:
                        projectStatus,

                    priority:
                        projectPriority,

                    category:
                        projectCategory,

                    tags:
                        projectTags,

                    projectHead:
                        projectHead,

                    timeline:
                        projectTimeline,

                    attachments:
                        attachments,

                    steps:
                        steps.map(
                            (s) => ({
                                name:
                                    s.name,

                                role:
                                    s.role,

                                days:
                                    s.days,

                                assignees:
                                    s.assignees,

                                startDate:
                                    s.startDate,

                                endDate:
                                    s.endDate,
                            })
                        ),

                    assignedTo:
                        assignedTo,

                    stepDeadlines:
                        stepDeadlines,

                    stepAttachments:
                        stepAttachments,
                };

                await createWorkflow(
                    payload
                ).unwrap();

                toast.success(
                    `Project "${projectName}" created successfully! 🎉`
                );

                router.push(
                    '/dashboard'
                );
            } catch (
            error
            ) {
                console.error(
                    'Create project error:',
                    error
                );

                toast.error(
                    error?.data
                        ?.message ||
                    'Failed to create project'
                );
            } finally {
                setIsSaving(
                    false
                );
            }
        };

    // ============================================
    // LOADING
    // ============================================

    if (
        templateLoading ||
        membersLoading
    ) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />

                    <p className="mt-4 text-gray-500 dark:text-gray-400">
                        Loading project template...
                    </p>
                </div>
            </div>
        );
    }

    // ============================================
    // RENDER
    // ============================================

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-28">

            {/* ✅ FIX: max-w-4xl → max-w-6xl */}

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

                {/* ===== HEADER ===== */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: -10,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
                >
                    <div className="flex items-center gap-3">

                        <Link
                            href="/dashboard/workflows"
                            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>

                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                Project Settings
                            </h1>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Configure your project details, team, and workflow
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">

                        <motion.button
                            whileHover={{
                                scale: 1.02,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            onClick={
                                handlePreview
                            }
                            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm font-medium"
                        >
                            <Eye className="w-4 h-4" />

                            {showSummary
                                ? 'Hide Summary'
                                : 'Preview'}
                        </motion.button>

                        <motion.button
                            whileHover={{
                                scale: 1.02,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            onClick={
                                handleSave
                            }
                            disabled={
                                isSaving ||
                                isCreating
                            }
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 transition-all duration-200 text-sm"
                        >
                            {isSaving ||
                                isCreating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}

                            {isCreating
                                ? 'Creating...'
                                : 'Create Project'}
                        </motion.button>
                    </div>
                </motion.div>

                {/* ===== FORM ===== */}

                <div className="space-y-5">

                    {/* Section 1: Project Details */}

                    <ProjectDetails
                        projectName={
                            projectName
                        }
                        setProjectName={
                            setProjectName
                        }
                        projectDescription={
                            projectDescription
                        }
                        setProjectDescription={
                            setProjectDescription
                        }
                        projectClient={
                            projectClient
                        }
                        setProjectClient={
                            setProjectClient
                        }
                        projectGoal={
                            projectGoal
                        }
                        setProjectGoal={
                            setProjectGoal
                        }
                        projectStatus={
                            projectStatus
                        }
                        setProjectStatus={
                            setProjectStatus
                        }
                        projectPriority={
                            projectPriority
                        }
                        setProjectPriority={
                            setProjectPriority
                        }
                        projectCategory={
                            projectCategory
                        }
                        setProjectCategory={
                            setProjectCategory
                        }
                        projectTags={
                            projectTags
                        }
                        setProjectTags={
                            setProjectTags
                        }
                    />

                    {/* Section 2: Project Head & Timeline */}

                    <ProjectHeadTimeline
                        projectHead={
                            projectHead
                        }
                        setProjectHead={
                            setProjectHead
                        }
                        projectTimeline={
                            projectTimeline
                        }
                        setProjectTimeline={
                            setProjectTimeline
                        }
                        members={
                            members
                        }
                        user={user}
                        getUserName={
                            getUserName
                        }
                    />

                    {/* Section 3: Project Attachments */}

                    <ProjectAttachments
                        attachments={
                            attachments
                        }
                        setAttachments={
                            setAttachments
                        }
                    />

                    {/* Section 4: Team Overview */}


                    {/* Section 5: Quick Assign */}


                    <TeamAndAssign
                        assignedTo={
                            assignedTo
                        }
                        steps={
                            steps
                        }
                        projectHead={
                            projectHead
                        }
                        user={user}
                        assignedCount={
                            assignedCount
                        }
                        isFullyAssigned={
                            isFullyAssigned()
                        }
                        isProjectHeadSet={
                            isProjectHeadSet()
                        }
                        getUserName={
                            getUserName
                        }
                        members={
                            members
                        }
                        setAssignedTo={
                            setAssignedTo
                        }
                    />

                    {/* Section 6: Workflow Steps */}

                    <WorkflowSteps
                        steps={
                            steps
                        }
                        setSteps={
                            setSteps
                        }
                        assignedTo={
                            assignedTo
                        }
                        stepDeadlines={
                            stepDeadlines
                        }
                        stepAttachments={
                            stepAttachments
                        }
                        updateStep={
                            updateStep
                        }
                        removeStep={
                            removeStep
                        }
                        assignStep={
                            assignStep
                        }
                        removeAssignment={
                            removeAssignment
                        }
                        updateStepDeadline={
                            updateStepDeadline
                        }
                        moveStep={
                            moveStep
                        }
                        addStep={
                            addStep
                        }
                        addStepAttachment={
                            addStepAttachment
                        }
                        removeStepAttachment={
                            removeStepAttachment
                        }
                        onOpenAssignModal={(
                            idx
                        ) =>
                            setAssignModal({
                                open: true,
                                stepIndex:
                                    idx,
                            })
                        }
                        getUserName={
                            getUserName
                        }
                        totalDays={
                            totalDays
                        }
                        projectStartDate={
                            projectTimeline.start
                        }
                        projectEndDate={
                            projectTimeline.end
                        }
                    />

                    {/* Section 7: Project Summary (Preview) */}

                    <div
                        id="project-summary-preview"
                        className="scroll-mt-6"
                    >
                        <ProjectSummary
                            showSummary={
                                showSummary
                            }
                            projectName={
                                projectName
                            }
                            projectClient={
                                projectClient
                            }
                            projectGoal={
                                projectGoal
                            }
                            projectHead={
                                projectHead
                            }
                            projectTimeline={
                                projectTimeline
                            }
                            steps={
                                steps
                            }
                            members={
                                members
                            }
                            totalDays={
                                totalDays
                            }
                            projectStatus={
                                projectStatus
                            }
                            getUserName={
                                getUserName
                            }
                        />
                    </div>
                </div>
            </div>

            {/* ===== STICKY SAVE BAR ===== */}

            <div className="fixed bottom-0 left-0 right-0 z-40 px-4 py-3 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800">

                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                    <div className="flex items-center gap-3">

                        <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <Target className="w-4 h-4 text-gray-500" />
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-gray-900 dark:text-white">
                                Project Setup
                            </p>

                            <p className="text-[10px] text-gray-500">
                                {
                                    assignedCount
                                }{' '}
                                of{' '}
                                {
                                    steps.length
                                }{' '}
                                steps assigned
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">

                        <button
                            onClick={() =>
                                router.push(
                                    '/dashboard/workflows'
                                )
                            }
                            className="flex-1 sm:flex-none px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
                        >
                            Cancel
                        </button>

                        <motion.button
                            whileHover={{
                                scale: 1.02,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            onClick={
                                handleSave
                            }
                            disabled={
                                isSaving ||
                                isCreating
                            }
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 transition-all duration-200"
                        >
                            {isSaving ||
                                isCreating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Check className="w-4 h-4" />
                            )}

                            {isCreating
                                ? 'Creating...'
                                : 'Create Project'}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* ===== ASSIGN MODAL ===== */}

            {assignModal.open && (
                <AssignmentModal
                    isOpen={
                        assignModal.open
                    }
                    onClose={() =>
                        setAssignModal({
                            open: false,
                            stepIndex:
                                null,
                        })
                    }
                    members={
                        members
                    }
                    currentAssignee={
                        assignedTo[
                        assignModal
                            .stepIndex
                        ] || ''
                    }
                    stepName={
                        steps[
                            assignModal
                                .stepIndex
                        ]?.name ||
                        `Step ${assignModal.stepIndex +
                        1
                        }`
                    }
                    stepIndex={
                        assignModal.stepIndex
                    }
                    onAssign={(
                        userId
                    ) => {
                        if (
                            assignModal.stepIndex !==
                            null
                        ) {
                            assignStep(
                                assignModal.stepIndex,
                                userId
                            );
                        }
                    }}
                />
            )}
        </div>
    );
}
