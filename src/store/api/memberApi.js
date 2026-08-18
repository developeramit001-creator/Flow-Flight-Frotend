// src/store/api/memberApi.js
import baseApi from './baseApi';

export const memberApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ============================================
        // 1. GET ALL MEMBERS
        // ============================================
        getMembers: builder.query({
            query: (orgId) => `/${orgId}/members`,
            providesTags: ['Member'],
        }),

        // ============================================
        // 2. INVITE MEMBER
        // ============================================
        inviteMember: builder.mutation({
            query: ({ orgId, email, role }) => ({
                url: `/${orgId}/invite`,
                method: 'POST',
                body: { email, role },
            }),
            invalidatesTags: ['Member', 'Invite'],
        }),

        // ============================================
        // 3. REMOVE MEMBER
        // ============================================
        removeMember: builder.mutation({
            query: ({ orgId, memberId }) => ({
                url: `/${orgId}/members/${memberId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Member'],
        }),

        // ============================================
        // 4. UPDATE MEMBER ROLE
        // ============================================
        updateMemberRole: builder.mutation({
            query: ({ orgId, memberId, role }) => ({
                url: `/${orgId}/members/${memberId}/role`,
                method: 'PUT',
                body: { role },
            }),
            invalidatesTags: ['Member'],
        }),

        // ============================================
        // 5. ACCEPT INVITE
        // ============================================
        acceptInvite: builder.mutation({
            query: ({ token, userId }) => ({
                url: `/accept-invite/${token}`,
                method: 'POST',
                body: { userId },
            }),
        }),

        // ============================================
        // 6. GET PENDING INVITES
        // ============================================
        getPendingInvites: builder.query({
            query: (orgId) => `/${orgId}/invites/pending`,
            providesTags: ['Invite'],
        }),

        // ============================================
        // 7. RESEND INVITE ✅ NEW
        // ============================================
        resendInvite: builder.mutation({
            query: ({ orgId, email }) => ({
                url: `/${orgId}/invites/resend`,
                method: 'POST',
                body: { email },
            }),
            invalidatesTags: ['Invite'],
        }),
    }),
});

export const {
    useGetMembersQuery,
    useInviteMemberMutation,
    useRemoveMemberMutation,
    useUpdateMemberRoleMutation,
    useAcceptInviteMutation,
    useGetPendingInvitesQuery,
    useResendInviteMutation,  // ✅ NEW
} = memberApi;
