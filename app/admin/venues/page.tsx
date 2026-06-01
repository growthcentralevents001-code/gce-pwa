"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Venue {
  id: string;
  name: string;
  city: string;
  rating: number;
  rating_name: string;
  monthly_fee: number;
  fee_adjustable: boolean;
}

export default function AdminVenues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVenues();
  }, []);

  async function fetchVenues() {
    const { data } = await supabase.from("venues").select("*");
    if (data) setVenues(data);
    setLoading(false);
  }

  async function updateRating(venueId: string, rating: number) {
    let ratingName = "Basic";
    let monthlyFee = 500;
    let feeAdjustable = false;

    if (rating === 5) { ratingName = "Diamond"; monthlyFee = 5000; feeAdjustable = true; }
    else if (rating === 4) { ratingName = "Platinum"; monthlyFee = 3000; feeAdjustable = true; }
    else if (rating === 3) { ratingName = "Gold"; monthlyFee = 2000; feeAdjustable = true; }
    else if (rating === 2) { ratingName = "Silver"; monthlyFee = 1000; feeAdjustable = true; }
    else { ratingName = "Basic"; monthlyFee = 500; feeAdjustable = false; }

    const { error } = await supabase
      .from("venues")
      .update({ rating, rating_name: ratingName, monthly_fee: monthlyFee, fee_adjustable: feeAdjustable })
      .eq("id", venueId);

    if (!error) {
      alert(`${ratingName} (${rating}★) - Monthly Fee: ₹${monthlyFee}`);
      fetchVenues();
    } else {
      alert("Update failed: " + error.message);
    }
  }

  if (loading) return <div className="p-8 text-center">Loading venues...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Venue Rating Management</h1>
      <div className="grid gap-4">
        {venues.map(venue => (
          <div key={venue.id} className="border p-4 rounded bg-white shadow">
            <div className="font-bold">{venue.name}</div>
            <div className="text-sm text-gray-500">{venue.city}</div>
            <div className="mt-2">Current Rating: {venue.rating_name} (₹{venue.monthly_fee}/month)</div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  onClick={() => updateRating(venue.id, star)}
                  className={`px-3 py-1 rounded ${venue.rating === star ? "bg-orange-600 text-white" : "bg-gray-200"}`}
                >
                  {star}★
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
