// src/store/api/baseApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Base API - Sabhi APIs ka parent
 * - Cookies automatically send hongi (credentials: 'include')
 * - Error handling common
 * - Tag system for cache invalidation
 */
export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api`,
        credentials: 'include', // ✅ Cookies automatically send/receive
        prepareHeaders: (headers) => {
            // ✅ Sirf Content-Type set karo (token cookie mein hai)
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: [
        'Auth',
        'User',
        'Organization',
        'Member',
        'Project',
        'Task',
    ],
    endpoints: () => ({}),
});

export default baseApi;
