"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Building2, TrendingUp, DollarSign, Users, Link2, Copy, CheckCircle } from "lucide-react";

export default function AffiliateDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [affiliateData, setAffiliateData] = useState<any>(null);
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [referralLink] = useState(`https://dev.growthcentralevents.com/?ref=${user?.id}`);

  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      router.push("/login?redirect=/dashboard/affiliate");
      return;
    }
    
    if (user.role !== "affiliate" && user.role !== "admin") {
      checkAffiliateStatus();
      return;
    }
    
    fetchAffiliateData();
  }, [user, isLoading]);

  const checkAffiliateStatus = async () => {
    const { data } = await supabase
      .from("marketplace_affiliates")
      .select("status")
      .eq("user_id", user?.id)
      .single();
    
    if (data) {
      fetchAffiliateData();
    } else {
      setLoading(false);
    }
  };

  const fetchAffiliateData = async () => {
    setLoading(true);
    
    const { data: affiliate, error } = await supabase
      .from("marketplace_affiliates")
      .select("*")
      .eq("user_id", user?.id)
      .single();

    if (affiliate) {
      setAffiliateData(affiliate);
      
      const { data: venuesData } = await supabase
        .from("affiliate_venues")
        .select("*, venues(*)")
        .eq("affiliate_id", affiliate.id);
      setVenues(venuesData || []);
    }
    
    setLoading(false);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading || loading) {
    return <div style={{ textAlign: "center", padding: "48px" }}>Loading affiliate dashboard...</div>;
  }

  if (!user) {
    return null;
  }

  if (!affiliateData) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px", textAlign: "center" }}>
        <h2>Not an Affiliate Yet</h2>
        <p style={{ marginBottom: "24px" }}>Join our affiliate program to earn commission by referring venues.</p>
        <a href="/affiliate/signup" style={{ background: "#f97316", color: "white", padding: "12px 24px", borderRadius: "40px", textDecoration: "none" }}>Join as Affiliate</a>
      </div>
    );
  }

  const stats = [
    { label: "Commission Rate", value: `${affiliateData.commission_rate || 15}%`, icon: TrendingUp, color: "#f97316" },
    { label: "Total Commission", value: `₹${affiliateData.total_commission_earned?.toLocaleString() || 0}`, icon: DollarSign, color: "#22c55e" },
    { label: "Venues Onboarded", value: affiliateData.total_venues_onboarded || 0, icon: Building2, color: "#3b82f6" },
  ];

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>Affiliate Dashboard</h1>
      <p style={{ color: "#64748b", marginBottom: "32px" }}>Track your commission and onboarded venues</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a" }}>{stat.value}</div>
                <div style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>{stat.label}</div>
              </div>
              <stat.icon size={28} style={{ color: stat.color, opacity: 0.7 }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Your Referral Link</h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <input type="text" value={referralLink} readOnly style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#f8fafc" }} />
          <button onClick={copyReferralLink} style={{ background: "#f97316", color: "white", border: "none", padding: "12px 24px", borderRadius: "40px", cursor: "pointer" }}>
            {copied ? <CheckCircle size={16} /> : <Copy size={16} />} {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Venues Onboarded</h2>
        {venues.length === 0 ? (
          <p style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>No venues onboarded yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #eef2ff" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>Venue</th>
                <th style={{ padding: "12px", textAlign: "left" }}>City</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Commission</th>
              </tr>
            </thead>
            <tbody>
              {venues.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #eef2ff" }}>
                  <td style={{ padding: "12px" }}>{item.venues?.name || "Unknown"}</td>
                  <td style={{ padding: "12px" }}>{item.venues?.city || "—"}</td>
                  <td style={{ padding: "12px", color: "#22c55e" }}>₹{item.commission_earned?.toLocaleString() || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
