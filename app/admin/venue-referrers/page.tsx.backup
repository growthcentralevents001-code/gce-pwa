"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Venue {
  id: string;
  name: string;
  city: string;
  referrer_id: string | null;
  referrer_type: string | null;
}

interface Referrer {
  id: string;
  name: string;
  code: string;
  type: string;
}

export default function AdminVenueReferrers() {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [referrers, setReferrers] = useState<Referrer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  async function checkAdminAndFetch() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (userData?.role !== "admin") { router.push("/unauthorized"); return; }
    await Promise.all([fetchVenues(), fetchReferrers()]);
    setLoading(false);
  }

  async function fetchVenues() {
    const { data } = await supabase.from("venues").select("id, name, city, referrer_id, referrer_type").order("name");
    setVenues(data || []);
  }

  async function fetchReferrers() {
    // Fetch affiliates with referral codes
    const { data: affiliates } = await supabase
      .from("marketplace_affiliates")
      .select("user_id, name, referral_code")
      .not("referral_code", "is", null);
    // Fetch ZBPs with referral codes
    const { data: zbps } = await supabase
      .from("zbp_profiles")
      .select("user_id, zone, referral_code")
      .not("referral_code", "is", null);
    const affiliateList = (affiliates || []).map(a => ({
      id: a.user_id,
      name: a.name || "Affiliate",
      code: a.referral_code,
      type: "affiliate"
    }));
    const zbpList = (zbps || []).map(z => ({
      id: z.user_id,
      name: z.zone ? `ZBP (${z.zone})` : "ZBP",
      code: z.referral_code,
      type: "zbp"
    }));
    setReferrers([...affiliateList, ...zbpList]);
  }

  async function updateReferrer(venueId: string, referrerId: string | null, referrerType: string | null) {
    setSaving(venueId);
    const { error } = await supabase
      .from("venues")
      .update({ referrer_id: referrerId || null, referrer_type: referrerType || null })
      .eq("id", venueId);
    if (error) alert("Update failed: " + error.message);
    else {
      // Refresh venues list
      await fetchVenues();
    }
    setSaving(null);
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Venue Relationship Managers</h1>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Relationship Manager</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assign New</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {venues.map(venue => {
              const currentReferrer = referrers.find(r => r.id === venue.referrer_id && r.type === venue.referrer_type);
              return (
                <tr key={venue.id}>
                  <td className="px-6 py-4">{venue.name}</td>
                  <td className="px-6 py-4">{venue.city}</td>
                  <td className="px-6 py-4">
                    {currentReferrer ? `${currentReferrer.name} (${currentReferrer.type}) - Code: ${currentReferrer.code}` : "None"}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      id={`referrer-${venue.id}`}
                      className="border rounded p-1 text-sm"
                      defaultValue={venue.referrer_id ? `${venue.referrer_type}|${venue.referrer_id}` : ""}
                    >
                      <option value="">None</option>
                      {referrers.map(ref => (
                        <option key={ref.id} value={`${ref.type}|${ref.id}`}>
                          {ref.name} ({ref.type}) - {ref.code}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        const select = document.getElementById(`referrer-${venue.id}`) as HTMLSelectElement;
                        const val = select.value;
                        if (val === "") {
                          updateReferrer(venue.id, null, null);
                        } else {
                          const [type, id] = val.split("|");
                          updateReferrer(venue.id, id, type);
                        }
                      }}
                      disabled={saving === venue.id}
                      className="bg-orange-600 text-white px-3 py-1 rounded text-sm"
                    >
                      {saving === venue.id ? "Saving..." : "Save"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
