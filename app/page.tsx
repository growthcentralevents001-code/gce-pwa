"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Heart } from "lucide-react";

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
  organizer: string;
  status: string;
  image?: string;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([
    { id: 1, name: "Startup Founders Mixer", vertical: "Connect", date: "24 May 2025", time: "6:30 PM", venue: "The Leela, Mumbai", price: "₹1,500", attendees: 124, capacity: 200, organizer: "GCE Admin", status: "Live" },
    { id: 2, name: "Sunday Brunch Buffet", vertical: "Marketplace", date: "28 May 2025", time: "11:00 AM", venue: "JW Marriott, Pune", price: "₹2,500", attendees: 45, capacity: 100, organizer: "JW Marriott", status: "Live" },
    { id: 3, name: "Fintech Leadership Summit", vertical: "Enterprise", date: "30 May 2025", time: "10:00 AM", venue: "Taj Lands End, Mumbai", price: "₹5,000", attendees: 180, capacity: 250, organizer: "Fintech Council", status: "Live" },
  ]);

  useEffect(() => {
    const storedEvents = localStorage.getItem("gce_events");
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      setEvents(prev => [...prev, ...parsedEvents]);
    }
  }, []);

  const getVerticalColor = (vertical: string) => {
    switch(vertical) {
      case "Connect": return { bg: "#fef3c7", color: "#92400e" };
      case "Marketplace": return { bg: "#e0e7ff", color: "#3730a3" };
      case "Enterprise": return { bg: "#dcfce7", color: "#166534" };
      default: return { bg: "#f1f5f9", color: "#475569" };
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px" }}>GCE Events</h1>
      <p style={{ color: "#64748b", marginBottom: "32px" }}>Discover amazing events near you</p>

      <div style={{ display: "flex", gap: "12px", marginBottom: "32px", flexWrap: "wrap" }}>
        <button style={{ background: "#f97316", color: "white", padding: "8px 20px", borderRadius: "40px", border: "none", fontWeight: "500" }}>All Events</button>
        <button style={{ background: "white", color: "#64748b", padding: "8px 20px", borderRadius: "40px", border: "1px solid #e2e8f0" }}>Connect</button>
        <button style={{ background: "white", color: "#64748b", padding: "8px 20px", borderRadius: "40px", border: "1px solid #e2e8f0" }}>Marketplace</button>
        <button style={{ background: "white", color: "#64748b", padding: "8px 20px", borderRadius: "40px", border: "1px solid #e2e8f0" }}>Enterprise</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
        {events.map((event) => {
          const verticalStyle = getVerticalColor(event.vertical);
          return (
            <div key={event.id} style={{ background: "white", borderRadius: "20px", overflow: "hidden", border: "1px solid #eef2ff", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ height: "160px", background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "48px" }}>🎉</span>
              </div>
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                  <span style={{ background: verticalStyle.bg, color: verticalStyle.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500" }}>
                    {event.vertical}
                  </span>
                  <Heart size={20} style={{ color: "#94a3b8", cursor: "pointer" }} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>{event.name}</h3>
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
                  <span style={{ fontSize: "20px", fontWeight: "700", color: "#f97316" }}>{event.price}</span>
                  <button style={{ background: "#f97316", color: "white", padding: "8px 20px", borderRadius: "40px", border: "none", cursor: "pointer", fontWeight: "500" }}>
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
