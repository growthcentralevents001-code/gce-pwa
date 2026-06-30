"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    vertical: "marketplace",
    date: "",
    time: "",
    venue: "",
    city: "",
    price: 0,
    capacity: 0,
    description: "",
  });
  const [genre, setGenre] = useState("music");

  const genreOptions = [
    "Adventure", "Arcades", "Bike Riding", "Bowling", "Clubbing", "Comedy",
    "Concerts", "Cricket Matches", "DJ Nights", "EDM & Electronic", "Food & Drinks",
    "Game Zones", "Heritage Walks", "Historical Tours", "Laser Tag", "Music",
    "Music Festivals", "Nightlife", "Open Mics", "Open Mics & Jams", "Pop",
    "Sports", "Theme Parks", "Tours", "Trampoline Parks", "Travel", "Walks"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please login");
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("events").insert({
      ...formData,
      user_id: user.id,
      status: "Live",
      registered: 0,
      genre: genre,
    });
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Event created and LIVE now!");
      router.push("/dashboard/venue");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Event Title</label>
          <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Vertical</label>
          <select name="vertical" value={formData.vertical} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="connect">GCE Connect</option>
            <option value="marketplace">GCE Marketplace</option>
            <option value="enterprise">GCE Enterprise</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Genre</label>
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full p-2 border rounded">
            {genreOptions.map(g => (
              <option key={g} value={g.toLowerCase()}>{g}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label>Date</label><input type="date" name="date" required onChange={handleChange} className="w-full p-2 border rounded" /></div>
          <div><label>Time</label><input type="time" name="time" required onChange={handleChange} className="w-full p-2 border rounded" /></div>
        </div>
        <div><label>Venue Name</label><input type="text" name="venue" required onChange={handleChange} className="w-full p-2 border rounded" /></div>
        <div><label>City</label><input type="text" name="city" required onChange={handleChange} className="w-full p-2 border rounded" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label>Price (₹)</label><input type="number" name="price" required onChange={handleChange} className="w-full p-2 border rounded" /></div>
          <div><label>Capacity</label><input type="number" name="capacity" required onChange={handleChange} className="w-full p-2 border rounded" /></div>
        </div>
        <div><label>Description</label><textarea name="description" rows="4" onChange={handleChange} className="w-full p-2 border rounded"></textarea></div>
        <button type="submit" disabled={loading} className="bg-orange-600 text-white px-4 py-2 rounded">{loading ? "Creating..." : "Create Live Event"}</button>
      </form>
    </div>
  );
}
