"use client";

import { useState, useEffect } from "react";
import type { DataRow } from "@/types";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { 
  Calendar, 
  Building2, 
  Users, 
  IndianRupee,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  TicketCheck,
  TrendingUp
} from "lucide-react";

export default function VenueDashboard() {
  const [events, setEvents] = useState<DataRow[]>([]);
  const [stats, setStats] = useState({ total: 0, live: 0, bookings: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  const fetchVenueData = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      // Fetch venue profile
      const { data: venue } = await supabase
        .from("venues")
        .select("id")
        .eq("user_id", user.user.id)
        .single();

      if (!venue) {
        setLoading(false);
        return;
      }

      // Fetch events
      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .eq("venue_id", venue.id)
        .order("date", { ascending: true });

      const evs = eventsData || [];
      const now = new Date();
      const live = evs.filter(e => new Date(e.date) >= now).length;
      const bookings = evs.reduce((acc, e) => acc + (e.registered || 0), 0);
      const revenue = evs.reduce((acc, e) => acc + (e.price * (e.registered || 0)), 0);

      setEvents(evs);
      setStats({ total: evs.length, live, bookings, revenue });
    } catch (error) {
      console.error("Error fetching venue data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenueData();
  }, []);

  const getStatusBadge = (eventDate: string) => {
    const isLive = new Date(eventDate) >= new Date();
    return isLive 
      ? { label: "Live", className: "bg-green-100 text-green-700 border-green-200" }
      : { label: "Past", className: "bg-gray-100 text-gray-500 border-gray-200" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center gap-3">
            <Building2 className="text-orange-500" size={32} />
            My Events
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Manage your events, bookings, and revenue
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Events</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Calendar className="text-orange-500" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Live Events</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.live}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <TicketCheck className="text-green-500" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Bookings</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.bookings}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="text-blue-500" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Revenue</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">₹{stats.revenue}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <IndianRupee className="text-amber-500" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Events List & Create Button */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Calendar className="text-orange-500" size={20} />
              Your Events
            </h3>
            <Link
              href="/dashboard/venue/create-event"
              className="inline-flex items-center gap-2 px-5 py-2 bg-orange-600 text-white text-sm font-medium rounded-full hover:bg-orange-700 transition shadow-md"
            >
              <Plus size={18} /> Create New Event
            </Link>
          </div>

          <div className="p-6">
            {events.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-orange-500" size={32} />
                </div>
                <h4 className="text-lg font-semibold text-slate-700">No events created yet</h4>
                <p className="text-sm text-slate-400 mt-1">Start by creating your first event</p>
                <Link
                  href="/dashboard/venue/create-event"
                  className="inline-block mt-4 px-6 py-2 bg-orange-600 text-white text-sm font-medium rounded-full hover:bg-orange-700 transition shadow-md"
                >
                  Create Your First Event
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((event) => {
                  const status = getStatusBadge(event.date);
                  return (
                    <div key={event.id} className="bg-slate-50 rounded-xl p-4 hover:bg-white hover:shadow-md transition border border-transparent hover:border-orange-100">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-slate-800">{event.title}</h4>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400" />
                          <span>{event.date} at {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-slate-400" />
                          <span>{event.venue}, {event.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-slate-400" />
                          <span>{event.registered} / {event.capacity} attending</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-600">₹{event.price}</span>
                        <Link
                          href={`/events/${event.id}`}
                          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
