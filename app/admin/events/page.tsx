"use client";

import { useState, useEffect } from "react";
import type { DataRow } from "@/types";
import { supabase } from "@/lib/supabaseClient";
import { 
  Calendar, Search, Plus, Eye, Edit, 
  CheckCircle, XCircle, Clock, Filter,
  TrendingUp, Users, MapPin, Tag, IndianRupee
} from "lucide-react";
import Link from "next/link";

export default function EventManagement() {
  const [events, setEvents] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterVertical, setFilterVertical] = useState("all");
  const [stats, setStats] = useState({ total: 0, live: 0, pending: 0, attendees: 0 });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;

      setEvents(data || []);
      const total = data?.length || 0;
      const live = data?.filter(e => e.status === "live" || e.status === "approved").length || 0;
      const pending = data?.filter(e => e.status === "pending").length || 0;
      const attendees = data?.reduce((sum, e) => sum + (e.registered || 0), 0) || 0;
      setStats({ total, live, pending, attendees });
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || e.status === filterStatus;
    const matchesVertical = filterVertical === "all" || e.vertical === filterVertical;
    return matchesSearch && matchesStatus && matchesVertical;
  });

  const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "live" || s === "approved") return "bg-green-100 text-green-700 border-green-200";
    if (s === "pending") return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (s === "cancelled") return "bg-red-100 text-red-700 border-red-200";
    if (s === "completed") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getVerticalStyle = (vertical: string) => {
    switch (vertical) {
      case "connect": return "bg-blue-100 text-blue-700 border-blue-200";
      case "marketplace": return "bg-green-100 text-green-700 border-green-200";
      case "enterprise": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6 pb-4 border-b-4 border-orange-400">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl">
            <Calendar size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
            <p className="text-gray-500 text-sm">Manage all events across your platform</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Total Events</p>
          <p className="text-2xl font-bold text-orange-700">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Live Events</p>
          <p className="text-2xl font-bold text-green-700">{stats.live}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Pending Events</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Total Attendees</p>
          <p className="text-2xl font-bold text-blue-700">{stats.attendees}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-orange-200 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-2.5 text-orange-400" />
              <input
                type="text"
                placeholder="Search events by title, venue, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="all">All Status</option>
            <option value="live">Live</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterVertical}
            onChange={(e) => setFilterVertical(e.target.value)}
            className="px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="all">All Verticals</option>
            <option value="connect">Connect</option>
            <option value="marketplace">Marketplace</option>
            <option value="enterprise">Enterprise</option>
          </select>
          <Link href="/admin/events/create" className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
            <Plus size={18} /> Add Event
          </Link>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white border border-orange-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-50 border-b border-orange-200">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Event Title</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Vertical</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Venue</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Attendees</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-6 text-gray-400">No events found</td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b border-orange-50 hover:bg-orange-50/30 transition">
                    <td className="p-3 text-sm font-medium text-gray-700">{event.title || "N/A"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getVerticalStyle(event.vertical)}`}>
                        {event.vertical || "—"}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {event.date ? new Date(event.date).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-3 text-sm text-gray-500">{event.venue || "—"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle(event.status)}`}>
                        {event.status || "pending"}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-500">{event.registered || 0}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/events/${event.id}`} className="text-orange-500 hover:text-orange-700 transition">
                          <Eye size={18} />
                        </Link>
                        <button className="text-blue-500 hover:text-blue-700 transition">
                          <Edit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
