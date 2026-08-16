// src/store/api/authApi.js
import baseApi from './baseApi';
import { setUser, clearUser } from '../slices/authSlice'; // ✅ IMPORT KARO

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ============================================
        // 1. REGISTER
        // ============================================
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
            onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
                try {
                    const { data } = await queryFulfilled;
                    if (data.success) {
                        const { user, organization } = data.data;
                        // ✅ setUser use karo
                        dispatch(setUser({ user, organization }));
                    }
                } catch (error) {
                    console.error('Register error:', error);
                }
            },
            invalidatesTags: ['Auth'],
        }),

        // ============================================
        // 2. LOGIN
        // ============================================
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
                try {
                    const { data } = await queryFulfilled;
                    if (data.success) {
                        const { user, organizations } = data.data;
                        const organization = organizations?.[0] || null;
                        // ✅ setUser use karo
                        dispatch(setUser({ user, organization }));
                    }
                } catch (error) {
                    console.error('Login error:', error);
                }
            },
            invalidatesTags: ['Auth'],
        }),

        // ============================================
        // 3. LOGOUT
        // ============================================
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            onQueryStarted: async (arg, { dispatch }) => {
                // ✅ clearUser use karo
                dispatch(clearUser());
            },
            invalidatesTags: ['Auth'],
        }),

        // ============================================
        // 4. GET CURRENT USER
        // ============================================
        getCurrentUser: builder.query({
            query: () => '/auth/me',
            providesTags: ['User'],
            onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
                try {
                    const { data } = await queryFulfilled;
                    if (data.success) {
                        const { user } = data.data;
                        // ✅ setUser use karo
                        dispatch(setUser({ user }));
                    }
                } catch (error) {
                    console.error('Get user error:', error);
                }
            },
        }),

        // ============================================
        // 5. VERIFY EMAIL
        // ============================================
        verifyEmail: builder.query({
            query: (token) => `/auth/verify/${token}`,
            providesTags: ['Auth'],
        }),

        // ============================================
        // 6. RESEND VERIFICATION
        // ============================================
        resendVerification: builder.mutation({
            query: (email) => ({
                url: '/auth/resend-verification',
                method: 'POST',
                body: { email },
            }),
        }),

        // ============================================
        // 7. REFRESH TOKEN
        // ============================================
        refreshToken: builder.mutation({
            query: () => ({
                url: '/auth/refresh-token',
                method: 'POST',
            }),
        }),
    }),
});

// ✅ Auto-generated hooks
export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useGetCurrentUserQuery,
    useVerifyEmailQuery,
    useResendVerificationMutation,
    useRefreshTokenMutation,
} = authApi;
