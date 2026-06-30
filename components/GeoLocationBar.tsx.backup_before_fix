"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MapPin, Loader2, ChevronDown } from "lucide-react";

interface GeoLocationBarProps {
  onCityChange: (city: string | null) => void;
  eventsCount: number;
}

export default function GeoLocationBar({ onCityChange, eventsCount }: GeoLocationBarProps) {
  const [userCity, setUserCity] = useState<string | null>("Amritsar"); // 🔥 Forcefully set
  const [locationLoading, setLocationLoading] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchCities();
    // 🔥 Forcefully call onCityChange with "Amritsar"
    onCityChange("Amritsar");
  }, []);

  const fetchCities = async () => {
    const { data } = await supabase.from("events").select("city");
    if (data) {
      const uniqueCities = [...new Set(data.map(e => e.city).filter(Boolean))];
      setCities(uniqueCities);
    }
  };

  const handleCitySelect = (city: string) => {
    setUserCity(city);
    onCityChange(city);
    setShowDropdown(false);
  };

  const clearCity = () => {
    setUserCity(null);
    onCityChange(null);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 px-3 py-1.5">
        <MapPin size={14} className="text-orange-500" />
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-gray-700">
            {userCity || "All Cities"}
          </span>
          <span className="text-[10px] text-gray-400">
            ({eventsCount} events)
          </span>
        </div>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="ml-1 text-gray-400 hover:text-gray-600"
        >
          <ChevronDown size={14} />
        </button>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="p-1">
            <button
              onClick={clearCity}
              className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:bg-orange-50 rounded"
            >
              All Cities
            </button>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => handleCitySelect(city)}
                className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-orange-50 rounded"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
