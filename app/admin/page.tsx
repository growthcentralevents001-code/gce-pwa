"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  Building, Calendar, Users, IndianRupee, 
  TrendingUp, Clock, CheckCircle, AlertCircle,
  PlusCircle, Eye, ArrowRight, Sparkles
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    venues: 0,
    events: 0,
    members: 0,
    revenue: 0,
    pendingVenues: 0,
    pendingEvents: 0,
    totalBookings: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [venuesRes, eventsRes, membersRes, bookingsRes, pendingVenuesRes, pendingEventsRes] = await Promise.all([
        supabase.from("venues").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("bookings").select("*", { count: "exact", head: true }),
        supabase.from("venues").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "pending"),
      ]);

      const { data: recentBookings } = await supabase
        .from("bookings")
        .select("*, events(title), users(email)")
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        venues: venuesRes.count || 0,
        events: eventsRes.count || 0,
        members: membersRes.count || 0,
        revenue: 1250000,
        pendingVenues: pendingVenuesRes.count || 0,
        pendingEvents: pendingEventsRes.count || 0,
        totalBookings: bookingsRes.count || 0,
        recentActivity: recentBookings || []
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: "Total Venues", 
      value: stats.venues, 
      icon: Building, 
      gradient: "from-orange-50 to-orange-100",
      border: "border-orange-200",
      text: "text-orange-700",
      iconBg: "bg-orange-100 text-orange-600",
      href: "/admin/venues"
    },
    { 
      title: "Total Events", 
      value: stats.events, 
      icon: Calendar, 
      gradient: "from-orange-50 to-orange-100",
      border: "border-orange-200",
      text: "text-orange-700",
      iconBg: "bg-orange-100 text-orange-600",
      href: "/admin/events"
    },
    { 
      title: "Total Members", 
      value: stats.members, 
      icon: Users, 
      gradient: "from-orange-50 to-orange-100",
      border: "border-orange-200",
      text: "text-orange-700",
      iconBg: "bg-orange-100 text-orange-600",
      href: "/admin/members"
    },
    { 
      title: "Total Revenue", 
      value: `₹${(stats.revenue / 100000).toFixed(1)}L`, 
      icon: IndianRupee, 
      gradient: "from-orange-100 to-orange-200",
      border: "border-orange-300",
      text: "text-orange-800",
      iconBg: "bg-orange-200 text-orange-700",
      href: "/admin/payments"
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-orange-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header with Orange Accent */}
      <div className="mb-6 pb-4 border-b-4 border-orange-400">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back! Here's your GCE overview.</p>
          </div>
        </div>
      </div>

      {/* Stats Grid - Orange & White Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} href={stat.href}>
              <div className={`bg-gradient-to-br ${stat.gradient} border ${stat.border} rounded-xl shadow-sm p-5 hover:shadow-lg transition transform hover:-translate-y-1 hover:border-orange-400`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <p className={`text-3xl font-bold ${stat.text} mt-1`}>{stat.value}</p>
                  </div>
                  <div className={`${stat.iconBg} rounded-lg p-2`}>
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pending Approvals + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Clock size={20} className="text-orange-500" />
            Pending Approvals
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/venues" className="bg-white border border-orange-200 rounded-lg p-4 hover:shadow-md transition hover:border-orange-400">
              <p className="text-2xl font-bold text-orange-600">{stats.pendingVenues}</p>
              <p className="text-sm text-gray-600">Venues Pending</p>
            </Link>
            <Link href="/admin/events" className="bg-white border border-orange-200 rounded-lg p-4 hover:shadow-md transition hover:border-orange-400">
              <p className="text-2xl font-bold text-orange-600">{stats.pendingEvents}</p>
              <p className="text-sm text-gray-600">Events Pending</p>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-100 to-white border border-orange-200 rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/admin/venues/create" className="flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-orange-50 transition text-sm border border-orange-100 hover:border-orange-300">
              <PlusCircle size={16} className="text-orange-600" /> Add Venue
            </Link>
            <Link href="/admin/events/create" className="flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-orange-50 transition text-sm border border-orange-100 hover:border-orange-300">
              <PlusCircle size={16} className="text-orange-600" /> Create Event
            </Link>
            <Link href="/admin/payments" className="flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-orange-50 transition text-sm border border-orange-100 hover:border-orange-300">
              <Eye size={16} className="text-orange-600" /> View Payments
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity - Orange Theme */}
      <div className="bg-white border border-orange-200 rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <TrendingUp size={20} className="text-orange-500" />
          Recent Activity
        </h2>
        {stats.recentActivity.length === 0 ? (
          <p className="text-gray-400 text-sm">No recent activity.</p>
        ) : (
          <div className="space-y-3">
            {stats.recentActivity.map((activity: any, index) => (
              <div key={index} className="flex items-center justify-between border-b border-orange-50 pb-2 last:border-0 hover:bg-orange-50/30 p-2 rounded-lg transition">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {activity.events?.title || "Unknown Event"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {activity.users?.email || "Unknown user"} • {new Date(activity.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full border border-orange-200">
                  Booked
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
