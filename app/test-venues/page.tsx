"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Venue = {
  id: string;
  name: string;
  city: string;
  rating_name: string;
  monthly_fee: number;
};

export default function TestVenues() {
  const [venues, setVenues] = useState<Venue[]>([]);

  useEffect(() => {
    supabase.from("venues").select("*").then(({ data }) => {
      if (data) setVenues(data as Venue[]);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Venues List</h1>
      {venues.map((v) => (
        <div key={v.id} className="border p-3 mb-2 rounded">
          {v.name} - {v.city} - {v.rating_name} (₹{v.monthly_fee})
        </div>
      ))}
    </div>
  );
}
