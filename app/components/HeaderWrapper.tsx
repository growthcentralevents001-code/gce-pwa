"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { User, LogOut, Heart, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function HeaderWrapper() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    // Clear any local storage
    localStorage.removeItem("gce_user");
    window.location.href = "/";
  }

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) {
    return null;
  }

  if (loading) {
    return (
      <header style={{ background: "white", borderBottom: "1px solid #eef2ff", padding: "16px 24px" }}>
        <div>Loading...</div>
      </header>
    );
  }

  const firstLetter = user?.email?.charAt(0).toUpperCase() || "U";
  const displayName = user?.email?.split('@')[0] || "User";

  return (
    <header style={{ background: "white", borderBottom: "1px solid #eef2ff", position: "sticky", top: 0, zIndex: 40 }}>
      <div style={{ maxWidth: "100%", margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <span style={{ fontSize: "24px", fontWeight: "bold", background: "linear-gradient(135deg, #f97316, #ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GCE</span>
        </Link>

        <div style={{ flex: 1, maxWidth: "400px", margin: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", background: "#f1f5f9", borderRadius: "48px", padding: "8px 16px", border: "1px solid #e2e8f0" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#94a3b8", marginRight: "8px" }}><circle cx="10.5" cy="10.5" r="7.5"/><line x1="21" y1="21" x2="15.8" y2="15.8"/></svg>
            <input type="text" placeholder="Search events, venues..." style={{ background: "transparent", border: "none", outline: "none", flex: 1, fontSize: "14px" }} />
          </div>
        </div>

        <div style={{ position: "relative" }}>
          {user ? (
            <div>
              <button onClick={() => setShowDropdown(!showDropdown)} style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f1f5f9", border: "none", padding: "6px 12px 6px 8px", borderRadius: "40px", cursor: "pointer" }}>
                <div style={{ width: "32px", height: "32px", background: "#f97316", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "600" }}>{firstLetter}</div>
                <span style={{ fontSize: "14px", fontWeight: "500" }}>{displayName}</span>
              </button>
              {showDropdown && (
                <div style={{ position: "absolute", top: "48px", right: 0, background: "white", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", border: "1px solid #eef2ff", minWidth: "180px", zIndex: 50 }}>
                  <Link href="/dashboard/member" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", textDecoration: "none", color: "#334155", borderBottom: "1px solid #eef2ff" }}><User size={16} /> Dashboard</Link>
                  <Link href="/bookings" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", textDecoration: "none", color: "#334155", borderBottom: "1px solid #eef2ff" }}><Calendar size={16} /> My Bookings</Link>
                  <Link href="/wishlist" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", textDecoration: "none", color: "#334155", borderBottom: "1px solid #eef2ff" }}><Heart size={16} /> Wishlist</Link>
                  <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", color: "#334155", borderTop: "1px solid #eef2ff" }}><LogOut size={16} /> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "12px" }}>
              <Link href="/login" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "white", border: "1px solid #e2e8f0", borderRadius: "40px", textDecoration: "none", color: "#64748b" }}>Login</Link>
              <Link href="/signup" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "#f97316", border: "none", borderRadius: "40px", textDecoration: "none", color: "white", fontWeight: "500" }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
