"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Users, Building2, Award, ArrowRight } from "lucide-react";

export default function HeroBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div style={{
      background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #f97316 100%)",
      borderRadius: "24px",
      marginBottom: "40px",
      overflow: "hidden",
      position: "relative",
      boxShadow: "0 20px 35px -10px rgba(249,115,22,0.3)",
      transform: isVisible ? "translateY(0)" : "translateY(20px)",
      opacity: isVisible ? 1 : 0,
      transition: "all 0.5s ease"
    }}>
      {/* Background Pattern */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1%, transparent 1%)`,
        backgroundSize: "30px 30px",
        pointerEvents: "none"
      }} />
      
      <div style={{
        padding: "48px 40px",
        position: "relative",
        zIndex: 2
      }}>
        {/* Badge */}
        <div style={{
          display: "inline-block",
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(10px)",
          padding: "6px 16px",
          borderRadius: "40px",
          marginBottom: "24px",
          fontSize: "13px",
          fontWeight: "500",
          color: "white",
          letterSpacing: "0.5px"
        }}>
          ✨ India's Premier Event Platform
        </div>

        {/* Main Heading */}
        <h1 style={{
          fontSize: "48px",
          fontWeight: "800",
          color: "white",
          marginBottom: "16px",
          lineHeight: "1.2",
          maxWidth: "600px"
        }}>
          Discover, Connect & <br />
          <span style={{ borderBottom: "4px solid #ffd700", display: "inline-block" }}>
            Grow Together
          </span>
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: "18px",
          color: "rgba(255,255,255,0.9)",
          marginBottom: "32px",
          maxWidth: "500px",
          lineHeight: "1.5"
        }}>
          Join 10,000+ members and experience the best networking, 
          learning, and entertainment events near you.
        </p>

        {/* Stats */}
        <div style={{
          display: "flex",
          gap: "32px",
          flexWrap: "wrap",
          marginBottom: "32px"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <Users size={20} style={{ color: "#ffd700" }} />
              <span style={{ fontSize: "24px", fontWeight: "700", color: "white" }}>10,000+</span>
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>Active Members</div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <Calendar size={20} style={{ color: "#ffd700" }} />
              <span style={{ fontSize: "24px", fontWeight: "700", color: "white" }}>50+</span>
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>Events Monthly</div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <Building2 size={20} style={{ color: "#ffd700" }} />
              <span style={{ fontSize: "24px", fontWeight: "700", color: "white" }}>100+</span>
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>Partner Venues</div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <Award size={20} style={{ color: "#ffd700" }} />
              <span style={{ fontSize: "24px", fontWeight: "700", color: "white" }}>4.8★</span>
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>Member Rating</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/events" style={{
            background: "white",
            color: "#f97316",
            padding: "12px 28px",
            borderRadius: "40px",
            textDecoration: "none",
            fontWeight: "600",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            transition: "transform 0.2s"
          }}>
            Explore Events <ArrowRight size={16} />
          </Link>
          <Link href="/signup" style={{
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            color: "white",
            padding: "12px 28px",
            borderRadius: "40px",
            textDecoration: "none",
            fontWeight: "500",
            border: "1px solid rgba(255,255,255,0.3)"
          }}>
            Become a Member
          </Link>
        </div>
      </div>

      {/* Decorative Circle */}
      <div style={{
        position: "absolute",
        right: "-50px",
        top: "-50px",
        width: "250px",
        height: "250px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "50%",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        right: "100px",
        bottom: "-80px",
        width: "200px",
        height: "200px",
        background: "rgba(255,255,255,0.08)",
        borderRadius: "50%",
        pointerEvents: "none"
      }} />
    </div>
  );
}
