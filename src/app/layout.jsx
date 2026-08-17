// src/app/layout.jsx
import { Inter } from 'next/font/google';
import { StoreProvider } from '@/providers/StoreProvider';
import { AuthHydrator } from '@/providers/AuthHydrator';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
    weight: ['400', '500', '600', '700', '800'],
});

export const metadata = {
    title: 'FlowPilot - Workflow Engine',
    description: 'Your Workflow, Our Engine.',
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning className={inter.variable}>
            <body className="font-sans antialiased">
                <StoreProvider>
                    <AuthHydrator>
                        <ThemeProvider>
                            <ToastProvider>
                                {children}
                                <Toaster position="top-right" />
                            </ToastProvider>
                        </ThemeProvider>
                    </AuthHydrator>
                </StoreProvider>
            </body>
        </html>
    );
}
