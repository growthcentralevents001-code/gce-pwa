"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MapPin, Loader2, ChevronDown, Navigation } from "lucide-react";
import { formatCityLabel, matchToDatabaseCity, citiesMatch } from "@/lib/cityUtils";

interface GeoLocationBarProps {
  onCityChange: (city: string | null) => void;
  eventsCount: number;
}

export default function GeoLocationBar({ onCityChange, eventsCount }: GeoLocationBarProps) {
  const [displayLabel, setDisplayLabel] = useState<string | null>(null);
  const [filterCity, setFilterCity] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [cities, setCities] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [citiesLoaded, setCitiesLoaded] = useState(false);
  const detectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyCity = useCallback(
    (detectedName: string, dbCities: string[], matchedCity: string) => {
      const label = formatCityLabel(detectedName);
      setDisplayLabel(label);
      setFilterCity(matchedCity);
      onCityChange(matchedCity);
      localStorage.setItem("userCity", matchedCity);
      localStorage.setItem("userCityLabel", label);
      window.dispatchEvent(new CustomEvent("gce:city-change", { detail: matchedCity }));
    },
    [onCityChange]
  );

  const clearDetectTimeout = () => {
    if (detectTimeoutRef.current) {
      clearTimeout(detectTimeoutRef.current);
      detectTimeoutRef.current = null;
    }
  };

  const fetchCities = useCallback(async () => {
    try {
      const res = await fetch("/api/cities");
      if (res.ok) {
        const data = await res.json();
        const uniqueCities = Array.isArray(data.cities) ? data.cities : [];
        setCities(uniqueCities);
        setCitiesLoaded(true);
        return uniqueCities as string[];
      }
    } catch {
      // fall through
    }
    setCitiesLoaded(true);
    return [] as string[];
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

  const finishDetection = useCallback(
    (detectedName: string | null, dbCities: string[]) => {
      clearDetectTimeout();
      if (detectedName) {
        const matched = matchToDatabaseCity(detectedName, dbCities);
        if (matched) {
          applyCity(detectedName, dbCities, matched);
        } else {
          setDisplayLabel(null);
          setFilterCity(null);
          onCityChange(null);
          window.dispatchEvent(new CustomEvent("gce:city-change", { detail: null }));
        }
      } else {
        setDisplayLabel(null);
        setFilterCity(null);
        onCityChange(null);
        window.dispatchEvent(new CustomEvent("gce:city-change", { detail: null }));
      }
      setLocationLoading(false);
    },
    [applyCity, onCityChange]
  );

  const fallbackToIP = async (dbCities: string[]) => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      if (!res.ok) throw new Error("ip lookup failed");
      const data = await res.json();
      finishDetection(data.city || null, dbCities);
    } catch {
      finishDetection(null, dbCities);
    }
  };

  const detectLocation = useCallback(
    async (dbCities: string[]) => {
      setLocationLoading(true);
      clearDetectTimeout();
      detectTimeoutRef.current = setTimeout(() => {
        finishDetection(null, dbCities);
      }, 12000);

      if (!navigator.geolocation) {
        await fallbackToIP(dbCities);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const city = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude
          );
          if (city) {
            finishDetection(city, dbCities);
          } else {
            await fallbackToIP(dbCities);
          }
        },
        async () => {
          await fallbackToIP(dbCities);
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
      );
    },
    [finishDetection]
  );

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const dbCities = await fetchCities();
      if (cancelled) return;

      const savedCity = localStorage.getItem("userCity");
      const savedLabel = localStorage.getItem("userCityLabel");

      if (savedCity) {
        const matched =
          dbCities.find((city) => citiesMatch(city, savedCity)) ||
          matchToDatabaseCity(savedCity, dbCities);
        if (matched) {
          setDisplayLabel(savedLabel || formatCityLabel(matched));
          setFilterCity(matched);
          onCityChange(matched);
          setLocationLoading(false);
          return;
        }
        localStorage.removeItem("userCity");
        localStorage.removeItem("userCityLabel");
      }

      await detectLocation(dbCities);
    };

    init();

    return () => {
      cancelled = true;
      clearDetectTimeout();
    };
  }, [fetchCities, detectLocation, onCityChange]);

  const handleCitySelect = (city: string) => {
    setDisplayLabel(formatCityLabel(city));
    setFilterCity(city);
    onCityChange(city);
    localStorage.setItem("userCity", city);
    localStorage.setItem("userCityLabel", formatCityLabel(city));
    window.dispatchEvent(new CustomEvent("gce:city-change", { detail: city }));
    setShowDropdown(false);
  };

  const clearCity = () => {
    setDisplayLabel(null);
    setFilterCity(null);
    onCityChange(null);
    localStorage.removeItem("userCity");
    localStorage.removeItem("userCityLabel");
    window.dispatchEvent(new CustomEvent("gce:city-change", { detail: null }));
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
