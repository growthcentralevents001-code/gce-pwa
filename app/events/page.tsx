"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  price: number;
  registered: number;
  capacity: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => { fetchEvents(); }, []);

  async function fetchEvents() {
    const { data, error } = await supabase.from("events").select("*").eq("status", "Live").order("date", { ascending: true });
    if (!error && data) {
      const formatted: Event[] = data.map((event: any) => ({
        id: event.id,
        title: event.title,
        category: event.category || event.vertical || "Marketplace",
        date: new Date(event.date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }),
        time: event.time || "6:30 PM",
        venue: event.venue,
        city: event.city,
        price: event.price,
        registered: event.registered || 0,
        capacity: event.capacity,
      }));
      setEvents(formatted);
    }
    setLoading(false);
  }

  const filteredEvents = events.filter(event => activeTab === "all" || event.category?.toLowerCase() === activeTab.toLowerCase());

  const getCategoryStyle = (category: string) => {
    switch (category?.toLowerCase()) {
      case "connect": return { bg: "#fef3c7", color: "#92400e", border: "#fde68a" };
      case "marketplace": return { bg: "#e0e7ff", color: "#3730a3", border: "#c7d2fe" };
      case "enterprise": return { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" };
      default: return { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" };
    }
  };

  if (loading) return <div className="p-8 text-center">Loading events...</div>;

  return (
    <div className="min-h-screen bg-gray-50"><div className="w-full mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">All Events</h1>
      <div className="flex justify-center gap-3 mb-8 flex-wrap">
        {["all", "connect", "marketplace", "enterprise"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-full font-medium transition ${activeTab === tab ? "bg-orange-600 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"}`}>
            {tab === "all" ? "All Events" : tab === "connect" ? "GCE Connect" : tab === "marketplace" ? "GCE Marketplace" : "GCE Enterprise"}
          </button>
        ))}
      </div>
      {filteredEvents.length === 0 ? <div className="text-center py-12 bg-white rounded-xl shadow"><p className="text-gray-500">No events found in this category.</p></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => {
            const colors = getCategoryStyle(event.category);
            return (
              <Link key={event.id} href={`/booking/${event.id}`}>
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer">
                  <div className="h-40 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.color}20, ${colors.color}10)` }}><span className="text-5xl">🎉</span></div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2"><span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: colors.bg, color: colors.color }}>{event.category}</span></div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{event.title}</h3>
                    <div className="space-y-1 text-sm text-gray-600"><div>📅 {event.date} at {event.time}</div><div>📍 {event.venue}, {event.city}</div><div>👥 {event.registered} / {event.capacity} attending</div></div>
                    <div className="mt-4 flex justify-between items-center"><span className="text-2xl font-bold text-orange-600">₹{event.price}</span><button onClick={(e) => { e.stopPropagation(); window.location.href = `/booking/${event.id}`; }} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition">Book Now</button></div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div></div>
  );
}
