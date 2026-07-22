"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Heart } from "lucide-react";
import GeoLocationBar from "@/components/GeoLocationBar";
import { citiesMatch } from "@/lib/cityUtils";
import HeroBanner from "@/app/components/HeroBanner";

interface HomeEvent {
  id: string;
  title: string;
  vertical: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  price: number;
  registered: number;
  capacity: number;
}

export default function HomePage() {
  const [events, setEvents] = useState<HomeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [userCity, setUserCity] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const categories = [
    { name: "Music", value: "music" },
    { name: "Sports", value: "sports" },
    { name: "Food & Drinks", value: "food" },
    { name: "Open Mics", value: "openmic" },
  ];

  async function fetchEvents() {
    setLoading(true);
    setFetchError(null);
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "Live")
        .order("date", { ascending: true });
      if (error) throw error;
      const formatted = (data || []).map((ev: any) => ({
        id: ev.id,
        title: ev.title,
        vertical: (ev.vertical || ev.category || "Marketplace").toLowerCase(),
        date: new Date(ev.date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }),
        time: ev.time || "6:30 PM",
        venue: ev.venue,
        city: ev.city,
        price: ev.price,
        registered: ev.registered || 0,
        capacity: ev.capacity,
      }));
      setEvents(formatted);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
      setFetchError("Unable to load events right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchWishlist() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("saved_events").select("event_id").eq("user_id", user.id);
    if (data) setWishlistIds(new Set(data.map((item: any) => item.event_id)));
  }

  useEffect(() => {
    fetchEvents();
    fetchWishlist();

    const savedCity = localStorage.getItem("userCity");
    if (savedCity) setUserCity(savedCity);

    const handleCityChange = (event: globalThis.Event) => {
      const customEvent = event as CustomEvent<string | null>;
      setUserCity(customEvent.detail ?? null);
    };
    window.addEventListener("gce:city-change", handleCityChange);
    return () => window.removeEventListener("gce:city-change", handleCityChange);
  }, []);

  async function toggleWishlist(eventId: string, e: React.MouseEvent) {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("Please login"); return; }
    const isIn = wishlistIds.has(eventId);
    if (isIn) {
      const { error } = await supabase.from("saved_events").delete().eq("user_id", user.id).eq("event_id", eventId);
      if (!error) {
        setWishlistIds(prev => { const s = new Set(prev); s.delete(eventId); return s; });
        alert("Removed");
      } else alert("Delete error: " + error.message);
    } else {
      const { error } = await supabase.from("saved_events").insert({ user_id: user.id, event_id: eventId });
      if (!error) {
        setWishlistIds(prev => new Set(prev).add(eventId));
        alert("Added");
      } else alert("Insert error: " + error.message);
    }
  }

  const filteredEvents = events.filter((event) => {
    if (activeTab !== "all" && event.vertical !== activeTab) {
      return false;
    }
    if (userCity && !citiesMatch(event.city, userCity)) {
      return false;
    }
    return true;
  });
  const getVerticalStyle = (vertical: string) => {
    switch (vertical) {
      case "connect": return { bg: "#fef3c7", color: "#92400e" };
      case "marketplace": return { bg: "#e0e7ff", color: "#3730a3" };
      case "enterprise": return { bg: "#dcfce7", color: "#166534" };
      default: return { bg: "#f1f5f9", color: "#475569" };
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Explore Events</h1>
          <p className="text-gray-500">Loading events...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md h-64 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroBanner />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {fetchError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {fetchError}
          </div>
        )}

        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <GeoLocationBar onCityChange={setUserCity} eventsCount={filteredEvents.length} />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={`/events?category=${cat.value}`}
                className="px-6 py-3 bg-orange-600 text-white rounded-full text-sm font-medium hover:bg-orange-700 transition shadow-md cursor-pointer"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b pb-2">
          {["all", "connect", "marketplace", "enterprise"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${activeTab === tab ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              {tab === "all" ? "All Events" : tab === "connect" ? "GCE Connect" : tab === "marketplace" ? "GCE Marketplace" : "GCE Enterprise"}
            </button>
          ))}
        </div>

        {/* Events grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p>{userCity ? `No events found in ${userCity}.` : "No events found."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => {
              const style = getVerticalStyle(event.vertical);
              const isWishlisted = wishlistIds.has(event.id);
              return (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition">
                    <div className="h-40 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                      <span className="text-5xl">🎉</span>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{event.title}</h3>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: style.bg, color: style.color }}>
                          {event.vertical === "connect" ? "GCE Connect" : event.vertical === "marketplace" ? "GCE Marketplace" : "GCE Enterprise"}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>📅 {event.date} at {event.time}</div>
                        <div>📍 {event.venue}, {event.city}</div>
                        <div>👥 {event.registered} / {event.capacity} attending</div>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-bold text-orange-600">₹{event.price}</span>
                          <button onClick={(e) => toggleWishlist(event.id, e)} className="focus:outline-none cursor-pointer">
                            <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"}`} />
                          </button>
                        </div>
                        <span className="px-3 py-1 bg-orange-600 text-white text-sm rounded-full">View Details</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
