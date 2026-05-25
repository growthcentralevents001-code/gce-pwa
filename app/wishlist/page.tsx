"use client";

import { useState } from "react";
import { Heart, Calendar, MapPin, Users, X } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const [savedEvents, setSavedEvents] = useState([
    { id: 1, name: "Startup Founders Mixer", date: "24 May 2025", venue: "The Leela, Mumbai", price: "₹1,500", attendees: 124, capacity: 200, vertical: "Connect" },
    { id: 3, name: "Fintech Leadership Summit", date: "30 May 2025", venue: "Taj Lands End, Mumbai", price: "₹5,000", attendees: 180, capacity: 250, vertical: "Enterprise" },
  ]);

  const removeFromWishlist = (id: number) => {
    setSavedEvents(savedEvents.filter(e => e.id !== id));
    alert("Removed from wishlist");
  };

  if (savedEvents.length === 0) {
    return (
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "60px 24px", textAlign: "center", background: "#f8fafc", minHeight: "100vh" }}>
        <Heart size={48} style={{ color: "#94a3b8", marginBottom: "16px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px" }}>No saved events yet</h2>
        <p style={{ color: "#64748b", marginBottom: "24px" }}>Start exploring and save events you love!</p>
        <Link href="/" style={{ background: "#f97316", color: "white", padding: "12px 24px", borderRadius: "40px", textDecoration: "none" }}>Explore Events</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>Saved Events</h1>
        <p style={{ color: "#64748b" }}>Events you've saved for later</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
        {savedEvents.map(event => (
          <div key={event.id} style={{ background: "white", borderRadius: "20px", overflow: "hidden", border: "1px solid #eef2ff", position: "relative" }}>
            <button onClick={() => removeFromWishlist(event.id)} style={{ position: "absolute", top: "12px", right: "12px", background: "white", border: "none", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}><X size={16} style={{ color: "#ef4444" }} /></button>
            <div style={{ height: "140px", background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: "48px" }}>🎉</span></div>
            <div style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}><span style={{ background: "#f1f5f9", padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>{event.vertical}</span></div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>{event.name}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px", fontSize: "13px", color: "#64748b" }}>
                <div><Calendar size={12} style={{ display: "inline", marginRight: "4px" }} /> {event.date}</div>
                <div><MapPin size={12} style={{ display: "inline", marginRight: "4px" }} /> {event.venue}</div>
                <div><Users size={12} style={{ display: "inline", marginRight: "4px" }} /> {event.attendees} / {event.capacity} attending</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #eef2ff", paddingTop: "16px" }}>
                <span style={{ fontSize: "20px", fontWeight: "700", color: "#f97316" }}>{event.price}</span>
                <Link href={`/events/${event.id}`} style={{ background: "#f97316", color: "white", padding: "6px 20px", borderRadius: "40px", textDecoration: "none", fontSize: "13px" }}>Book Now</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
