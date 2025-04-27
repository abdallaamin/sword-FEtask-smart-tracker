"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  
  // Skip rendering navbar on auth pages
  if (pathname.startsWith("/auth/")) {
    return null;
  }
  
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">Happit</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {!isLoading && !user ? (
            // Not authenticated - show sign in and sign up buttons
            <>
              <Link 
                href="/auth/signin"
                className="px-4 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Sign in
              </Link>
              <Link 
                href="/auth/signup"
                className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Sign up
              </Link>
            </>
          ) : !isLoading && user ? (
            // Authenticated - show user menu
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className={`px-3 py-1.5 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${
                  pathname.startsWith("/dashboard") ? "bg-accent text-accent-foreground" : ""
                }`}
              >
                Dashboard
              </Link>
              
              <Link 
                href="/dashboard/profile"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                {user.picture ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={user.picture}
                      alt={user.name || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </Link>
            </div>
          ) : (
            // Loading state
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
          )}
        </div>
      </div>
    </nav>
  );
} 