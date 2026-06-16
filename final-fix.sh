#!/bin/bash
echo "🔧 Fixing vertical filter and wishlist..."

# 1. Fix Events Page (Vertical filter + Wishlist toggle)
cat > app/events/page.tsx << 'EVENTSCODE'
"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Search, Heart } from "lucide-react";

interface Event {
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

export default function EventsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("search") || "";
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchInput, setSearchInput] = useState(urlQuery);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  useEffect(() => { fetchWishlist(); }, []);

  async function fetchWishlist() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("saved_events").select("event_id").eq("user_id", user.id);
    if (data) setWishlistIds(new Set(data.map((item: any) => item.event_id)));
  }

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

  useEffect(() => { fetchEvents(); }, [urlQuery]);

  async function fetchEvents() {
    setLoading(true);
    let query = supabase.from("events").select("*").eq("status", "Live");
    if (urlQuery.trim()) {
      query = query.or(`title.ilike.%${urlQuery}%,venue.ilike.%${urlQuery}%,city.ilike.%${urlQuery}%`);
    }
    const { data, error } = await query.order("date", { ascending: true });
    if (!error && data) {
      const formatted = data.map((ev: any) => ({
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
    } else setEvents([]);
    setLoading(false);
  }

  const filteredEvents = events.filter(event => {
    if (activeTab === "all") return true;
    return event.vertical === activeTab;
  });

  const getVerticalStyle = (vertical: string) => {
    switch (vertical) {
      case "connect": return { bg: "#fef3c7", color: "#92400e" };
      case "marketplace": return { bg: "#e0e7ff", color: "#3730a3" };
      case "enterprise": return { bg: "#dcfce7", color: "#166534" };
      default: return { bg: "#f1f5f9", color: "#475569" };
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(searchInput.trim() ? `/events?search=${encodeURIComponent(searchInput.trim())}` : "/events");
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Loading events...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{urlQuery ? `Search results for "${urlQuery}"` : "All Events"}</h1>
        <p>{filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-6 border-b pb-2">
        {["all", "connect", "marketplace", "enterprise"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab===tab?"bg-orange-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
            {tab==="all"?"All Events":tab==="connect"?"GCE Connect":tab==="marketplace"?"GCE Marketplace":"GCE Enterprise"}
          </button>
        ))}
      </div>
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12"><p>No events found.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => {
            const style = getVerticalStyle(event.vertical);
            const isWishlisted = wishlistIds.has(event.id);
            return (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition">
                  <div className="h-40 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center"><span className="text-5xl">🎉</span></div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full" style={{background:style.bg,color:style.color}}>
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
                        <button onClick={(e) => toggleWishlist(event.id, e)} className="focus:outline-none">
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
  );
}
EVENTSCODE

# 2. Fix Wishlist Page (proper fetch from saved_events)
cat > app/wishlist/page.tsx << 'WISHLISTCODE'
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchWishlist(); }, []);

  async function fetchWishlist() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: saved, error } = await supabase.from("saved_events").select("event_id").eq("user_id", user.id);
    if (error || !saved || saved.length === 0) { setEvents([]); setLoading(false); return; }
    const eventIds = saved.map(s => s.event_id);
    const { data: eventDetails } = await supabase.from("events").select("*").in("id", eventIds);
    setEvents(eventDetails || []);
    setLoading(false);
  }

  async function removeFromWishlist(eventId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("saved_events").delete().eq("user_id", user.id).eq("event_id", eventId);
    setEvents(prev => prev.filter(e => e.id !== eventId));
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Saved Events</h1>
      {events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No saved events yet.</p>
          <Link href="/events" className="mt-4 inline-block bg-orange-600 text-white px-4 py-2 rounded-lg">Browse Events</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden relative">
              <button onClick={() => removeFromWishlist(event.id)} className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-md z-10">
                <Heart size={18} className="fill-red-500 text-red-500" />
              </button>
              <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center"><span className="text-4xl">🎉</span></div>
              <div className="p-4">
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                <p className="text-sm text-gray-600">{event.venue}, {event.city}</p>
                <p className="text-orange-600 font-bold mt-2">₹{event.price}</p>
                <Link href={`/events/${event.id}`} className="mt-2 inline-block bg-orange-600 text-white px-3 py-1 rounded-full text-sm">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
WISHLISTCODE

# 3. Ensure database table and RLS (run in Supabase SQL later)
echo "✅ Files updated. Now rebuilding..."
rm -rf .next
npm run build
pm2 restart gce-dev
pm2 save
echo "🎉 Done! Hard refresh browser (Ctrl+Shift+R) and test:"
echo "   - Tabs should filter events by vertical"
echo "   - Heart icon adds/removes from wishlist"
echo "   - /wishlist shows saved events"
