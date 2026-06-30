"use client";

import { useState, useEffect } from "react";
import type { DataRow } from "@/types";
import { supabase } from "@/lib/supabaseClient";
import { 
  Tag, Search, Plus, Eye, Edit, 
  CheckCircle, XCircle, Clock, Filter,
  TrendingUp, Users, Calendar, DollarSign,
  RefreshCw, Trash2, Percent, Gift
} from "lucide-react";
import Link from "next/link";

export default function OffersManagement() {
  const [offers, setOffers] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, redeemed: 0 });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      // Fetch offers from offers table
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setOffers(data || []);
      const total = data?.length || 0;
      const active = data?.filter(o => o.status === "active").length || 0;
      const pending = data?.filter(o => o.status === "pending").length || 0;
      const redeemed = data?.reduce((sum, o) => sum + (o.redeemed || 0), 0) || 0;
      setStats({ total, active, pending, redeemed });
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from("offers")
        .update({ status: "active" })
        .eq("id", id);
      if (error) throw error;
      alert("Offer approved!");
      fetchOffers();
    } catch (error) {
      console.error("Error approving:", error);
      alert("Failed to approve.");
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Reject this offer?")) return;
    try {
      const { error } = await supabase
        .from("offers")
        .update({ status: "rejected" })
        .eq("id", id);
      if (error) throw error;
      alert("Offer rejected.");
      fetchOffers();
    } catch (error) {
      console.error("Error rejecting:", error);
      alert("Failed to reject.");
    }
  };

  const filteredOffers = offers.filter(o => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = o.name?.toLowerCase().includes(search) ||
                          o.description?.toLowerCase().includes(search) ||
                          o.type?.toLowerCase().includes(search);
    const matchesStatus = filterStatus === "all" || o.status === filterStatus;
    const matchesType = filterType === "all" || o.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "rejected": return "bg-red-100 text-red-700 border-red-200";
      case "expired": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "discount": return "bg-blue-100 text-blue-700 border-blue-200";
      case "freebie": return "bg-purple-100 text-purple-700 border-purple-200";
      case "bundle": return "bg-orange-100 text-orange-700 border-orange-200";
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
            <Gift size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Offers Management</h1>
            <p className="text-gray-500 text-sm">Manage discounts, promotions, and enterprise offers</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Total Offers</p>
          <p className="text-2xl font-bold text-orange-700">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Active Offers</p>
          <p className="text-2xl font-bold text-green-700">{stats.active}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Pending Approval</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Total Redeems</p>
          <p className="text-2xl font-bold text-blue-700">{stats.redeemed}</p>
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
                placeholder="Search offers..."
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
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="all">All Types</option>
            <option value="discount">Discount</option>
            <option value="freebie">Freebie</option>
            <option value="bundle">Bundle</option>
          </select>
          <button onClick={fetchOffers} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            <RefreshCw size={18} /> Refresh
          </button>
          <Link href="/admin/offers/create" className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
            <Plus size={18} /> Create Offer
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-orange-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-50 border-b border-orange-200">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Offer Name</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Type</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Discount</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Vertical</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Valid Till</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Redeemed</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOffers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-6 text-gray-400">No offers found</td>
                </tr>
              ) : (
                filteredOffers.map((offer) => (
                  <tr key={offer.id} className="border-b border-orange-50 hover:bg-orange-50/30 transition">
                    <td className="p-3 text-sm font-medium text-gray-700">{offer.name || "N/A"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeBadge(offer.type)}`}>
                        {offer.type || "—"}
                      </span>
                    </td>
                    <td className="p-3 text-sm font-bold text-orange-600">{offer.discount || offer.percentage || "—"}</td>
                    <td className="p-3 text-sm text-gray-500">{offer.vertical || "All"}</td>
                    <td className="p-3 text-sm text-gray-500">
                      {offer.valid_till ? new Date(offer.valid_till).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-3 text-sm text-gray-500">{offer.redeemed || 0}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle(offer.status)}`}>
                        {offer.status || "pending"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {offer.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(offer.id)}
                              className="text-green-600 hover:text-green-800 transition"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => handleReject(offer.id)}
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
                        <button className="text-gray-400 hover:text-gray-600 transition" title="Delete">
                          <Trash2 size={18} />
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
