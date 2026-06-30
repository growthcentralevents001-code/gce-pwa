"use client";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ZBPApply() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    zone: "",
    city: "",
    experience: "",
    venues: [{ name: "", address: "", city: "" }]
  });
  const [loading, setLoading] = useState(false);

  const zones = ["North", "South", "East", "West", "Central"];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVenueChange = (idx: number, field: keyof (typeof form.venues)[number], value: string) => {
    const updated = [...form.venues];
    updated[idx][field] = value;
    setForm({ ...form, venues: updated });
  };

  const addVenue = () => {
    setForm({ ...form, venues: [...form.venues, { name: "", address: "", city: "" }] });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please login");
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("zbp_applications").insert({
      user_id: user.id,
      full_name: form.fullName,
      phone: form.phone,
      zone: form.zone,
      city: form.city,
      experience: parseInt(form.experience),
      venues_data: form.venues
    });
    if (error) alert("Error: " + error.message);
    else {
      alert("Application submitted!");
      router.push("/dashboard/zbp");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Apply for ZBP (Franchisee)</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input type="text" name="fullName" required value={form.fullName} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input type="tel" name="phone" required value={form.phone} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Preferred Zone</label>
          <select name="zone" value={form.zone} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">Select Zone</option>
            {zones.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">City (within selected zone)</label>
          <input type="text" name="city" required value={form.city} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Experience (years)</label>
          <input type="number" name="experience" required value={form.experience} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Venues You Onboard (Optional)</label>
          {form.venues.map((venue, idx) => (
            <div key={idx} className="border p-2 rounded mb-2">
              <input type="text" placeholder="Venue Name" value={venue.name} onChange={(e) => handleVenueChange(idx, "name", e.target.value)} className="w-full p-2 border rounded mb-1" />
              <input type="text" placeholder="Address" value={venue.address} onChange={(e) => handleVenueChange(idx, "address", e.target.value)} className="w-full p-2 border rounded mb-1" />
              <input type="text" placeholder="City" value={venue.city} onChange={(e) => handleVenueChange(idx, "city", e.target.value)} className="w-full p-2 border rounded" />
            </div>
          ))}
          <button type="button" onClick={addVenue} className="mt-2 text-orange-600 text-sm">+ Add Another Venue</button>
        </div>
        <button type="submit" disabled={loading} className="bg-orange-600 text-white px-4 py-2 rounded w-full">
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
