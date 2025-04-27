import { signIn, signOut, getSession } from "next-auth/react";
import { User } from "@/types";
import Cookies from 'js-cookie';

// Simple hash function - must match the one in the signin page
async function hashPassword(password: string): Promise<string> {
  if (typeof window === "undefined") {
    // Server-side fallback
    return password;
  }
  
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// This is a mock Auth0 implementation for demonstration
// In a real app, you would use the actual Auth0 SDK
export const auth = {
  isAuthenticated: false,
  user: null as User | null,
  
  login: async (provider?: string, credentials?: { email: string; password: string }) => {
    console.log("Auth login called", { provider, email: credentials?.email });
    
    if (provider === "google") {
      await signIn("google", { callbackUrl: "/dashboard" });
      return null; // This redirects, so no user is returned
    } else if (credentials) {
      try {
        // Check if we're in the browser
        if (typeof window === "undefined") {
          throw new Error("Cannot access localStorage in server-side rendering");
        }
        
        // Get users from localStorage
        const storedUsers = localStorage.getItem("users");
        if (!storedUsers) {
          console.log("No users found in localStorage");
          throw new Error("No users found");
        }

        console.log("Users found in localStorage");
        const users = JSON.parse(storedUsers);
        const user = users.find((u: any) => u.email.toLowerCase() === credentials.email.toLowerCase());

        if (!user) {
          console.log("User not found with email:", credentials.email);
          throw new Error("User not found");
        }

        console.log("User found:", { ...user, password: "[HIDDEN]" });

        // Hash the password and compare
        const hashedPassword = await hashPassword(credentials.password);
        console.log("Comparing passwords:", {
          entered: hashedPassword.substring(0, 10) + "...",
          stored: user.password.substring(0, 10) + "..."
        });
        
        if (hashedPassword !== user.password) {
          console.log("Password mismatch");
          throw new Error("Invalid password");
        }

        // Create a user object without password
        const { password: _, ...userWithoutPassword } = user;
        
        // Set the current user
        localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
        
        // Set a cookie for middleware authentication
        if (typeof window !== "undefined" && typeof Cookies !== "undefined") {
          // Set a cookie that expires in 7 days
          Cookies.set('auth', 'true', { expires: 7, path: '/' });
        }
        
        auth.isAuthenticated = true;
        auth.user = userWithoutPassword;

        console.log("Login successful:", userWithoutPassword);
        return userWithoutPassword;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    }
    return null;
  },
  
  // New method to login with an already validated user object from localStorage
  loginWithStoredUser: async (user: User) => {
    console.log("Login with stored user:", user);
    auth.isAuthenticated = true;
    auth.user = user;
    
    // Set a cookie for middleware authentication
    if (typeof window !== "undefined" && typeof Cookies !== "undefined") {
      // Set a cookie that expires in 7 days
      Cookies.set('auth', 'true', { expires: 7, path: '/' });
    }
    
    return user;
  },
  
  logout: async () => {
    console.log("Logging out user");
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser");
      
      // Remove the auth cookie
      if (typeof Cookies !== "undefined") {
        Cookies.remove('auth', { path: '/' });
      }
    }
    auth.isAuthenticated = false;
    auth.user = null;
    await signOut({ callbackUrl: "/" });
  },
  
  getUser: async (): Promise<User | null> => {
    // First try to get user from NextAuth session
    const session = await getSession();
    if (session?.user) {
      console.log("User found in NextAuth session");
      const user: User = {
        // Use empty string as fallback for id if it doesn't exist
        id: (session.user as any).id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        picture: session.user.image || ""
      };
      return user;
    }
    
    // If no NextAuth session, try to get from localStorage
    try {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          console.log("User found in localStorage");
          const user = JSON.parse(storedUser);
          auth.isAuthenticated = true;
          auth.user = user;
          
          // Ensure the cookie is set
          if (typeof Cookies !== "undefined") {
            Cookies.set('auth', 'true', { expires: 7, path: '/' });
          }
          
          return user;
        }
      }
    } catch (error) {
      console.error("Error getting user from localStorage:", error);
    }
    
    console.log("No user found");
    return null;
  }
};