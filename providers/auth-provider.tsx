"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { User } from "@/types";
import { auth } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (provider?: string, credentials?: { email: string; password: string }) => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => null,
  logout: async () => {},
});

// The inner provider that uses the NextAuth session
function AuthContextProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const isLoading = status === "loading";
  const isAuthenticated = !!session;

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        picture: session.user.image || "",
      });
    } else {
      setUser(null);
    }
  }, [session]);

  const login = async (
    provider?: string, 
    credentials?: { email: string; password: string }
  ) => {
    return auth.login(provider, credentials);
  };

  const logout = async () => {
    return auth.logout();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// The outer provider that includes the SessionProvider
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}

export const useAuth = () => useContext(AuthContext);