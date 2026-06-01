"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/app/context/AuthContext";

export default function ZBPApplyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    zone: "",
    city: "Mumbai",
    venues: [{ name: "", address: "", contact: "" }],
  });

  const zones = ["North", "South", "East", "West", "Central"];
  const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Goa", "Chennai", "Kolkata", "Hyderabad"];

  const addVenue = () => {
    setFormData({
      ...formData,
      venues: [...formData.venues, { name: "", address: "", contact: "" }]
    });
  };

  const removeVenue = (index: number) => {
    const newVenues = formData.venues.filter((_, i) => i !== index);
    setFormData({ ...formData, venues: newVenues });
  };

  const updateVenue = (index: number, field: string, value: string) => {
    const newVenues = [...formData.venues];
    newVenues[index] = { ...newVenues[index], [field]: value };
    setFormData({ ...formData, venues: newVenues });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    // Check minimum 5 venues
    const validVenues = formData.venues.filter(v => v.name && v.address);
    if (validVenues.length < 5) {
      alert("Please add at least 5 venues you can onboard immediately");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('zbp_partners')
      .insert({
        user_id: user.id,
        zone: formData.zone,
        city: formData.city,
        status: 'Pending',
        applied_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error(error);
      alert("Error submitting application. Please try again.");
    } else {
      alert("Application submitted successfully! Admin will review it.");
      router.push("/dashboard/zbp");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ background: "white", borderRadius: "32px", padding: "40px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>Apply for ZBP Partnership</h1>
        <p style={{ color: "#64748b", marginBottom: "32px" }}>Become a Zonal Business Partner in your area</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Select Zone *</label>
            <select
              required
              value={formData.zone}
              onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
              style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }}
            >
              <option value="">Select Zone</option>
              {zones.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>City *</label>
            <select
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }}
            >
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "16px", fontWeight: "500" }}>
              Venues You Can Onboard (Minimum 5) *
            </label>
            {formData.venues.map((venue, idx) => (
              <div key={idx} style={{ padding: "16px", background: "#f8fafc", borderRadius: "16px", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <strong>Venue {idx + 1}</strong>
                  {idx >= 4 && (
                    <button type="button" onClick={() => removeVenue(idx)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Venue Name *"
                  value={venue.name}
                  onChange={(e) => updateVenue(idx, "name", e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "12px" }}
                  required={idx < 5}
                />
                <input
                  type="text"
                  placeholder="Address *"
                  value={venue.address}
                  onChange={(e) => updateVenue(idx, "address", e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "12px" }}
                  required={idx < 5}
                />
                <input
                  type="text"
                  placeholder="Contact Person / Phone"
                  value={venue.contact}
                  onChange={(e) => updateVenue(idx, "contact", e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                />
              </div>
            ))}
            <button type="button" onClick={addVenue} style={{ background: "#f97316", color: "white", border: "none", padding: "10px 20px", borderRadius: "40px", cursor: "pointer" }}>+ Add Another Venue</button>
          </div>

          <button type="submit" disabled={loading} style={{ width: "100%", background: "#f97316", color: "white", border: "none", padding: "14px", borderRadius: "40px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
