"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function VenueCreateEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    venue: "",
    city: "",
    date: "",
    time: "",
    price: 0,
    capacity: 0,
    description: "",
    vertical: "Marketplace"
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please login");
      router.push("/login");
      setLoading(false);
      return;
    }

    // Find venue ID by name and city (case-insensitive)
    const { data: venues, error } = await supabase
      .from("venues")
      .select("id")
      .eq("user_id", user.id)
      .ilike("name", form.venue)
      .ilike("city", form.city)
      .limit(1);

    if (error || !venues || venues.length === 0) {
      alert("Venue not found. Please ensure you have created a venue profile with this name and city.");
      setLoading(false);
      return;
    }

    const venueId = venues[0].id;

    const { error: insertError } = await supabase.from("events").insert({
      ...form,
      user_id: user.id,
      venue_id: venueId,
      status: "Live",
      registered: 0,
    });
    if (insertError) alert("Error: " + insertError.message);
    else {
      alert("Event created and live!");
      router.push("/dashboard/venue");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Event Title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-2 border rounded" />
          <input type="text" placeholder="Venue Name" required value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} className="w-full p-2 border rounded" />
          <input type="text" placeholder="City" required value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full p-2 border rounded" />
          <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full p-2 border rounded" />
          <input type="time" required value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full p-2 border rounded" />
          <input type="number" placeholder="Price (₹)" required value={form.price} onChange={e => setForm({...form, price: parseInt(e.target.value)})} className="w-full p-2 border rounded" />
          <input type="number" placeholder="Capacity" required value={form.capacity} onChange={e => setForm({...form, capacity: parseInt(e.target.value)})} className="w-full p-2 border rounded" />
          <textarea placeholder="Description" rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full p-2 border rounded" />
          <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white py-2 rounded">{loading ? "Creating..." : "Create Event"}</button>
        </form>
      </div>
    </div>
  );
}
