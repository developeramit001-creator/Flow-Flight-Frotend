// src/app/(auth)/signup/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Mail, Lock, User, Building2, Loader2, Eye, EyeOff,
    Sparkles, Calendar, CheckCircle, AlertCircle, Moon, Sun
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRegisterMutation } from '@/store/api/authApi';
import { useTheme } from '@/providers/ThemeProvider';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const [register, { isLoading }] = useRegisterMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        dob: '',
        orgName: '',
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateField = (field, value) => {
        switch (field) {
            case 'name':
                if (!value) return 'Full name is required';
                if (value.length < 2) return 'Name must be at least 2 characters';
                return '';
            case 'email':
                if (!value) return 'Email is required';
                if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address';
                return '';
            case 'password':
                if (!value) return 'Password is required';
                if (value.length < 6) return 'Password must be at least 6 characters';
                return '';
            case 'dob':
                if (!value) return 'Date of birth is required';
                const age = (new Date().getTime() - new Date(value).getTime()) / (365.25 * 24 * 60 * 60 * 1000);
                if (age < 18) return 'You must be 18 or older';
                return '';
            case 'orgName':
                if (!value) return 'Organization name is required';
                if (value.length < 2) return 'Organization name must be at least 2 characters';
                return '';
            default:
                return '';
        }
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
        const error = validateField(field, formData[field]);
        if (error) {
            setErrors({ ...errors, [field]: error });
        } else {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (touched[field]) {
            const error = validateField(field, value);
            setErrors({ ...errors, [field]: error });
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            dob: '',
            orgName: '',
        });
        setErrors({});
        setTouched({});
        setShowPassword(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const result = await register(formData).unwrap();

            if (result.success) {
                toast.success('Account created successfully! 🎉', {
                    icon: '✅',
                    duration: 4000,
                });

                toast.info('Please check your email to verify your account.', {
                    icon: '📧',
                    duration: 5000,
                });

                localStorage.setItem('registerEmail', formData.email);
                resetForm();

                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (error) {
            const message = error?.data?.message || 'Registration failed. Please try again.';
            toast.error(message, {
                icon: '❌',
                duration: 4000,
            });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md rounded-2xl glass p-8 border border-white/20 dark:border-gray-800/50 shadow-2xl relative"
            >
                {/* Dark Mode Toggle - Top Right */}
                <div className="absolute top-4 right-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-5 w-5 text-yellow-400" />
                        ) : (
                            <Moon className="h-5 w-5 text-gray-600" />
                        )}
                    </button>
                </div>

                {/* HEADER */}
                <div className="text-center">
                    <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <Sparkles className="h-7 w-7 text-white" />
                    </div>
                    <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Start your workflow journey
                    </p>
                </div>

                {/* FORM */}
                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Full Name
                        </label>
                        <div className="mt-1 relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                onBlur={() => handleBlur('name')}
                                className={`w-full rounded-lg border ${errors.name && touched.name
                                    ? 'border-red-500'
                                    : 'border-gray-200 dark:border-gray-700'
                                    } bg-white dark:bg-gray-900 pl-10 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none`}
                                placeholder="Amit Sharma"
                            />
                            {errors.name && touched.name && (
                                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email Address
                        </label>
                        <div className="mt-1 relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                onBlur={() => handleBlur('email')}
                                className={`w-full rounded-lg border ${errors.email && touched.email
                                    ? 'border-red-500'
                                    : 'border-gray-200 dark:border-gray-700'
                                    } bg-white dark:bg-gray-900 pl-10 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none`}
                                placeholder="you@company.com"
                            />
                            {errors.email && touched.email && (
                                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <div className="mt-1 relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                onBlur={() => handleBlur('password')}
                                className={`w-full rounded-lg border ${errors.password && touched.password
                                    ? 'border-red-500'
                                    : 'border-gray-200 dark:border-gray-700'
                                    } bg-white dark:bg-gray-900 pl-10 pr-10 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                            {errors.password && touched.password && (
                                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.password}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Date of Birth
                        </label>
                        <div className="mt-1 relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="date"
                                value={formData.dob}
                                onChange={(e) => handleChange('dob', e.target.value)}
                                onBlur={() => handleBlur('dob')}
                                className={`w-full rounded-lg border ${errors.dob && touched.dob
                                    ? 'border-red-500'
                                    : 'border-gray-200 dark:border-gray-700'
                                    } bg-white dark:bg-gray-900 pl-10 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none`}
                            />
                            {errors.dob && touched.dob && (
                                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.dob}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Organization Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Organization Name
                        </label>
                        <div className="mt-1 relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={formData.orgName}
                                onChange={(e) => handleChange('orgName', e.target.value)}
                                onBlur={() => handleBlur('orgName')}
                                className={`w-full rounded-lg border ${errors.orgName && touched.orgName
                                    ? 'border-red-500'
                                    : 'border-gray-200 dark:border-gray-700'
                                    } bg-white dark:bg-gray-900 pl-10 p-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition outline-none`}
                                placeholder="Your Company Name"
                            />
                            {errors.orgName && touched.orgName && (
                                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.orgName}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Create Account
                            </>
                        )}
                    </button>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
