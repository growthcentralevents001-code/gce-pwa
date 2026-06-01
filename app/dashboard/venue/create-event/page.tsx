"use client";
import { useState } from "react";
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
    const { error } = await supabase.from("events").insert({
      ...form,
      user_id: user.id,
      status: "Live",
      registered: 0,
    });
    if (error) alert("Error: " + error.message);
    else {
      alert("Event created and live!");
      router.push("/dashboard/venue");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Create New Event</h1>
            <p className="text-orange-100 text-sm mt-1">Your event will be live immediately after creation</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
              <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name *</label>
              <input type="text" required value={form.venue} onChange={e => setForm({...form, venue: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input type="text" required value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                placeholder="e.g., Mumbai, Delhi, Bangalore"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time (24-hour format) *</label>
                <input type="time" required value={form.time} onChange={e => setForm({...form, time: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                <p className="text-xs text-gray-400 mt-1">Example: 14:30 for 2:30 PM</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                <input type="number" required value={form.price} onChange={e => setForm({...form, price: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                <input type="number" required value={form.capacity} onChange={e => setForm({...form, capacity: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
              {loading ? "Creating..." : "✨ Create Event (Live)"}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-400 text-xs mt-6">Event will be visible to users immediately</p>
      </div>
    </div>
  );
}
