"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, TrendingUp, Users, Calendar, DollarSign, Shield, ChevronRight } from "lucide-react";

const benefits = [
  {
    icon: <TrendingUp size={24} />,
    title: "Increased Visibility",
    description: "Get your venue discovered by thousands of event seekers",
  },
  {
    icon: <Users size={24} />,
    title: "More Bookings",
    description: "Fill your empty slots with quality events",
  },
  {
    icon: <Calendar size={24} />,
    title: "Easy Management",
    description: "Simple dashboard to manage all your events",
  },
  {
    icon: <DollarSign size={24} />,
    title: "Weekly Payouts",
    description: "Get paid every week with transparent commission",
  },
  {
    icon: <Shield size={24} />,
    title: "Verified Badge",
    description: "Get 'Verified Venue' status and build trust",
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Analytics Dashboard",
    description: "Track your performance with real-time data",
  },
];

const plans = [
  {
    name: "Basic",
    price: "₹500",
    period: "/month",
    features: ["List up to 10 events/month", "Basic analytics", "Email support", "Commission: 20%"],
    popular: false,
  },
  {
    name: "Pro",
    price: "₹1,500",
    period: "/month",
    features: ["Unlimited events", "Advanced analytics", "Priority support", "Commission: 15%", "Featured listing"],
    popular: true,
  },
  {
    name: "Elite",
    price: "₹3,000",
    period: "/month",
    features: ["Unlimited events", "Premium analytics", "Dedicated manager", "Commission: 10%", "Verified badge", "Homepage promotion"],
    popular: false,
  },
];

const steps = [
  { step: "1", title: "Apply Online", desc: "Fill out the partner application form" },
  { step: "2", title: "Verification", desc: "Our team verifies your venue details" },
  { step: "3", title: "Start Listing", desc: "Create events and start earning" },
  { step: "4", title: "Get Paid", desc: "Receive weekly payouts" },
];

export default function ForPartnersPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

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

  const cardStyle = {
    background: "white",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid #eef2ff",
    transition: "transform 0.2s"
  };

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#f97316", margin: 0 }}>GCE</h1>
          </Link>
          <Link href="/login">
            <button style={{ background: "#f97316", color: "white", border: "none", borderRadius: "40px", padding: "8px 20px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Sign In</button>
          </Link>
        </div>

        {/* Hero Section */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 48px)", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>
            Partner with <span style={{ color: "#f97316" }}>GCE</span>
          </h1>
          <p style={{ fontSize: "18px", color: "#666", maxWidth: "600px", margin: "0 auto" }}>
            Join India's fastest-growing event platform and grow your venue business
          </p>
        </div>

        {/* Benefits Grid */}
        <div style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", textAlign: "center", marginBottom: "40px" }}>Why Partner With Us?</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "24px" }}>
            {benefits.map((benefit, idx) => (
              <div key={idx} style={cardStyle}>
                <div style={{ width: "48px", height: "48px", background: "#fff7ed", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#f97316", marginBottom: "16px" }}>
                  {benefit.icon}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>{benefit.title}</h3>
                <p style={{ fontSize: "14px", color: "#666" }}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div style={{ background: "#f8fafc", borderRadius: "24px", padding: "48px 24px", marginBottom: "64px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", textAlign: "center", marginBottom: "40px" }}>How It Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: "24px" }}>
            {steps.map((step) => (
              <div key={step.step} style={{ textAlign: "center" }}>
                <div style={{ width: "60px", height: "60px", background: "#f97316", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "24px", fontWeight: "700", margin: "0 auto 16px" }}>{step.step}</div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px" }}>{step.title}</h3>
                <p style={{ fontSize: "13px", color: "#666" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Plans */}
        <div style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", textAlign: "center", marginBottom: "40px" }}>Partner Plans</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "32px" }}>
            {plans.map((plan) => (
              <div key={plan.name} style={{ ...cardStyle, border: plan.popular ? "2px solid #f97316" : "1px solid #eef2ff", position: "relative" }}>
                {plan.popular && (
                  <div style={{ position: "absolute", top: "-12px", right: "20px", background: "#f97316", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>Popular</div>
                )}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>{plan.name}</h3>
                  <div style={{ fontSize: "36px", fontWeight: "800", color: "#f97316" }}>{plan.price}<span style={{ fontSize: "14px", color: "#666" }}>{plan.period}</span></div>
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
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "24px", padding: "48px 32px", marginBottom: "64px", textAlign: "center", color: "white" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⭐</div>
          <p style={{ fontSize: "20px", fontWeight: "500", marginBottom: "16px", maxWidth: "700px", margin: "0 auto 16px" }}>
            "Partnering with GCE has been a game-changer for our venue. Our bookings increased by 200% in just 3 months!"
          </p>
          <p style={{ fontSize: "14px", opacity: 0.9 }}>— Rajesh Sharma, The Leela Mumbai</p>
        </div>

        {/* Contact Form */}
        <div style={{ background: "#f8fafc", borderRadius: "24px", padding: "40px", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", textAlign: "center", marginBottom: "32px" }}>Ready to Partner?</h2>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            {formSubmitted ? (
              <div style={{ background: "#dcfce7", color: "#166534", padding: "16px", borderRadius: "12px", textAlign: "center" }}>
                ✅ Thank you! Our team will contact you soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Venue Name" required style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "12px" }} />
                <input type="text" placeholder="Owner Name" required style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "12px" }} />
                <input type="email" placeholder="Email Address" required style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "12px" }} />
                <input type="tel" placeholder="Phone Number" required style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "16px" }} />
                <button type="submit" style={{ width: "100%", background: "#f97316", color: "white", border: "none", borderRadius: "40px", padding: "14px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
                  Apply Now →
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Navigation - Mobile Only */}
        {isMobile && (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #eef2ff", padding: "12px 20px", marginTop: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-around", maxWidth: "500px", margin: "0 auto" }}>
              <Link href="/"><div style={{ fontSize: "22px" }}>🏠</div><div style={{ fontSize: "10px", color: "#64748b" }}>Home</div></Link>
              <Link href="/events"><div style={{ fontSize: "22px" }}>🔍</div><div style={{ fontSize: "10px", color: "#64748b" }}>Explore</div></Link>
              <Link href="/dashboard/user"><div style={{ fontSize: "22px" }}>👤</div><div style={{ fontSize: "10px", color: "#f97316", fontWeight: "600" }}>Profile</div></Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
