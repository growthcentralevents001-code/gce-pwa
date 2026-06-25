"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Calendar, MapPin, Users, DollarSign, PlusCircle } from "lucide-react";

export default function VenueDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalEvents: 0, liveEvents: 0, totalBookings: 0, revenue: 0 });

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true });
    if (eventsData) {
      setEvents(eventsData);
      setStats({
        totalEvents: eventsData.length,
        liveEvents: eventsData.filter(e => e.status === "Live").length,
        totalBookings: eventsData.reduce((acc, e) => acc + (e.registered || 0), 0),
        revenue: eventsData.reduce((acc, e) => acc + (e.price * (e.registered || 0)), 0),
      });
    }
    setLoading(false);
  }

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Events</h1>
        <Link href="/dashboard/venue/create-event" className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <PlusCircle size={18} /> Create New Event
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow text-center"><h3 className="text-gray-500">Total Events</h3><p className="text-2xl font-bold">{stats.totalEvents}</p></div>
        <div className="bg-white p-4 rounded-lg shadow text-center"><h3 className="text-gray-500">Live Events</h3><p className="text-2xl font-bold">{stats.liveEvents}</p></div>
        <div className="bg-white p-4 rounded-lg shadow text-center"><h3 className="text-gray-500">Total Bookings</h3><p className="text-2xl font-bold">{stats.totalBookings}</p></div>
        <div className="bg-white p-4 rounded-lg shadow text-center"><h3 className="text-gray-500">Revenue</h3><p className="text-2xl font-bold">₹{stats.revenue}</p></div>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No events created yet.</p>
          <Link href="/dashboard/venue/create-event" className="mt-4 inline-block bg-orange-600 text-white px-4 py-2 rounded-lg">Create Your First Event</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center"><span className="text-4xl">🎉</span></div>
              <div className="p-4">
                <h3 className="font-bold text-lg">{event.title}</h3>
                <div className="space-y-1 text-sm text-gray-600 mt-2">
                  <div className="flex items-center gap-1"><Calendar size={14} /> {new Date(event.date).toLocaleDateString()} at {event.time}</div>
                  <div className="flex items-center gap-1"><MapPin size={14} /> {event.venue}, {event.city}</div>
                  <div className="flex items-center gap-1"><Users size={14} /> {event.registered || 0} / {event.capacity} attending</div>
                  <div className="flex items-center gap-1"><DollarSign size={14} /> ₹{event.price}</div>
                </div>
                <div className="mt-3 flex justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs ${event.status === 'Live' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{event.status}</span>
                  <Link href={`/dashboard/venue/events/edit/${event.id}`} className="text-orange-600 text-sm">Edit</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
