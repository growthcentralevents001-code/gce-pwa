"use client";
import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Event {
  id: string;
  title: string;
  venue: string;
  city: string;
}

export default function SearchBar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Event[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchEvents() {
    const { data } = await supabase
      .from("events")
      .select("id, title, venue, city")
      .eq("status", "Live")
      .limit(50);
    if (data) setAllEvents(data);
  }

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = allEvents.filter(
      (e) =>
        e.title.toLowerCase().includes(term) ||
        e.venue.toLowerCase().includes(term) ||
        e.city?.toLowerCase().includes(term)
    );
    setSuggestions(filtered.slice(0, 8));
    setShowSuggestions(filtered.length > 0);
  }, [searchTerm, allEvents]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setShowSuggestions(false);
    if (query.trim()) {
      router.push(`/events?search=${encodeURIComponent(query)}`);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%", maxWidth: "500px" }}>
      <div style={{ position: "relative" }}>
        <Search
          style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94a3b8",
          }}
          size={20}
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search events by title, venue, or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length >= 2 && setShowSuggestions(suggestions.length > 0)}
          style={{
            width: "100%",
            padding: "14px 16px 14px 48px",
            border: "1px solid #e2e8f0",
            borderRadius: "48px",
            fontSize: "16px",
            outline: "none",
            backgroundColor: "white",
          }}
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
            marginTop: "8px",
            zIndex: 50,
            maxHeight: "320px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((event) => (
            <div
              key={event.id}
              onClick={() => handleSearch(event.title)}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                borderBottom: "1px solid #f1f5f9",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
            >
              <div style={{ fontWeight: 500 }}>{event.title}</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                {event.venue} • {event.city || "Online"}
              </div>
            </div>
          ))}
          <div
            onClick={() => handleSearch(searchTerm)}
            style={{
              padding: "10px 16px",
              cursor: "pointer",
              textAlign: "center",
              fontSize: "13px",
              color: "#f97316",
              fontWeight: 500,
              borderTop: "1px solid #e2e8f0",
            }}
          >
            See all results for "{searchTerm}"
          </div>
        </div>
      )}
    </div>
  );
}
