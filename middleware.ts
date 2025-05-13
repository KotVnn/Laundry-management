import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get('accessToken')?.value;

  const protectedRoutes = ['/man', '/profile', '/settings'];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (pathname === '/login' && accessToken) {
    // Chỉ cần biết có token là redirect
    return NextResponse.redirect(new URL('/man', request.url));
  }

  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL(`/login?redirect=${request.nextUrl.pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/man/:path*', '/profile/:path*', '/settings/:path*'],
};
