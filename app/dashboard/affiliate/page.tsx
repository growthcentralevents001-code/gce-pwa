"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Users, TrendingUp, DollarSign, MapPin, Calendar, RefreshCw, Copy, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AffiliateDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ venues: 0, commission: 0, pending: 0, paid: 0 });
  const [referredVenues, setReferredVenues] = useState([]);
  const [referralCode, setReferralCode] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      // Get affiliate profile or create one
      let { data: profile, error } = await supabase
        .from("affiliate_profiles")
        .select("referral_code")
        .eq("user_id", user.id)
        .single();

      // If no profile, create one
      if (!profile) {
        const { data: newProfile, error: createError } = await supabase
          .from("affiliate_profiles")
          .insert({
            user_id: user.id,
            referral_code: `AFF${user.id.slice(0, 8)}`,
          })
          .select("referral_code")
          .single();

        if (!createError && newProfile) {
          profile = newProfile;
        }
      }

      const code = profile?.referral_code || user.id.slice(0, 8);
      setReferralCode(code);

      // Fetch referred venues
      const { data: venues } = await supabase
        .from("venues")
        .select("*")
        .eq("referral_code", code)
        .order("created_at", { ascending: false });

      setReferredVenues(venues || []);

      // Fetch commission stats
      const { data: commissionData } = await supabase
        .from("commission_logs")
        .select("status, referrer_share")
        .eq("referrer_id", user.id)
        .eq("referrer_type", "affiliate");

      const totalCommission = commissionData?.reduce((sum, c) => sum + c.referrer_share, 0) || 0;
      const pending = commissionData?.filter(c => c.status === "pending").reduce((sum, c) => sum + c.referrer_share, 0) || 0;
      const paid = commissionData?.filter(c => c.status === "paid").reduce((sum, c) => sum + c.referrer_share, 0) || 0;

      setStats({
        venues: venues?.length || 0,
        commission: totalCommission,
        pending,
        paid,
      });
    } catch (error) {
      console.error("Error fetching affiliate data:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Affiliate Dashboard</h1>
        <p className="text-gray-500 mb-6">Track your referred venues, commissions, and performance</p>

        {/* Referral Code Card */}
        <div className="bg-white border border-orange-200 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500">Your Referral Code:</span>
              <span className="text-lg font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200">
                {referralCode}
              </span>
              <button
                onClick={copyReferralCode}
                className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 transition"
              >
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="text-xs text-gray-400">
              Share this code with venues to earn commission
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl shadow-sm p-4">
            <p className="text-gray-500 text-sm">Total Venues</p>
            <p className="text-2xl font-bold text-orange-700">{stats.venues}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm p-4">
            <p className="text-gray-500 text-sm">Total Commission</p>
            <p className="text-2xl font-bold text-green-700">₹{stats.commission}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl shadow-sm p-4">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-700">₹{stats.pending}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-sm p-4">
            <p className="text-gray-500 text-sm">Paid</p>
            <p className="text-2xl font-bold text-blue-700">₹{stats.paid}</p>
          </div>
        </div>

        {/* Referred Venues List */}
        <div className="bg-white border border-orange-200 rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Users size={20} className="text-orange-500" />
              Referred Venues
            </h2>
            <button onClick={fetchData} className="text-orange-500 hover:text-orange-700 transition">
              <RefreshCw size={18} />
            </button>
          </div>
          {referredVenues.length === 0 ? (
            <p className="text-gray-400 text-sm">No venues referred yet. Share your referral code to get started.</p>
          ) : (
            <div className="space-y-3">
              {referredVenues.map((venue) => (
                <div key={venue.id} className="flex items-center justify-between border-b border-orange-50 pb-2 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{venue.name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin size={12} /> {venue.city || "Unknown"} • Joined {new Date(venue.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${venue.status === "active" || venue.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {venue.status || "pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
