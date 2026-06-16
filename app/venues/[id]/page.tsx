"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { MapPin, Calendar, Users, ArrowLeft } from "lucide-react";

export default function VenueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [venue, setVenue] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) fetchVenueAndEvents();
  }, [params?.id]);

  async function fetchVenueAndEvents() {
    setLoading(true);
    const { data: venueData, error: venueError } = await supabase
      .from("venues")
      .select("*")
      .eq("id", params.id)
      .single();
    if (venueError) {
      setLoading(false);
      return;
    }
    setVenue(venueData);

    // Fetch events at this venue with status Live
    const { data: eventsData } = await supabase
      .from("events")
      .select("id, title, date, time, price, registered, capacity")
      .eq("venue_id", params.id)
      .eq("status", "Live")
      .order("date", { ascending: true });

    setEvents(eventsData || []);
    setLoading(false);
  }

  if (loading) return <div className="p-8 text-center">Loading venue...</div>;
  if (!venue) return <div className="p-8 text-center">Venue not found.</div>;

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-4">
        <ArrowLeft size={18} /> Back
      </button>
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>
        <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
          <div className="flex items-center gap-1"><MapPin size={16} /> {venue.address || "Address not provided"}, {venue.city || "N/A"}</div>
          {venue.phone && <div>📞 {venue.phone}</div>}
          {venue.email && <div>✉️ {venue.email}</div>}
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{venue.tier || "Basic"}</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{venue.venue_type || "Venue"}</span>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Upcoming Events at {venue.name}</h2>
      {events.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">No upcoming events at this venue.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <div key={event.id} onClick={() => router.push(`/events/${event.id}`)} className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-md transition">
              <h3 className="font-bold text-lg">{event.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1"><Calendar size={14} /> {formatDate(event.date)} at {event.time || "TBD"}</div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-orange-600 font-bold">₹{event.price}</span>
                <span className="text-sm text-gray-500"><Users size={14} className="inline" /> {event.registered}/{event.capacity}</span>
                <button className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm">Book</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
