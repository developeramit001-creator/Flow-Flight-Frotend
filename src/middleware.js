// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('auth-token')?.value;
    const path = request.nextUrl.pathname;

    // ✅ Public paths (bina login ke access)
    const isPublicPath =
        path === '/login' ||
        path === '/signup' ||
        path.startsWith('/verify/') ||      // ✅ Email verification
        path.startsWith('/invite/') ||      // ✅ Invite accept
        path === '/verify-pending' ||       // ✅ Verify pending page
        path === '/_next' ||
        path.startsWith('/api');

    const isAuthPage = path === '/login' || path === '/signup';

    // Agar token nahi hai aur public path nahi hai → login par bhejo
    if (!token && !isPublicPath && path !== '/') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Agar token hai aur auth page par hai → dashboard par bhejo
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
