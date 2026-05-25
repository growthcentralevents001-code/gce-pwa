"use client";

import { useState, useEffect } from "react";
import { MapPin, ChevronDown, Navigation, X } from "lucide-react";

export default function LocationBar() {
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [locationError, setLocationError] = useState("");

  const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Goa", "Chennai", "Kolkata", "Hyderabad"];

  useEffect(() => {
    const savedCity = localStorage.getItem("userCity");
    if (savedCity && cities.includes(savedCity)) {
      setSelectedCity(savedCity);
    }
  }, []);

  const detectLocation = () => {
    setIsDetecting(true);
    setLocationError("");
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Reverse geocoding using free OpenStreetMap Nominatim API (no key required)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
          );
          const data = await response.json();
          
          let detectedCity = "";
          if (data.address.city) detectedCity = data.address.city;
          else if (data.address.town) detectedCity = data.address.town;
          else if (data.address.village) detectedCity = data.address.village;
          else if (data.address.state_district) detectedCity = data.address.state_district;
          
          // Map to our city list
          const cityMap: Record<string, string> = {
            "Mumbai": "Mumbai", "Mumbai Suburban": "Mumbai",
            "Delhi": "Delhi", "New Delhi": "Delhi",
            "Bangalore": "Bangalore", "Bengaluru": "Bangalore",
            "Pune": "Pune",
            "Goa": "Goa", "North Goa": "Goa", "South Goa": "Goa",
            "Chennai": "Chennai",
            "Kolkata": "Kolkata",
            "Hyderabad": "Hyderabad"
          };
          
          let matchedCity = cityMap[detectedCity];
          if (!matchedCity && cities.includes(detectedCity)) matchedCity = detectedCity;
          if (!matchedCity) matchedCity = "Mumbai";
          
          setSelectedCity(matchedCity);
          localStorage.setItem("userCity", matchedCity);
          window.dispatchEvent(new Event("cityChanged"));
          setShowDropdown(false);
        } catch (err) {
          setLocationError("Could not detect city");
        }
        setIsDetecting(false);
      },
      (error) => {
        let message = "Location access denied";
        if (error.code === 1) message = "Please allow location access";
        else if (error.code === 2) message = "Location unavailable";
        else if (error.code === 3) message = "Location request timeout";
        setLocationError(message);
        setIsDetecting(false);
        setTimeout(() => setLocationError(""), 3000);
      }
    );
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    localStorage.setItem("userCity", city);
    window.dispatchEvent(new Event("cityChanged"));
    setShowDropdown(false);
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
            width: "260px",
            zIndex: 50,
            overflow: "hidden"
          }}
        >
          <button
            onClick={detectLocation}
            disabled={isDetecting}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              padding: "12px 16px",
              border: "none",
              borderBottom: "1px solid #eef2ff",
              background: "#f8fafc",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            <Navigation size={16} style={{ color: "#f97316" }} />
            {isDetecting ? "Detecting..." : "Detect my current location"}
          </button>
          
          {locationError && (
            <div style={{ padding: "8px 16px", fontSize: "12px", color: "#ef4444", background: "#fee2e2" }}>
              {locationError}
            </div>
          )}
          
          <div style={{ maxHeight: "250px", overflowY: "auto", padding: "8px 0" }}>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => handleCitySelect(city)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "10px 16px",
                  border: "none",
                  background: selectedCity === city ? "#fef3c7" : "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  textAlign: "left"
                }}
              >
                <MapPin size={14} style={{ color: selectedCity === city ? "#f97316" : "#94a3b8" }} />
                <span style={{ fontWeight: selectedCity === city ? "500" : "normal" }}>{city}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
