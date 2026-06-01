"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Event {
  id: string;
  title: string;
  venue: string;
  city: string;
  date: string;
  price: number;
  status: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "Live")
        .order("date", { ascending: true });
      if (!error && data) setEvents(data as Event[]);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading events...</div>;

  if (events.length === 0) return <div className="p-8 text-center">No live events at the moment.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Live Events</h1>
      <div className="grid gap-4">
        {events.map(event => (
          <div key={event.id} className="border p-4 rounded shadow">
            <h2 className="font-bold">{event.title}</h2>
            <p>{event.venue}, {event.city}</p>
            <p>{event.date} | ₹{event.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
