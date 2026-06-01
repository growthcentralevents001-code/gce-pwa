"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Event {
  id: string;
  title: string;
  status: string;
}

export default function TestEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "Live");
      if (error) setError(error.message);
      else setEvents(data || []);
    };
    fetchEvents();
  }, []);

  return (
    <div className="p-6">
      <h1>Test Events Page</h1>
      {error && <p className="text-red-500">Error: {error}</p>}
      {events.length === 0 ? (
        <p>No live events found.</p>
      ) : (
        events.map((e) => <div key={e.id}>{e.title} - {e.status}</div>)
      )}
    </div>
  );
}
