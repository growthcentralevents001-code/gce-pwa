"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header style={{
      background: "white",
      borderBottom: "1px solid #eef2ff",
      position: "sticky",
      top: 0,
      zIndex: 50,
      width: "100%"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        padding: "12px 20px",
        maxWidth: "1400px",
        margin: "0 auto",
        flexWrap: "wrap"
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#f97316", margin: 0 }}>GCE</h1>
        </Link>

        {/* Location button */}
        <button style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "40px",
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "pointer",
          whiteSpace: "nowrap"
        }}>
          📍 Mumbai <span style={{ fontSize: "12px", color: "#94a3b8" }}>▼</span>
        </button>

        {/* Search bar */}
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "40px",
          padding: "10px 20px",
          minWidth: "200px"
        }}>
          <span style={{ fontSize: "16px", marginRight: "8px", color: "#94a3b8" }}>🔍</span>
          <input
            type="text"
            placeholder="Search events, venues, or people..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "14px",
              background: "transparent"
            }}
          />
        </div>

        {/* Login & Sign Up buttons */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link href="/login">
            <button style={{
              background: "white",
              border: "none",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              color: "#1f2937"
            }}>Log in</button>
          </Link>
          <Link href="/signup">
            <button style={{
              background: "#f97316",
              color: "white",
              border: "none",
              borderRadius: "40px",
              padding: "8px 20px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}>Sign up</button>
          </Link>
        </div>
      </div>
    </header>
  );
}
