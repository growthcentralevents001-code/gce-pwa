'use client';

import { useGeolocation } from '@/hooks/useGeolocation';
import { MapPin, Loader2 } from 'lucide-react';

interface GeoLocationProps {
  onLocationDetected: (city: string | null) => void;
}

export default function GeoLocation({ onLocationDetected }: GeoLocationProps) {
  const location = useGeolocation();

  useEffect(() => {
    if (!location.loading && location.city) {
      onLocationDetected(location.city);
    }
  }, [location.loading, location.city, onLocationDetected]);

  if (location.loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2 size={16} className="animate-spin" />
        Detecting your location...
      </div>
    );
  }

  if (location.error) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <MapPin size={16} />
        Location unavailable
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <MapPin size={16} className="text-orange-500" />
      <span>{location.city || 'Unknown'}</span>
    </div>
  );
}
