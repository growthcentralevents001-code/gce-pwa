"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Building, MapPin, Users, Tag, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

export default function AddVenue() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    capacity: "",
    type: "hotel",
    tier: "basic",
    status: "pending",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please login first");
        return;
      }

      const { error } = await supabase.from("venues").insert({
        name: formData.name,
        city: formData.city,
        address: formData.address,
        capacity: parseInt(formData.capacity) || 0,
        type: formData.type,
        tier: formData.tier,
        status: formData.status,
        user_id: user.id,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      alert("Venue added successfully!");
      router.push("/admin/venues");
    } catch (error: any) {
      console.error("Error adding venue:", error);
      alert("Failed to add venue: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6 pb-4 border-b-4 border-orange-400">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl">
            <Building size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Add New Venue</h1>
            <p className="text-gray-500 text-sm">Add a venue to the GCE platform</p>
          </div>
        </div>
      </div>

      <Link href="/admin/venues" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6">
        <ArrowLeft size={18} /> Back to Venues
      </Link>

      <form onSubmit={handleSubmit} className="max-w-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-xl shadow-sm p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              placeholder="e.g., JW Marriott"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              placeholder="e.g., Mumbai"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              placeholder="e.g., 123, Marine Drive"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              placeholder="e.g., 200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
              >
                <option value="hotel">Hotel</option>
                <option value="restaurant">Restaurant</option>
                <option value="banquet">Banquet Hall</option>
                <option value="club">Club</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
              <select
                name="tier"
                value={formData.tier}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
              >
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
                <option value="diamond">Diamond</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            {loading ? "Adding..." : "Add Venue"}
          </button>
        </div>
      </form>
    </div>
  );
}
