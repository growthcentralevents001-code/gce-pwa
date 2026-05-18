"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "₹0",
    period: "Free",
    description: "Explore events and connect",
    icon: "👤",
    color: "from-gray-500 to-gray-600",
    features: [
      "Browse all events",
      "Save up to 10 events",
      "Basic event recommendations",
      "Email support",
    ],
    popular: false,
  },
  {
    id: "gold",
    name: "Gold",
    price: "₹499",
    period: "/month",
    description: "Best for regular attendees",
    icon: "⭐",
    color: "from-yellow-500 to-yellow-600",
    features: [
      "Everything in Basic",
      "₹500 monthly credits",
      "Priority booking",
      "Exclusive Gold events",
      "Early access to tickets",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "platinum",
    name: "Platinum",
    price: "₹999",
    period: "/month",
    description: "For premium members",
    icon: "👑",
    color: "from-purple-500 to-purple-600",
    features: [
      "Everything in Gold",
      "₹1200 monthly credits",
      "Free cancellation on all events",
      "VIP event access",
      "Free event hosting (1/year)",
      "Dedicated account manager",
      "Exclusive merchandise",
    ],
    popular: false,
  },
];

const annualPlans = [
  {
    id: "business",
    name: "Business",
    price: "₹3,000",
    period: "/year (10 seats)",
    description: "For small teams",
    icon: "🏢",
    color: "from-blue-500 to-blue-600",
    features: [
      "10 member seats",
      "₹500 credits per member/month",
      "Team analytics dashboard",
      "Corporate event hosting",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "Contact us",
    description: "For large organizations",
    icon: "🏛️",
    color: "from-indigo-500 to-indigo-600",
    features: [
      "Unlimited seats",
      "Custom credit allocation",
      "Dedicated account manager",
      "API access",
      "White-label options",
      "24/7 priority support",
    ],
  },
];

export default function MembershipsPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const containerStyle = {
    width: "100%",
    margin: "0",
    padding: isMobile ? "16px" : "24px",
    fontFamily: "'Inter', sans-serif",
    background: "white",
    minHeight: "100vh"
  };

  const innerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%"
  };

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#f97316", margin: 0 }}>GCE</h1>
              <p style={{ fontSize: "12px", color: "#666", marginTop: "-4px" }}>Growth Central Events</p>
            </div>
          </Link>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button style={{ background: "white", border: "1px solid #ddd", borderRadius: "40px", padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}>📍 Mumbai</button>
            <Link href="/login">
              <button style={{ background: "#f97316", color: "white", border: "none", borderRadius: "40px", padding: "8px 20px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Sign In</button>
            </Link>
          </div>
        </div>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 48px)", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>Choose your plan</h1>
          <p style={{ fontSize: "18px", color: "#666", maxWidth: "600px", margin: "0 auto" }}>Unlock exclusive benefits and event credits</p>
        </div>

        {/* Billing Toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "48px" }}>
          <div style={{ display: "flex", background: "#f1f5f9", borderRadius: "40px", padding: "4px" }}>
            <button
              onClick={() => setBillingCycle("monthly")}
              style={{
                padding: "10px 24px",
                borderRadius: "40px",
                background: billingCycle === "monthly" ? "#f97316" : "transparent",
                color: billingCycle === "monthly" ? "white" : "#666",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px"
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              style={{
                padding: "10px 24px",
                borderRadius: "40px",
                background: billingCycle === "annual" ? "#f97316" : "transparent",
                color: billingCycle === "annual" ? "white" : "#666",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px"
              }}
            >
              Annual / Business
            </button>
          </div>
        </div>

        {/* Monthly Plans */}
        {billingCycle === "monthly" && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "32px", marginBottom: "64px" }}>
            {plans.map((plan) => (
              <div key={plan.id} style={{ background: "white", borderRadius: "24px", padding: "24px", border: plan.popular ? "2px solid #f97316" : "1px solid #eef2ff", position: "relative" }}>
                {plan.popular && (
                  <div style={{ position: "absolute", top: "-12px", right: "20px", background: "#f97316", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>Popular</div>
                )}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>{plan.icon}</div>
                  <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>{plan.name}</h2>
                  <div style={{ fontSize: "36px", fontWeight: "800", color: "#f97316" }}>
                    {plan.price}<span style={{ fontSize: "14px", color: "#666" }}>{plan.period}</span>
                  </div>
                  <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>{plan.description}</p>
                </div>
                <div style={{ borderTop: "1px solid #eef2ff", paddingTop: "20px", marginBottom: "24px" }}>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <Check size={18} style={{ color: "#f97316" }} />
                      <span style={{ fontSize: "14px", color: "#475569" }}>{feature}</span>
                    </div>
                  ))}
                </div>
                <button style={{ width: "100%", background: plan.popular ? "#f97316" : "white", color: plan.popular ? "white" : "#f97316", border: plan.popular ? "none" : "2px solid #f97316", borderRadius: "40px", padding: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                  {plan.price === "₹0" ? "Get Started" : "Subscribe"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Annual Plans */}
        {billingCycle === "annual" && (
          <div style={{ marginBottom: "64px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "700", textAlign: "center", marginBottom: "32px" }}>For Teams</h2>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "32px" }}>
              {annualPlans.map((plan) => (
                <div key={plan.id} style={{ background: "white", borderRadius: "24px", padding: "24px", border: "1px solid #eef2ff" }}>
                  <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <div style={{ fontSize: "48px", marginBottom: "12px" }}>{plan.icon}</div>
                    <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>{plan.name}</h2>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: "#f97316" }}>{plan.price}<span style={{ fontSize: "14px", color: "#666" }}>{plan.period}</span></div>
                    <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>{plan.description}</p>
                  </div>
                  <div style={{ borderTop: "1px solid #eef2ff", paddingTop: "20px", marginBottom: "24px" }}>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                        <Check size={18} style={{ color: "#f97316" }} />
                        <span style={{ fontSize: "14px", color: "#475569" }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button style={{ width: "100%", background: "#f97316", color: "white", border: "none", borderRadius: "40px", padding: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                    {plan.price === "Custom" ? "Contact Sales" : "Subscribe"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Nav - Mobile */}
        {isMobile && (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #eef2ff", padding: "12px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-around", maxWidth: "500px", margin: "0 auto" }}>
              <Link href="/"><div style={{ fontSize: "22px" }}>🏠</div><div style={{ fontSize: "10px", color: "#64748b" }}>Home</div></Link>
              <Link href="/events"><div style={{ fontSize: "22px" }}>🔍</div><div style={{ fontSize: "10px", color: "#64748b" }}>Explore</div></Link>
              <Link href="/my-events"><div style={{ fontSize: "22px" }}>📅</div><div style={{ fontSize: "10px", color: "#64748b" }}>My Events</div></Link>
              <Link href="/dashboard/user"><div style={{ fontSize: "22px" }}>👤</div><div style={{ fontSize: "10px", color: "#f97316", fontWeight: "600" }}>Profile</div></Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
