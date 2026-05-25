"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Search, User, LogIn, Heart, Calendar, MapPin, Users } from "lucide-react";

// Dynamic import with no SSR for LocationBar
const LocationBar = dynamic(() => import("./components/LocationBar"), { ssr: false });

interface Event {
  id: number;
  name: string;
  vertical: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  price: string;
  attendees: number;
  capacity: number;
}

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [isClient, setIsClient] = useState(false);
  
  const [events] = useState<Event[]>([
    { id: 1, name: "Startup Founders Mixer", vertical: "Connect", date: "24 May 2025", time: "6:30 PM", venue: "The Leela, Mumbai", city: "Mumbai", price: "₹1,500", attendees: 124, capacity: 200 },
    { id: 2, name: "Sunday Brunch Buffet", vertical: "Marketplace", date: "28 May 2025", time: "11:00 AM", venue: "JW Marriott, Pune", city: "Pune", price: "₹2,500", attendees: 45, capacity: 100 },
    { id: 3, name: "Fintech Leadership Summit", vertical: "Enterprise", date: "30 May 2025", time: "10:00 AM", venue: "Taj Lands End, Mumbai", city: "Mumbai", price: "₹5,000", attendees: 180, capacity: 250 },
    { id: 4, name: "Wine Tasting Evening", vertical: "Marketplace", date: "1 Jun 2025", time: "7:00 PM", venue: "SOHO House, Mumbai", city: "Mumbai", price: "₹3,000", attendees: 0, capacity: 50 },
    { id: 5, name: "Yoga & Wellness Retreat", vertical: "Connect", date: "5 Jun 2025", time: "8:00 AM", venue: "St. Regis, Goa", city: "Goa", price: "₹4,000", attendees: 0, capacity: 80 },
    { id: 6, name: "AI & Future of Work", vertical: "Enterprise", date: "10 Jun 2025", time: "9:30 AM", venue: "WeWork, BKC", city: "Mumbai", price: "₹3,500", attendees: 95, capacity: 150 },
  ]);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("userCity");
    if (saved) setSelectedCity(saved);
    
    const handleCityChange = () => {
      const newCity = localStorage.getItem("userCity");
      if (newCity) setSelectedCity(newCity);
    };
    window.addEventListener("cityChanged", handleCityChange);
    return () => window.removeEventListener("cityChanged", handleCityChange);
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesTab = activeTab === "all" || event.vertical.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = event.city === selectedCity;
    return matchesTab && matchesSearch && matchesCity;
  });

  const getVerticalColor = (vertical: string) => {
    switch(vertical) {
      case "Connect": return { bg: "#fef3c7", color: "#92400e", border: "#fde68a" };
      case "Marketplace": return { bg: "#e0e7ff", color: "#3730a3", border: "#c7d2fe" };
      case "Enterprise": return { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" };
      default: return { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" };
    }
  };

  if (!isClient) {
    return <div style={{ minHeight: "100vh", background: "#f8fafc" }}></div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "48px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>
            Discover Amazing <span style={{ color: "#f97316" }}>Events</span> Near You
          </h1>
          <p style={{ fontSize: "18px", color: "#64748b", maxWidth: "600px", margin: "0 auto" }}>
            Connect, learn, and grow with India's premier event platform
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "32px", flexWrap: "wrap" }}>
          {["all", "connect", "marketplace", "enterprise"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "10px 24px", borderRadius: "40px", border: "none", background: activeTab === tab ? "#f97316" : "white", color: activeTab === tab ? "white" : "#64748b", fontWeight: "500", cursor: "pointer" }}>
              {tab === "all" ? "All Events" : tab === "connect" ? "GCE Connect" : tab === "marketplace" ? "GCE Marketplace" : "GCE Enterprise"}
            </button>
          ))}
        </div>

        {filteredEvents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "20px" }}>
            <p style={{ color: "#94a3b8" }}>No events found in {selectedCity}. Try another city or search.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
            {filteredEvents.map((event) => {
              const colors = getVerticalColor(event.vertical);
              return (
                <div key={event.id} onClick={() => router.push(`/booking/${event.id}`)} style={{ background: "white", borderRadius: "20px", overflow: "hidden", border: `1px solid ${colors.border}`, cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}>
                  <div style={{ height: "160px", background: `linear-gradient(135deg, ${colors.color}20, ${colors.color}10)`, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: "48px" }}>🎉</span></div>
                  <div style={{ padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                      <span style={{ background: colors.bg, color: colors.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500" }}>{event.vertical}</span>
                      <Heart size={18} style={{ color: "#94a3b8", cursor: "pointer" }} />
                    </div>
                    <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px", color: "#0f172a" }}>{event.name}</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#64748b" }}><Calendar size={14} /> {event.date} at {event.time}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#64748b" }}><MapPin size={14} /> {event.venue}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#64748b" }}><Users size={14} /> {event.attendees} / {event.capacity} attending</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #eef2ff", paddingTop: "16px" }}>
                      <span style={{ fontSize: "22px", fontWeight: "700", color: "#f97316" }}>{event.price}</span>
                      <button onClick={(e) => { e.stopPropagation(); router.push(`/booking/${event.id}`); }} style={{ background: "#f97316", color: "white", padding: "8px 24px", borderRadius: "40px", border: "none", cursor: "pointer", fontWeight: "500" }}>Book Now</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
