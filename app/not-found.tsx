"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, Search, ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: "500px", width: "100%", background: "white", borderRadius: "32px", padding: "48px 40px", textAlign: "center", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
        
        {/* 404 Animation */}
        <div style={{ marginBottom: "24px" }}>
          <span style={{ fontSize: "80px", fontWeight: "800", color: "#f97316", display: "inline-block", animation: "pulse 2s infinite" }}>404</span>
        </div>

        {/* Icon */}
        <div style={{ width: "80px", height: "80px", background: "#fef3c7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Compass size={40} style={{ color: "#f97316" }} />
        </div>

        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>Page Not Found</h1>
        <p style={{ color: "#64748b", marginBottom: "32px", lineHeight: "1.6" }}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button 
            onClick={() => router.push("/")}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", background: "#f97316", color: "white", border: "none", padding: "14px", borderRadius: "40px", cursor: "pointer", fontWeight: "500", fontSize: "16px" }}
          >
            <Home size={18} /> Back to Home
          </button>
          
          <button 
            onClick={() => router.back()}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", background: "white", color: "#64748b", border: "1px solid #e2e8f0", padding: "14px", borderRadius: "40px", cursor: "pointer", fontWeight: "500", fontSize: "16px" }}
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #eef2ff" }}>
          <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "12px" }}>Try these helpful links:</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "#f97316", textDecoration: "none", fontSize: "14px" }}>Home</Link>
            <Link href="/events" style={{ color: "#f97316", textDecoration: "none", fontSize: "14px" }}>Events</Link>
            <Link href="/offers" style={{ color: "#f97316", textDecoration: "none", fontSize: "14px" }}>Offers</Link>
            <Link href="/contact" style={{ color: "#f97316", textDecoration: "none", fontSize: "14px" }}>Contact</Link>
          </div>
        </div>

        {/* Search Box */}
        <div style={{ marginTop: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "40px", padding: "10px 16px", background: "#f8fafc" }}>
            <Search size={18} style={{ color: "#94a3b8", marginRight: "8px" }} />
            <input 
              type="text" 
              placeholder="Search events..." 
              onKeyPress={(e) => {
                if (e.key === "Enter" && e.currentTarget.value) {
                  router.push(`/?search=${encodeURIComponent(e.currentTarget.value)}`);
                }
              }}
              style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "14px" }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
