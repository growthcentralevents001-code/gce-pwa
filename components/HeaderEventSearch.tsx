"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeaderEventSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
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

  // Search logic
  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, title, city, vertical")
        .ilike("title", `%${searchTerm}%`)
        .limit(8);

      if (error) console.error("Search error:", error);
      if (data && data.length > 0) {
        setResults(data);
        setShowDropdown(true);
      } else {
        setResults([]);
        setShowDropdown(true); // still show dropdown to display "no results"
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelect = (eventId: string) => {
    setShowDropdown(false);
    setSearchTerm("");
    router.push(`/events/${eventId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const term = searchTerm.trim();
      if (term.length >= 2) {
        // Use the current searchTerm, not any stale value
        router.push(`/events?search=${encodeURIComponent(term)}`);
        setShowDropdown(false);
        setSearchTerm(""); // optional: clear after redirect
      }
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search events..."
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

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border max-h-80 overflow-y-auto"
        >
          {results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No events found for "{searchTerm}"
            </div>
          ) : (
            results.map((event) => (
              <div
                key={event.id}
                onClick={() => handleSelect(event.id)}
                className="p-3 hover:bg-gray-50 border-b cursor-pointer transition"
              >
                <p className="font-medium text-sm">{event.title}</p>
                <p className="text-xs text-gray-500">
                  {event.city || "Online"} • {event.vertical || "Event"}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
