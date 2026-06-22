"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function VenueApply() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [formData, setFormData] = useState({
    venue_name: "",
    city: "",
    address: "",
    capacity: "",
    type: "hotel",
    referral_code: "",
  });

  // Check if user already has venue role
  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "venue")
          .maybeSingle();
        if (data) setHasApplied(true);
      }
    };
    checkRole();
  }, []);

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
        router.push("/login");
        return;
      }

      // 1. Insert into venues table
      const { error: venueError } = await supabase
        .from("venues")
        .insert({
          name: formData.venue_name,
          city: formData.city,
          address: formData.address,
          capacity: parseInt(formData.capacity) || 0,
          type: formData.type,
          status: "pending",
          user_id: user.id,
          referral_code: formData.referral_code || null,
          created_at: new Date().toISOString(),
        });

      if (venueError) throw venueError;

      // 2. Auto-assign venue role
      const { error: roleError } = await supabase
        .from("user_roles")
        .upsert({
          user_id: user.id,
          role: "venue",
          approved: true,
          approved_at: new Date().toISOString(),
        }, { onConflict: "user_id, role" });

      if (roleError) throw roleError;

      alert("Venue application submitted successfully! You now have Venue Partner access.");
      router.push("/dashboard/venue");
    } catch (error: any) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (hasApplied) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <p className="text-green-700 font-medium text-lg">✅ You are already a Venue Partner!</p>
          <Link href="/dashboard/venue" className="text-orange-600 hover:underline font-medium mt-2 inline-block">
            Go to Venue Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-orange-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Apply as Venue Partner</h1>
        <p className="text-gray-500 text-sm mb-6">List your venue, host events, and earn 80% of ticket sales</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name *</label>
            <input
              type="text"
              name="venue_name"
              value={formData.venue_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
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
              className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
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
              className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
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
              className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
              placeholder="e.g., 200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venue Type</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Referral Code (optional)</label>
            <input
              type="text"
              name="referral_code"
              value={formData.referral_code}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
              placeholder="Enter referral code from ZBP or Affiliate"
            />
            <p className="text-xs text-gray-400 mt-1">If you have a referral code from a ZBP or Affiliate, enter it here.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Apply Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
