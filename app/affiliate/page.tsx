"use client";

import Link from "next/link";
import { TrendingUp, DollarSign, Users, Share2 } from "lucide-react";

export default function AffiliateLandingPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "800", marginBottom: "16px" }}>
          Become an <span style={{ color: "#f97316" }}>Affiliate</span>
        </h1>
        <p style={{ fontSize: "18px", color: "#64748b", marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px" }}>
          Earn commission by referring venues to GCE Events. No investment required!
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "48px" }}>
          <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff" }}>
            <DollarSign size={40} style={{ color: "#f97316", marginBottom: "16px" }} />
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Up to 30% Commission</h3>
            <p style={{ color: "#64748b" }}>Earn based on your follower count</p>
          </div>
          <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff" }}>
            <Share2 size={40} style={{ color: "#f97316", marginBottom: "16px" }} />
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Easy Referral Link</h3>
            <p style={{ color: "#64748b" }}>Share your unique link and earn</p>
          </div>
          <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff" }}>
            <Users size={40} style={{ color: "#f97316", marginBottom: "16px" }} />
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>No Investment</h3>
            <p style={{ color: "#64748b" }}>Zero cost to join, start earning today</p>
          </div>
        </div>

        <Link href="/affiliate/signup" style={{ display: "inline-block", background: "#f97316", color: "white", padding: "14px 32px", borderRadius: "40px", textDecoration: "none", fontWeight: "600" }}>
          Join Now →
        </Link>
      </div>
    </div>
  );
}
