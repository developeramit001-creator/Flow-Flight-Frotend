// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    const path = request.nextUrl.pathname;

    const isAuthPage = path === '/login' || path === '/signup';
    const isPublicPath = path === '/login' || path === '/signup' || path === '/_next' || path.startsWith('/api');

    if (!token && !isPublicPath && path !== '/') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
