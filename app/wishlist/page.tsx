"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Calendar, MapPin, Users } from "lucide-react";

export default function WishlistPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  async function fetchWishlist() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Get saved event IDs
    const { data: saved, error } = await supabase
      .from("saved_events")
      .select("event_id")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching wishlist:", error);
      setEvents([]);
      setLoading(false);
      return;
    }

    if (!saved || saved.length === 0) {
      setEvents([]);
      setLoading(false);
      return;
    }

    const eventIds = saved.map(s => s.event_id);
    // Fetch full event details
    const { data: eventDetails } = await supabase
      .from("events")
      .select("*")
      .in("id", eventIds);

    setEvents(eventDetails || []);
    setLoading(false);
  }

  async function removeFromWishlist(eventId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("saved_events").delete().eq("user_id", user.id).eq("event_id", eventId);
    setEvents(prev => prev.filter(e => e.id !== eventId));
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Saved Events</h1>
      {events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No saved events yet.</p>
          <Link href="/events" className="mt-4 inline-block bg-orange-600 text-white px-4 py-2 rounded-lg">Browse Events</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden relative">
              <button onClick={() => removeFromWishlist(event.id)} className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-md z-10">
                <Heart size={18} className="fill-red-500 text-red-500" />
              </button>
              <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                <span className="text-4xl">🎉</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">{event.title}</h3>
                <div className="space-y-1 text-sm text-gray-600 mt-2">
                  <div className="flex items-center gap-1"><Calendar size={14} /> {new Date(event.date).toLocaleDateString()} at {event.time}</div>
                  <div className="flex items-center gap-1"><MapPin size={14} /> {event.venue}, {event.city}</div>
                  <div className="flex items-center gap-1"><Users size={14} /> {event.registered} / {event.capacity} attending</div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xl font-bold text-orange-600">₹{event.price}</span>
                  <Link href={`/events/${event.id}`} className="px-3 py-1 bg-orange-600 text-white text-sm rounded-full">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
