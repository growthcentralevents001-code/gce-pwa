"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Plus, RefreshCw, MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function ZBPDashboard() {
  const [partner, setPartner] = useState<any>(null);
  const [venues, setVenues] = useState<any[]>([]);
  const [commissionHistory, setCommissionHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboardForm, setShowOnboardForm] = useState(false);
  const [onboardForm, setOnboardForm] = useState({ name: '', address: '', city: '', capacity: '', type: '' });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    // Get partner record
    const { data: partnerData } = await supabase
      .from('zbp_partners')
      .select('*')
      .eq('user_id', user.id)
      .single();
    if (!partnerData) { setLoading(false); return; }
    setPartner(partnerData);

    // Get venues linked to this ZBP (via created_by_zbp_id)
    const { data: venuesData } = await supabase
      .from('venues')
      .select('*')
      .eq('created_by_zbp_id', partnerData.id)
      .order('created_at', { ascending: false });
    setVenues(venuesData || []);

    // Get commission history
    const { data: commissionData } = await supabase
      .from('zbp_commission_history')
      .select('*')
      .eq('zbp_id', partnerData.id)
      .order('month', { ascending: false })
      .limit(6);
    setCommissionHistory(commissionData || []);

    setLoading(false);
  }

  async function handleOnboard(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: partnerData } = await supabase
      .from('zbp_partners')
      .select('id')
      .eq('user_id', user.id)
      .single();
    if (!partnerData) { alert("ZBP record not found"); return; }
    const { error } = await supabase.from('venues').insert({
      name: onboardForm.name,
      address: onboardForm.address,
      city: onboardForm.city,
      capacity: parseInt(onboardForm.capacity),
      type: onboardForm.type,
      status: 'Pending',
      created_by_zbp_id: partnerData.id
    });
    if (error) alert("Onboarding failed: " + error.message);
    else {
      alert("Venue submitted for approval!");
      setShowOnboardForm(false);
      setOnboardForm({ name: '', address: '', city: '', capacity: '', type: '' });
      fetchData();
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><RefreshCw className="w-8 h-8 text-orange-600 animate-spin" /></div>;
  if (!partner) return <div className="min-h-screen flex items-center justify-center">No ZBP record found.</div>;

  const activeCount = venues.filter(v => v.status === 'Active').length;
  const inactiveCount = venues.filter(v => v.status !== 'Active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">ZBP Dashboard</h1>
        <p className="text-gray-500 mb-6">Zone: {partner.zone} | City: {partner.city}</p>

        {/* Tier Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-l-4 border-orange-500">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Current Tier: <span className="text-orange-600">{partner.tier}</span></h2>
              <p className="text-sm text-gray-500 mt-1">Active venues: {activeCount}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Commission Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {partner.tier === 'Platinum' ? '50%' : partner.tier === 'Gold' ? '40%' : '30%'}
              </p>
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min(100, (activeCount / (partner.tier === 'Silver' ? 6 : partner.tier === 'Gold' ? 16 : 1)) * 100)}%` }}></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4 text-center"><div className="text-2xl font-bold text-orange-600">₹{partner.total_commission_earned}</div><div className="text-sm text-gray-500">Total Commission</div></div>
          <div className="bg-white rounded-xl shadow p-4 text-center"><div className="text-2xl font-bold text-orange-600">{activeCount}</div><div className="text-sm text-gray-500">Active Venues</div></div>
          <div className="bg-white rounded-xl shadow p-4 text-center"><div className="text-2xl font-bold text-orange-600">₹{partner.lifetime_commission}</div><div className="text-sm text-gray-500">Lifetime Commission</div></div>
        </div>

        {/* Venues List */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Your Venues</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Venue Name</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">City</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Rating</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {venues.length === 0 && <tr><td colSpan={4} className="text-center py-4 text-gray-500">No venues onboarded yet.</td></tr>}
                {venues.map(v => (
                  <tr key={v.id}>
                    <td className="px-4 py-2"><div className="font-medium">{v.name}</div><div className="text-xs text-gray-400">{v.address}</div></td>
                    <td className="px-4 py-2">{v.city}</td>
                    <td className="px-4 py-2">
                      {v.status === 'Active' ? <span className="text-green-600 flex items-center gap-1"><CheckCircle size={14} /> Active</span> : v.status === 'Pending' ? <span className="text-yellow-600 flex items-center gap-1"><AlertCircle size={14} /> Pending</span> : <span className="text-red-600 flex items-center gap-1"><XCircle size={14} /> {v.status}</span>}
                    </td>
                    <td className="px-4 py-2">{v.rating_name || 'Not rated'} {v.rating && `(${v.rating}★)`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Onboard Venue Button & Form */}
        <div className="mb-6">
          <button onClick={() => setShowOnboardForm(!showOnboardForm)} className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18} /> Onboard New Venue</button>
          {showOnboardForm && (
            <form onSubmit={handleOnboard} className="mt-4 bg-white p-4 rounded-xl shadow space-y-3">
              <input type="text" placeholder="Venue Name" className="w-full p-2 border rounded" value={onboardForm.name} onChange={e => setOnboardForm({...onboardForm, name: e.target.value})} required />
              <input type="text" placeholder="Address" className="w-full p-2 border rounded" value={onboardForm.address} onChange={e => setOnboardForm({...onboardForm, address: e.target.value})} required />
              <input type="text" placeholder="City" className="w-full p-2 border rounded" value={onboardForm.city} onChange={e => setOnboardForm({...onboardForm, city: e.target.value})} required />
              <input type="number" placeholder="Capacity" className="w-full p-2 border rounded" value={onboardForm.capacity} onChange={e => setOnboardForm({...onboardForm, capacity: e.target.value})} required />
              <select className="w-full p-2 border rounded" value={onboardForm.type} onChange={e => setOnboardForm({...onboardForm, type: e.target.value})} required>
                <option value="">Venue Type</option>
                <option>Restaurant</option><option>Banquet Hall</option><option>Hotel</option><option>Convention Center</option>
              </select>
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Submit for Approval</button>
            </form>
          )}
        </div>

        {/* Commission History */}
        <h2 className="text-xl font-bold mt-6 mb-3">Commission History</h2>
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Month</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total Sales</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">GCE Commission</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">ZBP Share</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Net Payout</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {commissionHistory.length === 0 && <tr><td colSpan={5} className="text-center py-4 text-gray-500">No commission data yet.</td></tr>}
              {commissionHistory.map(c => (
                <tr key={c.id}><td className="px-4 py-2">{c.month}</td><td className="px-4 py-2">₹{c.total_sales}</td><td className="px-4 py-2">₹{c.gce_commission}</td><td className="px-4 py-2">₹{c.zbp_commission}</td><td className="px-4 py-2">₹{c.net_payout}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
