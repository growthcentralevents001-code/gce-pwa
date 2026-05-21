"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, Users, DollarSign, Award, PlusCircle, ChevronRight, Star, Calendar, MapPin } from "lucide-react";

// Mock data — TODO: Connect to Supabase
const mockFranchisee = {
  id: "f1",
  name: "Rahul Sharma",
  zone: "Mumbai West",
  tier: 2, // Phase 2
  revenueSplit: "40:60",
  totalSales: 35000, // ₹35,000
  nextTierTarget: 50000,
  commissionEarned: 32500,
  thisMonthCommission: 8450,
  venues: [
    { id: "v1", name: "Taj Lands End", status: "Live", events: 12, earnings: 25000 },
    { id: "v2", name: "The Leela", status: "Live", events: 8, earnings: 18000 },
    { id: "v3", name: "JW Marriott", status: "Pending", events: 0, earnings: 0 },
  ],
  leaderboardRank: 3,
  topPerformers: [
    { name: "Amit Patel", zone: "Mumbai South", commission: 52000 },
    { name: "Priya Singh", zone: "Mumbai Central", commission: 48500 },
    { name: "Rahul Sharma", zone: "Mumbai West", commission: 32500 },
    { name: "Neha Gupta", zone: "Mumbai East", commission: 29800 },
    { name: "Vikram Mehta", zone: "Mumbai North", commission: 27400 },
  ],
};

export default function FranchiseeDashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [franchisee, setFranchisee] = useState(mockFranchisee);
  const [showOnboardForm, setShowOnboardForm] = useState(false);
  const [newVenue, setNewVenue] = useState({ name: "", gstin: "", address: "", bankAccount: "", type: "Basic" });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Insert into Supabase venues table
    alert(`Venue "${newVenue.name}" onboarded successfully!`);
    setShowOnboardForm(false);
    setNewVenue({ name: "", gstin: "", address: "", bankAccount: "", type: "Basic" });
  };

  const progressToNextTier = ((franchisee.totalSales / franchisee.nextTierTarget) * 100);
  const tierName = franchisee.tier === 1 ? "Phase 1" : franchisee.tier === 2 ? "Phase 2" : franchisee.tier === 3 ? "Phase 3" : "Phase 4";
  const splitParts = franchisee.revenueSplit.split(":");

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
    borderRadius: "24px",
    padding: "24px",
    border: "1px solid #eef2ff",
    marginBottom: "24px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "24px"
  };

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Franchise Dashboard</h1>
            <p style={{ color: "#666", marginTop: "4px" }}>Welcome back, {franchisee.name}</p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button style={{ background: "white", border: "1px solid #ddd", borderRadius: "40px", padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}>📍 {franchisee.zone}</button>
            <button style={{ background: "#f97316", color: "white", border: "none", borderRadius: "40px", padding: "8px 20px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Help</button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div style={gridStyle}>
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <DollarSign size={24} style={{ color: "#f97316" }} />
              <span style={{ fontWeight: "600" }}>Total Commission</span>
            </div>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a" }}>₹{franchisee.commissionEarned.toLocaleString()}</div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>Lifetime earnings</div>
          </div>
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <TrendingUp size={24} style={{ color: "#f97316" }} />
              <span style={{ fontWeight: "600" }}>This Month</span>
            </div>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a" }}>₹{franchisee.thisMonthCommission.toLocaleString()}</div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>+12% from last month</div>
          </div>
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <Users size={24} style={{ color: "#f97316" }} />
              <span style={{ fontWeight: "600" }}>Active Venues</span>
            </div>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a" }}>{franchisee.venues.filter(v => v.status === "Live").length}</div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>Total onboarded: {franchisee.venues.length}</div>
          </div>
        </div>

        {/* Tier Progress Card */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>Current Tier: {tierName}</h2>
            <span style={{ background: "#f1f5f9", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", color: "#f97316" }}>
              {splitParts[0]}:{splitParts[1]} Revenue Split
            </span>
          </div>
          <div style={{ marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
              <span>Progress to {franchisee.tier === 4 ? "Max" : `Phase ${franchisee.tier + 1}`}</span>
              <span>₹{franchisee.totalSales.toLocaleString()} / ₹{franchisee.nextTierTarget.toLocaleString()}</span>
            </div>
            <div style={{ background: "#e2e8f0", borderRadius: "10px", height: "8px" }}>
              <div style={{ width: `${Math.min(progressToNextTier, 100)}%`, background: "#f97316", borderRadius: "10px", height: "8px" }}></div>
            </div>
          </div>
          {franchisee.tier < 4 && (
            <p style={{ fontSize: "13px", color: "#666", marginTop: "8px" }}>
              Earn ₹{(franchisee.nextTierTarget - franchisee.totalSales).toLocaleString()} more to reach Phase {franchisee.tier + 1}
            </p>
          )}
        </div>

        {/* Venue Onboarding Form (Toggle) */}
        <div style={{ marginBottom: "24px" }}>
          <button
            onClick={() => setShowOnboardForm(!showOnboardForm)}
            style={{ background: "#f97316", color: "white", border: "none", borderRadius: "40px", padding: "12px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <PlusCircle size={18} /> Onboard New Venue
          </button>
          {showOnboardForm && (
            <div style={{ ...cardStyle, marginTop: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Venue Onboarding Form</h3>
              <form onSubmit={handleOnboardSubmit}>
                <input type="text" placeholder="Venue Name *" required value={newVenue.name} onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "12px" }} />
                <input type="text" placeholder="GSTIN *" required value={newVenue.gstin} onChange={(e) => setNewVenue({ ...newVenue, gstin: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "12px" }} />
                <input type="text" placeholder="Address *" required value={newVenue.address} onChange={(e) => setNewVenue({ ...newVenue, address: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "12px" }} />
                <input type="text" placeholder="Bank Account Number *" required value={newVenue.bankAccount} onChange={(e) => setNewVenue({ ...newVenue, bankAccount: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "12px" }} />
                <select value={newVenue.type} onChange={(e) => setNewVenue({ ...newVenue, type: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "16px" }}>
                  <option value="Basic">Basic</option>
                  <option value="Pro">Pro</option>
                  <option value="Elite">Elite</option>
                </select>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button type="submit" style={{ background: "#f97316", color: "white", border: "none", borderRadius: "40px", padding: "10px 20px", fontWeight: "600", cursor: "pointer" }}>Submit</button>
                  <button type="button" onClick={() => setShowOnboardForm(false)} style={{ background: "white", border: "1px solid #ddd", borderRadius: "40px", padding: "10px 20px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* My Venues List */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>My Venues</h2>
          {franchisee.venues.map((venue) => (
            <div key={venue.id} style={{ background: "#f8fafc", borderRadius: "16px", padding: "12px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div style={{ fontWeight: "600", marginBottom: "4px" }}>{venue.name}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>Events: {venue.events} | Earnings: ₹{venue.earnings.toLocaleString()}</div>
              </div>
              <span style={{ background: venue.status === "Live" ? "#dcfce7" : "#fef3c7", color: venue.status === "Live" ? "#166534" : "#92400e", padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600" }}>{venue.status}</span>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Leaderboard - {franchisee.zone}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", background: "#f1f5f9", padding: "8px 12px", borderRadius: "12px" }}>
            <Award size={20} style={{ color: "#f97316" }} />
            <span style={{ fontWeight: "600" }}>Your Rank: #{franchisee.leaderboardRank}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {franchisee.topPerformers.map((performer, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eef2ff", paddingBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontWeight: "600", width: "24px" }}>#{idx+1}</span>
                  <span>{performer.name}</span>
                  <span style={{ fontSize: "12px", color: "#666" }}>{performer.zone}</span>
                </div>
                <span style={{ fontWeight: "700", color: "#f97316" }}>₹{performer.commission.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed (mock) */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Recent Activity</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", background: "#f97316", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>✓</div>
              <div><div style={{ fontWeight: "500" }}>New venue onboarded: Taj Lands End</div><div style={{ fontSize: "11px", color: "#666" }}>2 hours ago</div></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", background: "#f97316", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>💰</div>
              <div><div style={{ fontWeight: "500" }}>Commission credited: ₹5,200</div><div style={{ fontSize: "11px", color: "#666" }}>Yesterday</div></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", background: "#f97316", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>🎉</div>
              <div><div style={{ fontWeight: "500" }}>Reached Phase 2 milestone</div><div style={{ fontSize: "11px", color: "#666" }}>3 days ago</div></div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation - Mobile Only */}
        {isMobile && (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #eef2ff", padding: "12px 20px", marginTop: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-around", maxWidth: "500px", margin: "0 auto" }}>
              <Link href="/"><div style={{ fontSize: "22px" }}>🏠</div><div style={{ fontSize: "10px", color: "#64748b" }}>Home</div></Link>
              <Link href="/events"><div style={{ fontSize: "22px" }}>🔍</div><div style={{ fontSize: "10px", color: "#64748b" }}>Explore</div></Link>
              <Link href="/dashboard/franchisee"><div style={{ fontSize: "22px" }}>👤</div><div style={{ fontSize: "10px", color: "#f97316", fontWeight: "600" }}>BDM</div></Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
