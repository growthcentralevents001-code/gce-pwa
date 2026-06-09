"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Search, X } from "lucide-react";
import Link from "next/link";

export default function EventSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
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
      setLoading(true);
      const { data } = await supabase
        .from("events")
        .select("id, title, city, vertical, venue:venues(name)")
        .ilike("title", `%${searchTerm}%`)
        .limit(10);
      
      if (data) {
        setResults(data);
        setShowDropdown(true);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelect = () => {
    setShowDropdown(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search events by name, city, or category..."
          className="w-full pl-12 pr-10 py-4 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length >= 2 && results.length > 0 && setShowDropdown(true)}
        />
        {searchTerm && (
          <button
            onClick={() => { setSearchTerm(""); setResults([]); setShowDropdown(false); }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div ref={dropdownRef} className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No events found for "{searchTerm}"</div>
          ) : (
            <div>
              {results.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  onClick={handleSelect}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 border-b last:border-0 transition"
                >
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.city || "Location TBD"} • {event.vertical || "Event"}</p>
                  </div>
                  <div className="text-sm text-gray-400">{event.venue?.name || "Venue TBD"}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
