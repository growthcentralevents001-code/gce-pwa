"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Search, MapPin } from "lucide-react";

interface Venue {
  id: string;
  name: string;
  city: string;
  address: string;
  tier: string;
  venue_type: string;
  events_count?: number;
}

export default function VenuesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("search") || "";
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(urlQuery);

  useEffect(() => {
    fetchVenues();
  }, [urlQuery]);

  async function fetchVenues() {
    setLoading(true);
    try {
      let query = supabase.from("venues").select("*");
      if (urlQuery.trim() !== "") {
        query = query.or(`name.ilike.%${urlQuery}%,city.ilike.%${urlQuery}%`);
      }
      const { data, error } = await query.order("name");
      if (error) throw error;
      const venuesWithCounts = await Promise.all(
        (data || []).map(async (venue) => {
          const { count } = await supabase
            .from("events")
            .select("*", { count: "exact", head: true })
            .eq("venue_id", venue.id);
          return { ...venue, events_count: count || 0 };
        })
      );
      setVenues(venuesWithCounts);
    } catch (error) {
      console.error("Error fetching venues:", error);
      setVenues([]);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/venues?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      router.push("/venues");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading venues...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search venues by name or city..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 text-white text-sm px-3 py-1 rounded-full">
              Go
            </button>
          </div>
        </form>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {urlQuery ? `Venues matching "${urlQuery}"` : "All Venues"}
        </h1>
        <p className="text-gray-500">{venues.length} venue{venues.length !== 1 ? "s" : ""} found</p>
      </div>

      {venues.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No venues found for your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <div
              key={venue.id}
              onClick={() => router.push(`/venues/${venue.id}`)}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition border border-gray-100"
            >
              <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                <span className="text-4xl">🏢</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{venue.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <MapPin size={14} /> {venue.city}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{venue.tier || "Basic"}</span>
                  <span className="text-sm text-orange-600">{venue.events_count} events</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
