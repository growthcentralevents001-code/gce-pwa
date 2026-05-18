"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, Share2, Bell, Heart, Users } from "lucide-react";
import Header from "@/components/Header";

const getEventData = (id: string) => {
  return {
    id: id,
    title: "Startup Founders Roundtable",
    tagline: "Network. Share. Grow.",
    date: "24 May 2026",
    day: "Friday",
    time: "6:30 PM",
    venue: "The Leela, Mumbai",
    location: "Sahar, Mumbai",
    price: "₹399",
    originalPrice: "₹999",
    discount: "60% OFF",
    description: "An exclusive roundtable for startup founders, investors and innovation leaders to connect, share insights and explore collaboration opportunities.",
    category: "Networking",
    capacity: "50–100 People",
    dressCode: "Smart Casual",
    attendees: ["Rahul", "Sneha", "Aman", "Karan", "Neha"],
    totalAttendees: 124,
  };
};

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showPostConnect, setShowPostConnect] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    const eventEndTime = new Date(2026, 4, 24, 22, 0, 0);
    if (new Date() > eventEndTime) setShowPostConnect(true);
    setEvent(getEventData(params.id));
    return () => window.removeEventListener("resize", checkMobile);
  }, [params.id]);

  const handleWhatsAppShare = () => {
    const text = `Join me at ${event?.title} on GCE! ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleReminder = () => alert("✅ Reminder set!");
  const handlePostConnect = () => alert("🔗 Connect with attendees coming soon!");

  if (!event) return <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>;

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
      <Header />
      <div style={innerStyle}>
        
        {/* Back & Heart */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <Link href="/">
            <button style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "50%", width: "44px", height: "44px", cursor: "pointer" }}>←</button>
          </Link>
          <button onClick={() => setIsLiked(!isLiked)} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "50%", width: "44px", height: "44px", cursor: "pointer" }}>
            <Heart size={20} style={{ color: isLiked ? "#f97316" : "#94a3b8", fill: isLiked ? "#f97316" : "none" }} />
          </button>
        </div>

        {/* Title */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: isMobile ? "28px" : "36px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>{event.title}</h1>
          <p style={{ color: "#f97316", fontSize: "14px", fontWeight: "500" }}>{event.tagline}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "32px" }}>
          
          {/* Left Column */}
          <div>
            <p style={{ color: "#475569", lineHeight: "1.6", marginBottom: "24px" }}>{event.description}</p>
            
            <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>About the Event</h2>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ background: "#f1f5f9", padding: "6px 14px", borderRadius: "20px", fontSize: "13px" }}>{event.category}</span>
                <span style={{ background: "#f1f5f9", padding: "6px 14px", borderRadius: "20px", fontSize: "13px" }}>{event.capacity}</span>
                <span style={{ background: "#f1f5f9", padding: "6px 14px", borderRadius: "20px", fontSize: "13px" }}>{event.dressCode}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div>
            <div style={{ background: "white", borderRadius: "24px", padding: "24px", border: "1px solid #eef2ff", position: "sticky", top: "20px" }}>
              
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "20px" }}>
                <span style={{ fontSize: "36px", fontWeight: "800", color: "#f97316" }}>{event.price}</span>
                <span style={{ fontSize: "14px", color: "#94a3b8", textDecoration: "line-through" }}>{event.originalPrice}</span>
                <span style={{ background: "#f97316", color: "white", padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600" }}>{event.discount}</span>
              </div>

              <Link href="/booking">
                <button style={{ width: "100%", background: "#f97316", color: "white", border: "none", borderRadius: "40px", padding: "14px", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginBottom: "20px" }}>
                  Book Now →
                </button>
              </Link>

              <div style={{ borderTop: "1px solid #eef2ff", paddingTop: "16px", marginBottom: "16px" }}>
                <div style={{ display: "flex", gap: "12px", marginBottom: "12px", alignItems: "center" }}>
                  <Calendar size={16} style={{ color: "#f97316" }} />
                  <span style={{ fontSize: "13px" }}>{event.date} • {event.day} • {event.time}</span>
                </div>
                <div style={{ display: "flex", gap: "12px", marginBottom: "12px", alignItems: "center" }}>
                  <MapPin size={16} style={{ color: "#f97316" }} />
                  <span style={{ fontSize: "13px" }}>{event.venue}, {event.location}</span>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <Users size={16} style={{ color: "#f97316" }} />
                  <span style={{ fontSize: "13px" }}>{event.totalAttendees}+ going</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #eef2ff", borderBottom: "1px solid #eef2ff", padding: "12px 0", marginBottom: "20px", fontSize: "12px" }}>
                <span>✅ Free cancellation</span>
                <span>🔒 Secure payment</span>
              </div>

              <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}>Your Network Attending</h3>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
                {event.attendees.map((name: string, idx: number) => (
                  <div key={idx} style={{ textAlign: "center" }}>
                    <div style={{ width: "44px", height: "44px", background: "#f97316", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "600", fontSize: "16px" }}>{name.charAt(0)}</div>
                    <div style={{ fontSize: "11px", marginTop: "4px" }}>{name}</div>
                  </div>
                ))}
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: "44px", height: "44px", background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "600" }}>+{event.totalAttendees - event.attendees.length}</div>
                  <div style={{ fontSize: "11px", marginTop: "4px" }}>More</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={handleWhatsAppShare} style={{ flex: 1, background: "#25D366", color: "white", border: "none", borderRadius: "40px", padding: "10px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>📱 Share</button>
                <button onClick={handleReminder} style={{ flex: 1, background: "#f1f5f9", color: "#333", border: "none", borderRadius: "40px", padding: "10px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>🔔 Remind</button>
              </div>
            </div>
          </div>
        </div>

        {/* Post-Event Connect */}
        {showPostConnect && (
          <div style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "20px", padding: "24px", color: "white", textAlign: "center", marginTop: "32px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>🤝 Post Event Connect</h3>
            <p style={{ fontSize: "13px", marginBottom: "16px" }}>Connect with attendees after the event and grow your network.</p>
            <button onClick={handlePostConnect} style={{ background: "white", color: "#f97316", border: "none", borderRadius: "40px", padding: "10px 24px", fontWeight: "700", cursor: "pointer" }}>Connect Now →</button>
          </div>
        )}

        {/* Bottom Navigation - Mobile Only */}
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
