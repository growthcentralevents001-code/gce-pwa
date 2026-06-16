"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Building2, Calendar, Users, Briefcase,
  UserRound, HandCoins, Star, Gift, Settings,
  TrendingUp, Wallet, Clock, CheckCircle, XCircle, Activity,
  Database, AlertCircle, PlusCircle, DollarSign
} from "lucide-react";

interface DashboardStats {
  totalVenues: number;
  totalEvents: number;
  totalMembers: number;
  activeEvents: number;
  pendingEvents: number;
  pendingVenues: number;
  pendingFranchisees: number;
  totalRevenue: number;
  totalCommissions: number;
  pendingPayouts: number;
}

interface RecentActivityItem {
  id: string;
  action: string;
  target: string;
  created_at: string;
  admin_name?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalVenues: 0,
    totalEvents: 0,
    totalMembers: 0,
    activeEvents: 0,
    pendingEvents: 0,
    pendingVenues: 0,
    pendingFranchisees: 0,
    totalRevenue: 0,
    totalCommissions: 0,
    pendingPayouts: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthOk, setHealthOk] = useState(true);

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  async function checkAdminAndFetch() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (userData?.role !== "admin") { router.push("/unauthorized"); return; }
    await Promise.all([fetchStats(), fetchRecentActivity(), checkPlatformHealth()]);
    setLoading(false);
  }

  async function fetchStats() {
    // Counts
    const { count: totalVenues } = await supabase.from("venues").select("*", { count: 'exact', head: true });
    const { count: totalEvents } = await supabase.from("events").select("*", { count: 'exact', head: true });
    const { count: totalMembers } = await supabase.from("users").select("*", { count: 'exact', head: true }).eq("role", "member");
    const { count: activeEvents } = await supabase.from("events").select("*", { count: 'exact', head: true }).eq("status", "Live");
    const { count: pendingEvents } = await supabase.from("events").select("*", { count: 'exact', head: true }).eq("status", "pending_approval");
    const { count: pendingVenues } = await supabase.from("venues").select("*", { count: 'exact', head: true }).eq("status", "pending");
    const { count: pendingFranchisees } = await supabase.from("franchisees").select("*", { count: 'exact', head: true }).eq("status", "pending");

    // Financials
    const { data: bookings } = await supabase.from("bookings").select("total_amount");
    const totalRevenue = bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;
    // Assume commission is 20% of revenue (adjust if you have commission table)
    const totalCommissions = Math.round(totalRevenue * 0.2);
    const { count: pendingPayouts } = await supabase.from("payouts").select("*", { count: 'exact', head: true }).eq("status", "pending");

    setStats({
      totalVenues: totalVenues || 0,
      totalEvents: totalEvents || 0,
      totalMembers: totalMembers || 0,
      activeEvents: activeEvents || 0,
      pendingEvents: pendingEvents || 0,
      pendingVenues: pendingVenues || 0,
      pendingFranchisees: pendingFranchisees || 0,
      totalRevenue,
      totalCommissions,
      pendingPayouts: pendingPayouts || 0,
    });
  }

  async function fetchRecentActivity() {
    // Fetch from audit_logs if exists, else from events/bookings
    const { data: auditLogs } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    if (auditLogs && auditLogs.length > 0) {
      setRecentActivities(auditLogs.map(log => ({
        id: log.id,
        action: log.action,
        target: log.target,
        created_at: log.created_at,
        admin_name: log.admin_id,
      })));
    } else {
      // Fallback: recent events and signups
      const { data: recentEvents } = await supabase
        .from("events")
        .select("id, title, created_at")
        .order("created_at", { ascending: false })
        .limit(3);
      const { data: recentUsers } = await supabase
        .from("users")
        .select("id, email, created_at")
        .order("created_at", { ascending: false })
        .limit(2);
      const activities: RecentActivityItem[] = [];
      recentEvents?.forEach(ev => activities.push({ id: ev.id, action: "Event Created", target: ev.title, created_at: ev.created_at }));
      recentUsers?.forEach(us => activities.push({ id: us.id, action: "New User Signup", target: us.email, created_at: us.created_at }));
      setRecentActivities(activities);
    }
  }

  async function checkPlatformHealth() {
    // Check Supabase connection
    const { error } = await supabase.from("events").select("id", { count: 'exact', head: true });
    setHealthOk(!error);
  }

  if (loading) return <div className="flex justify-center items-center h-96">Loading dashboard...</div>;

  // Quick Actions
  const quickActions = [
    { name: "Create Event", href: "/admin/events/create", icon: PlusCircle, color: "bg-orange-100 text-orange-700" },
    { name: "Process Payouts", href: "/admin/payouts", icon: HandCoins, color: "bg-green-100 text-green-700" },
    { name: "Add Venue", href: "/admin/venues", icon: Building2, color: "bg-blue-100 text-blue-700" },
    { name: "Manage Members", href: "/admin/members", icon: Users, color: "bg-purple-100 text-purple-700" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening on your platform.</p>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-orange-500">
          <div className="flex justify-between"><div><p className="text-sm text-gray-500">Total Venues</p><p className="text-2xl font-bold">{stats.totalVenues}</p></div><Building2 className="text-orange-500" size={24} /></div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">
          <div className="flex justify-between"><div><p className="text-sm text-gray-500">Total Events</p><p className="text-2xl font-bold">{stats.totalEvents}</p></div><Calendar className="text-blue-500" size={24} /></div>
          <p className="text-xs text-gray-400 mt-1">Active: {stats.activeEvents}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
          <div className="flex justify-between"><div><p className="text-sm text-gray-500">Total Members</p><p className="text-2xl font-bold">{stats.totalMembers}</p></div><Users className="text-green-500" size={24} /></div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-purple-500">
          <div className="flex justify-between"><div><p className="text-sm text-gray-500">Total Revenue</p><p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p></div><DollarSign className="text-purple-500" size={24} /></div>
        </div>
      </div>

      {/* Financial Summary + Pending Approvals Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Summary */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4"><Wallet size={20} /> Financial Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-gray-600">Total Revenue</span><span className="font-bold">₹{stats.totalRevenue.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Platform Commission (est. 20%)</span><span className="font-bold">₹{stats.totalCommissions.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Pending Payouts</span><span className="font-bold text-red-600">₹{stats.pendingPayouts > 0 ? 'Pending' : 'None'}</span></div>
          </div>
          <Link href="/admin/payouts" className="inline-block mt-4 text-sm text-orange-600 hover:underline">Manage Payouts →</Link>
        </div>

        {/* Pending Approvals Queue */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4"><Clock size={20} /> Pending Approvals</h2>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Events</span><span className="font-bold">{stats.pendingEvents}</span></div>
            <div className="flex justify-between"><span>Venues</span><span className="font-bold">{stats.pendingVenues}</span></div>
            <div className="flex justify-between"><span>Franchisees</span><span className="font-bold">{stats.pendingFranchisees}</span></div>
          </div>
          <div className="flex gap-3 mt-4">
            <Link href="/admin/events?status=pending" className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full">Review Events</Link>
            <Link href="/admin/venues?status=pending" className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full">Review Venues</Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4"><Activity size={20} /> Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action, idx) => (
            <Link key={idx} href={action.href} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${action.color} hover:opacity-80 transition`}>
              <action.icon size={18} /> {action.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity & Platform Health Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4"><TrendingUp size={20} /> Recent Activity</h2>
          {recentActivities.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent activity.</p>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{act.action}</p>
                    <p className="text-xs text-gray-500">{act.target}</p>
                  </div>
                  <p className="text-xs text-gray-400">{new Date(act.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Platform Health */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4"><Database size={20} /> Platform Health</h2>
          <div className="flex items-center gap-3">
            {healthOk ? <CheckCircle className="text-green-500" size={24} /> : <XCircle className="text-red-500" size={24} />}
            <span className="text-gray-700">{healthOk ? "All systems operational" : "Some services are experiencing issues"}</span>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>✅ Supabase connection: {healthOk ? "OK" : "Failed"}</p>
            <p>📦 Storage: Not configured (optional)</p>
          </div>
        </div>
      </div>

      {/* Full Sidebar Navigation (already present in admin layout, but can be listed here for clarity – optional) */}
    </div>
  );
}
