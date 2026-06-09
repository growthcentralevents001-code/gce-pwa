"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  HandCoins,
  Calendar,
  Gift,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Members", href: "/admin/members", icon: Users },
  { name: "Partners", href: "/admin/partners", icon: HandCoins },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Offers", href: "/admin/offers", icon: Gift },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function GCEAdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-orange-600">GCE Admin</h1>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-200 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
