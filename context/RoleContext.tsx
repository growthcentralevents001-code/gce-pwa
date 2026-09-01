"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface RoleContextType {
  roles: string[];
  activeRole: string;
  setActiveRole: (role: string) => void;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [roles, setRoles] = useState<string[]>([]);
  const [activeRole, setActiveRole] = useState<string>("member");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchRoles = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setRoles([]);
      setIsLoading(false);
      return;
    }
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("approved", true);
    const roleList = data?.map(r => r.role) || [];
    if (roleList.length === 0) roleList.push("member");
    setRoles(roleList);
    const saved = localStorage.getItem("gce_active_role");
    const defaultRole = roleList.includes(saved || "") ? saved! : roleList[0];
    setActiveRole(defaultRole);
    localStorage.setItem("gce_active_role", defaultRole);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRoles();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        fetchRoles();
      } else if (event === "SIGNED_OUT") {
        setRoles([]);
        setActiveRole("member");
        setIsLoading(false);
        localStorage.removeItem("gce_active_role");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSetActiveRole = (role: string) => {
    if (!roles.includes(role)) return;
    setActiveRole(role);
    localStorage.setItem("gce_active_role", role);
    const dashboardMap: Record<string, string> = {
      member: "/dashboard/connect-member",
      venue: "/venue",
      zbp: "/for-partners",
      affiliate: "/for-partners",
      bdm: "/for-partners",
      enterprise: "/dashboard/enterprise-bdp",
      admin: "/ops",
      marketplace_bdp: "/dashboard/marketplace-bdp",
    };
    router.push(dashboardMap[role] || "/customer");
  };

  return (
    <RoleContext.Provider value={{ roles, activeRole, setActiveRole: handleSetActiveRole, isLoading, refetch: fetchRoles }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoles() {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useRoles must be used within RoleProvider");
  return context;
}
