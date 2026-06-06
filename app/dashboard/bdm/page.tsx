"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { RefreshCw, Target, TrendingUp, Users, Calendar, DollarSign, CheckCircle, XCircle, Edit2, Trash2, Save, X, Download, Trophy, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Lead {
  id: string;
  venue_name: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  status: string;
  notes: string;
  proof_url: string | null;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  price: number;
}

interface Commission {
  month: string;
  amount: number;
}

interface BDMProfile {
  id: string;
  zone: string;
  target_revenue: number;
  target_multiplier: number;
}

export default function BDMDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<BDMProfile | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [commission, setCommission] = useState<Commission[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState({
    venue_name: "",
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    notes: "",
    proof_file: null as File | null,
  });
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [editLeadData, setEditLeadData] = useState<Lead | null>(null);
  const [targetProgress, setTargetProgress] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    checkAndFetch();
  }, []);

  function showNotification(type: string, message: string) {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }

  async function checkAndFetch() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    const { data: bdmProfile } = await supabase
      .from("bdm_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!bdmProfile) {
      router.push("/dashboard/bdm?error=no-profile");
      return;
    }
    setProfile(bdmProfile as BDMProfile);

    // Leads
    const { data: leadsData } = await supabase
      .from("bdm_leads")
      .select("*")
      .eq("bdm_id", bdmProfile.id)
      .order("created_at", { ascending: false });
    setLeads((leadsData as Lead[]) || []);

    // Events
    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .eq("bdm_id", bdmProfile.id)
      .order("created_at", { ascending: false });
    setEvents((eventsData as Event[]) || []);

    // Commission
    const { data: commissionData } = await supabase
      .from("bdm_commission")
      .select("*")
      .eq("bdm_id", bdmProfile.id)
      .order("month", { ascending: false });
    setCommission((commissionData as Commission[]) || []);

    // Leaderboard (top 5 BDM by total commission)
    const { data: allCommission } = await supabase
      .from("bdm_commission")
      .select("bdm_profiles(user_id, zone, auth.users(email)), amount")
      .eq("paid", true);
    if (allCommission) {
      const agg: Record<string, any> = {};
      allCommission.forEach((c: any) => {
        const userId = c.bdm_profiles?.user_id;
        if (userId) {
          if (!agg[userId]) {
            agg[userId] = {
              total: 0,
              zone: c.bdm_profiles?.zone,
              email: c.bdm_profiles?.auth?.users?.email,
            };
          }
          agg[userId].total += c.amount;
        }
      });
      const sorted = Object.values(agg)
        .sort((a: any, b: any) => b.total - a.total)
        .slice(0, 5);
      setLeaderboard(sorted);
    }

    // Target progress
    const wonLeads = leadsData?.filter((l: Lead) => l.status === "won") || [];
    const leadRevenue = wonLeads.length * 5000;
    const eventRevenue = eventsData?.reduce((sum: number, e: Event) => sum + (e.price || 0), 0) || 0;
    const totalRevenue = leadRevenue + eventRevenue;
    setMonthlyRevenue(totalRevenue);
    setTargetProgress(Math.min(100, (totalRevenue / (bdmProfile.target_revenue || 1500000)) * 100));

    setLoading(false);
  }

  async function createLead(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    let proofUrl: string | null = null;
    if (leadForm.proof_file) {
      setUploading(true);
      const file = leadForm.proof_file;
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("bdm-proofs")
        .upload(fileName, file);
      if (uploadError) {
        showNotification("error", "Upload failed: " + uploadError.message);
      } else {
        proofUrl = fileName;
      }
      setUploading(false);
    }
    const { error } = await supabase.from("bdm_leads").insert({
      bdm_id: profile.id,
      venue_name: leadForm.venue_name,
      contact_name: leadForm.contact_name,
      contact_phone: leadForm.contact_phone,
      contact_email: leadForm.contact_email,
      notes: leadForm.notes,
      proof_url: proofUrl,
      status: "new",
    });
    if (error) {
      showNotification("error", "Error: " + error.message);
    } else {
      showNotification("success", "Lead added!");
      setShowLeadForm(false);
      setLeadForm({
        venue_name: "",
        contact_name: "",
        contact_phone: "",
        contact_email: "",
        notes: "",
        proof_file: null,
      });
      checkAndFetch();
    }
  }

  async function updateLeadStatus(leadId: string, newStatus: string) {
    const { error } = await supabase
      .from("bdm_leads")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", leadId);
    if (error) {
      showNotification("error", "Update failed");
    } else {
      showNotification("success", "Lead status updated!");
      checkAndFetch();
    }
  }

  async function deleteLead(leadId: string) {
    if (!confirm("Delete this lead permanently?")) return;
    const { error } = await supabase.from("bdm_leads").delete().eq("id", leadId);
    if (error) {
      showNotification("error", "Delete failed");
    } else {
      showNotification("success", "Lead deleted!");
      checkAndFetch();
    }
  }

  function startEditLead(lead: Lead) {
    setEditingLeadId(lead.id);
    setEditLeadData(lead);
  }

  async function saveEditLead() {
    if (!editingLeadId || !editLeadData) return;
    const { error } = await supabase
      .from("bdm_leads")
      .update({
        venue_name: editLeadData.venue_name,
        contact_name: editLeadData.contact_name,
        contact_phone: editLeadData.contact_phone,
        contact_email: editLeadData.contact_email,
        notes: editLeadData.notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingLeadId);
    if (error) {
      showNotification("error", "Update failed");
    } else {
      showNotification("success", "Lead updated!");
      checkAndFetch();
    }
    setEditingLeadId(null);
    setEditLeadData(null);
  }

  function exportToCSV(data: any[], filename: string) {
    if (!data.length) {
      showNotification("error", "No data to export");
      return;
    }
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(",")];
    for (const row of data) {
      const values = headers.map((header) => JSON.stringify(row[header] || ""));
      csvRows.push(values.join(","));
    }
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification("success", "Exported!");
  }

  const commissionBreakdown = commission.map((c) => ({ month: c.month, amount: c.amount }));
  const totalCommission = commission.reduce((sum, c) => sum + c.amount, 0);
  const chartData = commissionBreakdown.slice(0, 6).reverse();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return <div className="bg-white p-2 shadow rounded border text-sm">₹{payload[0].value.toLocaleString()}</div>;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-orange-600 animate-spin" />
      </div>
    );
  }
  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">BDM profile not found.</div>;
  }

  const wonLeadsCount = leads.filter((l) => l.status === "won").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-6 px-4 sm:px-6">
      {notification && (
        <div
          className={`fixed top-20 right-4 z-50 p-3 rounded-lg shadow-lg text-white ${
            notification.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {notification.message}
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">BDM Dashboard</h1>
        <p className="text-gray-500 text-sm sm:text-base mb-6">
          Zone: {profile.zone} | Target: ₹{(profile.target_revenue / 100000).toFixed(1)}L | Multiplier: {profile.target_multiplier}x
        </p>

        {/* Target Progress Card */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6 border-l-4 border-orange-500">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Target className="text-orange-600" size={22} />
              <span className="font-semibold">Target Progress ({profile.target_multiplier}x income)</span>
            </div>
            <span className="text-sm font-bold">{Math.round(targetProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-orange-600 h-3 rounded-full transition-all" style={{ width: `${targetProgress}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Current monthly revenue: ₹{(monthlyRevenue / 1000).toFixed(1)}K / ₹{(profile.target_revenue / 1000).toFixed(0)}K target
          </p>
          <div className="mt-3 text-sm">
            <span className="font-semibold">Multiplier Effect:</span> Need ₹{profile.target_revenue} revenue to achieve {profile.target_multiplier}x income.
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-500">Leads Generated</p>
                <p className="text-2xl font-bold text-blue-600">{leads.length}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-500">Won Leads</p>
                <p className="text-2xl font-bold text-green-600">{wonLeadsCount}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="text-green-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-purple-500">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-500">Events Organized</p>
                <p className="text-2xl font-bold text-purple-600">{events.length}</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <Calendar className="text-purple-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-yellow-500">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Commission</p>
                <p className="text-2xl font-bold text-yellow-600">₹{totalCommission}</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-full">
                <DollarSign className="text-yellow-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Leads Management */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 flex flex-wrap justify-between items-center gap-2">
            <h2 className="text-lg font-bold text-white">Leads Management</h2>
            <div className="flex gap-2">
              <button
                onClick={() => exportToCSV(leads, "bdm_leads")}
                className="bg-white text-orange-600 px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1"
              >
                <Download size={14} /> Export
              </button>
              <button
                onClick={() => setShowLeadForm(!showLeadForm)}
                className="bg-white text-orange-600 px-3 py-1 rounded-lg text-sm font-semibold"
              >
                + Add Lead
              </button>
            </div>
          </div>
          {showLeadForm && (
            <form onSubmit={createLead} className="p-4 bg-gray-50 border-b space-y-3">
              <input
                type="text"
                placeholder="Venue Name"
                className="w-full p-2 border rounded text-sm"
                value={leadForm.venue_name}
                onChange={(e) => setLeadForm({ ...leadForm, venue_name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Contact Name"
                className="w-full p-2 border rounded text-sm"
                value={leadForm.contact_name}
                onChange={(e) => setLeadForm({ ...leadForm, contact_name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Contact Phone"
                className="w-full p-2 border rounded text-sm"
                value={leadForm.contact_phone}
                onChange={(e) => setLeadForm({ ...leadForm, contact_phone: e.target.value })}
              />
              <input
                type="email"
                placeholder="Contact Email"
                className="w-full p-2 border rounded text-sm"
                value={leadForm.contact_email}
                onChange={(e) => setLeadForm({ ...leadForm, contact_email: e.target.value })}
              />
              <textarea
                placeholder="Notes"
                className="w-full p-2 border rounded text-sm"
                rows={2}
                value={leadForm.notes}
                onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
              />
              <div>
                <label className="block text-xs text-gray-500 mb-1">Proof (image/document)</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) =>
                    setLeadForm({ ...leadForm, proof_file: e.target.files?.[0] || null })
                  }
                  className="w-full text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-green-600 text-white py-2 rounded text-sm"
              >
                {uploading ? "Uploading..." : "Save Lead"}
              </button>
            </form>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Venue</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Contact</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-400">
                      No leads yet. Add your first lead.
                    </td>
                  </tr>
                )}
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b">
                    {editingLeadId === lead.id && editLeadData ? (
                      <>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={editLeadData.venue_name}
                            onChange={(e) =>
                              setEditLeadData({ ...editLeadData, venue_name: e.target.value })
                            }
                            className="border rounded p-1 text-sm w-full"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={editLeadData.contact_name}
                            onChange={(e) =>
                              setEditLeadData({ ...editLeadData, contact_name: e.target.value })
                            }
                            className="border rounded p-1 text-sm w-full"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={editLeadData.status}
                            onChange={(e) =>
                              setEditLeadData({ ...editLeadData, status: e.target.value })
                            }
                            className="border rounded p-1 text-xs"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="negotiation">Negotiation</option>
                            <option value="won">Won</option>
                            <option value="lost">Lost</option>
                          </select>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <button onClick={saveEditLead} className="text-green-600 mr-2">
                            <Save size={16} />
                          </button>
                          <button onClick={() => setEditingLeadId(null)} className="text-gray-400">
                            <X size={16} />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-3 py-2 text-sm">
                          {lead.venue_name}
                          {lead.proof_url && (
                            <a
                              href={supabase.storage.from("bdm-proofs").getPublicUrl(lead.proof_url).data.publicUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-500 ml-2"
                            >
                              📎 Proof
                            </a>
                          )}
                        </td>
                        <td className="px-3 py-2 text-sm">
                          {lead.contact_name}
                          <br />
                          {lead.contact_phone}
                        </td>
                        <td className="px-3 py-2">
                          <select
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                            value={lead.status}
                            className="text-xs border rounded p-1 bg-white"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="negotiation">Negotiation</option>
                            <option value="won">Won</option>
                            <option value="lost">Lost</option>
                          </select>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <button
                            onClick={() => startEditLead(lead)}
                            className="text-blue-600 mr-2"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => deleteLead(lead.id)} className="text-red-500">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Events Organized + Export */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Events Organized</h2>
            <button
              onClick={() => exportToCSV(events, "bdm_events")}
              className="bg-white text-orange-600 px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1"
            >
              <Download size={14} /> Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Event Title</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-400">
                      No events yet. You'll see events you help organize.
                    </td>
                  </tr>
                )}
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className="px-3 py-2 text-sm">{event.title}</td>
                    <td className="px-3 py-2 text-sm">{event.date}</td>
                    <td className="px-3 py-2 text-sm">₹{event.price || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commission Breakdown & Leaderboard */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Commission Breakdown</h2>
              <button
                onClick={() => exportToCSV(commissionBreakdown, "bdm_commission")}
                className="bg-white text-orange-600 px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1"
              >
                <Download size={14} /> Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Month</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {commissionBreakdown.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center py-6 text-gray-400">
                        No commission records yet.
                      </td>
                    </tr>
                  ) : (
                    commissionBreakdown.map((c) => (
                      <tr key={c.month}>
                        <td className="px-3 py-2 text-sm">{c.month}</td>
                        <td className="px-3 py-2 text-sm font-medium text-green-600">₹{c.amount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy size={18} /> Zone Leaderboard
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Rank</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Email</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Total Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-gray-400">
                        No commission data yet.
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((entry, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2 text-sm font-bold">{idx + 1}</td>
                        <td className="px-3 py-2 text-sm">{entry.email}</td>
                        <td className="px-3 py-2 text-sm text-green-600">₹{entry.total}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Commission Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <BarChart3 className="text-orange-600" /> Commission Trend (Last 6 months)
          </h2>
          {chartData.length === 0 ? (
            <p className="text-gray-400 text-center py-8 text-sm">No commission data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
