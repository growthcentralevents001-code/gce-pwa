"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    vertical: "Connect",
    date: "",
    time: "",
    venue: "",
    city: "",
    price: "",
    capacity: "",
    description: "",
    status: "Live",
  });

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    const { data } = await supabase.from("events").select("*").eq("id", eventId).single();
    if (data) {
      setFormData({
        title: data.title || "",
        vertical: data.vertical || "Connect",
        date: data.date || "",
        time: data.time || "",
        venue: data.venue || "",
        city: data.city || "",
        price: data.price || "",
        capacity: data.capacity || "",
        description: data.description || "",
        status: data.status || "Live",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("events")
      .update({
        title: formData.title,
        vertical: formData.vertical,
        date: formData.date,
        time: formData.time,
        venue: formData.venue,
        city: formData.city,
        price: parseInt(formData.price),
        capacity: parseInt(formData.capacity),
        description: formData.description,
        status: formData.status,
      })
      .eq("id", eventId);

    if (error) {
      alert("Error updating event: " + error.message);
    } else {
      alert("Event updated successfully!");
      router.push("/admin/events");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>Edit Event</h1>
      <form onSubmit={handleSubmit} style={{ background: "white", padding: "32px", borderRadius: "24px" }}>
        <div style={{ marginBottom: "16px" }}>
          <label>Event Title</label>
          <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ccc" }} />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label>City</label>
          <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="e.g., Mumbai" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ccc" }} />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label>Venue</label>
          <input type="text" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ccc" }} />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label>Vertical</label>
          <select value={formData.vertical} onChange={(e) => setFormData({ ...formData, vertical: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ccc" }}>
            <option>Connect</option>
            <option>Marketplace</option>
            <option>Enterprise</option>
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div><label>Date</label><input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ccc" }} /></div>
          <div><label>Time</label><input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ccc" }} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div><label>Price</label><input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ccc" }} /></div>
          <div><label>Capacity</label><input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ccc" }} /></div>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label>Status</label>
          <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ccc" }}>
            <option>Live</option>
            <option>Draft</option>
            <option>Pending</option>
            <option>Rejected</option>
          </select>
        </div>
        <div style={{ marginBottom: "24px" }}>
          <label>Description</label>
          <textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ccc" }} />
        </div>
        <button type="submit" disabled={loading} style={{ width: "100%", background: "#f97316", color: "white", border: "none", padding: "14px", borderRadius: "40px", cursor: "pointer" }}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
