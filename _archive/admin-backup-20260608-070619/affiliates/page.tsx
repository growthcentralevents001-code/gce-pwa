"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RefreshCw, Search, CheckCircle, XCircle, Trash2, Edit2, Save, X, User, Mail, Phone, Globe, DollarSign, Calendar, Tag, TrendingUp, Users, Award, Clock } from "lucide-react";

export default function AdminAffiliates() {
  const [applications, setApplications] = useState<any[]>([]);
  const [filteredApps, setFilteredApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => { fetchApplications(); }, []);

  useEffect(() => {
    let filtered = [...applications];
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.social_handle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    setFilteredApps(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, applications]);

  async function fetchApplications() {
    setLoading(true);
    const { data } = await supabase.from("marketplace_affiliates").select("*").order("applied_at", { ascending: false });
    if (data) setApplications(data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("marketplace_affiliates").update({ status }).eq("id", id);
    if (error) alert(error.message);
    else fetchApplications();
  }

  async function deleteAffiliate(id: string) {
    if (confirm("Delete this affiliate application permanently?")) {
      const { error } = await supabase.from("marketplace_affiliates").delete().eq("id", id);
      if (error) alert(error.message);
      else fetchApplications();
    }
  }

  async function updateNotes(id: string, notes: string) {
    const { error } = await supabase.from("marketplace_affiliates").update({ admin_notes: notes }).eq("id", id);
    if (error) alert(error.message);
    else {
      setEditingId(null);
      fetchApplications();
    }
  }

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === "Pending").length,
    approved: applications.filter(a => a.status === "Approved").length,
    totalCommission: applications.reduce((sum, a) => sum + (a.total_commission_earned || 0), 0),
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentApps = filteredApps.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);

  if (loading) return <div className="flex justify-center items-center h-64"><RefreshCw className="w-8 h-8 text-orange-600 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8 px-4">
      <div className="w-full max-w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Affiliate Applications</h1>
          <p className="text-gray-500 mt-2">Manage affiliate applications, approve/reject, add notes, track performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-orange-500">
            <div className="flex justify-between items-center">
              <div><p className="text-sm text-gray-500">Total Applications</p><p className="text-3xl font-bold text-gray-800">{stats.total}</p></div>
              <div className="bg-orange-100 p-3 rounded-full"><Users className="text-orange-600" size={24} /></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-yellow-500">
            <div className="flex justify-between items-center">
              <div><p className="text-sm text-gray-500">Pending</p><p className="text-3xl font-bold text-yellow-600">{stats.pending}</p></div>
              <div className="bg-yellow-100 p-3 rounded-full"><Clock className="text-yellow-600" size={24} /></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-green-500">
            <div className="flex justify-between items-center">
              <div><p className="text-sm text-gray-500">Approved</p><p className="text-3xl font-bold text-green-600">{stats.approved}</p></div>
              <div className="bg-green-100 p-3 rounded-full"><Award className="text-green-600" size={24} /></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-purple-500">
            <div className="flex justify-between items-center">
              <div><p className="text-sm text-gray-500">Total Commission Paid</p><p className="text-3xl font-bold text-purple-600">₹{stats.totalCommission.toLocaleString()}</p></div>
              <div className="bg-purple-100 p-3 rounded-full"><DollarSign className="text-purple-600" size={24} /></div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search by name, email, or social handle..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white">
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Affiliates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentApps.length === 0 && (
            <div className="col-span-full bg-white rounded-2xl shadow-md p-12 text-center text-gray-400">
              <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              No applications found.
            </div>
          )}
          {currentApps.map(app => (
            <div key={app.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow">
                      {app.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">{app.name}</h2>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12} /> {app.email}</p>
                    </div>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {app.status}
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600"><Phone size={14} /> {app.phone}</div>
                  <div className="flex items-center gap-2 text-gray-600"><Globe size={14} /> {app.social_handle}</div>
                  <div className="flex items-center gap-2"><TrendingUp size={14} className="text-orange-500" /> <strong>{app.follower_count}</strong> followers</div>
                  <div className="flex items-center gap-2"><DollarSign size={14} className="text-green-600" /> Commission: <strong className="text-orange-600">{app.commission_rate}%</strong></div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs"><Calendar size={12} /> Applied: {new Date(app.applied_at).toLocaleDateString()}</div>
                </div>

                {/* Notes */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-500 flex items-center gap-1"><Tag size={12} /> Notes</span>
                    {editingId === app.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => updateNotes(app.id, editNotes)} className="text-green-600 hover:text-green-700"><Save size={14} /></button>
                        <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingId(app.id); setEditNotes(app.admin_notes || ''); }} className="text-gray-400 hover:text-orange-600"><Edit2 size={12} /></button>
                    )}
                  </div>
                  {editingId === app.id ? (
                    <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-orange-500" rows={2} placeholder="Add internal notes..." />
                  ) : (
                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">{app.admin_notes || '—'}</p>
                  )}
                </div>
              </div>

              <div className="px-5 pb-5 pt-0 flex gap-2">
                {app.status === 'Pending' && (
                  <>
                    <button onClick={() => updateStatus(app.id, 'Approved')} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-xl text-sm flex items-center justify-center gap-1"><CheckCircle size={14} /> Approve</button>
                    <button onClick={() => updateStatus(app.id, 'Rejected')} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-sm flex items-center justify-center gap-1"><XCircle size={14} /> Reject</button>
                  </>
                )}
                <button onClick={() => deleteAffiliate(app.id)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl text-sm flex items-center justify-center gap-1"><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-8">
            <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="px-4 py-2 bg-white border border-gray-300 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition">← Previous</button>
            <span className="px-4 py-2 bg-orange-600 text-white rounded-xl">{currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="px-4 py-2 bg-white border border-gray-300 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
