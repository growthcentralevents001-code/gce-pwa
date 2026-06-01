"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Award, TrendingUp, MapPin, Calendar, DollarSign, AlertCircle, CheckCircle, XCircle } from "lucide-react";

export default function ZBPDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [zbpData, setZbpData] = useState<any>(null);
  const [venues, setVenues] = useState<any[]>([]);
  const [commissionHistory, setCommissionHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "zbp" && user.role !== "admin") {
      router.push("/unauthorized");
      return;
    }
    fetchZBPData();
  }, [user]);

  const fetchZBPData = async () => {
    setLoading(true);
    
    // Fetch ZBP partner data
    const { data: partnerData, error: partnerError } = await supabase
      .from("zbp_partners")
      .select("*")
      .eq("user_id", user?.id)
      .single();

    if (partnerError && partnerError.code !== "PGRST116") {
      console.error(partnerError);
    }

    if (partnerData) {
      setZbpData(partnerData);
      
      // Fetch venues onboarded by this ZBP
      const { data: venuesData } = await supabase
        .from("venues")
        .select("*")
        .eq("franchisee_id", partnerData.id);
      setVenues(venuesData || []);
      
      // Fetch commission history
      const { data: commissionData } = await supabase
        .from("zbp_commission_history")
        .select("*")
        .eq("zbp_id", partnerData.id)
        .order("month", { ascending: false })
        .limit(6);
      setCommissionHistory(commissionData || []);
    }
    
    setLoading(false);
  };

  const getTierColor = (tier: string) => {
    switch(tier) {
      case "Platinum": return { bg: "#e0e7ff", color: "#3730a3", icon: "🏆" };
      case "Gold": return { bg: "#fef3c7", color: "#92400e", icon: "🥇" };
      default: return { bg: "#f1f5f9", color: "#475569", icon: "🥈" };
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active": return { bg: "#dcfce7", color: "#166534", icon: <CheckCircle size={12} /> };
      case "Pending": return { bg: "#fef3c7", color: "#92400e", icon: <AlertCircle size={12} /> };
      case "ZoneReleased": return { bg: "#fee2e2", color: "#991b1b", icon: <XCircle size={12} /> };
      default: return { bg: "#f1f5f9", color: "#475569", icon: null };
    }
  };

  const calculateTierProgress = () => {
    const activeVenues = zbpData?.active_venues_count || 0;
    if (activeVenues >= 16) return 100;
    if (activeVenues >= 6) return ((activeVenues - 6) / 10) * 100;
    return (activeVenues / 6) * 100;
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "48px" }}>Loading dashboard...</div>;
  }

  if (!zbpData) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px", textAlign: "center" }}>
        <h2>Not a ZBP Partner Yet</h2>
        <p style={{ marginBottom: "24px" }}>You haven't applied for ZBP partnership yet.</p>
        <a href="/zbp/apply" style={{ background: "#f97316", color: "white", padding: "12px 24px", borderRadius: "40px", textDecoration: "none" }}>Apply Now</a>
      </div>
    );
  }

  const tierStyle = getTierColor(zbpData.tier);
  const statusStyle = getStatusBadge(zbpData.status);
  const tierProgress = calculateTierProgress();

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>ZBP Dashboard</h1>
      <p style={{ color: "#64748b", marginBottom: "32px" }}>Manage your zone, track commissions, and monitor performance</p>

      {/* Status Alert */}
      {zbpData.status === "ZoneReleased" && (
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: "16px", borderRadius: "16px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <AlertCircle size={24} />
          <div><strong>Zone Released!</strong> Your zone has been released due to inactivity. Contact admin to reinstate.</div>
        </div>
      )}

      {zbpData.warning_sent && zbpData.status === "Active" && (
        <div style={{ background: "#fef3c7", color: "#92400e", padding: "16px", borderRadius: "16px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <AlertCircle size={24} />
          <div><strong>Warning!</strong> You have 0 active venues. Onboard venues within 30 days or your zone will be released.</div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
        <div style={{ background: "white", borderRadius: "20px", padding: "20px" }}>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#f97316" }}>{zbpData.tier}</div>
          <div style={{ color: "#64748b" }}>Current Tier</div>
          <div style={{ fontSize: "12px", marginTop: "8px" }}>{zbpData.tier === "Platinum" ? "50% Commission" : zbpData.tier === "Gold" ? "40% Commission" : "30% Commission"}</div>
        </div>
        <div style={{ background: "white", borderRadius: "20px", padding: "20px" }}>
          <div style={{ fontSize: "28px", fontWeight: "800" }}>{zbpData.active_venues_count || 0}</div>
          <div style={{ color: "#64748b" }}>Active Venues</div>
        </div>
        <div style={{ background: "white", borderRadius: "20px", padding: "20px" }}>
          <div style={{ fontSize: "28px", fontWeight: "800" }}>₹{zbpData.total_commission_earned?.toLocaleString() || 0}</div>
          <div style={{ color: "#64748b" }}>Total Commission</div>
        </div>
        <div style={{ background: "white", borderRadius: "20px", padding: "20px" }}>
          <div style={{ fontSize: "28px", fontWeight: "800" }}>{zbpData.zone}</div>
          <div style={{ color: "#64748b" }}>Your Zone</div>
          <div style={{ fontSize: "12px", marginTop: "8px" }}>{zbpData.city}</div>
        </div>
      </div>

      {/* Tier Progress */}
      <div style={{ background: "white", borderRadius: "20px", padding: "24px", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Tier Progress</h2>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span>Silver (0-5 venues)</span>
          <span>Gold (6-15 venues)</span>
          <span>Platinum (16+ venues)</span>
        </div>
        <div style={{ background: "#e2e8f0", borderRadius: "10px", height: "8px" }}>
          <div style={{ width: `${tierProgress}%`, background: "#f97316", height: "8px", borderRadius: "10px" }}></div>
        </div>
        <div style={{ marginTop: "12px", fontSize: "13px", color: "#64748b" }}>
          {zbpData.tier === "Silver" && `${6 - (zbpData.active_venues_count || 0)} more venues needed for Gold tier`}
          {zbpData.tier === "Gold" && `${16 - (zbpData.active_venues_count || 0)} more venues needed for Platinum tier`}
          {zbpData.tier === "Platinum" && "🎉 You're at the highest tier!"}
        </div>
      </div>

      {/* Venues List */}
      <div style={{ background: "white", borderRadius: "20px", padding: "24px", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>My Venues</h2>
        {venues.length === 0 ? (
          <p style={{ color: "#64748b" }}>No venues onboarded yet. Start onboarding venues to earn commission.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ borderBottom: "1px solid #eef2ff" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>Venue Name</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Address</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
              </tr></thead>
              <tbody>
                {venues.map(venue => (
                  <tr key={venue.id} style={{ borderBottom: "1px solid #eef2ff" }}>
                    <td style={{ padding: "12px" }}>{venue.name}</td>
                    <td style={{ padding: "12px" }}>{venue.address}</td>
                    <td style={{ padding: "12px" }}><span style={{ background: "#dcfce7", color: "#166534", padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>{venue.status || "Active"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Commission History */}
      {commissionHistory.length > 0 && (
        <div style={{ background: "white", borderRadius: "20px", padding: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Commission History</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ borderBottom: "1px solid #eef2ff" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>Month</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Commission</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Fee Deducted</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Net Payout</th>
              </tr></thead>
              <tbody>
                {commissionHistory.map(comm => (
                  <tr key={comm.id} style={{ borderBottom: "1px solid #eef2ff" }}>
                    <td style={{ padding: "12px" }}>{new Date(comm.month).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</td>
                    <td style={{ padding: "12px", fontWeight: "600", color: "#22c55e" }}>₹{comm.zbp_commission?.toLocaleString() || 0}</td>
                    <td style={{ padding: "12px" }}>₹{comm.fee_deducted?.toLocaleString() || 0}</td>
                    <td style={{ padding: "12px", fontWeight: "600" }}>₹{comm.net_payout?.toLocaleString() || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
