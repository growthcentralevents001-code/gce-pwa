"use client";
import GeoLocationBar from "@/components/GeoLocationBar";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeaderEventSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [userCity, setUserCity] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      // Search events
      const { data: events } = await supabase
        .from("events")
        .select("id, title, city, vertical")
        .ilike("title", `%${searchTerm}%`)
        .limit(5);

      // Search venues
      const { data: venues } = await supabase
        .from("venues")
        .select("id, name, city")
        .ilike("name", `%${searchTerm}%`)
        .limit(5);

      const combined = [
        ...(events || []).map(e => ({ id: e.id, displayName: e.title, city: e.city, category: e.vertical, type: "event" })),
        ...(venues || []).map(v => ({ id: v.id, displayName: v.name, city: v.city, category: "", type: "venue" }))
      ].slice(0, 10);

      if (combined.length > 0) {
        setResults(combined);
        setShowDropdown(true);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelect = (item: any) => {
    setShowDropdown(false);
    setSearchTerm("");
    if (item.type === "event") {
      router.push(`/events/${item.id}`);
    } else {
      router.push(`/venues/${item.id}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const term = searchTerm.trim();
      if (term.length >= 2) {
        router.push(`/events?search=${encodeURIComponent(term)}`);
        setShowDropdown(false);
        setSearchTerm("");
      }
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 w-full min-w-0">
        <GeoLocationBar onCityChange={setUserCity} eventsCount={0} />
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search events or venues..."
            className="w-full pl-10 pr-8 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <X size={14} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {showDropdown && results.length > 0 && (
        <div ref={dropdownRef} className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border max-h-80 overflow-y-auto">
          {results.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              onClick={() => handleSelect(item)}
              className="p-3 hover:bg-gray-50 border-b cursor-pointer transition"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{item.displayName}</p>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {item.type === "event" ? "Event" : "Venue"}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {item.city || "Online"} {item.category ? `• ${item.category}` : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
