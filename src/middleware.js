// src/middleware.js
import { NextResponse } from 'next/server';

/**
 * FlowPilot Middleware
 *
 * 🔐 Auth Protection:
 * - Public paths (/, /login, /signup, /verify/*, /invite/*) → Always accessible
 * - Protected paths (/dashboard/*, /projects/*, /tasks/*) → Require login
 * - Auth paths (/login, /signup) → Redirect to home if already logged in
 */
export function middleware(request) {
    // ============================================
    // 1. GET TOKEN FROM COOKIE
    // ============================================
    const token = request.cookies.get('auth-token')?.value;
    const path = request.nextUrl.pathname;

    // ============================================
    // 2. DEFINE PUBLIC PATHS (Bina login ke access)
    // ============================================
    const publicPaths = [
        '/',                    // Home page
        '/login',               // Login page
        '/signup',              // Signup page
        '/verify-pending',      // Verify pending page
        '/_next',               // Next.js internal
    ];

    const publicPathPrefixes = [
        '/verify/',             // Email verification (/verify/:token)
        '/invite/',             // Invite accept (/invite/:token)
        '/api/',                // API routes
    ];

    const isPublicPath =
        publicPaths.includes(path) ||
        publicPathPrefixes.some(prefix => path.startsWith(prefix));

    // ============================================
    // 3. IDENTIFY AUTH PAGES (Login/Signup)
    // ============================================
    const isAuthPage = path === '/login' || path === '/signup';

    // ============================================
    // 4. IDENTIFY PROTECTED PAGES (Login required)
    // ============================================
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

    // ============================================
    // 5. AUTH LOGIC
    // ============================================

    // 🔐 CASE 1: Token nahi hai aur protected path hai → Login par bhejo
    if (!token && isProtectedPath) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', path);
        return NextResponse.redirect(loginUrl);
    }

    // 🔐 CASE 2: Token hai aur auth page (login/signup) hai → Home par bhejo
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 🔐 CASE 3: Token nahi hai aur root path hai → Home page dikhao (allow)
    // ✅ Already public, so allow

    // 🔐 CASE 4: Token nahi hai aur public path hai → Allow
    // ✅ Already public, so allow

    // ============================================
    // 6. DEFAULT: ALLOW ACCESS
    // ============================================
    return NextResponse.next();
}

// ============================================
// 7. CONFIG - Which paths middleware runs on
// ============================================
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon)
         * - public folder (public assets)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
    ],
};
