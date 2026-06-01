"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { User, LogOut, Settings, Heart, Calendar, Award } from "lucide-react";
import { useState, useEffect } from "react";

export default function HeaderWrapper() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState(user?.name || "");
  
  useEffect(() => {
    // Listen for profile updates
    const storedUser = localStorage.getItem("gce_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserName(parsed.name);
    }
  }, [user]);
  
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) {
    return null;
  }

  const displayName = userName || user?.name || "User";
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <header style={{ background: "white", borderBottom: "1px solid #eef2ff", position: "sticky", top: 0, zIndex: 40 }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <span style={{ fontSize: "24px", fontWeight: "bold", background: "linear-gradient(135deg, #f97316, #ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GCE</span>
          
        </Link>

        <div style={{ flex: 1, maxWidth: "400px", margin: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", background: "#f1f5f9", borderRadius: "48px", padding: "8px 16px", border: "1px solid #e2e8f0" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#94a3b8", marginRight: "8px" }}><circle cx="10.5" cy="10.5" r="7.5"/><line x1="21" y1="21" x2="15.8" y2="15.8"/></svg>
            <input type="text" placeholder="Search events, venues..." style={{ background: "transparent", border: "none", outline: "none", flex: 1, fontSize: "14px" }} />
          </div>
        </div>

        <div style={{ position: "relative" }}>
          {user ? (
            <div>
              <button onClick={() => setShowDropdown(!showDropdown)} style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f1f5f9", border: "none", padding: "6px 12px 6px 8px", borderRadius: "40px", cursor: "pointer" }}>
                <div style={{ width: "32px", height: "32px", background: "#f97316", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "600" }}>{firstLetter}</div>
                <span style={{ fontWeight: "500", fontSize: "14px" }}>{displayName.split(" ")[0]}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              
              {showDropdown && (
                <div style={{ position: "absolute", top: "48px", right: 0, background: "white", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", border: "1px solid #eef2ff", width: "220px", zIndex: 50 }}>
                  <div style={{ padding: "12px", borderBottom: "1px solid #eef2ff" }}>
                    <div style={{ fontWeight: "600" }}>{displayName}</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>{user.email}</div>
                  </div>
                  <div style={{ padding: "8px" }}>
                    <Link href="/profile" onClick={() => setShowDropdown(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "10px", textDecoration: "none", color: "#0f172a" }}><User size={16} /> My Profile</Link>
                    <Link href="/bookings" onClick={() => setShowDropdown(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "10px", textDecoration: "none", color: "#0f172a" }}><Calendar size={16} /> My Bookings</Link>
                    <Link href="/wishlist" onClick={() => setShowDropdown(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "10px", textDecoration: "none", color: "#0f172a" }}><Heart size={16} /> Saved Events</Link>
                    <Link href="/dashboard/member" onClick={() => setShowDropdown(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "10px", textDecoration: "none", color: "#0f172a" }}><Award size={16} /> My Dashboard</Link>
                    <Link href="/offers" onClick={() => setShowDropdown(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "10px", textDecoration: "none", color: "#0f172a" }}><Settings size={16} /> Offers</Link>
                    <button onClick={() => { logout(); setShowDropdown(false); window.location.href = "/"; }} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "10px", width: "100%", border: "none", background: "none", cursor: "pointer", color: "#ef4444", marginTop: "8px", borderTop: "1px solid #eef2ff", paddingTop: "12px" }}><LogOut size={16} /> Logout</button>
                  </div>
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
