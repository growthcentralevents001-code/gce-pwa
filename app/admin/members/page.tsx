"use client";

import { useState, useEffect } from "react";
import type { DataRow } from "@/types";
import { supabase } from "@/lib/supabaseClient";
import { 
  Users, Search, Eye, Edit, 
  CheckCircle, XCircle, Clock, Filter,
  TrendingUp, UserPlus, Mail, Phone, MapPin,
  RefreshCw, Trash2, Shield, UserCheck, UserX
} from "lucide-react";
import Link from "next/link";

export default function MembersManagement() {
  const [members, setMembers] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0, admins: 0 });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      // Fetch users from auth + their roles
      const { data: users, error } = await supabase
        .from("users")
        .select(`
          id,
          email,
          name,
          phone,
          city,
          created_at,
          user_roles (role, approved)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setMembers(users || []);
      const total = users?.length || 0;
      const active = users?.filter(u => u.user_roles?.some(r => r.approved === true)).length || 0;
      const suspended = 0; // Add logic if you have a suspended status
      const admins = users?.filter(u => u.user_roles?.some(r => r.role === "admin")).length || 0;
      setStats({ total, active, suspended, admins });
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(m => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = m.email?.toLowerCase().includes(search) ||
                          m.name?.toLowerCase().includes(search) ||
                          m.phone?.toLowerCase().includes(search) ||
                          m.city?.toLowerCase().includes(search);
    const role = m.user_roles?.[0]?.role || "member";
    const matchesRole = filterRole === "all" || role === filterRole;
    const status = m.user_roles?.[0]?.approved === true ? "active" : "pending";
    const matchesStatus = filterStatus === "all" || status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "suspended": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-700 border-purple-200";
      case "zbp": return "bg-blue-100 text-blue-700 border-blue-200";
      case "venue": return "bg-green-100 text-green-700 border-green-200";
      case "affiliate": return "bg-orange-100 text-orange-700 border-orange-200";
      case "enterprise": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleSuspend = async (id: string) => {
    if (!confirm("Suspend this member?")) return;
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ approved: false })
        .eq("user_id", id);
      if (error) throw error;
      alert("Member suspended.");
      fetchMembers();
    } catch (error) {
      console.error("Error suspending:", error);
      alert("Failed to suspend.");
    }
  };

  const handleActivate = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ approved: true })
        .eq("user_id", id);
      if (error) throw error;
      alert("Member activated.");
      fetchMembers();
    } catch (error) {
      console.error("Error activating:", error);
      alert("Failed to activate.");
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
            <h1 className="text-2xl font-bold text-gray-800">Members Management</h1>
            <p className="text-gray-500 text-sm">Manage all platform members, their memberships, and activity</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Total Members</p>
          <p className="text-2xl font-bold text-orange-700">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Active</p>
          <p className="text-2xl font-bold text-green-700">{stats.active}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Suspended</p>
          <p className="text-2xl font-bold text-red-700">{stats.suspended}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Admins</p>
          <p className="text-2xl font-bold text-purple-700">{stats.admins}</p>
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
                placeholder="Search by name, email, phone or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="all">All Roles</option>
            <option value="member">Member</option>
            <option value="venue">Venue</option>
            <option value="zbp">ZBP</option>
            <option value="affiliate">Affiliate</option>
            <option value="enterprise">Enterprise</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          <button onClick={fetchMembers} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
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
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Member</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Contact</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Role</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">City</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Joined</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-6 text-gray-400">No members found</td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const role = member.user_roles?.[0]?.role || "member";
                  const status = member.user_roles?.[0]?.approved === true ? "active" : "pending";
                  return (
                    <tr key={member.id} className="border-b border-orange-50 hover:bg-orange-50/30 transition">
                      <td className="p-3 text-sm font-medium text-gray-700">{member.name || member.email || "N/A"}</td>
                      <td className="p-3 text-sm text-gray-500">{member.email || "—"}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadge(role)}`}>
                          {role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle(status)}`}>
                          {status}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-500">{member.city || "—"}</td>
                      <td className="p-3 text-sm text-gray-500">
                        {member.created_at ? new Date(member.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button className="text-blue-500 hover:text-blue-700 transition" title="Edit">
                            <Edit size={18} />
                          </button>
                          {status === "active" ? (
                            <button
                              onClick={() => handleSuspend(member.id)}
                              className="text-yellow-500 hover:text-yellow-700 transition"
                              title="Suspend"
                            >
                              <UserX size={18} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate(member.id)}
                              className="text-green-500 hover:text-green-700 transition"
                              title="Activate"
                            >
                              <UserCheck size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
