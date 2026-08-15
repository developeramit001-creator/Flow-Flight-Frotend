// src/app/layout.jsx
import { Inter } from 'next/font/google';
import { StoreProvider } from '@/providers/StoreProvider';
import { AuthHydrator } from '@/providers/AuthHydrator';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'FlowPilot - Workflow Engine',
    description: 'Your Workflow, Our Engine.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
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
