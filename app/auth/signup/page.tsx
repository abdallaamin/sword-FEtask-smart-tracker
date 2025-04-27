"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting to sign up user with email:", email);
      
      // Call the sign-up API endpoint
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      console.log("Sign-up API response:", { 
        status: response.status, 
        message: data.message,
        user: data.user ? { ...data.user, password: "[HIDDEN]" } : null
      });

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      // Store user in localStorage (only if we're in the browser)
      if (typeof window !== "undefined") {
        console.log("Storing user in localStorage");
        
        // Check if there's already a users array in localStorage
        let users = [];
        const storedUsers = localStorage.getItem("users");
        if (storedUsers) {
          users = JSON.parse(storedUsers);
          console.log("Existing users found:", users.length);
          
          // Check if user with this email already exists
          const existingUserIndex = users.findIndex((u: any) => 
            u.email.toLowerCase() === email.toLowerCase()
          );
          
          if (existingUserIndex >= 0) {
            console.log("Replacing existing user at index:", existingUserIndex);
            // Replace existing user
            users[existingUserIndex] = data.user;
          } else {
            console.log("Adding new user");
            // Add new user
            users.push(data.user);
          }
        } else {
          console.log("No existing users, creating first user");
          // First user
          users.push(data.user);
        }
        
        // Save back to localStorage
        localStorage.setItem("users", JSON.stringify(users));
        console.log("Users saved to localStorage, total count:", users.length);
      }

      // Redirect to sign-in page after successful registration
      console.log("Registration successful, redirecting to sign-in page");
      router.push("/auth/signin?registered=true");
    } catch (error) {
      console.error("Sign-up error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create account. Please try again.");
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-primary hover:text-primary/90"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="sr-only">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="relative block w-full rounded-md border-0 py-2 px-3 bg-background text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                placeholder="Full name"
              />
            </div>
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
                autoComplete="new-password"
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
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 