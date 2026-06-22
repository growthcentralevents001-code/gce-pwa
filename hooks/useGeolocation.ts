import { useState, useEffect } from 'react';

interface Location {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
    city: null,
    country: null,
    loading: true,
    error: null,
  });

  // Fetch city from coordinates (reverse geocoding)
  const fetchCityFromCoords = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await res.json();
      return data.city || data.locality || null;
    } catch {
      return null;
    }
  };

  // IP-based fallback
  const fetchIPLocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      if (data.city) {
        setLocation({
          latitude: null,
          longitude: null,
          city: data.city,
          country: data.country_name,
          loading: false,
          error: null,
        });
      } else {
        throw new Error('IP location failed');
      }
    } catch {
      setLocation({
        latitude: null,
        longitude: null,
        city: null,
        country: null,
        loading: false,
        error: 'Could not detect location',
      });
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      fetchIPLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const city = await fetchCityFromCoords(latitude, longitude);
        setLocation({
          latitude,
          longitude,
          city: city || 'Unknown',
          country: null,
          loading: false,
          error: null,
        });
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        fetchIPLocation(); // fallback to IP
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  return location;
}
