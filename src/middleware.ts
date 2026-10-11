import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'glowseoul_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie || !sessionCookie.includes('.')) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const [payloadBase64] = sessionCookie.split('.');
      if (!payloadBase64) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      const jsonStr = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const session = JSON.parse(jsonStr);

      if (!session || (session.expiresAt && Date.now() > session.expiresAt)) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (session.role !== 'ADMIN' && session.role !== 'STAFF') {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(loginUrl);
      }
    } catch {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in as ADMIN/STAFF and visiting /admin/login, redirect to /admin
  if (pathname === '/admin/login') {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (sessionCookie && sessionCookie.includes('.')) {
      try {
        const [payloadBase64] = sessionCookie.split('.');
        const jsonStr = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
        const session = JSON.parse(jsonStr);
        if (session && (!session.expiresAt || Date.now() <= session.expiresAt)) {
          if (session.role === 'ADMIN' || session.role === 'STAFF') {
            return NextResponse.redirect(new URL('/admin', request.url));
          }
        }
      } catch {
        // Allow proceeding to login page if token corrupted
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
