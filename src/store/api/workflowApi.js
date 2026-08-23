import baseApi from './baseApi';

export const workflowApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ============================================
        // 1. GET ALL WORKFLOW TEMPLATES
        //    Search + Category + Pagination
        // ============================================
        getTemplates: builder.query({
            query: (params = {}) => {
                const {
                    page = 1,
                    limit = 20,
                    category = '',
                    search = '',
                    sortBy = 'name',
                    sortOrder = 'ASC',
                    minDays = '',
                    maxDays = '',
                    isActive = '',
                } = params;

                const queryParams =
                    new URLSearchParams();

                // Pagination
                queryParams.append(
                    'page',
                    page
                );

                queryParams.append(
                    'limit',
                    limit
                );

                // Category filter
                if (
                    category &&
                    category !== 'All' &&
                    category !== 'all'
                ) {
                    queryParams.append(
                        'category',
                        category
                    );
                }

                // Backend search
                if (search?.trim()) {
                    queryParams.append(
                        'search',
                        search.trim()
                    );
                }

                // Sorting
                if (sortBy) {
                    queryParams.append(
                        'sortBy',
                        sortBy
                    );
                }

                if (sortOrder) {
                    queryParams.append(
                        'sortOrder',
                        sortOrder
                    );
                }

                // Estimated days filters
                if (minDays !== '') {
                    queryParams.append(
                        'minDays',
                        minDays
                    );
                }

                if (maxDays !== '') {
                    queryParams.append(
                        'maxDays',
                        maxDays
                    );
                }

                // Active filter
                if (isActive !== '') {
                    queryParams.append(
                        'isActive',
                        isActive
                    );
                }

                return `/workflows/templates?${queryParams.toString()}`;
            },

            providesTags: (result) => [
                'Template',

                ...(result?.data?.templates || []).map(
                    (template) => ({
                        type: 'Template',
                        id: template.id,
                    })
                ),
            ],

            keepUnusedDataFor: 300,
        }),

        // ============================================
        // 2. GET SINGLE TEMPLATE
        // ============================================
        getTemplate: builder.query({
            query: (id) =>
                `/workflows/templates/${id}`,

            providesTags: (
                result,
                error,
                id
            ) => [
                    {
                        type: 'Template',
                        id,
                    },
                ],
        }),

        // ============================================
        // 3. GET TEMPLATE CATEGORIES
        // ============================================
        getCategories: builder.query({
            query: () =>
                '/workflows/templates/categories/all',

            providesTags: ['Category'],

            keepUnusedDataFor: 300,
        }),

        // ============================================
        // 4. CREATE WORKFLOW FROM TEMPLATE
        // ============================================
        createWorkflow: builder.mutation({
            query: (data) => ({
                url: '/workflows/create',
                method: 'POST',
                body: data,
            }),

            invalidatesTags: [
                'Workflow',
                'Template',
                'Stats',
            ],
        }),

        // ============================================
        // 5. GET USER'S WORKFLOWS
        // ============================================
        getMyWorkflows: builder.query({
            query: (params = {}) => {
                const {
                    page = 1,
                    limit = 20,
                    organizationId = '',
                    status = '',
                    search = '',
                    sortBy = 'created_at',
                    sortOrder = 'DESC',
                } = params;

                const queryParams =
                    new URLSearchParams();

                queryParams.append(
                    'page',
                    page
                );

                queryParams.append(
                    'limit',
                    limit
                );

                if (organizationId) {
                    queryParams.append(
                        'organizationId',
                        organizationId
                    );
                }

                if (status) {
                    queryParams.append(
                        'status',
                        status
                    );
                }

                if (search?.trim()) {
                    queryParams.append(
                        'search',
                        search.trim()
                    );
                }

                if (sortBy) {
                    queryParams.append(
                        'sortBy',
                        sortBy
                    );
                }

                if (sortOrder) {
                    queryParams.append(
                        'sortOrder',
                        sortOrder
                    );
                }

                return `/workflows/my?${queryParams.toString()}`;
            },

            providesTags: ['Workflow'],
        }),

        // ============================================
        // 6. GET WORKFLOW DETAILS
        // ============================================
        getWorkflowDetails: builder.query({
            query: (id) =>
                `/workflows/${id}`,

            providesTags: (
                result,
                error,
                id
            ) => [
                    {
                        type: 'Workflow',
                        id,
                    },
                ],
        }),

        // ============================================
        // 7. UPDATE WORKFLOW
        // ============================================
        updateWorkflow: builder.mutation({
            query: ({ id, data }) => ({
                url: `/workflows/${id}`,
                method: 'PUT',
                body: data,
            }),

            invalidatesTags: (
                result,
                error,
                { id }
            ) => [
                    {
                        type: 'Workflow',
                        id,
                    },
                    'Workflow',
                ],
        }),

        // ============================================
        // 8. DELETE WORKFLOW
        // ============================================
        deleteWorkflow: builder.mutation({
            query: (id) => ({
                url: `/workflows/${id}`,
                method: 'DELETE',
            }),

            invalidatesTags: [
                'Workflow',
                'Stats',
            ],
        }),

        // ============================================
        // 9. UPDATE TASK STATUS
        // ============================================
        updateTaskStatus: builder.mutation({
            query: ({
                taskId,
                data,
            }) => ({
                url: `/workflows/task/${taskId}`,
                method: 'PATCH',
                body: data,
            }),

            invalidatesTags: [
                'Workflow',
                'Stats',
            ],
        }),

        // ============================================
        // 10. GET DASHBOARD STATS
        // ============================================
        getWorkflowStats: builder.query({
            query: (
                organizationId = ''
            ) => {
                const queryParams =
                    new URLSearchParams();

                if (organizationId) {
                    queryParams.append(
                        'organizationId',
                        organizationId
                    );
                }

                return `/workflows/stats/dashboard?${queryParams.toString()}`;
            },

            providesTags: ['Stats'],
        }),

        // ============================================
        // 11. GET RECENT WORKFLOWS
        // ============================================
        getRecentWorkflows: builder.query({
            query: ({
                limit = 5,
                organizationId = '',
            } = {}) => {
                const queryParams =
                    new URLSearchParams();

                queryParams.append(
                    'limit',
                    limit
                );

                if (organizationId) {
                    queryParams.append(
                        'organizationId',
                        organizationId
                    );
                }

                return `/workflows/recent?${queryParams.toString()}`;
            },

            providesTags: ['Workflow'],
        }),

        // ============================================
        // 12. DUPLICATE WORKFLOW
        // ============================================
        duplicateWorkflow: builder.mutation({
            query: ({
                id,
                name,
            }) => ({
                url: `/workflows/${id}/duplicate`,
                method: 'POST',
                body: {
                    name,
                },
            }),

            invalidatesTags: [
                'Workflow',
                'Stats',
            ],
        }),
    }),
});

// ============================================
// AUTO GENERATED HOOKS
// ============================================
export const {
    useGetTemplatesQuery,
    useGetTemplateQuery,
    useGetCategoriesQuery,
    useCreateWorkflowMutation,
    useGetMyWorkflowsQuery,
    useGetWorkflowDetailsQuery,
    useUpdateWorkflowMutation,
    useDeleteWorkflowMutation,
    useUpdateTaskStatusMutation,
    useGetWorkflowStatsQuery,
    useGetRecentWorkflowsQuery,
    useDuplicateWorkflowMutation,
} = workflowApi;
