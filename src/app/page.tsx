"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("connect");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mock events data — TODO: Connect to Supabase
  const events = [
    { id: "1", title: "Startup Founders Mixer", date: "24 May, 6:30 PM", venue: "The Leela, Mumbai", price: "₹399", going: 124, image: "🚀" },
    { id: "2", title: "Bollywood Night", date: "25 May, 9:00 PM", venue: "Juhu, Mumbai", price: "₹799", going: 89, image: "🎉" },
    { id: "3", title: "Brewery Tour", date: "25 May, 9:00 PM", venue: "Andheri, Mumbai", price: "₹699", going: 56, image: "🍔" },
  ];

  const weekend = [
    { id: "5", title: "Stand-up Comedy", date: "25 May, 8:00 PM", price: "₹499", icon: "🎭" },
    { id: "6", title: "Yoga Session", date: "26 May, 7:00 AM", price: "₹299", icon: "🧘" },
    { id: "7", title: "Art & Wine", date: "26 May, 6:00 PM", price: "₹599", icon: "🎨" },
    { id: "8", title: "Live Music", date: "26 May, 9:00 PM", price: "₹449", icon: "🎸" },
  ];

  const tabs = [
    { id: "connect", label: "GCE Connect", icon: "🤝", desc: "Networking & Business" },
    { id: "marketplace", label: "GCE Marketplace", icon: "🛒", desc: "Venue Hosted" },
    { id: "enterprise", label: "GCE Enterprise", icon: "🏢", desc: "Corporate & B2B" },
  ];

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    padding: "16px 20px",
    background: "white",
    borderBottom: "1px solid #eef2ff",
    marginBottom: "24px",
    flexWrap: isMobile ? "wrap" : "nowrap" as const
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "40px"
  };

  const weekendStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "40px"
  };

  const cardStyle: React.CSSProperties = {
    background: "white",
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid #eef2ff",
    cursor: "pointer",
    transition: "transform 0.2s"
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    minWidth: "180px",
    background: isActive ? "#f97316" : "white",
    color: isActive ? "white" : "#666",
    border: isActive ? "none" : "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s"
  });

  return (
    <div>
      {/* Header */}
      <div style={headerStyle}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#f97316", margin: 0 }}>GCE</h1>
        </Link>
        
        {/* Search Bar */}
        <div style={{ 
          flex: 1, 
          display: "flex", 
          alignItems: "center", 
          gap: "10px", 
          background: "#f8fafc", 
          border: "1px solid #e2e8f0", 
          borderRadius: "60px", 
          padding: "10px 20px", 
          maxWidth: isMobile ? "100%" : "500px" 
        }}>
          <span style={{ fontSize: "16px" }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search events, venues, people..." 
            style={{ flex: 1, border: "none", outline: "none", fontSize: "14px", background: "transparent" }} 
          />
          <button style={{ background: "#f97316", color: "white", border: "none", borderRadius: "40px", padding: "8px 20px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
            Search
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button style={{ background: "white", border: "1px solid #ddd", borderRadius: "40px", padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}>📍 Mumbai</button>
          <Link href="/login">
            <button style={{ background: "#f97316", color: "white", border: "none", borderRadius: "40px", padding: "8px 20px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Sign In</button>
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "16px" : "24px" }}>
        
        {/* 3 Tabs - Only active tab is orange */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px", flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <div 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              style={tabStyle(activeTab === tab.id)}
            >
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>{tab.icon}</div>
              <div style={{ fontWeight: "700", fontSize: "14px" }}>{tab.label}</div>
              <div style={{ fontSize: "11px", opacity: 0.8 }}>{tab.desc}</div>
            </div>
          ))}
        </div>

        {/* Featured Banner */}
        <div style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "24px", padding: "32px 24px", marginBottom: "40px", color: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", fontWeight: "600" }}>FEATURED</span>
            <span style={{ fontSize: "18px", cursor: "pointer" }}>♡</span>
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "12px" }}>Startup Founders Mixer</h2>
          <div style={{ display: "flex", gap: "20px", fontSize: "13px", marginBottom: "16px", opacity: 0.9, flexWrap: "wrap" }}>
            <span>📅 24 May, 6:30 PM</span>
            <span>📍 The Leela, Mumbai</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ display: "flex" }}>
                <div style={{ width: "32px", height: "32px", background: "rgba(255,255,255,0.3)", borderRadius: "50%", border: "2px solid white" }}></div>
                <div style={{ width: "32px", height: "32px", background: "rgba(255,255,255,0.3)", borderRadius: "50%", border: "2px solid white", marginLeft: "-10px" }}></div>
                <div style={{ width: "32px", height: "32px", background: "rgba(255,255,255,0.3)", borderRadius: "50%", border: "2px solid white", marginLeft: "-10px" }}></div>
              </div>
              <span style={{ fontSize: "13px" }}>124+ going</span>
            </div>
            <Link href="/booking">
              <button style={{ background: "white", color: "#f97316", border: "none", borderRadius: "40px", padding: "10px 24px", fontWeight: "700", cursor: "pointer" }}>Book Now →</button>
            </Link>
          </div>
        </div>

        {/* Trending Events - Cards visible now */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700" }}>🔥 Trending Events</h2>
            <Link href="/events" style={{ color: "#f97316", fontSize: "13px", textDecoration: "none" }}>View all →</Link>
          </div>
          <div style={gridStyle}>
            {events.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} style={{ textDecoration: "none" }}>
                <div style={cardStyle}>
                  <div style={{ height: "130px", background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "44px", color: "white" }}>{event.image}</div>
                  <div style={{ padding: "16px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "6px" }}>{event.title}</h3>
                    <p style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>📅 {event.date}</p>
                    <p style={{ fontSize: "12px", color: "#666", marginBottom: "12px" }}>📍 {event.venue}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #eef2ff", paddingTop: "12px" }}>
                      <span style={{ fontSize: "12px", color: "#666" }}>👥 {event.going} going</span>
                      <div>
                        <span style={{ fontSize: "18px", fontWeight: "700", color: "#f97316", marginRight: "8px" }}>{event.price}</span>
                        <button style={{ background: "#f97316", color: "white", border: "none", borderRadius: "30px", padding: "6px 14px", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}>Book</button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Weekend Picks - Cards visible now */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700" }}>🎉 This Weekend Picks</h2>
            <Link href="/events" style={{ color: "#f97316", fontSize: "13px", textDecoration: "none" }}>View all →</Link>
          </div>
          <div style={weekendStyle}>
            {weekend.map((item) => (
              <Link key={item.id} href={`/events/${item.id}`} style={{ textDecoration: "none" }}>
                <div style={cardStyle}>
                  <div style={{ height: "100px", background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", color: "white" }}>{item.icon}</div>
                  <div style={{ padding: "12px" }}>
                    <h3 style={{ fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>{item.title}</h3>
                    <p style={{ fontSize: "11px", color: "#666", marginBottom: "6px" }}>📅 {item.date}</p>
                    <p style={{ fontSize: "16px", fontWeight: "700", color: "#f97316" }}>{item.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Offers Card */}
        <div style={{ background: "#fffaf5", border: "1px solid #fed7aa", borderRadius: "20px", padding: "20px" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "22px" }}>%</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>Exclusive Offers</h3>
              <p style={{ fontSize: "13px", color: "#666", marginBottom: "6px" }}>Flat ₹100 OFF on all Business Events</p>
              <span style={{ background: "#fed7aa", color: "#f97316", borderRadius: "20px", padding: "4px 12px", fontSize: "12px", fontWeight: "700" }}>GCE100</span>
            </div>
            <button style={{ border: "2px solid #f97316", color: "#f97316", background: "white", borderRadius: "40px", padding: "10px 24px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>View Offers →</button>
          </div>
        </div>

        {/* Bottom Nav - Mobile Only */}
        {isMobile && (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #eef2ff", padding: "12px 20px", marginTop: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
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
