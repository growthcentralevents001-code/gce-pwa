"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RefreshCw, Copy, CheckCircle, DollarSign, Users, TrendingUp } from "lucide-react";

export default function AffiliateDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutStatus, setPayoutStatus] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data: affiliate } = await supabase.from("marketplace_affiliates").select("*").eq("user_id", user.id).single();
    if (!affiliate) { setLoading(false); return; }
    const { data: venues } = await supabase.from("affiliate_venues").select("venue_id, venues(name, city, status)").eq("affiliate_id", affiliate.id);
    const { data: commissions } = await supabase.from("affiliate_commission_history").select("commission_amount, paid").eq("affiliate_id", affiliate.id);
    const totalEarned = commissions?.reduce((s, c) => s + (c.commission_amount || 0), 0) || 0;
    const pendingPayout = commissions?.filter(c => !c.paid).reduce((s, c) => s + (c.commission_amount || 0), 0) || 0;
    const referralLink = `${window.location.origin}/signup?ref=${affiliate.id}`;
    setData({ affiliate, venues: venues || [], stats: { totalEarned, pendingPayout, totalVenues: venues?.length || 0 }, referralLink });
    setLoading(false);
  }

  const copyReferralLink = () => {
    if (data?.referralLink) { navigator.clipboard.writeText(data.referralLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const requestPayout = async () => {
    if (!payoutAmount || parseInt(payoutAmount) <= 0) { alert("Enter valid amount"); return; }
    setPayoutStatus("Processing...");
    const { error } = await supabase.from("affiliate_payout_requests").insert({ affiliate_id: data?.affiliate.id, amount: parseInt(payoutAmount), status: "pending" });
    if (error) alert("Payout request failed: " + error.message);
    else { alert("Request submitted!"); setShowPayoutModal(false); setPayoutAmount(""); }
    setPayoutStatus("");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><RefreshCw className="w-8 h-8 text-orange-600 animate-spin" /></div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center">No affiliate record found.</div>;

  const { affiliate, venues, stats, referralLink } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-semibold mb-2">Affiliate Program</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Affiliate Dashboard</h1>
          <p className="text-gray-500 mt-2">Track your referrals, venues, and commissions</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-l-4 border-orange-500">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div><h2 className="text-xl font-bold">{affiliate.name}</h2><p className="text-sm text-gray-500">Commission Rate: <span className="font-semibold text-orange-600">{affiliate.commission_rate}%</span> | Status: <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${affiliate.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{affiliate.status}</span></p></div>
            <button onClick={copyReferralLink} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">{copied ? <CheckCircle size={16} /> : <Copy size={16} />} {copied ? "Copied!" : "Copy Referral Link"}</button>
          </div>
          {affiliate.status === 'Approved' && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
              <p className="text-xs text-gray-500 mb-1">Your unique referral link:</p>
              <div className="flex items-center gap-2"><input type="text" readOnly value={referralLink} className="flex-1 text-sm bg-white border rounded-lg px-3 py-2" /><button onClick={copyReferralLink} className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg"><Copy size={16} /></button></div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-orange-500"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Venues Onboarded</p><p className="text-3xl font-bold text-orange-600">{stats.totalVenues}</p></div><div className="bg-orange-100 p-3 rounded-full"><Users className="text-orange-600" size={24} /></div></div></div>
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Total Commission</p><p className="text-3xl font-bold text-green-600">₹{stats.totalEarned}</p></div><div className="bg-green-100 p-3 rounded-full"><DollarSign className="text-green-600" size={24} /></div></div></div>
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-yellow-500"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Pending Payout</p><p className="text-3xl font-bold text-yellow-600">₹{stats.pendingPayout}</p></div><div className="bg-yellow-100 p-3 rounded-full"><TrendingUp className="text-yellow-600" size={24} /></div></div></div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3"><h2 className="text-lg font-bold text-white">Venues You've Onboarded</h2></div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                {venues.length === 0 && <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">No venues onboarded yet. Share your referral link!</td></tr>}
                {venues.map((v: any) => (<tr key={v.venue_id}><td className="px-6 py-4 text-sm font-medium text-gray-900">{v.venues?.name}</td><td className="px-6 py-4 text-sm text-gray-500">{v.venues?.city}</td><td className="px-6 py-4"><span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${v.venues?.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{v.venues?.status || 'Pending'}</span></td></tr>))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3"><h2 className="text-lg font-bold text-white">Commission History</h2></div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th></tr></thead>
              <tbody><tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No commission records yet.</td></tr></tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center"><button onClick={() => setShowPayoutModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold">Request Payout</button></div>
      </div>

      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Request Payout</h3>
            <p className="text-sm text-gray-500 mb-2">Available balance: ₹{stats.pendingPayout}</p>
            <input type="number" placeholder="Amount (₹)" className="w-full p-3 border border-gray-300 rounded-lg mb-4" value={payoutAmount} onChange={e => setPayoutAmount(e.target.value)} />
            <button onClick={requestPayout} disabled={!!payoutStatus} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold">{payoutStatus || "Submit Request"}</button>
            <button onClick={() => setShowPayoutModal(false)} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold mt-2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
