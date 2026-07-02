"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Heart, Calendar, MapPin, Users, IndianRupee, Trash2, Building2 } from "lucide-react";

interface SavedEvent {
  event_id: string;
  events: {
    id: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    city: string;
    price: number;
    registered: number;
    capacity: number;
    vertical: string;
    category: string;
  };
}

export default function WishlistPage() {
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const fetchSavedEvents = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("saved_events")
        .select(`
          event_id,
          events (
            id,
            title,
            date,
            time,
            venue,
            city,
            price,
            registered,
            capacity,
            vertical,
            category
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSavedEvents((data ?? []) as unknown as SavedEvent[]);
    } catch (error) {
      console.error("Error fetching saved events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      setUser(data.user);
      fetchSavedEvents(data.user.id);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const removeSavedEvent = async (eventId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("saved_events")
        .delete()
        .eq("user_id", user.id)
        .eq("event_id", eventId);

      if (error) throw error;
      setSavedEvents(savedEvents.filter((item) => item.event_id !== eventId));
    } catch (error) {
      console.error("Error removing saved event:", error);
      alert("Failed to remove event. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center gap-3">
            <Heart className="text-orange-500" size={32} />
            Saved Events
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Your wishlist of events you're interested in
          </p>
        </div>

        {/* Events Grid */}
        {savedEvents.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">
            <Heart className="mx-auto text-slate-300" size={48} />
            <h3 className="text-lg font-semibold text-slate-700 mt-4">No saved events yet</h3>
            <p className="text-sm text-slate-400 mt-1">Start exploring events and save your favorites</p>
            <Link
              href="/events"
              className="inline-block mt-4 px-6 py-2 bg-orange-600 text-white text-sm font-medium rounded-full hover:bg-orange-700 transition shadow-md"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedEvents.map((item) => {
              const event = item.events;
              if (!event) return null;

              const verticalColors =
                event.vertical === "connect"
                  ? { bg: "bg-blue-100", text: "text-blue-700" }
                  : event.vertical === "marketplace"
                  ? { bg: "bg-green-100", text: "text-green-700" }
                  : { bg: "bg-purple-100", text: "text-purple-700" };

              return (
                <div
                  key={event.id}
                  className="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:border-orange-200"
                >
                  {/* Hero Image */}
                  <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center relative">
                    <span className="text-4xl">🎉</span>
                    <span className={`absolute top-3 right-3 ${verticalColors.bg} ${verticalColors.text} text-xs font-semibold px-2.5 py-1 rounded-full shadow`}>
                      {event.vertical || "Event"}
                    </span>
                    <button
                      onClick={() => removeSavedEvent(event.id)}
                      className="absolute top-3 left-3 p-2 bg-white/90 rounded-full hover:bg-red-100 transition shadow-md"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <Link href={`/events/${event.id}`}>
                      <h3 className="font-bold text-lg text-slate-800 group-hover:text-orange-600 transition line-clamp-1">
                        {event.title}
                      </h3>
                    </Link>

                    <div className="mt-2 space-y-1.5 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-orange-400 flex-shrink-0" />
                        <span>{event.date} at {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-orange-400 flex-shrink-0" />
                        <span className="line-clamp-1">{event.venue}, {event.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-orange-400 flex-shrink-0" />
                        <span>{event.registered} / {event.capacity} attending</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IndianRupee size={14} className="text-orange-400 flex-shrink-0" />
                        <span className="font-semibold text-orange-600">₹{event.price}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        new Date(event.date) >= new Date()
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}>
                        {new Date(event.date) >= new Date() ? "Upcoming" : "Past"}
                      </span>
                      <Link
                        href={`/events/${event.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700 transition"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
