"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';
import { Search, X } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HeaderEventSearch() {
  const [searchTerm, setSearchTerm] = useState("");
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
      const { data, error } = await supabase
        .from('events')
        .select('id, title, city, vertical')
        .ilike('title', `%${searchTerm}%`)
        .limit(8);
      
      console.log("Search results:", data); // Debug log
      
      if (data && data.length > 0) {
        setResults(data);
        setShowDropdown(true);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search events..."
          className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {showDropdown && results.length > 0 && (
        <div ref={dropdownRef} className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border max-h-80 overflow-y-auto">
          {results.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              onClick={() => { setShowDropdown(false); setSearchTerm(""); }}
              className="block p-3 hover:bg-gray-50 border-b last:border-0"
            >
              <p className="font-medium text-sm">{event.title}</p>
              <p className="text-xs text-gray-500">{event.city || 'Anywhere'} • {event.vertical || 'Event'}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
