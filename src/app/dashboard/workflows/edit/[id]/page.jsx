// src/app/dashboard/workflows/edit/[id]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetTemplateQuery, useCreateWorkflowMutation } from '@/store/api/workflowApi';
import { useGetMyOrganizationsQuery } from '@/store/api/memberApi';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Loader2, ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function EditWorkflowPage({ params }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const workflowId = params.id;
    const orgId = searchParams.get('orgId');

    const user = useSelector((state) => state.auth.user);

    // ✅ State
    const [workflowName, setWorkflowName] = useState('');
    const [steps, setSteps] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    // ✅ API Hooks
    const { data: templateData, isLoading: templateLoading } = useGetTemplateQuery(workflowId, {
        skip: !workflowId,
    });

    const { data: orgsData } = useGetMyOrganizationsQuery();
    const [createWorkflow, { isLoading: isCreating }] = useCreateWorkflowMutation();

    // ✅ Load template data
    useEffect(() => {
        if (templateData?.data) {
            const template = templateData.data;
            setWorkflowName(template.name);
            setSteps(template.steps || []);
        }
    }, [templateData]);

    // ✅ Add step
    const addStep = () => {
        setSteps([
            ...steps,
            { name: '', role: '', days: 1 }
        ]);
    };

    // ✅ Remove step
    const removeStep = (index) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    // ✅ Update step
    const updateStep = (index, field, value) => {
        const newSteps = [...steps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setSteps(newSteps);
    };

    // ✅ Save workflow
    const handleSave = async () => {
        if (!workflowName.trim()) {
            toast.error('Please enter a workflow name');
            return;
        }

        if (steps.length === 0) {
            toast.error('Please add at least one step');
            return;
        }

        // ✅ Validate steps
        for (let i = 0; i < steps.length; i++) {
            if (!steps[i].name.trim()) {
                toast.error(`Step ${i + 1} name is required`);
                return;
            }
            if (!steps[i].role.trim()) {
                toast.error(`Step ${i + 1} role is required`);
                return;
            }
        }

        setIsSaving(true);

        try {
            const orgIdToUse = orgId || orgsData?.data?.organizations?.[0]?.id;

            if (!orgIdToUse) {
                toast.error('Please select an organization first');
                setIsSaving(false);
                return;
            }

            const result = await createWorkflow({
                templateId: workflowId,
                organizationId: orgIdToUse,
                name: workflowName,
                customSteps: steps,
            }).unwrap();

            toast.success('Workflow created successfully! 🎉');
            router.push(`/dashboard/workflows/${result.data.workflowId}`);
        } catch (error) {
            console.error('Create workflow error:', error);
            toast.error(error?.data?.message || 'Failed to create workflow');
        } finally {
            setIsSaving(false);
        }
    };

    // ============================================
    // LOADING
    // ============================================
    if (templateLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
                    <p className="mt-4 text-gray-500 dark:text-gray-400">Loading workflow template...</p>
                </div>
            </div>
        );
    }

    // ============================================
    // MAIN
    // ============================================
    return (
        <div className="max-w-4xl mx-auto space-y-6 py-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/workflows"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Edit Workflow
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Customize your workflow steps and assignments
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving || isCreating}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving || isCreating ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <Save className="h-5 w-5" />
                    )}
                    Save Workflow
                </button>
            </div>

            {/* Workflow Name */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Workflow Name
                </label>
                <input
                    type="text"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                    placeholder="Enter workflow name..."
                />
            </div>

            {/* Steps */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Workflow Steps
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Add, edit, or remove steps
                        </p>
                    </div>
                    <button
                        onClick={addStep}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
                    >
                        <Plus className="h-4 w-4" />
                        Add Step
                    </button>
                </div>

                {/* Steps List */}
                <div className="space-y-3">
                    {steps.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            No steps added yet. Click "Add Step" to get started.
                        </div>
                    ) : (
                        steps.map((step, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </div>

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Step Name
                                        </label>
                                        <input
                                            type="text"
                                            value={step.name}
                                            onChange={(e) => updateStep(index, 'name', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                                            placeholder="e.g., Research"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            value={step.role}
                                            onChange={(e) => updateStep(index, 'role', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                                            placeholder="e.g., Content Writer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Days
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={step.days}
                                            onChange={(e) => updateStep(index, 'days', parseInt(e.target.value) || 1)}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                                            placeholder="1"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeStep(index)}
                                    className="flex-shrink-0 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Summary */}
            {steps.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                            Total Steps: <span className="font-medium text-gray-900 dark:text-white">{steps.length}</span>
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                            Total Days: <span className="font-medium text-gray-900 dark:text-white">
                                {steps.reduce((sum, step) => sum + (step.days || 0), 0)}
                            </span>
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                            Roles: <span className="font-medium text-gray-900 dark:text-white">
                                {new Set(steps.map(s => s.role)).size} unique roles
                            </span>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
