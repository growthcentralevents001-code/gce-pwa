"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  Building, Search, Plus, Eye, Edit, 
  CheckCircle, XCircle, Clock, Filter,
  TrendingUp, Users, MapPin, Calendar, IndianRupee,
  RefreshCw, MessageSquare, FileText, DollarSign
} from "lucide-react";
import Link from "next/link";

export default function EnterpriseProposals() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({ total: 0, pending: 0, proposed: 0, approved: 0, rejected: 0 });
  const [editingId, setEditingId] = useState(null);
  const [proposalForm, setProposalForm] = useState({
    proposal_text: "",
    amount: "",
    admin_notes: "",
    final_budget: "",
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Fetch all enterprise requests with statuses
      const { data, error } = await supabase
        .from("enterprise_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);

      const total = data?.length || 0;
      const pending = data?.filter(r => r.status === "pending").length || 0;
      const proposed = data?.filter(r => r.status === "proposed").length || 0;
      const approved = data?.filter(r => r.status === "approved").length || 0;
      const rejected = data?.filter(r => r.status === "rejected").length || 0;
      setStats({ total, pending, proposed, approved, rejected });
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProposal = async (requestId: string) => {
    if (!proposalForm.proposal_text || !proposalForm.amount) {
      alert("Please fill in proposal text and amount.");
      return;
    }

    try {
      // Insert proposal
      const { error: propError } = await supabase
        .from("enterprise_proposals")
        .insert({
          request_id: requestId,
          proposal_text: proposalForm.proposal_text,
          amount: parseFloat(proposalForm.amount),
          admin_notes: proposalForm.admin_notes || null,
          final_budget: proposalForm.final_budget ? parseFloat(proposalForm.final_budget) : null,
          status: "pending",
          user_id: (await supabase.auth.getUser()).data.user?.id,
        });

      if (propError) throw propError;

      // Update request status to 'proposed'
      const { error: reqError } = await supabase
        .from("enterprise_requests")
        .update({ status: "proposed" })
        .eq("id", requestId);

      if (reqError) throw reqError;

      alert("Proposal sent to enterprise!");
      setEditingId(null);
      setProposalForm({ proposal_text: "", amount: "", admin_notes: "", final_budget: "" });
      fetchRequests();
    } catch (error: any) {
      console.error("Error creating proposal:", error);
      alert("Failed to create proposal: " + error.message);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (!confirm("Reject this request?")) return;
    try {
      const { error } = await supabase
        .from("enterprise_requests")
        .update({ status: "rejected" })
        .eq("id", requestId);
      if (error) throw error;
      alert("Request rejected.");
      fetchRequests();
    } catch (error) {
      console.error("Error rejecting:", error);
      alert("Failed to reject.");
    }
  };

  const filteredRequests = requests.filter(r => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = r.event_type?.toLowerCase().includes(search) ||
                          r.company_name?.toLowerCase().includes(search) ||
                          r.city?.toLowerCase().includes(search) ||
                          r.budget_range?.toLowerCase().includes(search);
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-700 border-green-200";
      case "proposed": return "bg-blue-100 text-blue-700 border-blue-200";
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
            <Building size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Enterprise Requests</h1>
            <p className="text-gray-500 text-sm">Manage corporate event requests, create proposals, and track status</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Total Requests</p>
          <p className="text-2xl font-bold text-orange-700">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Proposed</p>
          <p className="text-2xl font-bold text-blue-700">{stats.proposed}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Approved</p>
          <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Rejected</p>
          <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
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
                placeholder="Search by event type, company, city, budget..."
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
            <option value="proposed">Proposed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={fetchRequests} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
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
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Event Type</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Company</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Budget</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">City</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Guests</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-6 text-gray-400">No requests found</td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="border-b border-orange-50 hover:bg-orange-50/30 transition">
                    <td className="p-3 text-sm font-medium text-gray-700">{req.event_type || "N/A"}</td>
                    <td className="p-3 text-sm text-gray-500">{req.company_name || "—"}</td>
                    <td className="p-3 text-sm font-medium text-orange-600">{req.budget_range || "—"}</td>
                    <td className="p-3 text-sm text-gray-500">{req.city || "—"}</td>
                    <td className="p-3 text-sm text-gray-500">{req.guest_count || 0}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle(req.status)}`}>
                        {req.status || "pending"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        {req.status === "pending" && (
                          <>
                            <button
                              onClick={() => setEditingId(req.id)}
                              className="px-3 py-1 bg-orange-500 text-white rounded-lg text-xs hover:bg-orange-600 transition"
                            >
                              Create Proposal
                            </button>
                            <button
                              onClick={() => handleRejectRequest(req.id)}
                              className="text-red-500 hover:text-red-700 transition"
                              title="Reject Request"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        {req.status === "proposed" && (
                          <span className="text-xs text-blue-600">Proposal sent</span>
                        )}
                        {req.status === "approved" && (
                          <span className="text-xs text-green-600">Approved</span>
                        )}
                        {req.status === "rejected" && (
                          <span className="text-xs text-red-600">Rejected</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proposal Form Modal (inline) */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-orange-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create Proposal</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Text *</label>
                <textarea
                  value={proposalForm.proposal_text}
                  onChange={(e) => setProposalForm({...proposalForm, proposal_text: e.target.value})}
                  className="w-full p-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
                  rows="4"
                  placeholder="Describe the proposal..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  value={proposalForm.amount}
                  onChange={(e) => setProposalForm({...proposalForm, amount: e.target.value})}
                  className="w-full p-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes (optional)</label>
                <textarea
                  value={proposalForm.admin_notes}
                  onChange={(e) => setProposalForm({...proposalForm, admin_notes: e.target.value})}
                  className="w-full p-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
                  rows="2"
                  placeholder="Internal notes..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Final Budget (optional)</label>
                <input
                  type="number"
                  value={proposalForm.final_budget}
                  onChange={(e) => setProposalForm({...proposalForm, final_budget: e.target.value})}
                  className="w-full p-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
                  placeholder="Enter final budget"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleCreateProposal(editingId)}
                  className="flex-1 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                >
                  Send Proposal
                </button>
                <button
                  onClick={() => { setEditingId(null); setProposalForm({ proposal_text: "", amount: "", admin_notes: "", final_budget: "" }); }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
