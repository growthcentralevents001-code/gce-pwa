"use client";

import { useState, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";

export default function CitySelector() {
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [showDropdown, setShowDropdown] = useState(false);
  const [cities, setCities] = useState<string[]>(["Mumbai", "Delhi", "Bangalore", "Pune", "Goa", "Amritsar", "Ludhiana", "Pathankot", "Chennai", "Kolkata"]);

  useEffect(() => {
    const savedCity = localStorage.getItem("selectedCity");
    if (savedCity) setSelectedCity(savedCity);
  }, []);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    localStorage.setItem("selectedCity", city);
    setShowDropdown(false);
    window.dispatchEvent(new Event("cityChanged"));
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "40px",
          padding: "8px 16px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500"
        }}
      >
        <MapPin size={14} style={{ color: "#f97316" }} />
        <span>{selectedCity}</span>
        <ChevronDown size={12} style={{ color: "#94a3b8" }} />
      </button>

      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "48px",
            left: 0,
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
            border: "1px solid #eef2ff",
            width: "180px",
            zIndex: 50,
            maxHeight: "250px",
            overflowY: "auto"
          }}
        >
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => handleCityChange(city)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                padding: "10px 16px",
                border: "none",
                background: selectedCity === city ? "#fef3c7" : "white",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <MapPin size={14} style={{ color: selectedCity === city ? "#f97316" : "#94a3b8" }} />
              <span style={{ fontWeight: selectedCity === city ? "500" : "normal" }}>{city}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
