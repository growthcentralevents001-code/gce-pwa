"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { RefreshCw, CheckCircle, XCircle, FileText, IndianRupee, Calendar, MapPin, Users, Plus, Search, Trash2 } from "lucide-react";

export default function AdminEnterpriseProposals() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [proposalText, setProposalText] = useState("");
  const [proposalAmount, setProposalAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => { checkAdminAndFetch(); }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter]);

  async function checkAdminAndFetch() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (userData?.role !== "admin") { router.push("/unauthorized"); return; }
    fetchRequests();
  }

  async function fetchRequests() {
    setLoading(true);
    const { data } = await supabase.from("enterprise_requests").select("*, enterprise_proposals(*)").order("created_at", { ascending: false });
    if (data) setRequests(data);
    setLoading(false);
  }

  function filterRequests() {
    let filtered = [...requests];
    if (searchTerm) filtered = filtered.filter(req => req.event_type.toLowerCase().includes(searchTerm.toLowerCase()) || req.city.toLowerCase().includes(searchTerm.toLowerCase()));
    if (statusFilter !== "all") filtered = filtered.filter(req => req.status === statusFilter);
    setFilteredRequests(filtered);
  }

  async function createProposal(requestId: string) {
    if (!proposalText || !proposalAmount) return alert("Please fill both fields.");
    setSubmitting(true);
    const { error } = await supabase.from("enterprise_proposals").insert({ request_id: requestId, proposal_text: proposalText, amount: parseFloat(proposalAmount), status: "pending" });
    if (error) alert("Error: " + error.message);
    else { alert("Proposal created!"); setSelectedRequest(null); setProposalText(""); setProposalAmount(""); fetchRequests(); }
    setSubmitting(false);
  }

  async function deleteProposal(proposalId: string) {
    if (confirm("Delete this proposal permanently?")) {
      await supabase.from("enterprise_proposals").delete().eq("id", proposalId);
      fetchRequests();
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><RefreshCw className="w-8 h-8 text-orange-600 animate-spin" /></div>;

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    withProposals: requests.filter(r => r.enterprise_proposals?.length > 0).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8 px-4">
      <div className="w-full max-w-full mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-semibold mb-2">Admin Panel</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Enterprise Proposal Management</h1>
          <p className="text-gray-500 mt-2">Create proposals for corporate event requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-orange-500"><div className="text-2xl font-bold text-orange-600">{stats.total}</div><div className="text-sm text-gray-500">Total Requests</div></div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-yellow-500"><div className="text-2xl font-bold text-yellow-600">{stats.pending}</div><div className="text-sm text-gray-500">Pending Requests</div></div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500"><div className="text-2xl font-bold text-green-600">{stats.withProposals}</div><div className="text-sm text-gray-500">With Proposals</div></div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search by event type or city..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No requests found.</p>
            </div>
          )}
          {filteredRequests.map((req) => (
            <div key={req.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-white">{req.event_type}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${req.status === 'approved' ? 'bg-green-200 text-green-800' : req.status === 'rejected' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>{req.status}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2"><Users size={16} className="text-orange-500" /> {req.guest_count} guests</div>
                  <div className="flex items-center gap-2"><IndianRupee size={16} className="text-orange-500" /> {req.budget_range}</div>
                  <div className="flex items-center gap-2"><MapPin size={16} className="text-orange-500" /> {req.city}</div>
                  <div className="flex items-center gap-2"><Calendar size={16} className="text-orange-500" /> Preferred: {req.preferred_dates}</div>
                </div>

                {req.enterprise_proposals?.length > 0 ? (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Proposals:</h3>
                    {req.enterprise_proposals.map((prop: any) => (
                      <div key={prop.id} className="bg-gray-50 rounded-xl p-3 mb-2 border border-gray-100">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{prop.proposal_text}</p>
                            <p className="text-orange-600 font-bold mt-1">₹{prop.amount}</p>
                            <p className="text-xs text-gray-400">Status: <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${prop.status === 'accepted' ? 'bg-green-100 text-green-700' : prop.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{prop.status}</span></p>
                          </div>
                          <button onClick={() => deleteProposal(prop.id)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-2 py-1 rounded-lg text-sm"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <button onClick={() => setSelectedRequest(req)} className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-xl flex items-center justify-center gap-2 transition">
                    <Plus size={18} /> Create Proposal
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold mb-4">Create Proposal for <span className="text-orange-600">{selectedRequest.event_type}</span></h3>
            <textarea placeholder="Proposal text" className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-orange-500" rows={4} value={proposalText} onChange={e => setProposalText(e.target.value)} />
            <input type="number" placeholder="Amount (₹)" className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-orange-500" value={proposalAmount} onChange={e => setProposalAmount(e.target.value)} />
            <button onClick={() => createProposal(selectedRequest.id)} disabled={submitting} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition">{submitting ? "Creating..." : "Create Proposal"}</button>
            <button onClick={() => setSelectedRequest(null)} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold mt-2 transition">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
