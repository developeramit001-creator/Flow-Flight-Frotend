// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
    // ✅ Cookie name change karo: 'auth-token' → 'accessToken'
    const token = request.cookies.get('accessToken')?.value;  // ✅ CHANGE KARO
    const path = request.nextUrl.pathname;

    const publicPaths = [
        '/',
        '/login',
        '/signup',
        '/verify-pending',
        '/_next',
    ];

    const publicPathPrefixes = [
        '/verify/',
        '/invite/',
        '/api/',
    ];

    const isPublicPath =
        publicPaths.includes(path) ||
        publicPathPrefixes.some(prefix => path.startsWith(prefix));

    const isAuthPage = path === '/login' || path === '/signup';

    const isProtectedPath =
        path.startsWith('/dashboard') ||
        path.startsWith('/projects') ||
        path.startsWith('/tasks') ||
        path.startsWith('/team') ||
        path.startsWith('/clients') ||
        path.startsWith('/resources') ||
        path.startsWith('/chat') ||
        path.startsWith('/settings') ||
        path.startsWith('/workflows') ||
        path === '/profile' ||
        path === '/account';

    // 🔐 Token nahi hai aur protected path hai → Login par bhejo
    if (!token && isProtectedPath) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', path);
        return NextResponse.redirect(loginUrl);
    }

    // 🔐 Token hai aur auth page (login/signup) hai → Dashboard par bhejo
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)'],
};
