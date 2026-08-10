'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: 'var(--background)',
                        color: 'var(--foreground)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                    },
                    success: {
                        icon: '✅',
                    },
                    error: {
                        icon: '❌',
                    },
                }}
            />
        </>
    );
}
