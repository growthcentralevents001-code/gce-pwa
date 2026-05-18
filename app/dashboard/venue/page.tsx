"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, Users, DollarSign, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";

export default function VenueDashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [venueName] = useState("The Leela, Mumbai");
  
  // Mock data — TODO: Connect to Supabase
  const [stats] = useState({
    totalRevenue: 125000,
    totalBookings: 342,
    upcomingEvents: 8
  });
  
  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, title: "Startup Founders Mixer", date: "24 May, 6:30 PM", tickets: 124, status: "Live", image: "🎯" },
    { id: 2, title: "Bollywood Night", date: "25 May, 9:00 PM", tickets: 89, status: "Live", image: "🎉" },
    { id: 3, title: "Corporate Summit", date: "28 May, 10:00 AM", tickets: 234, status: "Draft", image: "🏢" },
  ]);
  
  const [recentBookings, setRecentBookings] = useState([
    { id: 1, customer: "Rahul Sharma", event: "Startup Founders Mixer", tickets: 2, amount: 798, status: "Confirmed", date: "23 May" },
    { id: 2, customer: "Sneha Kapoor", event: "Bollywood Night", tickets: 4, amount: 3196, status: "Pending", date: "23 May" },
    { id: 3, customer: "Aman Gupta", event: "Startup Founders Mixer", tickets: 1, amount: 399, status: "Confirmed", date: "22 May" },
  ]);
  
  const [payouts, setPayouts] = useState([
    { id: 1, amount: 12500, date: "15 May 2026", status: "Paid" },
    { id: 2, amount: 8900, date: "08 May 2026", status: "Paid" },
    { id: 3, amount: 15600, date: "01 May 2026", status: "Processing" },
  ]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "24px"
  };

  const statCardStyle = {
    background: "#f8fafc",
    borderRadius: "20px",
    padding: "20px",
    textAlign: "center" as const
  };

  const sectionStyle = {
    background: "#f8fafc",
    borderRadius: "20px",
    padding: "20px",
    marginBottom: "24px"
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: isMobile ? "20px" : "28px", fontWeight: "600", color: "#1f2937", margin: 0 }}>Venue Dashboard</h1>
            <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>{venueName}</p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: "44px", height: "44px", cursor: "pointer", fontSize: "18px" }}>🔔</button>
            <button style={{ background: "#f97316", border: "none", borderRadius: "50%", width: "44px", height: "44px", cursor: "pointer", color: "white", fontWeight: "600" }}>TL</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <DollarSign size={28} style={{ color: "#f97316", marginBottom: "8px", marginLeft: "auto", marginRight: "auto" }} />
            <div style={{ fontSize: "28px", fontWeight: "700", color: "#1f2937" }}>₹{stats.totalRevenue.toLocaleString()}</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Total Revenue</div>
          </div>
          <div style={statCardStyle}>
            <Users size={28} style={{ color: "#f97316", marginBottom: "8px", marginLeft: "auto", marginRight: "auto" }} />
            <div style={{ fontSize: "28px", fontWeight: "700", color: "#1f2937" }}>{stats.totalBookings}</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Total Bookings</div>
          </div>
          <div style={statCardStyle}>
            <Calendar size={28} style={{ color: "#f97316", marginBottom: "8px", marginLeft: "auto", marginRight: "auto" }} />
            <div style={{ fontSize: "28px", fontWeight: "700", color: "#1f2937" }}>{stats.upcomingEvents}</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Upcoming Events</div>
          </div>
        </div>

        {/* Create Event Button */}
        <Link href="/venue/events/create">
          <button style={{ background: "#f97316", color: "white", border: "none", borderRadius: "40px", padding: "14px 24px", fontSize: "15px", fontWeight: "600", cursor: "pointer", width: "100%", marginBottom: "24px", boxShadow: "0 2px 8px rgba(249,115,22,0.25)" }}>
            + Create New Event
          </button>
        </Link>

        {/* Upcoming Events */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>📅 Upcoming Events</h2>
            <Link href="/venue/events" style={{ color: "#f97316", fontSize: "13px", textDecoration: "none" }}>View all →</Link>
          </div>
          {upcomingEvents.map((event) => (
            <div key={event.id} style={{ background: "white", borderRadius: "16px", padding: "14px", marginBottom: "12px", display: "flex", gap: "12px", alignItems: "center", border: "1px solid #e5e7eb" }}>
              <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", color: "white" }}>{event.image}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "2px" }}>{event.title}</h3>
                <p style={{ fontSize: "11px", color: "#6b7280", marginBottom: "2px" }}>📅 {event.date}</p>
                <p style={{ fontSize: "11px", color: "#6b7280" }}>🎟️ {event.tickets} tickets sold</p>
              </div>
              <span style={{ background: event.status === "Live" ? "#dcfce7" : "#fef3c7", color: event.status === "Live" ? "#166534" : "#92400e", padding: "4px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: "600" }}>{event.status}</span>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>📋 Recent Bookings</h2>
            <Link href="/venue/bookings" style={{ color: "#f97316", fontSize: "13px", textDecoration: "none" }}>View all →</Link>
          </div>
          {recentBookings.map((booking) => (
            <div key={booking.id} style={{ background: "white", borderRadius: "16px", padding: "14px", marginBottom: "12px", border: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontWeight: "600", fontSize: "14px" }}>{booking.customer}</span>
                <span style={{ background: booking.status === "Confirmed" ? "#dcfce7" : "#fef3c7", color: booking.status === "Confirmed" ? "#166534" : "#92400e", padding: "4px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: "600" }}>{booking.status}</span>
              </div>
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>{booking.event}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: "11px", color: "#6b7280" }}>{booking.tickets} tickets • ₹{booking.amount}</p>
                <p style={{ fontSize: "11px", color: "#6b7280" }}>{booking.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Payout History */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>💰 Payout History</h2>
            <Link href="/venue/payouts" style={{ color: "#f97316", fontSize: "13px", textDecoration: "none" }}>View all →</Link>
          </div>
          {payouts.map((payout) => (
            <div key={payout.id} style={{ background: "white", borderRadius: "16px", padding: "14px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e5e7eb" }}>
              <div>
                <div style={{ fontWeight: "700", fontSize: "16px", color: "#1f2937" }}>₹{payout.amount.toLocaleString()}</div>
                <div style={{ fontSize: "11px", color: "#6b7280" }}>{payout.date}</div>
              </div>
              <span style={{ background: payout.status === "Paid" ? "#dcfce7" : "#fef3c7", color: payout.status === "Paid" ? "#166534" : "#92400e", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "600" }}>{payout.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #e5e7eb", padding: "12px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-around", maxWidth: "500px", margin: "0 auto" }}>
            {[
              { icon: "🏠", label: "Home", link: "/" },
              { icon: "🔍", label: "Explore", link: "/explore" },
              { icon: "📅", label: "Events", link: "/venue/events" },
              { icon: "👤", label: "Profile", link: "/dashboard/venue" },
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
