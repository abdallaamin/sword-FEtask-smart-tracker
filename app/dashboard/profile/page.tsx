"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-32 h-32 overflow-hidden rounded-full border-4 border-primary/20">
            {user.picture ? (
              <Image
                src={user.picture}
                alt={user.name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {user.name || "User"}
            </h1>
            <p className="text-muted-foreground mb-4">{user.email}</p>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors duration-200 disabled:opacity-50"
              >
                {isLoggingOut ? "Logging out..." : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 