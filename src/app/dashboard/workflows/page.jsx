
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    Loader2,
    Plus,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    X,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    useGetTemplatesQuery,
    useGetCategoriesQuery,
} from '@/store/api/workflowApi';
import { useGetMyOrganizationsQuery } from '@/store/api/memberApi';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

// ============================================
// SHIMMER CARD
// ============================================
const ShimmerCard = () => (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 overflow-hidden">
        <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] animate-shimmer" />

            <div className="flex-1 space-y-3">
                <div className="h-5 w-3/4 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] animate-shimmer" />

                <div className="h-4 w-full rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] animate-shimmer" />

                <div className="h-4 w-2/3 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] animate-shimmer" />

                <div className="flex gap-2 pt-1">
                    <div className="h-5 w-16 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] animate-shimmer" />

                    <div className="h-5 w-12 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] animate-shimmer" />
                </div>
            </div>
        </div>

        <div className="mt-3 flex gap-1 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="h-4 w-16 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] animate-shimmer" />

            <div className="h-4 w-12 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] animate-shimmer" />

            <div className="h-4 w-10 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] animate-shimmer" />
        </div>
    </div>
);

// ============================================
// WORKFLOW CARD
// ============================================
const WorkflowCard = ({
    workflow,
    onClick,
    index,
}) => (
    <motion.div
        initial={{
            opacity: 0,
            y: 20,
        }}
        animate={{
            opacity: 1,
            y: 0,
        }}
        transition={{
            delay: Math.min(index * 0.03, 0.3),
        }}
        whileHover={{
            y: -4,
            scale: 1.01,
        }}
        onClick={() => onClick(workflow.id)}
        className="group cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
    >
        <div className="flex items-start gap-3">
            <span className="text-3xl">
                {workflow.icon || '📌'}
            </span>

            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {workflow.name}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {workflow.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="text-xs px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full font-medium">
                        {workflow.category}
                    </span>

                    <span className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                        {workflow.steps?.length || 0} Steps
                    </span>

                    <span className="text-xs px-2.5 py-1 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-full">
                        {workflow.estimated_days || 0} Days
                    </span>
                </div>
            </div>
        </div>

        <div className="mt-3 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 overflow-hidden border-t border-gray-100 dark:border-gray-700 pt-3">
            {workflow.steps
                ?.slice(0, 4)
                .map((step, idx) => (
                    <span
                        key={idx}
                        className="truncate bg-gray-50 dark:bg-gray-700/50 px-2 py-0.5 rounded-full"
                    >
                        {step.name}

                        {idx < 3 && (
                            <span className="text-gray-300 dark:text-gray-600 ml-1">
                                →
                            </span>
                        )}
                    </span>
                ))}

            {workflow.steps?.length > 4 && (
                <span className="text-indigo-500 font-medium">
                    +{workflow.steps.length - 4} more
                </span>
            )}
        </div>
    </motion.div>
);

// ============================================
// MAIN
// ============================================
export default function WorkflowsPage() {
    const router = useRouter();

    const user = useSelector(
        (state) => state.auth.user
    );

    // ============================================
    // STATE
    // ============================================
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [page, setPage] = useState(1);

    const LIMIT = 20;

    // ============================================
    // CATEGORIES
    // ============================================
    const {
        data: categoriesData,
        isLoading: categoriesLoading,
    } = useGetCategoriesQuery();

    // ============================================
    // ORGANIZATIONS
    // ============================================
    const { data: orgsData } =
        useGetMyOrganizationsQuery();

    // ============================================
    // QUERY PARAMS
    // Backend handles:
    // - Search
    // - Category
    // - Pagination
    // ============================================
    const queryParams = useMemo(
        () => ({
            page,
            limit: LIMIT,

            category:
                selectedCategory === 'All'
                    ? ''
                    : selectedCategory,

            search: searchTerm.trim(),
        }),
        [
            page,
            selectedCategory,
            searchTerm,
        ]
    );

    // ============================================
    // GET TEMPLATES
    // ============================================
    const {
        data: templatesData,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useGetTemplatesQuery(
        queryParams,
        {
            skip: !user?.id,
        }
    );

    // ============================================
    // API DATA
    // ============================================
    const templates =
        templatesData?.data?.templates || [];

    const pagination =
        templatesData?.data?.pagination || {};

    const totalCount =
        pagination?.total || 0;

    const totalPages =
        pagination?.totalPages || 1;

    const currentPage =
        pagination?.page || page;

    // ============================================
    // CATEGORIES
    // ============================================
    const categories = useMemo(() => {
        if (
            categoriesData?.data?.categories
        ) {
            return [
                'All',
                ...categoriesData.data.categories.map(
                    (category) => category.name
                ),
            ];
        }

        return ['All'];
    }, [categoriesData]);

    // ============================================
    // CATEGORY COUNT
    // ============================================
    const getCategoryCount = (
        categoryName
    ) => {
        if (categoryName === 'All') {
            return totalCount;
        }

        return (
            categoriesData?.data?.categories?.find(
                (category) =>
                    category.name ===
                    categoryName
            )?.count || 0
        );
    };

    // ============================================
    // FILTER CHANGE
    // ============================================
    useEffect(() => {
        setPage(1);
    }, [
        selectedCategory,
        searchTerm,
    ]);

    // ============================================
    // SELECT WORKFLOW
    // ============================================
    const handleSelectWorkflow = async (
        workflowId
    ) => {
        try {
            toast.loading(
                'Loading workflow...',
                {
                    id: 'create-workflow',
                }
            );

            const orgId =
                orgsData?.data
                    ?.organizations?.[0]?.id;

            if (!orgId) {
                toast.error(
                    'Please create an organization first!',
                    {
                        id: 'create-workflow',
                    }
                );

                return;
            }

            router.push(
                `/dashboard/workflows/edit/${workflowId}?orgId=${orgId}`
            );

            toast.success(
                'Workflow loaded!',
                {
                    id: 'create-workflow',
                }
            );
        } catch (error) {
            console.error(
                'Workflow selection error:',
                error
            );

            toast.error(
                'Failed to load workflow. Please try again.',
                {
                    id: 'create-workflow',
                }
            );
        }
    };

    // ============================================
    // RETRY
    // ============================================
    const handleRetry = () => {
        refetch();

        toast.success(
            'Refreshing...'
        );
    };

    // ============================================
    // PAGINATION
    // ============================================
    const handlePageChange = (
        newPage
    ) => {
        if (
            newPage < 1 ||
            newPage > totalPages ||
            newPage === page ||
            isFetching
        ) {
            return;
        }

        setPage(newPage);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    // ============================================
    // PAGE BUTTONS
    // ============================================
    const getPageNumbers = () => {
        const pages = [];

        if (totalPages <= 7) {
            for (
                let i = 1;
                i <= totalPages;
                i++
            ) {
                pages.push(i);
            }

            return pages;
        }

        pages.push(1);

        if (page > 4) {
            pages.push('...');
        }

        const start = Math.max(
            2,
            page - 1
        );

        const end = Math.min(
            totalPages - 1,
            page + 1
        );

        for (
            let i = start;
            i <= end;
            i++
        ) {
            if (!pages.includes(i)) {
                pages.push(i);
            }
        }

        if (
            page <
            totalPages - 3
        ) {
            pages.push('...');
        }

        if (
            !pages.includes(totalPages)
        ) {
            pages.push(totalPages);
        }

        return pages;
    };

    // ============================================
    // HEADER
    // ============================================
    const renderHeader = () => (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <span className="text-4xl">
                        🚀
                    </span>

                    Workflow Templates

                    {!isLoading &&
                        !error && (
                            <span className="text-sm font-normal bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full">
                                {totalCount}
                            </span>
                        )}
                </h1>

                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {totalCount > 0
                        ? `Showing ${templates.length} of ${totalCount} workflows`
                        : 'Choose from ready-made workflows'}

                    {selectedCategory !==
                        'All' && (
                            <span className="ml-2 text-indigo-500 font-medium">
                                • Category:{' '}
                                {selectedCategory}
                            </span>
                        )}

                    {searchTerm && (
                        <span className="ml-2 text-indigo-500 font-medium">
                            • Search: "
                            {searchTerm}"
                        </span>
                    )}
                </p>
            </div>

            <button
                onClick={() =>
                    router.push(
                        '/dashboard/workflows/custom'
                    )
                }
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300"
            >
                <Plus className="h-5 w-5" />

                Custom Workflow
            </button>
        </div>
    );

    // ============================================
    // SEARCH + CATEGORIES
    // ============================================
    const renderSearchAndCategories =
        () => (
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

                    <input
                        type="text"
                        placeholder="Search workflows (YouTube, SEO, App, Design)..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                    />

                    {searchTerm && (
                        <button
                            onClick={() =>
                                setSearchTerm('')
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categoriesLoading ? (
                        <div className="flex gap-2">
                            {[
                                1,
                                2,
                                3,
                                4,
                                5,
                            ].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="h-9 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
                                    />
                                )
                            )}
                        </div>
                    ) : (
                        categories.map(
                            (category) => (
                                <button
                                    key={
                                        category
                                    }
                                    onClick={() => {
                                        if (
                                            selectedCategory !==
                                            category
                                        ) {
                                            setSelectedCategory(
                                                category
                                            );
                                        }
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedCategory ===
                                            category
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {category}

                                    {getCategoryCount(
                                        category
                                    ) >
                                        0 && (
                                            <span className="ml-1.5 text-xs opacity-70">
                                                (
                                                {getCategoryCount(
                                                    category
                                                )}
                                                )
                                            </span>
                                        )}
                                </button>
                            )
                        )
                    )}
                </div>
            </div>
        );

    // ============================================
    // PAGINATION UI
    // ============================================
    const renderPagination = () => {
        if (
            totalPages <= 1 ||
            templates.length === 0
        ) {
            return null;
        }

        return (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Page {currentPage} of{' '}
                    {totalPages}
                </p>

                <div className="flex items-center gap-1">
                    {/* PREVIOUS */}
                    <button
                        onClick={() =>
                            handlePageChange(
                                currentPage - 1
                            )
                        }
                        disabled={
                            currentPage === 1 ||
                            isFetching
                        }
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">
                            Previous
                        </span>
                    </button>

                    {/* PAGE NUMBERS */}
                    {getPageNumbers().map(
                        (pageNumber, index) => {
                            if (
                                pageNumber ===
                                '...'
                            ) {
                                return (
                                    <span
                                        key={`dots-${index}`}
                                        className="px-2 text-gray-400"
                                    >
                                        ...
                                    </span>
                                );
                            }

                            return (
                                <button
                                    key={
                                        pageNumber
                                    }
                                    onClick={() =>
                                        handlePageChange(
                                            pageNumber
                                        )
                                    }
                                    disabled={
                                        isFetching
                                    }
                                    className={`min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition ${currentPage ===
                                            pageNumber
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                            : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        } disabled:cursor-not-allowed`}
                                >
                                    {
                                        pageNumber
                                    }
                                </button>
                            );
                        }
                    )}

                    {/* NEXT */}
                    <button
                        onClick={() =>
                            handlePageChange(
                                currentPage + 1
                            )
                        }
                        disabled={
                            currentPage ===
                            totalPages ||
                            isFetching
                        }
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        <span className="hidden sm:inline">
                            Next
                        </span>
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        );
    };

    // ============================================
    // GRID
    // ============================================
    const renderGrid = () => {
        // ========================================
        // ERROR
        // ========================================
        if (error) {
            return (
                <div className="text-center py-16">
                    <div className="mx-auto h-20 w-20 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                        <AlertCircle className="h-10 w-10 text-red-500" />
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Failed to load
                        workflows
                    </h3>

                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        {error?.data
                            ?.message ||
                            error?.error ||
                            'Something went wrong. Please try again.'}
                    </p>

                    <button
                        onClick={
                            handleRetry
                        }
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        // ========================================
        // INITIAL LOADING
        // ========================================
        if (
            isLoading ||
            isFetching
        ) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({
                        length: 6,
                    }).map(
                        (_, index) => (
                            <ShimmerCard
                                key={`shimmer-${index}`}
                            />
                        )
                    )}
                </div>
            );
        }

        // ========================================
        // NO RESULTS
        // ========================================
        if (
            templates.length === 0
        ) {
            return (
                <div className="text-center py-16">
                    <div className="mx-auto h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Search className="h-10 w-10 text-gray-400" />
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                        No workflows
                        found
                    </h3>

                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        {searchTerm
                            ? `No workflows match your search "${searchTerm}". Try a different keyword.`
                            : selectedCategory !==
                                'All'
                                ? `No workflows found in category "${selectedCategory}". Try selecting a different category.`
                                : 'No workflows available right now. Please check back later.'}
                    </p>

                    {(searchTerm ||
                        selectedCategory !==
                        'All') && (
                            <button
                                onClick={() => {
                                    setSearchTerm(
                                        ''
                                    );

                                    setSelectedCategory(
                                        'All'
                                    );

                                    setPage(1);
                                }}
                                className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                            >
                                Clear Filters
                            </button>
                        )}
                </div>
            );
        }

        // ========================================
        // WORKFLOW GRID
        // ========================================
        return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map(
                        (
                            workflow,
                            index
                        ) => (
                            <WorkflowCard
                                key={
                                    workflow.id
                                }
                                workflow={
                                    workflow
                                }
                                index={
                                    index
                                }
                                onClick={
                                    handleSelectWorkflow
                                }
                            />
                        )
                    )}
                </div>

                {renderPagination()}
            </>
        );
    };

    // ============================================
    // RENDER
    // ============================================
    return (
        <div className="max-w-7xl mx-auto space-y-6 py-4">
            {renderHeader()}

            {renderSearchAndCategories()}

            {renderGrid()}
        </div>
    );
}

