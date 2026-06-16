"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, Award, Calendar, DollarSign, TrendingUp,
  PlusCircle, Edit, Trash2, Search, Download, Save, X, Settings,
  User, Phone, Mail, MapPin, CheckCircle, XCircle, Clock
} from "lucide-react";

interface BDMProfile {
  id: string;
  user_id: string;
  zone: string;
  target_revenue: number;
  leads_count: number;
  won_leads: number;
  events_count: number;
  commission: number;
}

interface Lead {
  id: string;
  venue_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  city: string;
  status: string;
  notes: string;
  created_at: string;
}

export default function BDMDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState<BDMProfile | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    venue_name: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    city: "",
    status: "new",
    notes: "",
  });

  const [profileForm, setProfileForm] = useState({ zone: "", target_revenue: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data: profileData, error: profileError } = await supabase
      .from("bdm_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profileData) {
      setLoading(false);
      return;
    }
    setProfile(profileData);
    setProfileForm({ zone: profileData.zone || "", target_revenue: profileData.target_revenue || 1500000 });

    const { data: leadsData } = await supabase
      .from("bdm_leads")
      .select("*")
      .eq("bdm_id", profileData.id)
      .order("created_at", { ascending: false });

    setLeads(leadsData || []);
    setLoading(false);
  }

  async function saveProfile() {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("bdm_profiles")
      .update({ zone: profileForm.zone, target_revenue: profileForm.target_revenue })
      .eq("id", profile.id);
    if (error) alert("Error: " + error.message);
    else {
      alert("Profile updated!");
      setProfile({ ...profile, zone: profileForm.zone, target_revenue: profileForm.target_revenue });
    }
    setSaving(false);
  }

  async function saveLead() {
    if (!profile) return;
    setSaving(true);
    if (editingLead) {
      const { error } = await supabase
        .from("bdm_leads")
        .update(formData)
        .eq("id", editingLead.id);
      if (error) alert("Error: " + error.message);
      else {
        alert("Lead updated!");
        fetchData();
      }
    } else {
      const { error } = await supabase
        .from("bdm_leads")
        .insert([{ ...formData, bdm_id: profile.id }]);
      if (error) alert("Error: " + error.message);
      else {
        alert("Lead added!");
        fetchData();
      }
    }
    setShowLeadModal(false);
    setEditingLead(null);
    setFormData({ venue_name: "", contact_name: "", contact_email: "", contact_phone: "", city: "", status: "new", notes: "" });
    setSaving(false);
  }

  async function deleteLead(id: string) {
    if (!confirm("Delete this lead?")) return;
    const { error } = await supabase.from("bdm_leads").delete().eq("id", id);
    if (error) alert("Error: " + error.message);
    else fetchData();
  }

  function openEditLead(lead: Lead) {
    setEditingLead(lead);
    setFormData({
      venue_name: lead.venue_name,
      contact_name: lead.contact_name || "",
      contact_email: lead.contact_email || "",
      contact_phone: lead.contact_phone || "",
      city: lead.city || "",
      status: lead.status,
      notes: lead.notes || "",
    });
    setShowLeadModal(true);
  }

  function openAddLead() {
    setEditingLead(null);
    setFormData({ venue_name: "", contact_name: "", contact_email: "", contact_phone: "", city: "", status: "new", notes: "" });
    setShowLeadModal(true);
  }

  const filteredLeads = leads.filter(lead =>
    lead.venue_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const targetProgress = profile ? (profile.leads_count / (profile.target_revenue / 50000)) * 100 : 0;

  if (loading) {
    return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div><p className="ml-3">Loading BDM Dashboard...</p></div>;
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">BDM Dashboard</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800 mb-2">⚠️ No BDM profile found</p>
          <p className="text-gray-600">Please contact admin to set up your BDM profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">BDM Dashboard</h1>
        <p className="text-gray-500">Zone: {profile.zone} | Target: ₹{(profile.target_revenue / 100000).toFixed(1)}L</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b pb-2">
        {["overview", "leads", "analytics", "settings"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
            {tab === "overview" && "📊 Overview"}
            {tab === "leads" && "📋 Leads"}
            {tab === "analytics" && "📈 Analytics"}
            {tab === "settings" && "⚙️ Settings"}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex justify-between mb-2"><span className="text-sm font-medium">Target Progress ({profile.leads_count} leads)</span><span className="text-sm text-orange-600">{targetProgress.toFixed(0)}%</span></div>
            <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-orange-600 h-2 rounded-full" style={{ width: `${Math.min(100, targetProgress)}%` }}></div></div>
            <p className="text-sm text-gray-500 mt-2">Target Revenue: ₹{(profile.target_revenue / 100000).toFixed(1)}L | Current Leads Value: ₹{(profile.leads_count * 50000).toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-500"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Leads Generated</p><p className="text-2xl font-bold">{profile.leads_count}</p></div><Users className="text-blue-500" size={28} /></div></div>
            <div className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Won Leads</p><p className="text-2xl font-bold">{profile.won_leads}</p></div><Award className="text-green-500" size={28} /></div></div>
            <div className="bg-white rounded-lg shadow p-5 border-l-4 border-purple-500"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Events Organized</p><p className="text-2xl font-bold">{profile.events_count}</p></div><Calendar className="text-purple-500" size={28} /></div></div>
            <div className="bg-white rounded-lg shadow p-5 border-l-4 border-orange-500"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Total Commission</p><p className="text-2xl font-bold">₹{profile.commission.toLocaleString()}</p></div><DollarSign className="text-orange-500" size={28} /></div></div>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center"><h2 className="font-semibold">Recent Leads</h2><button onClick={openAddLead} className="text-sm bg-orange-600 text-white px-3 py-1 rounded-full">+ Add Lead</button></div>
            {leads.length === 0 ? <div className="p-8 text-center text-gray-500">No leads yet. Add your first lead.</div> : <div className="divide-y">{leads.slice(0, 5).map((lead) => (<div key={lead.id} className="p-4 flex justify-between items-center hover:bg-gray-50"><div><p className="font-medium">{lead.venue_name}</p><p className="text-sm text-gray-500">{lead.city} • {lead.status}</p></div><button onClick={() => openEditLead(lead)} className="text-orange-600 text-sm">Edit</button></div>))}</div>}
          </div>
        </>
      )}

      {activeTab === "leads" && (
        <>
          <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-3 justify-between items-center">
            <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} /><input type="text" placeholder="Search leads..." className="w-full pl-10 pr-4 py-2 border rounded-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <button onClick={openAddLead} className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><PlusCircle size={18} /> Add Lead</button>
            <button className="border px-4 py-2 rounded-lg flex items-center gap-2"><Download size={18} /> Export</button>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b"><tr><th className="text-left p-4">Venue Name</th><th className="text-left p-4">Contact</th><th className="text-left p-4">City</th><th className="text-left p-4">Status</th><th className="text-left p-4">Created</th><th className="text-left p-4">Actions</th></tr></thead>
              <tbody>
                {filteredLeads.map((lead) => (<tr key={lead.id} className="border-b hover:bg-gray-50"><td className="p-4 font-medium">{lead.venue_name}</td><td className="p-4"><p className="text-sm">{lead.contact_name || "-"}</p><p className="text-xs text-gray-500">{lead.contact_email}</p></td><td className="p-4">{lead.city || "-"}</td><td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${lead.status === "won" ? "bg-green-100 text-green-700" : lead.status === "lost" ? "bg-red-100 text-red-700" : lead.status === "qualified" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>{lead.status}</span></td><td className="p-4 text-sm">{new Date(lead.created_at).toLocaleDateString()}</td><td className="p-4"><div className="flex gap-2"><button onClick={() => openEditLead(lead)} className="text-orange-600 hover:bg-orange-50 p-1 rounded"><Edit size={16} /></button><button onClick={() => deleteLead(lead.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button></div></td></tr>))}
                {filteredLeads.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500">No leads found</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "analytics" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Performance Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><p className="font-medium">Leads by Status</p><div className="mt-2 space-y-2"><div className="flex justify-between"><span>New</span><span>{leads.filter(l => l.status === "new").length}</span></div><div className="flex justify-between"><span>Contacted</span><span>{leads.filter(l => l.status === "contacted").length}</span></div><div className="flex justify-between"><span>Qualified</span><span>{leads.filter(l => l.status === "qualified").length}</span></div><div className="flex justify-between"><span>Won</span><span>{leads.filter(l => l.status === "won").length}</span></div><div className="flex justify-between"><span>Lost</span><span>{leads.filter(l => l.status === "lost").length}</span></div></div></div>
            <div><p className="font-medium">Conversion Rate</p><div className="mt-2 text-2xl font-bold text-orange-600">{profile.leads_count > 0 ? ((profile.won_leads / profile.leads_count) * 100).toFixed(1) : 0}%</div><p className="text-sm text-gray-500 mt-4">Total Commission Earned: ₹{profile.commission.toLocaleString()}</p><button onClick={() => alert("Report generation coming soon")} className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg">Download Full Report</button></div>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Profile Settings</h2>
          <div className="space-y-4 max-w-md"><div><label className="block text-sm text-gray-500 mb-1">Zone</label><input type="text" value={profileForm.zone} onChange={(e) => setProfileForm({ ...profileForm, zone: e.target.value })} className="w-full border rounded-lg p-2" /></div><div><label className="block text-sm text-gray-500 mb-1">Target Revenue (₹)</label><input type="number" value={profileForm.target_revenue} onChange={(e) => setProfileForm({ ...profileForm, target_revenue: parseInt(e.target.value) })} className="w-full border rounded-lg p-2" /></div><button onClick={saveProfile} disabled={saving} className="bg-orange-600 text-white px-4 py-2 rounded-lg">{saving ? "Saving..." : "Save Settings"}</button></div>
        </div>
      )}

      {showLeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-5 border-b flex justify-between items-center"><h3 className="text-lg font-bold">{editingLead ? "Edit Lead" : "Add New Lead"}</h3><button onClick={() => setShowLeadModal(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button></div>
            <div className="p-5 space-y-4">
              <div><label className="block text-sm">Venue Name *</label><input type="text" value={formData.venue_name} onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })} className="w-full border rounded-lg p-2" required /></div>
              <div><label className="block text-sm">Contact Name</label><input type="text" value={formData.contact_name} onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })} className="w-full border rounded-lg p-2" /></div>
              <div><label className="block text-sm">Contact Email</label><input type="email" value={formData.contact_email} onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })} className="w-full border rounded-lg p-2" /></div>
              <div><label className="block text-sm">Contact Phone</label><input type="tel" value={formData.contact_phone} onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })} className="w-full border rounded-lg p-2" /></div>
              <div><label className="block text-sm">City</label><input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full border rounded-lg p-2" /></div>
              <div><label className="block text-sm">Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full border rounded-lg p-2"><option value="new">New</option><option value="contacted">Contacted</option><option value="qualified">Qualified</option><option value="won">Won</option><option value="lost">Lost</option></select></div>
              <div><label className="block text-sm">Notes</label><textarea rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full border rounded-lg p-2"></textarea></div>
            </div>
            <div className="p-5 border-t flex justify-end gap-3"><button onClick={() => setShowLeadModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={saveLead} disabled={saving} className="bg-orange-600 text-white px-4 py-2 rounded-lg">{saving ? "Saving..." : "Save Lead"}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
