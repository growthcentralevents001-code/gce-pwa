"use client";

import Link from "next/link";
import { Shield, TrendingUp, Award, MapPin, Calendar, DollarSign } from "lucide-react";

export default function ZBPLandingPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "800", marginBottom: "16px" }}>
          Become a <span style={{ color: "#f97316" }}>Zonal Business Partner</span>
        </h1>
        <p style={{ fontSize: "18px", color: "#64748b", marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px" }}>
          Own your zone, earn commission, and grow with India's premier event platform
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "48px" }}>
          <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff" }}>
            <Award size={40} style={{ color: "#f97316", marginBottom: "16px" }} />
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Tiered Commission</h3>
            <p style={{ color: "#64748b" }}>Silver: 30% → Gold: 40% → Platinum: 50%</p>
          </div>
          <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff" }}>
            <MapPin size={40} style={{ color: "#f97316", marginBottom: "16px" }} />
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Zone Protection</h3>
            <p style={{ color: "#64748b" }}>Exclusive rights to your zone. 30-day inactivity protection.</p>
          </div>
          <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff" }}>
            <TrendingUp size={40} style={{ color: "#f97316", marginBottom: "16px" }} />
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>10% Growth Incentive</h3>
            <p style={{ color: "#64748b" }}>Monthly 10% revenue increase reward up to ₹1,00,000</p>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "24px", padding: "32px", maxWidth: "500px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px" }}>Ready to start?</h2>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>No upfront fee. Pay as you earn.</p>
          <Link href="/zbp/apply" style={{ display: "inline-block", background: "#f97316", color: "white", border: "none", padding: "14px 32px", borderRadius: "40px", textDecoration: "none", fontWeight: "600" }}>
            Apply Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
