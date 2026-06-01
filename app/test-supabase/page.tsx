"use client";

import { useEffect, useState } from "react";

export default function TestSupabase() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function test() {
      try {
        const res = await fetch("/api/test-supabase");
        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      }
    }
    test();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h1>Supabase Test</h1>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
