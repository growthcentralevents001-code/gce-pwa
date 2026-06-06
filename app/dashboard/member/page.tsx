"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Wallet, Users, TrendingUp, Share2, Calendar } from "lucide-react";

interface Credits {
  balance: number;
  expiry: string | null;
}

interface Referrals {
  count: number;
  points: number;
  link: string;
}

interface Milestone {
  attended: number;
  tier: string;
  next: string;
}

export default function MemberDashboard() {
  const [credits, setCredits] = useState<Credits>({ balance: 0, expiry: null });
  const [referrals, setReferrals] = useState<Referrals>({ count: 0, points: 0, link: "" });
  const [milestone, setMilestone] = useState<Milestone>({ attended: 0, tier: "", next: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch credits
      const { data: wallet } = await supabase
        .from('user_wallets')
        .select('balance, expiry_date')
        .eq('user_id', user.id)
        .single();

      if (wallet) {
        setCredits({ balance: wallet.balance, expiry: wallet.expiry_date });
      } else {
        setCredits({ balance: 0, expiry: null });
      }

      // Fetch referrals
      const { data: referralsData } = await supabase
        .from('referrals')
        .select('points')
        .eq('referrer_id', user.id);

      const totalReferrals = referralsData?.length || 0;
      const totalPoints = referralsData?.reduce((sum, r) => sum + (r.points || 0), 0) || 0;
      setReferrals({
        count: totalReferrals,
        points: totalPoints,
        link: `${window.location.origin}/signup?ref=${user.id}`
      });

      // Fetch milestone (attended events count)
      const { data: attendance } = await supabase
        .from('event_attendance')
        .select('id')
        .eq('user_id', user.id)
        .eq('attended', true);

      const count = attendance?.length || 0;
      let tier = 'Explorer';
      let next = 'Insider (6)';
      if (count >= 21) tier = 'Ambassador';
      else if (count >= 6) tier = 'Insider';
      else next = `Insider (${6 - count} more)`;
      setMilestone({ attended: count, tier, next });

      setLoading(false);
    }
    fetchData();
  }, []);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referrals.link);
    alert("Referral link copied!");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Member Dashboard</h1>
        <p className="text-gray-500 mb-6">Welcome back! Here's your activity summary.</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Credit Balance Widget */}
          <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-orange-500">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Credit Balance</h2>
              <Wallet className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-orange-600">₹{credits.balance}</div>
            {credits.expiry && <div className="text-xs text-gray-400 mt-1">Expires: {new Date(credits.expiry).toLocaleDateString()}</div>}
            <button className="mt-3 w-full bg-orange-600 text-white py-2 rounded-lg text-sm font-medium">Use Credits</button>
          </div>

          {/* Milestone Tracker Widget */}
          <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-green-500">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Milestone Tracker</h2>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{milestone.attended}</div>
            <div className="text-sm text-gray-500">Events attended</div>
            <div className="mt-2">
              <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">{milestone.tier}</span>
              <div className="text-xs text-gray-400 mt-1">Next: {milestone.next}</div>
            </div>
            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full" style={{ width: `${Math.min(100, (milestone.attended / 21) * 100)}%` }}></div>
            </div>
          </div>

          {/* Referral Widget */}
          <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-purple-500">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Refer & Earn</h2>
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-600">{referrals.count}</div>
            <div className="text-sm text-gray-500">Friends referred</div>
            <div className="text-sm font-semibold mt-1">Points: {referrals.points}</div>
            <button onClick={copyReferralLink} className="mt-3 w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
              <Share2 size={14} /> Invite Friends
            </button>
          </div>
        </div>

        {/* Upcoming Events Placeholder */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-lg font-semibold mb-3">Upcoming Events</h2>
          <p className="text-gray-500 text-sm">You haven't booked any upcoming events yet.</p>
          <button className="mt-3 text-orange-600 text-sm font-medium flex items-center gap-1">Browse Events <Calendar size={14} /></button>
        </div>
      </div>
    </div>
  );
}
