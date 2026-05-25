"use client";

import { useState, useEffect } from "react";
import { 
  Wallet, TrendingUp, Users, Calendar, Clock, ChevronRight, 
  Gift, Star, Share2, CheckCircle, Award, Target, Copy, 
  User, Bell, Heart, CreditCard, Settings, LogOut
} from "lucide-react";

export default function MemberDashboard() {
  // State for interactive elements
  const [creditBalance, setCreditBalance] = useState({
    balance: 1250,
    expiryDate: "2025-06-30"
  });

  const [milestone, setMilestone] = useState({
    attendedEvents: 8,
    currentTier: "Insider",
    nextTier: "Ambassador",
    progress: 40,
    tiers: [
      { name: "Explorer", min: 0, max: 5, icon: "🌱", color: "#22c55e" },
      { name: "Insider", min: 6, max: 20, icon: "⭐", color: "#f97316" },
      { name: "Ambassador", min: 21, max: 100, icon: "🏆", color: "#8b5cf6" }
    ]
  });

  const [referral, setReferral] = useState({
    totalReferrals: 3,
    points: 150,
    shareLink: "https://dev.growthcentralevents.com/ref/abc123"
  });

  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, name: "Startup Founders Mixer", date: "24 May 2025", time: "6:30 PM", venue: "The Leela, Mumbai", status: "Confirmed", image: "🎉" },
    { id: 2, name: "Fintech Leadership Summit", date: "30 May 2025", time: "10:00 AM", venue: "Taj Lands End, Mumbai", status: "Confirmed", image: "🏦" },
  ]);

  const [pastEvents, setPastEvents] = useState([
    { id: 3, name: "AI & Future of Work", date: "10 May 2025", venue: "WeWork, BKC", attended: true, image: "🤖" },
    { id: 4, name: "Wine Tasting Evening", date: "5 May 2025", venue: "SOHO House, Mumbai", attended: false, image: "🍷" },
  ]);

  const [savedEvents, setSavedEvents] = useState([
    { id: 5, name: "Yoga & Wellness Retreat", date: "5 Jun 2025", venue: "St. Regis, Goa", image: "🧘" }
  ]);

  const [showCopied, setShowCopied] = useState(false);

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referral.shareLink);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      alert("Copy manually: " + referral.shareLink);
    }
  };

  const handleUseCredits = () => {
    alert("Credits can be applied at checkout when booking events.");
  };

  const getTierIcon = (tierName: string) => {
    const tier = milestone.tiers.find(t => t.name === tierName);
    return tier ? tier.icon : "⭐";
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header with Profile Summary */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>Member Dashboard</h1>
          <p style={{ color: "#64748b" }}>Welcome back, Rohan! Here's your activity summary.</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{ padding: "8px", background: "white", border: "1px solid #e2e8f0", borderRadius: "40px", cursor: "pointer" }}>
            <Bell size={18} style={{ color: "#64748b" }} />
          </button>
          <button style={{ padding: "8px", background: "white", border: "1px solid #e2e8f0", borderRadius: "40px", cursor: "pointer" }}>
            <Settings size={18} style={{ color: "#64748b" }} />
          </button>
        </div>
      </div>

      {/* 3 Widgets Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "32px" }}>
        
        {/* Widget 1: Credit Balance */}
        <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ background: "#fef3c7", padding: "10px", borderRadius: "16px" }}>
              <Wallet size={24} style={{ color: "#f97316" }} />
            </div>
            <h2 style={{ fontSize: "18px", fontWeight: "600" }}>Credit Balance</h2>
          </div>
          <div style={{ fontSize: "36px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
            ₹{creditBalance.balance}
          </div>
          <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
            Expires on {new Date(creditBalance.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
          <button 
            onClick={handleUseCredits}
            style={{ width: "100%", background: "#f97316", color: "white", border: "none", padding: "10px", borderRadius: "40px", cursor: "pointer", fontWeight: "500" }}
          >
            Use Credits
          </button>
        </div>

        {/* Widget 2: Milestone Tracker */}
        <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ background: "#e0e7ff", padding: "10px", borderRadius: "16px" }}>
              <Award size={24} style={{ color: "#3b82f6" }} />
            </div>
            <h2 style={{ fontSize: "18px", fontWeight: "600" }}>Milestone Tracker</h2>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
            <span style={{ fontSize: "28px", fontWeight: "700" }}>{milestone.attendedEvents}</span>
            <span style={{ color: "#64748b", fontSize: "14px" }}>events attended</span>
          </div>
          <div style={{ background: "#e2e8f0", borderRadius: "10px", height: "8px", marginBottom: "12px" }}>
            <div style={{ width: `${milestone.progress}%`, background: "#f97316", height: "8px", borderRadius: "10px", transition: "width 0.3s" }}></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "16px" }}>
            <span>Current: <strong>{milestone.currentTier} {getTierIcon(milestone.currentTier)}</strong></span>
            <span>Next: {milestone.nextTier} → {milestone.nextTier === "Ambassador" ? "21+" : `${milestone.tiers.find(t => t.name === milestone.nextTier)?.min}+`}</span>
          </div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
            {milestone.tiers.map((tier, idx) => (
              <div key={idx} style={{ textAlign: "center", flex: 1, padding: "8px", background: milestone.currentTier === tier.name ? "#fef3c7" : "#f1f5f9", borderRadius: "12px", transition: "all 0.2s" }}>
                <div style={{ fontSize: "20px" }}>{tier.icon}</div>
                <div style={{ fontSize: "11px", fontWeight: "500" }}>{tier.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 3: Referral Widget */}
        <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ background: "#dcfce7", padding: "10px", borderRadius: "16px" }}>
              <Share2 size={24} style={{ color: "#22c55e" }} />
            </div>
            <h2 style={{ fontSize: "18px", fontWeight: "600" }}>Refer & Earn</h2>
          </div>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
            {referral.totalReferrals}
          </div>
          <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "12px" }}>friends referred</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", padding: "8px", background: "#f1f5f9", borderRadius: "12px" }}>
            <Gift size={16} style={{ color: "#f97316" }} />
            <span style={{ fontSize: "14px" }}>Points: <strong>{referral.points}</strong></span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button 
              onClick={copyReferralLink}
              style={{ flex: 1, background: "#f97316", color: "white", border: "none", padding: "10px", borderRadius: "40px", cursor: "pointer", fontWeight: "500" }}
            >
              Invite Friends
            </button>
            <button 
              onClick={copyReferralLink}
              style={{ padding: "10px", background: "#f1f5f9", border: "none", borderRadius: "40px", cursor: "pointer" }}
            >
              <Copy size={18} style={{ color: "#f97316" }} />
            </button>
          </div>
          {showCopied && (
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#22c55e", textAlign: "center" }}>✓ Link copied!</div>
          )}
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
            <Calendar size={18} style={{ color: "#f97316" }} /> Upcoming Events
          </h2>
          <a href="/events" style={{ color: "#f97316", fontSize: "14px", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>View All <ChevronRight size={14} /></a>
        </div>
        {upcomingEvents.map((event) => (
          <div key={event.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #eef2ff" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{ fontSize: "28px" }}>{event.image}</div>
              <div>
                <div style={{ fontWeight: "600" }}>{event.name}</div>
                <div style={{ fontSize: "13px", color: "#64748b", display: "flex", gap: "16px", marginTop: "4px", flexWrap: "wrap" }}>
                  <span><Calendar size={12} style={{ display: "inline", marginRight: "4px" }} />{event.date} at {event.time}</span>
                  <span><Clock size={12} style={{ display: "inline", marginRight: "4px" }} />{event.venue}</span>
                </div>
              </div>
            </div>
            <span style={{ background: "#dcfce7", color: "#166534", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500" }}>{event.status}</span>
          </div>
        ))}
      </div>

      {/* Three Column Grid for Past Events, Saved Events, Offers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
        
        {/* Past Events */}
        <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Clock size={18} style={{ color: "#f97316" }} /> Past Events
          </h2>
          {pastEvents.map((event) => (
            <div key={event.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #eef2ff" }}>
              <div>
                <div style={{ fontWeight: "500" }}>{event.name}</div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>{event.date} · {event.venue}</div>
              </div>
              {event.attended ? (
                <span style={{ background: "#dcfce7", color: "#166534", padding: "4px 8px", borderRadius: "20px", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}><CheckCircle size={10} /> Attended</span>
              ) : (
                <span style={{ background: "#fee2e2", color: "#991b1b", padding: "4px 8px", borderRadius: "20px", fontSize: "11px" }}>Missed</span>
              )}
            </div>
          ))}
        </div>

        {/* Saved Events / Wishlist */}
        <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Heart size={18} style={{ color: "#f97316" }} /> Saved Events
          </h2>
          {savedEvents.length > 0 ? (
            savedEvents.map((event) => (
              <div key={event.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #eef2ff" }}>
                <div>
                  <div style={{ fontWeight: "500" }}>{event.name}</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>{event.date} · {event.venue}</div>
                </div>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "#f97316" }}>Book</button>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>No saved events yet</div>
          )}
        </div>

        {/* My Offers */}
        <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Gift size={18} style={{ color: "#f97316" }} /> My Offers
          </h2>
          <div style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>
            <Gift size={32} style={{ marginBottom: "12px", opacity: 0.5 }} />
            <p>No active offers yet</p>
            <a href="/offers" style={{ color: "#f97316", fontSize: "14px", textDecoration: "none" }}>Browse offers →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
