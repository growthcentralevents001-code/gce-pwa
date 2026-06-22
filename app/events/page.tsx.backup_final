"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Search, Heart, SlidersHorizontal } from "lucide-react";
import FilterModal from "@/components/FilterModal";

interface Event {
  id: string;
  title: string;
  vertical: string;
  genre?: string;
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
  
  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    genres: searchParams.get("genres")?.split(",").filter(g => g) || [],
    sortBy: searchParams.get("sortBy") || "popularity",
  });

  // Fetch wishlist
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

  // Apply filters and fetch events
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams(searchParams.toString());
    if (newFilters.genres.length) params.set("genres", newFilters.genres.join(","));
    else params.delete("genres");
    if (newFilters.sortBy) params.set("sortBy", newFilters.sortBy);
    else params.delete("sortBy");
    router.replace(`/events?${params.toString()}`, { scroll: false });
    fetchEvents(newFilters);
  };

  async function fetchEvents(currentFilters = filters) {
    setLoading(true);
    let query = supabase.from("events").select("*").eq("status", "Live");

    // Search filter
    if (urlQuery.trim() !== "") {
      query = query.or(`title.ilike.%${urlQuery}%,venue.ilike.%${urlQuery}%,city.ilike.%${urlQuery}%`);
    }

    // Genre filter
    if (currentFilters.genres.length) {
      query = query.ilike("genre", currentFilters.genres.map(g => g.toLowerCase()).join(","));
    }

    // Sorting
    switch (currentFilters.sortBy) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "date":
        query = query.order("date", { ascending: true });
        break;
      default:
        query = query.order("registered", { ascending: false });
    }

    const { data, error } = await query.order("date", { ascending: true });

    if (!error && data) {
      const formatted: Event[] = data.map((ev: any) => ({
        id: ev.id,
        title: ev.title,
        vertical: (ev.vertical || ev.category || "Marketplace").toLowerCase(),
        genre: ev.genre || "",
        date: new Date(ev.date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }),
        time: ev.time || "6:30 PM",
        venue: ev.venue,
        city: ev.city,
        price: ev.price,
        registered: ev.registered || 0,
        capacity: ev.capacity,
      }));
      setEvents(formatted);
    } else {
      setEvents([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchEvents(filters);
  }, [urlQuery]);

  const filteredEvents = events.filter(event => activeTab === "all" || event.vertical === activeTab);
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
    if (searchInput.trim()) {
      router.push(`/events?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      router.push("/events");
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Loading events...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with Filter Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{urlQuery ? `Search results for "${urlQuery}"` : "All Events"}</h1>
          <p className="text-gray-500">{filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found</p>
        </div>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition"
        >
          <SlidersHorizontal size={18} />
          Filters
          {(filters.genres.length > 0 || filters.sortBy !== "popularity") && (
            <span className="ml-1 w-2 h-2 bg-orange-600 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b pb-2">
        {["all", "connect", "marketplace", "enterprise"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab === "all" ? "All Events" : tab === "connect" ? "GCE Connect" : tab === "marketplace" ? "GCE Marketplace" : "GCE Enterprise"}
          </button>
        ))}
      </div>

      {/* Events grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No events found for your search or filter.</p>
          <button
            onClick={() => {
              setSearchInput("");
              router.push("/events");
            }}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
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
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ background: style.bg, color: style.color }}
                      >
                        {event.vertical === "connect" ? "GCE Connect" : event.vertical === "marketplace" ? "GCE Marketplace" : "GCE Enterprise"}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>📅 {event.date} at {event.time}</div>
                      <div>📍 {event.venue}, {event.city}</div>
                      <div>👥 {event.registered} / {event.capacity} attending</div>
                      {event.genre && <div>🎭 {event.genre}</div>}
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

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={applyFilters}
        currentFilters={filters}
      />
    </div>
  );
}
