"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

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
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function mapSupabaseUser(supabaseUser: SupabaseUser): Promise<User> {
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", supabaseUser.id)
    .eq("approved", true)
    .limit(1);

  const meta = supabaseUser.user_metadata;

  return {
    id: supabaseUser.id,
    name: meta?.full_name || meta?.name || supabaseUser.email?.split("@")[0] || "User",
    email: supabaseUser.email || "",
    role: roles?.[0]?.role || "member",
    phone: meta?.phone || "",
    city: meta?.city || "",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: sbUser } }) => {
      if (sbUser) {
        setUser(await mapSupabaseUser(sbUser));
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(await mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  };

  const signup = async (email: string, password: string, name: string, role: string = "member") => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error || !data.user) return false;

    await supabase.from("user_roles").insert({
      user_id: data.user.id,
      role,
      approved: role === "member",
    });
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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
