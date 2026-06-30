"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    vertical: "Connect",
    date: "",
    time: "",
    city: "",
    venue: "",
    price: "",
    capacity: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.city) {
      alert("Please enter city");
      return;
    }
    setLoading(true);
    
    const { error } = await supabase.from('events').insert({
      title: formData.title,
      vertical: formData.vertical,
      date: formData.date,
      time: formData.time,
      city: formData.city,
      venue: formData.venue,
      price: parseInt(formData.price),
      capacity: parseInt(formData.capacity),
      status: 'Live',
      registered: 0
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Event created!");
      router.push("/admin/events");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>Create New Event</h1>
      <p style={{ color: "#64748b", marginBottom: "24px" }}>Fill in the details to create a new event</p>

      <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: "24px", padding: "32px", border: "1px solid #eef2ff" }}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>City *</label>
          <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required placeholder="e.g., Mumbai" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Venue</label>
          <input type="text" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} placeholder="e.g., The Leela Mumbai" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Event Title *</label>
          <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Vertical</label>
          <select value={formData.vertical} onChange={(e) => setFormData({...formData, vertical: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <option value="Connect">Connect</option>
            <option value="Marketplace">Marketplace</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Date *</label>
            <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Time *</label>
            <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Price (₹) *</label>
            <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Capacity *</label>
            <input type="number" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} required style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Description</label>
          <textarea rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
        </div>

        <button type="submit" disabled={loading} style={{ width: "100%", background: "#f97316", color: "white", border: "none", padding: "14px", borderRadius: "40px", cursor: "pointer", fontWeight: "600" }}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
