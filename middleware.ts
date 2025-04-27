import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

// We can't access localStorage in middleware, so we'll need to use cookies
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is a protected route
  const isProtectedRoute = 
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/profile");
  
  // Check if the path is an auth route
  const isAuthRoute = 
    pathname.startsWith("/auth/signin") || 
    pathname.startsWith("/auth/signup");
  
  // We'll prioritize checking for NextAuth token
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // Then check for our custom auth cookie
  const authCookie = request.cookies.get("auth");
  const isAuthenticated = !!token || !!authCookie;
  
  if (isProtectedRoute && !isAuthenticated) {
    // If we're not authenticated and trying to access a protected route
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }
  
  if (isAuthRoute && isAuthenticated) {
    // If we're authenticated and trying to access an auth route
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  return NextResponse.next();
}

// Configure the paths that the middleware should run on
export const config = {
  matcher: [
    // Routes that require authentication
    "/dashboard/:path*",
    "/profile/:path*",
    // Auth routes that should redirect authenticated users
    "/auth/signin",
    "/auth/signup",
  ],
}; 