"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  Building, Search, Eye, Edit, 
  CheckCircle, XCircle, Clock, Filter,
  TrendingUp, Users, MapPin, Calendar, Award,
  RefreshCw, Star, UserCheck, UserX, Plus
} from "lucide-react";
import Link from "next/link";

export default function PartnersManagement() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTier, setFilterTier] = useState("all");
  const [stats, setStats] = useState({ total: 0, active: 0, elite: 0, events: 0 });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      // Fetch partners from venues table
      const { data, error } = await supabase
        .from("venues")
        .select(`
          *,
          events_count:events(count)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPartners(data || []);
      const total = data?.length || 0;
      const active = data?.filter(v => v.status === "active" || v.status === "approved").length || 0;
      const elite = data?.filter(v => v.tier === "diamond").length || 0;
      const events = data?.reduce((sum, v) => sum + (v.events_count?.count || 0), 0) || 0;
      setStats({ total, active, elite, events });
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from("venues")
        .update({ status: "active" })
        .eq("id", id);
      if (error) throw error;
      alert("Partner approved!");
      fetchPartners();
    } catch (error) {
      console.error("Error approving:", error);
      alert("Failed to approve.");
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Reject this partner?")) return;
    try {
      const { error } = await supabase
        .from("venues")
        .update({ status: "suspended" })
        .eq("id", id);
      if (error) throw error;
      alert("Partner rejected.");
      fetchPartners();
    } catch (error) {
      console.error("Error rejecting:", error);
      alert("Failed to reject.");
    }
  };

  const filteredPartners = partners.filter(p => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = p.name?.toLowerCase().includes(search) ||
                          p.city?.toLowerCase().includes(search) ||
                          p.email?.toLowerCase().includes(search);
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    const matchesTier = filterTier === "all" || p.tier === filterTier;
    return matchesSearch && matchesStatus && matchesTier;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "suspended":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "diamond": return "bg-purple-100 text-purple-700 border-purple-200";
      case "premium": return "bg-blue-100 text-blue-700 border-blue-200";
      case "basic":
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
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
            <Building size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Partners Management</h1>
            <p className="text-gray-500 text-sm">Manage venue partners, approve applications, track performance</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Total Partners</p>
          <p className="text-2xl font-bold text-orange-700">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Active</p>
          <p className="text-2xl font-bold text-green-700">{stats.active}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Elite Partners</p>
          <p className="text-2xl font-bold text-purple-700">{stats.elite}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Total Events</p>
          <p className="text-2xl font-bold text-blue-700">{stats.events}</p>
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
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
          <button onClick={fetchPartners} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            <RefreshCw size={18} /> Refresh
          </button>
          <Link href="/admin/venues/create" className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
            <Plus size={18} /> Add Partner
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-orange-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-50 border-b border-orange-200">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Partner Name</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Tier</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">City</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Events</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Joined</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-6 text-gray-400">No partners found</td>
                </tr>
              ) : (
                filteredPartners.map((partner) => (
                  <tr key={partner.id} className="border-b border-orange-50 hover:bg-orange-50/30 transition">
                    <td className="p-3 text-sm font-medium text-gray-700">{partner.name || "N/A"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTierBadge(partner.tier)}`}>
                        {partner.tier || "Basic"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle(partner.status)}`}>
                        {partner.status || "pending"}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-500">{partner.city || "—"}</td>
                    <td className="p-3 text-sm text-gray-500">{partner.events_count?.count || 0} events</td>
                    <td className="p-3 text-sm text-gray-500">
                      {partner.created_at ? new Date(partner.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {partner.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(partner.id)}
                              className="text-green-600 hover:text-green-800 transition"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => handleReject(partner.id)}
                              className="text-red-500 hover:text-red-700 transition"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        <button className="text-blue-500 hover:text-blue-700 transition" title="Edit">
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
