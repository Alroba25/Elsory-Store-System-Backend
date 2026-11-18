"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { logoutFromServer } from "@/src/services/auth.service";
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "owner" | "cashier" | "accessories_seller" | "phone_seller" | "general";
  isActive?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
  logout: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || "";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();

      if (!data.success || !data.user) {
        setUser(null);
        return;
      }

      const profile = data.user;

      setUser({
        id: profile.id ?? profile._id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        isActive: profile.isActive,
      });
    } catch {
      setUser(null);
    }
  }, []);

const logout = useCallback(async () => {
  const message = await logoutFromServer();
  setUser(null);
  return message;
}, []);

  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      await refreshUser();
      setIsLoading(false);
    };

    initializeAuth();
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        refreshUser,
        clearUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
