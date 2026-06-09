"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Building2, Calendar, Users, Briefcase, UserRound, HandCoins, Star, Gift, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/login");
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Venue Management", href: "/admin/venues", icon: Building2 },
    { name: "Event Management", href: "/admin/events", icon: Calendar },
    { name: "Affiliate Applications", href: "/admin/affiliates", icon: Users },
    { name: "Enterprise Proposals", href: "/admin/enterprise-proposals", icon: Briefcase },
    { name: "BDM Dashboard", href: "/dashboard/bdm", icon: UserRound },
    { name: "Payout Management", href: "/admin/payouts", icon: HandCoins },
    { name: "Members Management", href: "/admin/members", icon: Users },
    { name: "Partners Management", href: "/admin/partners", icon: Star },
    { name: "Offers Management", href: "/admin/offers", icon: Gift },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-200"><h2 className="text-xl font-bold text-orange-600">GCE Admin</h2><p className="text-xs text-gray-400">Control Panel</p></div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${isActive ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-100"}`}>
                <Icon size={18} /> {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t">
          <button onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-600 hover:bg-red-50">LogOut</button>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
