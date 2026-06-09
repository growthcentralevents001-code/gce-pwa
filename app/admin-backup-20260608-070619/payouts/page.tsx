"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { RefreshCw, CheckCircle, XCircle, DollarSign, Users, Calendar } from "lucide-react";

interface PayoutRequest {
  id: string;
  affiliate_id?: string;
  venue_id?: string;
  amount: number;
  status: string;
  requested_at: string;
  processed_at?: string;
  notes?: string;
  // joined data
  affiliate_name?: string;
  affiliate_email?: string;
  venue_name?: string;
  venue_email?: string;
}

export default function AdminPayouts() {
  const router = useRouter();
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending"); // pending, approved, rejected, all
  const [stats, setStats] = useState({ pending: 0, total: 0 });

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  async function checkAdminAndFetch() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (userData?.role !== "admin") { router.push("/unauthorized"); return; }
    fetchPayouts();
  }

  async function fetchPayouts() {
    setLoading(true);
    // Fetch affiliate payout requests
    const { data: affiliateRequests, error: affError } = await supabase
      .from("affiliate_payout_requests")
      .select("*, marketplace_affiliates(name, email)")
      .order("requested_at", { ascending: false });

    // Fetch venue payout requests (if you have a payouts table for venues)
    const { data: venuePayouts, error: venueError } = await supabase
      .from("payouts")
      .select("*, venues(name, user_id, users(email))")
      .order("created_at", { ascending: false });

    let combined: PayoutRequest[] = [];

    if (affiliateRequests && !affError) {
      combined.push(...affiliateRequests.map((req: any) => ({
        id: req.id,
        affiliate_id: req.affiliate_id,
        amount: req.amount,
        status: req.status,
        requested_at: req.requested_at,
        processed_at: req.processed_at,
        affiliate_name: req.marketplace_affiliates?.name,
        affiliate_email: req.marketplace_affiliates?.email,
      })));
    }

    if (venuePayouts && !venueError) {
      combined.push(...venuePayouts.map((p: any) => ({
        id: p.id,
        venue_id: p.venue_id,
        amount: p.amount,
        status: p.status,
        requested_at: p.created_at,
        processed_at: p.updated_at,
        venue_name: p.venues?.name,
        venue_email: p.venues?.users?.email,
      })));
    }

    setPayouts(combined);
    const pendingCount = combined.filter(p => p.status === "pending").length;
    setStats({ pending: pendingCount, total: combined.length });
    setLoading(false);
  }

  async function updatePayoutStatus(id: string, newStatus: string, type: "affiliate" | "venue") {
    const table = type === "affiliate" ? "affiliate_payout_requests" : "payouts";
    const { error } = await supabase
      .from(table)
      .update({ status: newStatus, processed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      alert("Update failed: " + error.message);
    } else {
      alert(`Payout ${newStatus}!`);
      fetchPayouts();
    }
  }

  const filteredPayouts = filter === "all" ? payouts : payouts.filter(p => p.status === filter);

  if (loading) return <div className="flex justify-center items-center h-64"><RefreshCw className="w-8 h-8 text-orange-600 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Payout Management</h1>
          <p className="text-gray-500">Process pending payouts for affiliates and venues</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-orange-500">
            <div className="flex justify-between items-center"><div><p className="text-sm text-gray-500">Pending Payouts</p><p className="text-3xl font-bold text-orange-600">{stats.pending}</p></div><div className="bg-orange-100 p-3 rounded-full"><DollarSign className="text-orange-600" size={24} /></div></div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
            <div className="flex justify-between items-center"><div><p className="text-sm text-gray-500">Total Requests</p><p className="text-3xl font-bold text-green-600">{stats.total}</p></div><div className="bg-green-100 p-3 rounded-full"><Users className="text-green-600" size={24} /></div></div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b mb-6">
          {["pending", "approved", "rejected", "all"].map(stat => (
            <button key={stat} onClick={() => setFilter(stat)} className={`px-4 py-2 ${filter === stat ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-500"}`}>
              {stat.charAt(0).toUpperCase() + stat.slice(1)}
            </button>
          ))}
        </div>

        {/* Payouts List */}
        <div className="space-y-4">
          {filteredPayouts.length === 0 && <div className="bg-white rounded-xl p-8 text-center text-gray-400">No payout requests found.</div>}
          {filteredPayouts.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow-md border p-5">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="font-bold text-lg">
                    {p.affiliate_name || p.venue_name || "Unknown"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {p.affiliate_email || p.venue_email || "Email not available"}
                  </div>
                  <div className="text-sm mt-1">
                    Amount: <span className="font-bold text-orange-600">₹{p.amount}</span>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <Calendar size={12} /> Requested: {new Date(p.requested_at).toLocaleDateString()}
                  </div>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      p.status === "approved" ? "bg-green-100 text-green-700" :
                      p.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {p.status === "approved" && <CheckCircle size={12} />}
                      {p.status === "rejected" && <XCircle size={12} />}
                      {p.status}
                    </span>
                  </div>
                </div>
                {p.status === "pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => updatePayoutStatus(p.id, "approved", p.affiliate_id ? "affiliate" : "venue")} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"><CheckCircle size={16} /> Approve</button>
                    <button onClick={() => updatePayoutStatus(p.id, "rejected", p.affiliate_id ? "affiliate" : "venue")} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"><XCircle size={16} /> Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
