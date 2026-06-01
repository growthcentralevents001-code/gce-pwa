"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PlansDebug() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("venue_plans").select("*");
      setData(data);
      setError(error);
    }
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Plans Debug - Raw Data</h1>
      {error && <pre className="text-red-500">Error: {JSON.stringify(error, null, 2)}</pre>}
      {data && <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(data, null, 2)}</pre>}
      {!data && !error && <p>Loading...</p>}
    </div>
  );
}
