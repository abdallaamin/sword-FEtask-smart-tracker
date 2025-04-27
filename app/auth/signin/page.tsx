"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import Cookies from "js-cookie";

// Simple hash function - must match the one in the API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user just registered
    const registered = searchParams.get("registered");
    if (registered === "true") {
      setSuccess("Account created successfully! Please sign in.");
    }

    // Check if already logged in
    const checkAuth = async () => {
      try {
        if (typeof window !== "undefined") {
          const currentUser = localStorage.getItem("currentUser");
          if (currentUser) {
            // User is already logged in, redirect to dashboard
            console.log("User already logged in, redirecting to dashboard");
            
            // Set auth cookie for middleware
            Cookies.set('auth', 'true', { expires: 7, path: '/' });
            
            // Use router.replace to avoid history issues
            router.replace("/dashboard");
          }
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      }
    };

    checkAuth();
  }, [router, searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // For debugging: Log what we're looking for
      console.log("Attempting login with email:", email);
      
      // Make sure we're running in the browser
      if (typeof window === "undefined") {
        throw new Error("Cannot access localStorage in server-side rendering");
      }
      
      // Get users from localStorage
      const storedUsers = localStorage.getItem("users");
      if (!storedUsers) {
        console.log("No users found in localStorage");
        throw new Error("Invalid email or password");
      }

      // For debugging: Log stored users
      console.log("Users in localStorage:", storedUsers);
      
      const users = JSON.parse(storedUsers);
      const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        console.log("User not found for email:", email);
        throw new Error("Invalid email or password");
      }

      // For debugging: Log the user we found
      console.log("Found user:", user);
      
      // Hash the entered password and compare with stored hash
      const hashedPassword = await hashPassword(password);
      
      // For debugging: Log the hashed passwords
      console.log("Entered password hash:", hashedPassword);
      console.log("Stored password hash:", user.password);
      
      // Compare the hashed password with the stored hash
      if (hashedPassword !== user.password) {
        console.log("Password mismatch");
        throw new Error("Invalid email or password");
      }

      // Create a user object without the password for storage
      const { password: _, ...userWithoutPassword } = user;
      
      // Set the current user in localStorage
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      
      // Set auth cookie for middleware
      Cookies.set('auth', 'true', { expires: 7, path: '/' });
      
      console.log("User logged in successfully:", userWithoutPassword);

      // Set authentication state
      auth.isAuthenticated = true;
      auth.user = userWithoutPassword;

      // Show success message briefly before redirecting
      setSuccess("Login successful! Redirecting...");
      
      // Use a small timeout to ensure state is updated
      setTimeout(() => {
        console.log("Redirecting to dashboard...");
        // Use router.replace instead of push to avoid history issues
        router.replace("/dashboard");
      }, 500);

    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-primary hover:text-primary/90"
            >
              create a new account
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-500/15 p-3">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-md border-0 py-2 px-3 bg-background text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-md border-0 py-2 px-3 bg-background text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-primary py-2 px-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 