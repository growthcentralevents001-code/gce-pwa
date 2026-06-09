"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/app/context/AuthContext";

export default function AffiliateSignupPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    social_handle: "",
    follower_count: "1000"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first");
      router.push("/login?redirect=/affiliate/signup");
      return;
    }

    setLoading(true);

    let commissionRate = 15;
    const followers = parseInt(formData.follower_count);
    if (followers >= 100000) commissionRate = 30;
    else if (followers >= 10000) commissionRate = 20;

    const { error } = await supabase.from("marketplace_affiliates").insert({
      user_id: user.id,
      name: formData.name,
      email: user.email,
      phone: formData.phone,
      social_handle: formData.social_handle,
      follower_count: followers,
      commission_rate: commissionRate,
      status: "Pending"
    });

    if (error) {
      alert("Error submitting application: " + error.message);
    } else {
      alert("Application submitted! Admin will review it.");
      router.push("/dashboard/affiliate");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ background: "white", borderRadius: "32px", padding: "32px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>Join Affiliate Program</h1>
        <p style={{ color: "#64748b", marginBottom: "24px" }}>Earn commission by referring venues</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Full Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ccc" }} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Phone Number</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ccc" }} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Social Media Handle (Instagram/Facebook)</label>
            <input type="text" value={formData.social_handle} onChange={(e) => setFormData({...formData, social_handle: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ccc" }} />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Follower Count</label>
            <select value={formData.follower_count} onChange={(e) => setFormData({...formData, follower_count: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ccc" }}>
              <option value="1000">1k - 10k followers (15% commission)</option>
              <option value="10000">10k - 100k followers (20% commission)</option>
              <option value="100000">100k+ followers (30% commission)</option>
            </select>
          </div>
          <button type="submit" disabled={loading} style={{ width: "100%", background: "#f97316", color: "white", border: "none", padding: "14px", borderRadius: "40px", cursor: "pointer", fontWeight: "600" }}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
