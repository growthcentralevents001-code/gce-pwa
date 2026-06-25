"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  Users, Search, Plus, Eye, Edit, 
  CheckCircle, XCircle, Clock, Filter,
  TrendingUp, Award, IndianRupee, UserPlus,
  RefreshCw, Trash2, MessageCircle
} from "lucide-react";
import Link from "next/link";

export default function AffiliateApplications() {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, commission: 0 });

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    setLoading(true);
    try {
      // Fetch all users with affiliate role from user_roles
      const { data, error } = await supabase
        .from("user_roles")
        .select(`
          id,
          user_id,
          approved,
          approved_at,
          created_at,
          users:user_id (email, name, phone, created_at)
        `)
        .eq("role", "affiliate")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Also fetch from affiliate_applications table if exists
      const { data: appData } = await supabase
        .from("affiliate_applications")
        .select("*")
        .order("created_at", { ascending: false });

      // Combine both sources (if needed)
      let combined = data || [];
      if (appData && appData.length > 0) {
        combined = appData.map(app => ({
          id: app.id,
          user_id: app.user_id,
          approved: app.status === "approved",
          status: app.status || "pending",
          name: app.name || app.contact_person,
          email: app.email,
          phone: app.phone,
          social_handle: app.social_handle || "",
          followers: app.followers || 0,
          commission_rate: app.commission_rate || 15,
          created_at: app.created_at,
          notes: app.notes || "",
        }));
      }

      setAffiliates(combined);
      const total = combined.length;
      const pending = combined.filter(a => a.status === "pending").length;
      const approved = combined.filter(a => a.status === "approved").length;
      const commission = combined.reduce((sum, a) => sum + (a.commission_rate || 0), 0);
      setStats({ total, pending, approved, commission });
    } catch (error) {
      console.error("Error fetching affiliates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from("affiliate_applications")
        .update({ status: "approved" })
        .eq("id", id);
      if (error) throw error;
      alert("Affiliate approved!");
      fetchAffiliates();
    } catch (error) {
      console.error("Error approving:", error);
      alert("Failed to approve.");
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Reject this affiliate application?")) return;
    try {
      const { error } = await supabase
        .from("affiliate_applications")
        .update({ status: "rejected" })
        .eq("id", id);
      if (error) throw error;
      alert("Affiliate rejected.");
      fetchAffiliates();
    } catch (error) {
      console.error("Error rejecting:", error);
      alert("Failed to reject.");
    }
  };

  const filteredAffiliates = affiliates.filter(a => {
    const name = a.name || a.email || "";
    const email = a.email || "";
    const social = a.social_handle || "";
    const search = searchTerm.toLowerCase();
    const matchesSearch = name.toLowerCase().includes(search) ||
                          email.toLowerCase().includes(search) ||
                          social.toLowerCase().includes(search);
    const matchesStatus = filterStatus === "all" || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "rejected": return "bg-red-100 text-red-700 border-red-200";
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
            <Users size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Affiliate Applications</h1>
            <p className="text-gray-500 text-sm">Manage affiliate applications, approve/reject, add notes, track performance</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Total Applications</p>
          <p className="text-2xl font-bold text-orange-700">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Approved</p>
          <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Total Commission Paid</p>
          <p className="text-2xl font-bold text-blue-700">₹{stats.commission}</p>
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
                placeholder="Search by name, email, or social handle..."
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
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={fetchAffiliates} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-orange-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-50 border-b border-orange-200">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Name</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Email</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Social Handle</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Followers</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Commission</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAffiliates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-6 text-gray-400">No affiliates found</td>
                </tr>
              ) : (
                filteredAffiliates.map((aff) => (
                  <tr key={aff.id} className="border-b border-orange-50 hover:bg-orange-50/30 transition">
                    <td className="p-3 text-sm font-medium text-gray-700">{aff.name || "N/A"}</td>
                    <td className="p-3 text-sm text-gray-500">{aff.email || "—"}</td>
                    <td className="p-3 text-sm text-gray-500">{aff.social_handle || "—"}</td>
                    <td className="p-3 text-sm text-gray-500">{aff.followers || 0}</td>
                    <td className="p-3 text-sm font-medium text-orange-600">{aff.commission_rate || 15}%</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle(aff.status)}`}>
                        {aff.status || "pending"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {aff.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(aff.id)}
                              className="text-green-600 hover:text-green-800 transition"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => handleReject(aff.id)}
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
                        <button className="text-gray-400 hover:text-gray-600 transition" title="Add Note">
                          <MessageCircle size={18} />
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
