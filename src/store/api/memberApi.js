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
        // 6. GET PENDING INVITES (Organization)
        // ============================================
        getPendingInvites: builder.query({
            query: (orgId) => `/${orgId}/invites/pending`,
            providesTags: ['Invite'],
        }),

        // ============================================
        // 7. RESEND INVITE
        // ============================================
        resendInvite: builder.mutation({
            query: ({ orgId, email }) => ({
                url: `/${orgId}/invites/resend`,
                method: 'POST',
                body: { email },
            }),
            invalidatesTags: ['Invite'],
        }),

        // ============================================
        // 8. GET INVITE DETAILS (Public)
        // ============================================
        getInviteDetails: builder.query({
            query: (token) => `/invite/${token}`,
            providesTags: ['Invite'],
        }),

        // ============================================
        // 9. GET MY INVITES (Dashboard) ✅ NEW
        // ============================================
        getMyInvites: builder.query({
            query: () => '/my/invites',
            providesTags: ['Invite'],
        }),

        // ============================================
        // 10. REJECT INVITE ✅ NEW
        // ============================================
        rejectInvite: builder.mutation({
            query: (inviteId) => ({
                url: `/invites/${inviteId}/reject`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Invite'],
        }),
        getMyOrganizations: builder.query({
            query: () => '/organizations/my/organizations',
            providesTags: ['Organization'],
        }),
    }),
});
// api/organizations/my/organizations

// ✅ Auto-generated hooks
export const {
    useGetMembersQuery,
    useInviteMemberMutation,
    useRemoveMemberMutation,
    useUpdateMemberRoleMutation,
    useAcceptInviteMutation,
    useGetPendingInvitesQuery,
    useResendInviteMutation,
    useGetInviteDetailsQuery,
    useGetMyInvitesQuery,    // ✅ NEW
    useRejectInviteMutation, // ✅ NEW
    useGetMyOrganizationsQuery
} = memberApi;
