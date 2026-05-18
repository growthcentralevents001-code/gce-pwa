"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MemberDashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [credit, setCredit] = useState(2450);
  const [creditExpiry, setCreditExpiry] = useState("31 Dec 2026");
  const [attendedCount, setAttendedCount] = useState(12);
  const [referralCount, setReferralCount] = useState(8);
  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, title: "Startup Founders Mixer", date: "24 May, 6:30 PM", venue: "The Leela, Mumbai", image: "🎯" },
    { id: 2, title: "Bollywood Night", date: "25 May, 9:00 PM", venue: "Juhu, Mumbai", image: "🎉" },
  ]);
  const [pastEvents, setPastEvents] = useState([
    { id: 3, title: "Tech Summit 2025", date: "15 May, 10:00 AM", venue: "BKC, Mumbai", rated: false },
  ]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const milestoneTier = attendedCount <= 5 ? "Explorer" : attendedCount <= 20 ? "Insider" : "Ambassador";
  const nextMilestone = attendedCount <= 5 ? 6 - attendedCount : attendedCount <= 20 ? 21 - attendedCount : 0;
  const progress = attendedCount <= 5 ? (attendedCount / 5) * 100 : attendedCount <= 20 ? ((attendedCount - 5) / 15) * 100 : 100;

  // Responsive container
  const containerStyle = {
    maxWidth: "100%",
    margin: "0 auto",
    padding: isMobile ? "16px" : "32px",
    fontFamily: "'Inter', sans-serif",
    background: "#ffffff",
    minHeight: "100vh",
    paddingBottom: isMobile ? "80px" : "40px"
  };

  const contentStyle = {
    maxWidth: isMobile ? "100%" : "1200px",
    margin: "0 auto"
  };

  const statsGridStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr 1fr 1fr" : "repeat(3, 300px)",
    gap: "16px",
    marginBottom: "24px",
    justifyContent: isMobile ? "stretch" : "center"
  };

  const upcomingGridStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
    gap: "16px",
    marginBottom: "24px"
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: isMobile ? "20px" : "28px", fontWeight: "600", color: "#1f2937", margin: 0 }}>Hello, Rohan</h1>
            <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>Ready for your next event?</p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: "44px", height: "44px", cursor: "pointer", fontSize: "18px" }}>🔔</button>
            <button style={{ background: "#f97316", border: "none", borderRadius: "50%", width: "44px", height: "44px", cursor: "pointer", color: "white", fontWeight: "600", fontSize: "16px" }}>RS</button>
          </div>
        </div>

        {/* Credits Card */}
        <div style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "20px", padding: "24px", marginBottom: "24px", color: "white", maxWidth: isMobile ? "100%" : "600px", marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "14px", fontWeight: "500", opacity: 0.9 }}>GCE Credits</span>
            <button style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "20px", padding: "6px 12px", fontSize: "12px", cursor: "pointer" }}>+ Add</button>
          </div>
          <div style={{ fontSize: isMobile ? "36px" : "48px", fontWeight: "700", marginBottom: "4px" }}>₹{credit}</div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>Expires on {creditExpiry}</div>
        </div>

        {/* Stats - Centered on desktop */}
        <div style={statsGridStyle}>
          <div style={{ background: "#f8fafc", borderRadius: "16px", padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🎯</div>
            <div style={{ fontWeight: "700", fontSize: "24px", color: "#1f2937" }}>{attendedCount}</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Events</div>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: "16px", padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>👥</div>
            <div style={{ fontWeight: "700", fontSize: "24px", color: "#1f2937" }}>{referralCount}</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Referrals</div>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: "16px", padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏆</div>
            <div style={{ fontWeight: "700", fontSize: "24px", color: "#1f2937" }}>{milestoneTier}</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Tier</div>
          </div>
        </div>

        {/* Milestone */}
        <div style={{ background: "#f8fafc", borderRadius: "16px", padding: "20px", marginBottom: "24px", maxWidth: isMobile ? "100%" : "900px", marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontWeight: "600" }}>Your Milestone</span>
            <span style={{ background: "#f97316", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>{milestoneTier}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "8px", color: "#6b7280" }}>
            <span>Explorer</span><span>Insider</span><span>Ambassador</span>
          </div>
          <div style={{ background: "#e5e7eb", borderRadius: "10px", height: "8px", marginBottom: "10px" }}>
            <div style={{ width: `${progress}%`, background: "#f97316", borderRadius: "10px", height: "8px" }}></div>
          </div>
          {nextMilestone > 0 && <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>{nextMilestone} more events to reach {milestoneTier === "Explorer" ? "Insider" : "Ambassador"} →</p>}
        </div>

        {/* Upcoming Events */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700" }}>Upcoming Events</h2>
            <Link href="/my-events" style={{ color: "#f97316", fontSize: "13px", textDecoration: "none" }}>View all →</Link>
          </div>
          <div style={upcomingGridStyle}>
            {upcomingEvents.map((event) => (
              <div key={event.id} style={{ background: "#f8fafc", borderRadius: "16px", padding: "16px", display: "flex", gap: "14px", alignItems: "center" }}>
                <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", color: "white" }}>{event.image}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "4px" }}>{event.title}</h3>
                  <p style={{ fontSize: "11px", color: "#6b7280", marginBottom: "2px" }}>📅 {event.date}</p>
                  <p style={{ fontSize: "11px", color: "#6b7280" }}>📍 {event.venue}</p>
                </div>
                <Link href={`/events/${event.id}`}>
                  <button style={{ background: "#f97316", color: "white", border: "none", borderRadius: "20px", padding: "6px 14px", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}>Book</button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Referral */}
        <div style={{ background: "#f8fafc", borderRadius: "16px", padding: "20px", textAlign: "center", marginBottom: "24px", maxWidth: isMobile ? "100%" : "600px", marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>🎁</div>
          <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>Invite Friends, Get ₹200</h3>
          <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "16px" }}>{referralCount} friends invited</p>
          <button style={{ background: "#f97316", color: "white", border: "none", borderRadius: "30px", padding: "12px", fontSize: "13px", fontWeight: "600", cursor: "pointer", width: "100%", maxWidth: "300px", margin: "0 auto", display: "block" }}>Invite Friends →</button>
        </div>

        {/* Past Events */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700" }}>Past Events</h2>
            <Link href="/past-events" style={{ color: "#f97316", fontSize: "13px", textDecoration: "none" }}>View all →</Link>
          </div>
          <div style={upcomingGridStyle}>
            {pastEvents.map((event) => (
              <div key={event.id} style={{ background: "#f8fafc", borderRadius: "16px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "4px" }}>{event.title}</h3>
                  <p style={{ fontSize: "11px", color: "#6b7280", marginBottom: "2px" }}>📅 {event.date}</p>
                  <p style={{ fontSize: "11px", color: "#6b7280" }}>📍 {event.venue}</p>
                </div>
                <button style={{ background: "white", border: "1px solid #f97316", color: "#f97316", borderRadius: "20px", padding: "6px 14px", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}>Rate</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #e5e7eb", padding: "12px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-around", maxWidth: "500px", margin: "0 auto" }}>
            {[
              { icon: "🏠", label: "Home", link: "/" },
              { icon: "🔍", label: "Explore", link: "/explore" },
              { icon: "📅", label: "My Events", link: "/my-events" },
              { icon: "👤", label: "Profile", link: "/dashboard/user" },
            ].map((item, i) => (
              <Link key={i} href={item.link} style={{ textAlign: "center", textDecoration: "none", opacity: item.label === "Profile" ? 1 : 0.6 }}>
                <div style={{ fontSize: "22px" }}>{item.icon}</div>
                <div style={{ fontSize: "10px", marginTop: "4px", color: item.label === "Profile" ? "#f97316" : "#6b7280", fontWeight: item.label === "Profile" ? "600" : "400" }}>{item.label}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
