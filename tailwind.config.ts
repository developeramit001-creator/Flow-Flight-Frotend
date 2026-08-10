import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            keyframes: {
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'pulse-ring': {
                    '0%': { transform: 'scale(0.95)', opacity: '0.7' },
                    '50%': { transform: 'scale(1.05)', opacity: '0.3' },
                    '100%': { transform: 'scale(0.95)', opacity: '0.7' },
                },
                'slide-in': {
                    '0%': { transform: 'translateX(-100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                }
            },
            animation: {
                'fade-in-up': 'fade-in-up 0.4s ease-out',
                'pulse-ring': 'pulse-ring 2s ease-in-out infinite',
                'slide-in': 'slide-in 0.3s ease-out',
            }
        },
    },
    plugins: [],
};
export default config;
