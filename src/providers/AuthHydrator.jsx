// src/providers/AuthHydrator.jsx
'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hydrateAuth, clearUser, setUser } from '@/store/slices/authSlice';
import { useGetCurrentUserQuery } from '@/store/api/authApi';

export function AuthHydrator({ children }) {
    const dispatch = useDispatch();

    // ✅ 1. Hydrate from localStorage (immediate)
    useEffect(() => {
        dispatch(hydrateAuth());
    }, [dispatch]);

    // ✅ 2. Server se fresh user data fetch karo
    const { data, isLoading, error } = useGetCurrentUserQuery(undefined, {
        // Cookie automatically sends with request
    });

    useEffect(() => {
        if (data?.success && data?.data?.user) {
            // ✅ Fresh user data Redux store mein save karo
            dispatch(setUser({ user: data.data.user }));
        }
        if (error) {
            // ❌ Token invalid/expired → Clear user
            dispatch(clearUser());
        }
    }, [data, error, dispatch]);

    // ⏳ Loading state
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
        );
    }

    return children;
}
