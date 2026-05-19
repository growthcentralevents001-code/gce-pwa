"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      gap: "16px", 
      flexWrap: isMobile ? "wrap" : "nowrap",
      padding: "16px 20px",
      background: "white",
      borderBottom: "1px solid #eef2ff"
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#f97316", margin: 0 }}>GCE</h1>
      </Link>

      {/* Search Bar - Wider now */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        alignItems: "center", 
        gap: "8px", 
        background: "#f8fafc", 
        border: "1px solid #e2e8f0", 
        borderRadius: "60px", 
        padding: "8px 16px", 
        maxWidth: isMobile ? "100%" : "500px" 
      }}>
        <span style={{ fontSize: "14px" }}>🔍</span>
        <input 
          type="text" 
          placeholder="Search events, venues, people..." 
          style={{ flex: 1, border: "none", outline: "none", fontSize: "14px", background: "transparent" }} 
        />
        <button style={{ background: "#f97316", color: "white", border: "none", borderRadius: "40px", padding: "6px 16px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
          Search
        </button>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button style={{ background: "white", border: "1px solid #ddd", borderRadius: "40px", padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}>📍 Mumbai</button>
        <button style={{ background: "white", border: "1px solid #ddd", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", position: "relative", fontSize: "14px" }}>
          🔔
          <span style={{ position: "absolute", top: "-4px", right: "-4px", background: "#f97316", color: "white", fontSize: "9px", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
        </button>
        <Link href="/login">
          <button style={{ background: "#f97316", color: "white", border: "none", borderRadius: "40px", padding: "8px 20px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Sign In</button>
        </Link>
      </div>
    </div>
  );
}
// CI test trigger
