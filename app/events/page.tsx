"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter } from "lucide-react";

const allEvents = [
  { id: "1", title: "Startup Founders Mixer", date: "24 May, 6:30 PM", venue: "The Leela, Mumbai", price: "₹399", going: 124, category: "BUSINESS", image: "🚀" },
  { id: "2", title: "Bollywood Night Party", date: "25 May, 9:00 PM", venue: "Juhu, Mumbai", price: "₹799", going: 89, category: "SOCIAL", image: "🎉" },
  { id: "3", title: "Brewery Tour Experience", date: "25 May, 9:00 PM", venue: "Andheri, Mumbai", price: "₹699", going: 56, category: "FOOD", image: "🍔" },
  { id: "4", title: "SaaS Growth Summit", date: "28 May, 10:00 AM", venue: "Jio World Centre", price: "₹1299", going: 234, category: "BUSINESS", image: "🎯" },
  { id: "5", title: "Stand-up Comedy Live", date: "25 May, 8:00 PM", venue: "Comedy Club, Mumbai", price: "₹499", going: 45, category: "ENTERTAINMENT", image: "🎭" },
  { id: "6", title: "Wellness & Yoga Session", date: "26 May, 7:00 AM", venue: "Juhu Beach, Mumbai", price: "₹299", going: 32, category: "WELLNESS", image: "🧘" },
  { id: "7", title: "Art & Wine Evening", date: "26 May, 6:00 PM", venue: "Bandra, Mumbai", price: "₹599", going: 28, category: "SOCIAL", image: "🎨" },
  { id: "8", title: "Live Music Night", date: "26 May, 9:00 PM", venue: "Lower Parel, Mumbai", price: "₹449", going: 56, category: "ENTERTAINMENT", image: "🎸" },
];

const categories = ["ALL", "BUSINESS", "SOCIAL", "FOOD", "ENTERTAINMENT", "WELLNESS"];

export default function EventsListingPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  let filteredEvents = allEvents.filter(event => {
    const matchesCategory = selectedCategory === "ALL" || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  filteredEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === "price_low") return parseInt(a.price.replace("₹", "")) - parseInt(b.price.replace("₹", ""));
    if (sortBy === "price_high") return parseInt(b.price.replace("₹", "")) - parseInt(a.price.replace("₹", ""));
    if (sortBy === "popularity") return b.going - a.going;
    return 0;
  });

  // FULL WIDTH - NO SIDE SPACE
  const containerStyle = {
    width: "100%",
    margin: "0",
    padding: isMobile ? "16px" : "24px",
    fontFamily: "'Inter', sans-serif",
    background: "white",
    minHeight: "100vh"
  };

  const innerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
    marginTop: "32px"
  };

  const cardStyle = {
    background: "white",
    borderRadius: "20px",
    overflow: "hidden",
    cursor: "pointer",
    border: "1px solid #eef2ff",
    transition: "transform 0.2s"
  };

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#f97316", margin: 0 }}>GCE</h1>
          </Link>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button style={{ background: "white", border: "1px solid #ddd", borderRadius: "40px", padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}>📍 Mumbai</button>
            <Link href="/login">
              <button style={{ background: "#f97316", color: "white", border: "none", borderRadius: "40px", padding: "8px 20px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Sign In</button>
            </Link>
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px" }}>All Events</h1>
        <p style={{ color: "#666", marginBottom: "24px" }}>Discover and book the best events in your city</p>

        {/* Search and Filter Bar */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", background: "white", border: "1px solid #e2e8f0", borderRadius: "60px", padding: "12px 20px" }}>
            <Search size={18} style={{ color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search events by title or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, border: "none", outline: "none", fontSize: "14px" }}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", border: "1px solid #e2e8f0", borderRadius: "40px", padding: "12px 20px", cursor: "pointer" }}
          >
            <Filter size={18} /> Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div style={{ background: "#f8fafc", borderRadius: "20px", padding: "20px", marginBottom: "24px" }}>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontWeight: "600", marginBottom: "12px" }}>Category</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      background: selectedCategory === cat ? "#f97316" : "white",
                      color: selectedCategory === cat ? "white" : "#333",
                      border: selectedCategory === cat ? "none" : "1px solid #e2e8f0",
                      borderRadius: "30px",
                      padding: "6px 16px",
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontWeight: "600", marginBottom: "12px" }}>Sort by</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[
                  { value: "date", label: "Date" },
                  { value: "price_low", label: "Price: Low to High" },
                  { value: "price_high", label: "Price: High to Low" },
                  { value: "popularity", label: "Popularity" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    style={{
                      background: sortBy === option.value ? "#f97316" : "white",
                      color: sortBy === option.value ? "white" : "#333",
                      border: sortBy === option.value ? "none" : "1px solid #e2e8f0",
                      borderRadius: "30px",
                      padding: "6px 16px",
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div style={{ marginBottom: "16px", fontSize: "14px", color: "#666" }}>
          Found {filteredEvents.length} events
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>No events found</h3>
            <p style={{ color: "#666" }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div style={gridStyle}>
            {filteredEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} style={{ textDecoration: "none" }}>
                <div style={cardStyle}>
                  <div style={{ height: "140px", background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", color: "white" }}>
                    {event.image}
                  </div>
                  <div style={{ padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ background: "#f1f5f9", padding: "4px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: "600" }}>{event.category}</span>
                      <span style={{ fontSize: "18px", cursor: "pointer" }}>♡</span>
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px", color: "#1a1a1a" }}>{event.title}</h3>
                    <p style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>📅 {event.date}</p>
                    <p style={{ fontSize: "12px", color: "#666", marginBottom: "12px" }}>📍 {event.venue}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #eef2ff", paddingTop: "12px" }}>
                      <span style={{ fontSize: "12px", color: "#666" }}>👥 {event.going} going</span>
                      <div>
                        <span style={{ fontSize: "18px", fontWeight: "700", color: "#f97316", marginRight: "8px" }}>{event.price}</span>
                        <button style={{ background: "#f97316", color: "white", border: "none", borderRadius: "30px", padding: "6px 14px", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}>Book</button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom Navigation - Mobile Only */}
        {isMobile && (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #eef2ff", padding: "12px 20px", marginTop: "40px" }}>
            <div style={{ display: "flex", justifyContent: "space-around", maxWidth: "500px", margin: "0 auto" }}>
              <Link href="/" style={{ textAlign: "center", textDecoration: "none" }}><div style={{ fontSize: "22px" }}>🏠</div><div style={{ fontSize: "10px", color: "#64748b" }}>Home</div></Link>
              <Link href="/events" style={{ textAlign: "center", textDecoration: "none", opacity: 1 }}><div style={{ fontSize: "22px" }}>🔍</div><div style={{ fontSize: "10px", color: "#f97316", fontWeight: "600" }}>Explore</div></Link>
              <Link href="/my-events" style={{ textAlign: "center", textDecoration: "none" }}><div style={{ fontSize: "22px" }}>📅</div><div style={{ fontSize: "10px", color: "#64748b" }}>My Events</div></Link>
              <Link href="/dashboard/user" style={{ textAlign: "center", textDecoration: "none" }}><div style={{ fontSize: "22px" }}>👤</div><div style={{ fontSize: "10px", color: "#64748b" }}>Profile</div></Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
