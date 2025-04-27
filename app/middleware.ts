import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('auth')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/dashboard/habits',
    '/dashboard/settings',
  ];

  // Check if path is a protected route (starts with any of the protected routes)
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If accessing a protected route and not logged in, redirect to signin
  if (isProtectedRoute && !currentUser) {
    const url = new URL('/auth/signin', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Continue with the request
  return NextResponse.next();
}

// Configure matcher for routes that should be checked by the middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
}; 