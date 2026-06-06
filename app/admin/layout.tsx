"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single();
      if (userData?.role !== "admin") { router.push("/unauthorized"); return; }
      setIsAdmin(true);
      setLoading(false);
    }
    checkAdmin();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!isAdmin) return null;

  const navItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Venue Management", href: "/admin/venues" },
    { name: "Event Management", href: "/admin/events" },
    { name: "Affiliate Applications", href: "/admin/affiliates" },
    { name: "Enterprise Proposals", href: "/admin/enterprise-proposals" },
    { name: "BDM Dashboard", href: "/dashboard/bdm" },
    { name: "Payout Management", href: "/admin/payouts" },
    { name: "Members Management", href: "/admin/members" },
    { name: "Partners Management", href: "/admin/partners" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-orange-600">Admin Panel</h2>
        </div>
        <nav className="p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-md my-1 ${pathname === item.href ? "bg-orange-100 text-orange-700" : "text-gray-700 hover:bg-gray-100"}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
