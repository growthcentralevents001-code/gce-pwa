"use client";

import { useState, useEffect } from "react";
import { Search, User, LogIn, Heart, Calendar, MapPin, Users } from "lucide-react";

interface Event {
  id: number;
  name: string;
  vertical: string;
  date: string;
  time: string;
  venue: string;
  price: string;
  attendees: number;
  capacity: number;
  image?: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([
    { id: 1, name: "Startup Founders Mixer", vertical: "Connect", date: "24 May 2025", time: "6:30 PM", venue: "The Leela, Mumbai", price: "₹1,500", attendees: 124, capacity: 200 },
    { id: 2, name: "Sunday Brunch Buffet", vertical: "Marketplace", date: "28 May 2025", time: "11:00 AM", venue: "JW Marriott, Pune", price: "₹2,500", attendees: 45, capacity: 100 },
    { id: 3, name: "Fintech Leadership Summit", vertical: "Enterprise", date: "30 May 2025", time: "10:00 AM", venue: "Taj Lands End, Mumbai", price: "₹5,000", attendees: 180, capacity: 250 },
    { id: 4, name: "Wine Tasting Evening", vertical: "Marketplace", date: "1 Jun 2025", time: "7:00 PM", venue: "SOHO House, Mumbai", price: "₹3,000", attendees: 0, capacity: 50 },
    { id: 5, name: "Yoga & Wellness Retreat", vertical: "Connect", date: "5 Jun 2025", time: "8:00 AM", venue: "St. Regis, Goa", price: "₹4,000", attendees: 0, capacity: 80 },
    { id: 6, name: "AI & Future of Work", vertical: "Enterprise", date: "10 Jun 2025", time: "9:30 AM", venue: "WeWork, BKC", price: "₹3,500", attendees: 95, capacity: 150 },
  ]);

  const filteredEvents = events.filter(event => {
    const matchesTab = activeTab === "all" || event.vertical.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getVerticalColor = (vertical: string) => {
    switch(vertical) {
      case "Connect": return { bg: "#fef3c7", color: "#92400e", border: "#fde68a" };
      case "Marketplace": return { bg: "#e0e7ff", color: "#3730a3", border: "#c7d2fe" };
      case "Enterprise": return { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" };
      default: return { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" };
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Header */}
      <header style={{ background: "white", borderBottom: "1px solid #eef2ff", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "24px", fontWeight: "bold", background: "linear-gradient(135deg, #f97316, #ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GCE</span>
            <span style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a" }}>Events</span>
          </div>

          {/* Search Bar */}
          <div style={{ flex: 1, maxWidth: "400px", margin: "0 16px" }}>
            <div style={{ display: "flex", alignItems: "center", background: "#f1f5f9", borderRadius: "48px", padding: "8px 16px", border: "1px solid #e2e8f0" }}>
              <Search size={18} style={{ color: "#94a3b8", marginRight: "8px" }} />
              <input 
                type="text" 
                placeholder="Search events, venues..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: "transparent", border: "none", outline: "none", flex: 1, fontSize: "14px" }}
              />
            </div>
          </div>

          {/* Auth Buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "white", border: "1px solid #e2e8f0", borderRadius: "40px", cursor: "pointer", color: "#64748b" }}>
              <LogIn size={16} /> Login
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "#f97316", border: "none", borderRadius: "40px", cursor: "pointer", color: "white", fontWeight: "500" }}>
              <User size={16} /> Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Hero Section */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "48px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>
            Discover Amazing <span style={{ color: "#f97316" }}>Events</span> Near You
          </h1>
          <p style={{ fontSize: "18px", color: "#64748b", maxWidth: "600px", margin: "0 auto" }}>
            Connect, learn, and grow with India's premier event platform
          </p>
        </div>

        {/* Vertical Tabs Container */}
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "32px", flexWrap: "wrap" }}>
          <button 
            onClick={() => setActiveTab("all")}
            style={{
              padding: "10px 24px",
              borderRadius: "40px",
              border: "none",
              background: activeTab === "all" ? "#f97316" : "white",
              color: activeTab === "all" ? "white" : "#64748b",
              fontWeight: "500",
              cursor: "pointer",
              boxShadow: activeTab === "all" ? "0 4px 6px -1px rgba(249,115,22,0.2)" : "none"
            }}
          >
            All Events
          </button>
          <button 
            onClick={() => setActiveTab("connect")}
            style={{
              padding: "10px 24px",
              borderRadius: "40px",
              border: "none",
              background: activeTab === "connect" ? "#f97316" : "white",
              color: activeTab === "connect" ? "white" : "#64748b",
              fontWeight: "500",
              cursor: "pointer"
            }}
          >
            GCE Connect
          </button>
          <button 
            onClick={() => setActiveTab("marketplace")}
            style={{
              padding: "10px 24px",
              borderRadius: "40px",
              border: "none",
              background: activeTab === "marketplace" ? "#f97316" : "white",
              color: activeTab === "marketplace" ? "white" : "#64748b",
              fontWeight: "500",
              cursor: "pointer"
            }}
          >
            GCE Marketplace
          </button>
          <button 
            onClick={() => setActiveTab("enterprise")}
            style={{
              padding: "10px 24px",
              borderRadius: "40px",
              border: "none",
              background: activeTab === "enterprise" ? "#f97316" : "white",
              color: activeTab === "enterprise" ? "white" : "#64748b",
              fontWeight: "500",
              cursor: "pointer"
            }}
          >
            GCE Enterprise
          </button>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "20px" }}>
            <p style={{ color: "#94a3b8" }}>No events found. Try another search or tab.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
            {filteredEvents.map((event) => {
              const colors = getVerticalColor(event.vertical);
              return (
                <div key={event.id} style={{ background: "white", borderRadius: "20px", overflow: "hidden", border: `1px solid ${colors.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", transition: "transform 0.2s, box-shadow 0.2s" }}>
                  {/* Image Placeholder */}
                  <div style={{ height: "160px", background: `linear-gradient(135deg, ${colors.color}20, ${colors.color}10)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "48px" }}>🎉</span>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                      <span style={{ background: colors.bg, color: colors.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500" }}>
                        {event.vertical}
                      </span>
                      <Heart size={18} style={{ color: "#94a3b8", cursor: "pointer" }} />
                    </div>
                    <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px", color: "#0f172a" }}>{event.name}</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#64748b" }}>
                        <Calendar size={14} /> {event.date} at {event.time}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#64748b" }}>
                        <MapPin size={14} /> {event.venue}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#64748b" }}>
                        <Users size={14} /> {event.attendees} / {event.capacity} attending
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #eef2ff", paddingTop: "16px" }}>
                      <span style={{ fontSize: "22px", fontWeight: "700", color: "#f97316" }}>{event.price}</span>
                      <button style={{ background: "#f97316", color: "white", padding: "8px 24px", borderRadius: "40px", border: "none", cursor: "pointer", fontWeight: "500" }}>
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: "white", borderTop: "1px solid #eef2ff", padding: "32px 24px", marginTop: "48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
          <p>© 2025 GCE Events. All rights reserved.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "16px" }}>
            <a href="/about" style={{ color: "#64748b", textDecoration: "none" }}>About</a>
            <a href="/terms" style={{ color: "#64748b", textDecoration: "none" }}>Terms</a>
            <a href="/privacy" style={{ color: "#64748b", textDecoration: "none" }}>Privacy</a>
            <a href="/contact" style={{ color: "#64748b", textDecoration: "none" }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
