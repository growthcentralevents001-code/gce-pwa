"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ZBPDashboard() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    capacity: "",
    type: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) fetchVenues();
  }

  async function fetchVenues() {
    if (!user) return;
    const { data, error } = await supabase
      .from("venues")
      .select("*")
      .eq("zbp_id", user.id);
    if (!error) setVenues(data);
    setLoading(false);
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (!user) { alert("Please login as ZBP"); setSubmitting(false); return; }

    const payload = {
      name: form.name,
      city: form.city,
      address: form.address,
      capacity: form.capacity,
      type: form.type,
      email: form.email,
      password: form.password,
      zbp_user_id: user.id,
    };

    const res = await fetch("/api/venue/onboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      alert("Venue onboarded successfully! Partner can login now.");
      fetchVenues();
      setForm({ name: "", city: "", address: "", capacity: "", type: "", email: "", password: "" });
    } else {
      alert("Error: " + data.error);
    }
    setSubmitting(false);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ZBP Dashboard</h1>

      {/* Onboard Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Onboard New Venue</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Venue Name" required value={form.name} onChange={handleChange} className="p-2 border rounded" />
          <input type="text" name="city" placeholder="City" required value={form.city} onChange={handleChange} className="p-2 border rounded" />
          <input type="text" name="address" placeholder="Address" required value={form.address} onChange={handleChange} className="p-2 border rounded" />
          <input type="number" name="capacity" placeholder="Capacity" required value={form.capacity} onChange={handleChange} className="p-2 border rounded" />
          <input type="text" name="type" placeholder="Venue Type" required value={form.type} onChange={handleChange} className="p-2 border rounded" />
          <input type="email" name="email" placeholder="Venue Partner Email" required value={form.email} onChange={handleChange} className="p-2 border rounded" />
          <input type="password" name="password" placeholder="Password" required value={form.password} onChange={handleChange} className="p-2 border rounded" />
          <button type="submit" disabled={submitting} className="col-span-2 bg-orange-600 text-white p-2 rounded hover:bg-orange-700">
            {submitting ? "Creating..." : "Submit for Approval (Auto-Approve)"}
          </button>
        </form>
      </div>

      {/* Venues List */}
      <h2 className="text-xl font-semibold mb-4">Your Venues</h2>
      {venues.length === 0 ? (
        <p>No venues onboarded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Venue Name</th>
                <th className="p-2 text-left">City</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {venues.map((v) => (
                <tr key={v.id} className="border-t">
                  <td className="p-2">{v.name}</td>
                  <td className="p-2">{v.city}</td>
                  <td className="p-2"><span className="text-green-600">Approved</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
