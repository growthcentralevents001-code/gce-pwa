"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboardContent() {
  const [stats, setStats] = useState({ totalVenues: 0, totalEvents: 0, totalBookings: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const { data: venues } = await supabase.from("venues").select("id");
    const { data: events } = await supabase.from("events").select("id");
    const { data: bookings } = await supabase.from("bookings").select("total_amount");
    const totalRevenue = bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;
    setStats({
      totalVenues: venues?.length || 0,
      totalEvents: events?.length || 0,
      totalBookings: bookings?.length || 0,
      totalRevenue,
    });
    setLoading(false);
  }

  if (loading) return <div>Loading stats...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow border-l-4 border-orange-500">
          <p className="text-sm text-gray-500">Total Venues</p>
          <p className="text-2xl font-bold">{stats.totalVenues}</p>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Total Events</p>
          <p className="text-2xl font-bold">{stats.totalEvents}</p>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-2xl font-bold">{stats.totalBookings}</p>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-purple-600">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
