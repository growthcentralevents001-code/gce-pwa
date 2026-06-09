"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Calendar, MapPin, Users, TrendingUp } from "lucide-react";

interface TrendingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  price: number;
  registered: number;
  capacity: number;
  image_url?: string;
  category: string;
}

export default function TrendingEvents() {
  const router = useRouter();
  const [events, setEvents] = useState<TrendingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingEvents();
  }, []);

  const fetchTrendingEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'Live')
      .order('registered', { ascending: false })
      .limit(6);

    if (!error && data) {
      const formatted = data.map((ev: any) => ({
        id: ev.id,
        title: ev.title,
        date: new Date(ev.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: ev.time || "6:30 PM",
        venue: ev.venue,
        city: ev.city,
        price: ev.price,
        registered: ev.registered || 0,
        capacity: ev.capacity,
        category: ev.category || ev.vertical,
        image_url: ev.image_url || null,
      }));
      setEvents(formatted);
    }
    setLoading(false);
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Loading trending events...</div>;
  }

  if (events.length === 0) {
    return null;
  }

  const getCategoryStyle = (category: string) => {
    switch(category?.toLowerCase()) {
      case "connect": return { bg: "#fef3c7", color: "#92400e", border: "#fde68a" };
      case "marketplace": return { bg: "#e0e7ff", color: "#3730a3", border: "#c7d2fe" };
      case "enterprise": return { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" };
      default: return { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" };
    }
  };

  return (
    <div style={{ marginTop: "48px", marginBottom: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <TrendingUp size={28} color="#f97316" />
        <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
          🔥 Trending Events
        </h2>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "24px"
      }}>
        {events.map((event) => {
          const style = getCategoryStyle(event.category);
          const bgGradient = event.image_url ? `url(${event.image_url})` : 
            `linear-gradient(135deg, ${style.color}40, ${style.color}20)`;
          
          return (
            <div
              key={event.id}
              onClick={() => router.push(`/booking/${event.id}`)}
              style={{
                background: "white",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                border: `1px solid ${style.border}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              }}
            >
              <div style={{
                height: "160px",
                background: bgGradient,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
              }}>
                {!event.image_url && (
                  <span style={{ fontSize: "56px", opacity: 0.8 }}>
                    {event.category === "Connect" ? "🤝" : 
                     event.category === "Marketplace" ? "🛒" : "🏢"}
                  </span>
                )}
                <div style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "#f97316",
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600"
                }}>
                  🔥 Trending
                </div>
              </div>

              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{
                    background: style.bg,
                    color: style.color,
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "600"
                  }}>
                    {event.category}
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#f97316" }}>
                    ₹{event.price}
                  </span>
                </div>

                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#0f172a",
                  marginBottom: "12px",
                  lineHeight: "1.3"
                }}>
                  {event.title}
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#64748b" }}>
                    <Calendar size={14} /> {event.date} at {event.time}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#64748b" }}>
                    <MapPin size={14} /> {event.venue}, {event.city}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#64748b" }}>
                    <Users size={14} /> {event.registered} / {event.capacity} attending
                  </div>
                </div>

                <div style={{
                  background: "#e2e8f0",
                  borderRadius: "20px",
                  height: "6px",
                  overflow: "hidden",
                  marginTop: "8px"
                }}>
                  <div style={{
                    width: `${(event.registered / event.capacity) * 100}%`,
                    background: "#f97316",
                    height: "100%",
                    borderRadius: "20px"
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
