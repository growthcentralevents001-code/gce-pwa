"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MemberDashboard() {
  const [credit, setCredit] = useState(2450);
  const [creditExpiry] = useState("31 Dec 2026");
  const [attendedCount, setAttendedCount] = useState(12);
  const [referralCount, setReferralCount] = useState(8);
  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, title: "Startup Founders Mixer", date: "24 May, 6:30 PM", venue: "The Leela, Mumbai", image: "🎯" },
    { id: 2, title: "Bollywood Night", date: "25 May, 9:00 PM", venue: "Juhu, Mumbai", image: "🎉" },
  ]);
  const [pastEvents, setPastEvents] = useState([
    { id: 3, title: "Tech Summit 2025", date: "15 May, 10:00 AM", venue: "BKC, Mumbai", rated: false },
  ]);

  const milestoneTier = attendedCount <= 5 ? "Explorer" : attendedCount <= 20 ? "Insider" : "Ambassador";
  const nextMilestone = attendedCount <= 5 ? 6 - attendedCount : attendedCount <= 20 ? 21 - attendedCount : 0;
  const progress = attendedCount <= 5 ? (attendedCount / 5) * 100 : attendedCount <= 20 ? ((attendedCount - 5) / 15) * 100 : 100;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "20px" }}>Member Dashboard</h1>
      <p style={{ marginBottom: "20px", color: "#666" }}>Welcome back, Member!</p>

      {/* Credit Widget */}
      <div style={{ background: "white", borderRadius: "20px", padding: "20px", marginBottom: "20px", border: "1px solid #eee" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>GCE Credits</h2>
        <p style={{ fontSize: "32px", fontWeight: "800", color: "#f97316", marginBottom: "4px" }}>₹{credit}</p>
        <p style={{ fontSize: "12px", color: "#666" }}>Expires: {creditExpiry}</p>
        <button style={{ marginTop: "12px", background: "#f97316", color: "white", border: "none", borderRadius: "40px", padding: "8px 20px", cursor: "pointer" }}>Use Credits →</button>
      </div>

      {/* Milestone */}
      <div style={{ background: "white", borderRadius: "20px", padding: "20px", marginBottom: "20px", border: "1px solid #eee" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>Milestone Progress</h2>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "8px" }}>
          <span style={{ fontWeight: milestoneTier === "Explorer" ? "700" : "400" }}>Explorer</span>
          <span style={{ fontWeight: milestoneTier === "Insider" ? "700" : "400" }}>Insider</span>
          <span style={{ fontWeight: milestoneTier === "Ambassador" ? "700" : "400" }}>Ambassador</span>
        </div>
        <div style={{ background: "#eee", borderRadius: "10px", height: "8px", marginBottom: "8px" }}>
          <div style={{ width: `${progress}%`, background: "#f97316", borderRadius: "10px", height: "8px" }}></div>
        </div>
        <p style={{ fontSize: "13px", color: "#666" }}>{attendedCount} events attended</p>
        {nextMilestone > 0 && <p style={{ fontSize: "12px", marginTop: "8px" }}>{nextMilestone} more events to reach {milestoneTier === "Explorer" ? "Insider" : "Ambassador"} →</p>}
      </div>

      {/* Referral */}
      <div style={{ background: "white", borderRadius: "20px", padding: "20px", marginBottom: "20px", border: "1px solid #eee" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>Referrals</h2>
        <p style={{ fontSize: "32px", fontWeight: "800", color: "#f97316", marginBottom: "4px" }}>{referralCount}</p>
        <p style={{ fontSize: "12px", color: "#666", marginBottom: "12px" }}>members invited</p>
        <button style={{ background: "#f1f5f9", color: "#333", border: "none", borderRadius: "40px", padding: "8px 20px", cursor: "pointer" }}>Invite Friends →</button>
      </div>

      {/* Upcoming Events */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "12px" }}>Upcoming Events</h2>
        {upcomingEvents.map((event) => (
          <div key={event.id} style={{ background: "white", borderRadius: "16px", padding: "12px", marginBottom: "12px", border: "1px solid #eee", display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ width: "50px", height: "50px", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", color: "white" }}>{event.image}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "4px" }}>{event.title}</h3>
              <p style={{ fontSize: "11px", color: "#666", marginBottom: "2px" }}>📅 {event.date}</p>
              <p style={{ fontSize: "11px", color: "#666" }}>📍 {event.venue}</p>
            </div>
            <Link href={`/events/${event.id}`}>
              <button style={{ background: "#f97316", color: "white", border: "none", borderRadius: "30px", padding: "6px 16px", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}>View →</button>
            </Link>
          </div>
        ))}
      </div>

      {/* Past Events */}
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "12px" }}>Past Events</h2>
        {pastEvents.map((event) => (
          <div key={event.id} style={{ background: "white", borderRadius: "16px", padding: "12px", marginBottom: "12px", border: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "4px" }}>{event.title}</h3>
              <p style={{ fontSize: "11px", color: "#666", marginBottom: "2px" }}>📅 {event.date}</p>
              <p style={{ fontSize: "11px", color: "#666" }}>📍 {event.venue}</p>
            </div>
            <button style={{ background: "white", border: "1px solid #f97316", color: "#f97316", borderRadius: "30px", padding: "6px 16px", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}>Rate Event</button>
          </div>
        ))}
      </div>
    </div>
  );
}
