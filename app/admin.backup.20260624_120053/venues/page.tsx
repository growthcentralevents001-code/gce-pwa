"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  Building, Search, Plus, Eye, Edit, 
  CheckCircle, XCircle, Clock, Filter,
  TrendingUp, MapPin, Star, IndianRupee
} from "lucide-react";
import Link from "next/link";

export default function VenueManagement() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, suspended: 0 });

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setVenues(data || []);
      const total = data?.length || 0;
      const active = data?.filter(v => v.status === "active" || v.status === "Approved").length || 0;
      const pending = data?.filter(v => v.status === "pending").length || 0;
      const suspended = data?.filter(v => v.status === "suspended").length || 0;
      setStats({ total, active, pending, suspended });
    } catch (error) {
      console.error("Error fetching venues:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVenues = venues.filter(v => {
    const matchesSearch = v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === "all" || v.tier === filterTier;
    const matchesStatus = filterStatus === "all" || v.status === filterStatus;
    return matchesSearch && matchesTier && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "active" || s === "approved") return "bg-green-100 text-green-700 border-green-200";
    if (s === "pending") return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (s === "suspended") return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
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
            <Building size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Venue Management</h1>
            <p className="text-gray-500 text-sm">Manage venue ratings, fees, and approvals</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Total Venues</p>
          <p className="text-2xl font-bold text-orange-700">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Active</p>
          <p className="text-2xl font-bold text-green-700">{stats.active}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Suspended</p>
          <p className="text-2xl font-bold text-red-700">{stats.suspended}</p>
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
                placeholder="Search by name, email or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="all">All Tiers</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
            <option value="diamond">Diamond</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          <Link href="/admin/venues/create" className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
            <Plus size={18} /> Add Venue
          </Link>
        </div>
      </div>

      {/* Venues Table */}
      <div className="bg-white border border-orange-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-50 border-b border-orange-200">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Venue Name</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Contact</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">City</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Tier</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Monthly Fee</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVenues.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-6 text-gray-400">No venues found</td>
                </tr>
              ) : (
                filteredVenues.map((venue) => (
                  <tr key={venue.id} className="border-b border-orange-50 hover:bg-orange-50/30 transition">
                    <td className="p-3 text-sm font-medium text-gray-700">{venue.name || "N/A"}</td>
                    <td className="p-3 text-sm text-gray-500">{venue.email || venue.phone || "—"}</td>
                    <td className="p-3 text-sm text-gray-500">{venue.city || "—"}</td>
                    <td className="p-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        venue.tier === "diamond" ? "bg-purple-100 text-purple-700 border-purple-200" :
                        venue.tier === "premium" ? "bg-blue-100 text-blue-700 border-blue-200" :
                        "bg-gray-100 text-gray-700 border-gray-200"
                      }`}>
                        {venue.tier || "Basic"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle(venue.status)}`}>
                        {venue.status || "pending"}
                      </span>
                    </td>
                    <td className="p-3 text-sm font-medium text-orange-600">₹{venue.monthly_fee || 1000}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/venues/${venue.id}`} className="text-orange-500 hover:text-orange-700 transition">
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
