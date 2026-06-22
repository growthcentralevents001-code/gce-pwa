"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RefreshCw, Copy, Users, DollarSign, TrendingUp } from "lucide-react";

export default function AffiliateDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Not logged in"); setLoading(false); return; }
      const { data: affiliate, error: affError } = await supabase
        .from("marketplace_affiliates")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (affError || !affiliate) {
        setError("No affiliate record found.");
        setLoading(false);
        return;
      }
      // Ensure referral_code exists
      if (!affiliate.referral_code) {
        const newCode = 'aff' + Math.random().toString(36).substring(2, 12);
        await supabase.from("marketplace_affiliates").update({ referral_code: newCode }).eq("user_id", user.id);
        affiliate.referral_code = newCode;
      }
      const { data: venues } = await supabase.from("affiliate_venues").select("venue_id, venues(name, city, status)").eq("affiliate_id", affiliate.id);
      const { data: commissions } = await supabase.from("affiliate_commission_history").select("commission_amount, paid").eq("affiliate_id", affiliate.id);
      const totalEarned = commissions?.reduce((s, c) => s + (c.commission_amount || 0), 0) || 0;
      const pendingPayout = commissions?.filter(c => !c.paid).reduce((s, c) => s + (c.commission_amount || 0), 0) || 0;
      const referralLink = `${window.location.origin}/signup?ref=${affiliate.id}`;
      setData({ affiliate, venues: venues || [], stats: { totalEarned, pendingPayout, totalVenues: venues?.length || 0 }, referralLink });
      setError("");
    } catch (err) { console.error(err); setError("Failed to load dashboard."); } finally { setLoading(false); }
  }

  const copyReferralLink = () => { navigator.clipboard.writeText(data.referralLink); alert("Referral link copied!"); };
  const copyReferralCode = () => { navigator.clipboard.writeText(data.affiliate.referral_code); alert("Referral code copied!"); };

  if (loading) return <div className="flex justify-center items-center h-96"><RefreshCw className="animate-spin" /></div>;
  if (error) return <div className="text-center text-red-600 p-8">{error}</div>;
  if (!data) return <div className="text-center p-8">No affiliate data found.</div>;

  const { affiliate, venues, stats, referralLink } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8"><h1 className="text-3xl font-bold">Affiliate Dashboard</h1><p className="text-gray-500">Track your referrals, venues, and commissions</p></div>
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-l-4 border-orange-500">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div><h2 className="text-xl font-bold">{affiliate.name}</h2><p className="text-sm text-gray-500">Commission Rate: {affiliate.commission_rate}% | Status: <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Approved</span></p></div>
            <button onClick={copyReferralLink} className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Copy size={16} /> Copy Referral Link</button>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
            <p className="text-xs text-gray-500 mb-1">Your unique referral code (give this to venues):</p>
            <div className="flex items-center gap-2"><code className="bg-white border rounded px-2 py-1 text-sm font-mono">{affiliate.referral_code}</code><button onClick={copyReferralCode} className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm">Copy</button></div>
          </div>
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border"><p className="text-xs text-gray-500 mb-1">Your unique referral link:</p><div className="flex items-center gap-2"><input type="text" readOnly value={referralLink} className="flex-1 text-sm bg-white border rounded-lg px-3 py-2" /><button onClick={copyReferralLink} className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg"><Copy size={16} /></button></div></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-orange-500"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Venues Onboarded</p><p className="text-3xl font-bold text-orange-600">{stats.totalVenues}</p></div><div className="bg-orange-100 p-3 rounded-full"><Users className="text-orange-600" size={24} /></div></div></div>
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Total Commission</p><p className="text-3xl font-bold text-green-600">₹{stats.totalEarned}</p></div><div className="bg-green-100 p-3 rounded-full"><DollarSign className="text-green-600" size={24} /></div></div></div>
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-yellow-500"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Pending Payout</p><p className="text-3xl font-bold text-yellow-600">₹{stats.pendingPayout}</p></div><div className="bg-yellow-100 p-3 rounded-full"><TrendingUp className="text-yellow-600" size={24} /></div></div></div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"><div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3"><h2 className="text-lg font-bold text-white">Venues You've Onboarded</h2></div><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th></tr></thead><tbody className="divide-y divide-gray-200">{venues.length === 0 ? <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">No venues onboarded yet. Share your referral code with venues!</td></tr> : venues.map((v: any) => (<tr key={v.venue_id}><td className="px-6 py-4 text-sm font-medium text-gray-900">{v.venues?.name}</td><td className="px-6 py-4 text-sm text-gray-500">{v.venues?.city}</td><td className="px-6 py-4"><span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${v.venues?.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{v.venues?.status || 'Pending'}</span></td></tr>))}</tbody></table></div></div>
      </div>
    </div>
  );
}
