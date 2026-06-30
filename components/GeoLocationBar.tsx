"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MapPin, Loader2, ChevronDown, Navigation } from "lucide-react";

interface GeoLocationBarProps {
  onCityChange: (city: string | null) => void;
  eventsCount: number;
}

const CITY_ALIASES: Record<string, string> = {
  amritsar: "asr",
  ludhiana: "ludhiana",
  chandigarh: "chandigarh",
  mumbai: "mumbai",
  bombay: "mumbai",
  delhi: "delhi",
  "new delhi": "delhi",
  bangalore: "bangalore",
  bengaluru: "bangalore",
  pune: "pune",
  batala: "batala",
  bathinda: "bathinda",
  goa: "goa",
  chennai: "chennai",
  kolkata: "kolkata",
  hyderabad: "hyderabad",
};

const CITY_DISPLAY_NAMES: Record<string, string> = {
  asr: "Amritsar",
  ludhiana: "Ludhiana",
  chandigarh: "Chandigarh",
  mumbai: "Mumbai",
  delhi: "Delhi",
  bangalore: "Bangalore",
  pune: "Pune",
  batala: "Batala",
  bathinda: "Bathinda",
  goa: "Goa",
  chennai: "Chennai",
  kolkata: "Kolkata",
  hyderabad: "Hyderabad",
};

function formatCityLabel(city: string): string {
  const key = city.trim().toLowerCase();
  return CITY_DISPLAY_NAMES[key] || city.charAt(0).toUpperCase() + city.slice(1);
}

function matchToDatabaseCity(detected: string, dbCities: string[]): string {
  const lower = detected.trim().toLowerCase();
  const alias = CITY_ALIASES[lower] || lower;

  const exact = dbCities.find((c) => c.trim().toLowerCase() === alias);
  if (exact) return exact;

  const partial = dbCities.find((c) => {
    const db = c.trim().toLowerCase();
    return db === alias || db.includes(alias) || alias.includes(db);
  });
  if (partial) return partial;

  return alias;
}

export default function GeoLocationBar({ onCityChange, eventsCount }: GeoLocationBarProps) {
  const [displayLabel, setDisplayLabel] = useState<string | null>(null);
  const [filterCity, setFilterCity] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [cities, setCities] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [citiesLoaded, setCitiesLoaded] = useState(false);

  const applyCity = useCallback(
    (detectedName: string, dbCities: string[]) => {
      const matched = matchToDatabaseCity(detectedName, dbCities);
      const label = formatCityLabel(detectedName);
      setDisplayLabel(label);
      setFilterCity(matched);
      onCityChange(matched);
      localStorage.setItem("userCity", matched);
      localStorage.setItem("userCityLabel", label);
    },
    [onCityChange]
  );

  const fetchCities = useCallback(async () => {
    const { data } = await supabase.from("events").select("city");
    const uniqueCities = data
      ? Array.from(new Set(data.map((e) => e.city).filter(Boolean) as string[]))
      : [];
    setCities(uniqueCities);
    setCitiesLoaded(true);
    return uniqueCities;
  }, []);

  const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      const data = await res.json();
      return data.city || data.locality || data.principalSubdivision || null;
    } catch {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`
        );
        const data = await res.json();
        return (
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.state_district ||
          null
        );
      } catch {
        return null;
      }
    }
  };

  const detectLocation = useCallback(
    async (dbCities: string[]) => {
      setLocationLoading(true);

      const finish = (name: string | null) => {
        if (name) {
          applyCity(name, dbCities);
        } else {
          setDisplayLabel(null);
          setFilterCity(null);
          onCityChange(null);
        }
        setLocationLoading(false);
      };

      if (!navigator.geolocation) {
        await fallbackToIP(dbCities, finish);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const city = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude
          );
          if (city) {
            finish(city);
          } else {
            await fallbackToIP(dbCities, finish);
          }
        },
        async () => {
          await fallbackToIP(dbCities, finish);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    },
    [applyCity, onCityChange]
  );

  const fallbackToIP = async (
    dbCities: string[],
    finish: (name: string | null) => void
  ) => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      finish(data.city || null);
    } catch {
      finish(null);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const dbCities = await fetchCities();
      if (cancelled) return;

      const savedCity = localStorage.getItem("userCity");
      const savedLabel = localStorage.getItem("userCityLabel");

      if (savedCity) {
        setDisplayLabel(savedLabel || formatCityLabel(savedCity));
        setFilterCity(savedCity);
        onCityChange(savedCity);
        setLocationLoading(false);
        return;
      }

      await detectLocation(dbCities);
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [fetchCities, detectLocation, onCityChange]);

  const handleCitySelect = (city: string) => {
    setDisplayLabel(formatCityLabel(city));
    setFilterCity(city);
    onCityChange(city);
    localStorage.setItem("userCity", city);
    localStorage.setItem("userCityLabel", formatCityLabel(city));
    setShowDropdown(false);
  };

  const clearCity = () => {
    setDisplayLabel(null);
    setFilterCity(null);
    onCityChange(null);
    localStorage.removeItem("userCity");
    localStorage.removeItem("userCityLabel");
    setShowDropdown(false);
  };

  const handleRedetect = async () => {
    localStorage.removeItem("userCity");
    localStorage.removeItem("userCityLabel");
    const dbCities = cities.length > 0 ? cities : await fetchCities();
    await detectLocation(dbCities);
    setShowDropdown(false);
  };

  return (
    <div className="relative shrink-0">
      <div className="flex items-center gap-2 bg-white rounded-full shadow-sm border border-gray-200 px-3 py-1.5 whitespace-nowrap">
        <MapPin size={14} className="text-orange-500 shrink-0" />
        {locationLoading ? (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Loader2 size={12} className="animate-spin" />
            <span>Detecting...</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-700 max-w-[100px] sm:max-w-[140px] truncate">
              {displayLabel || "All Cities"}
            </span>
            {eventsCount > 0 && (
              <span className="text-[10px] text-gray-400 hidden sm:inline">
                ({eventsCount} events)
              </span>
            )}
          </div>
        )}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="ml-0.5 text-gray-400 hover:text-gray-600 shrink-0"
          aria-label="Change location"
        >
          <ChevronDown size={14} />
        </button>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="p-1">
            <button
              onClick={handleRedetect}
              disabled={locationLoading}
              className="w-full text-left px-3 py-1.5 text-xs text-orange-600 hover:bg-orange-50 rounded flex items-center gap-2"
            >
              <Navigation size={12} />
              {locationLoading ? "Detecting..." : "Detect my location"}
            </button>
            <button
              onClick={clearCity}
              className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:bg-orange-50 rounded"
            >
              All Cities
            </button>
            {citiesLoaded &&
              cities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded ${
                    filterCity === city
                      ? "bg-orange-50 text-orange-700 font-medium"
                      : "text-gray-700 hover:bg-orange-50"
                  }`}
                >
                  {formatCityLabel(city)}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
