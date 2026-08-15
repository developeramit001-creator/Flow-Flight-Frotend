// src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    organization: null,
    isAuthenticated: false,
    isLoading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // ✅ Set user data (login/register success)
        setUser: (state, action) => {
            const { user, organization } = action.payload;
            if (user) {
                state.user = user;
                state.isAuthenticated = true;
            }
            if (organization) {
                state.organization = organization;
            }
            state.isLoading = false;
        },

        // ✅ Clear user data (logout)
        clearUser: (state) => {
            state.user = null;
            state.organization = null;
            state.isAuthenticated = false;
            state.isLoading = false;
        },

        // ✅ Update user profile
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },

        // ✅ Set organization
        setOrganization: (state, action) => {
            state.organization = action.payload;
        },

        // ✅ Set loading state
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },

        // ✅ Hydrate from localStorage (for initial load)
        hydrateAuth: (state) => {
            try {
                const user = localStorage.getItem('user');
                const organization = localStorage.getItem('organization');

                if (user) {
                    state.user = JSON.parse(user);
                    state.isAuthenticated = true;
                }
                if (organization) {
                    state.organization = JSON.parse(organization);
                }
            } catch (error) {
                console.error('Hydrate error:', error);
            }
            state.isLoading = false;
        },
    },
});

export const {
    setUser,
    clearUser,
    updateUser,
    setOrganization,
    setLoading,
    hydrateAuth   // ✅ YEH EXPORT HONA CHAHIYE
} = authSlice.actions;

export default authSlice.reducer;
