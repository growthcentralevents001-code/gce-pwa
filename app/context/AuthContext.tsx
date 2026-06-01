"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  city?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("gce_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // FORCE role to 'admin' for testing
    let role = "member";
    if (email === "admin@test.com" || email.includes("admin")) {
      role = "admin";
    }
    
    const mockUser: User = {
      id: "mock-" + Date.now(),
      name: email.split("@")[0] || "User",
      email: email,
      role: role,
      phone: "",
      city: "Mumbai"
    };
    setUser(mockUser);
    localStorage.setItem("gce_user", JSON.stringify(mockUser));
    return true;
  };

  const signup = async (email: string, password: string, name: string, role: string = "member") => {
    const mockUser: User = {
      id: "mock-" + Date.now(),
      name: name,
      email: email,
      role: role,
      phone: "",
      city: "Mumbai"
    };
    setUser(mockUser);
    localStorage.setItem("gce_user", JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("gce_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
