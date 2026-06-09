"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import HeaderEventSearch from "@/components/HeaderEventSearch";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="text-2xl font-bold text-orange-600 shrink-0">GCE</Link>
        <div className="flex-1 max-w-md">
          <HeaderEventSearch />
        </div>
        <nav className="flex items-center gap-4 shrink-0">
          <Link href="/events" className="text-gray-600 hover:text-orange-600">Events</Link>
          <Link href="/venues" className="text-gray-600 hover:text-orange-600">Venues</Link>
          {user ? (
            <div className="relative" ref={dropdownRef}>
              {/* Avatar only – click to open dropdown */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold hover:bg-orange-200 focus:outline-none"
              >
                {firstLetter}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    👤 Profile
                  </Link>
                  <Link
                    href="/dashboard/member"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    📊 Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    ⚙️ Settings
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-orange-600">Login</Link>
              <Link href="/signup" className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
