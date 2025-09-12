import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register', '/about'];

export function middleware(req: NextRequest) {
    const token = req.cookies.get('access_token')?.value;
    const { pathname } = req.nextUrl;

    const isPublic = PUBLIC_ROUTES.some(route => pathname.startsWith(route));

    if (isPublic && token) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (!isPublic && !token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
