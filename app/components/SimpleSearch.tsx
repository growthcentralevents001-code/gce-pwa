"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SimpleSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchEvents = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const { data } = await supabase
      .from("events")
      .select("id, title, city, venue")
      .ilike("title", `%${searchQuery}%`)
      .limit(8);
    setResults(data || []);
    setShowDropdown(data && data.length > 0);
  };

  const handleSelect = (eventId: string, title: string) => {
    setQuery(title);
    setShowDropdown(false);
    router.push(`/events/${eventId}`);
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
      <input
        type="text"
        placeholder="Search events..."
        className="w-full px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          searchEvents(e.target.value);
        }}
      />
      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {results.map((event: any) => (
            <div
              key={event.id}
              onClick={() => handleSelect(event.id, event.title)}
              className="p-2 hover:bg-gray-100 cursor-pointer border-b"
            >
              <div className="font-medium">{event.title}</div>
              <div className="text-xs text-gray-500">{event.city || "Online"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
