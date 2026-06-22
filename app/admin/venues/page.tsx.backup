"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Search, Edit, Save, X, CheckCircle, XCircle } from "lucide-react";

interface Venue {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  tier: string;
  status: string;
  monthly_fee: number;
  created_at: string;
}

export default function VenueManagement() {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ tier: "", status: "", monthly_fee: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  async function checkAdminAndFetch() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (userData?.role !== "admin") { router.push("/unauthorized"); return; }
    fetchVenues();
  }

  async function fetchVenues() {
    const { data, error } = await supabase.from("venues").select("*").order("created_at", { ascending: false });
    if (error) console.error("Error fetching venues:", error);
    else setVenues(data || []);
    setLoading(false);
  }

  async function updateVenue(venueId: string) {
    setSaving(true);
    const { error } = await supabase
      .from("venues")
      .update({ tier: editForm.tier, status: editForm.status, monthly_fee: editForm.monthly_fee })
      .eq("id", venueId);
    if (error) alert("Error updating: " + error.message);
    else alert("Venue updated successfully!");
    setEditingId(null);
    fetchVenues();
    setSaving(false);
  }

  const filteredVenues = venues.filter(v =>
    v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Loading venues...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Venue Management</h1>
        <p className="text-gray-500">Manage venue ratings, fees, and approvals</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email or city..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Venues Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4">Venue Name</th>
                <th className="text-left p-4">Contact</th>
                <th className="text-left p-4">City</th>
                <th className="text-left p-4">Tier</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Monthly Fee</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVenues.length === 0 ? (
                <tr><td colSpan={7} className="text-center p-8 text-gray-500">No venues found</td></tr>
              ) : (
                filteredVenues.map((venue) => (
                  <tr key={venue.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{venue.name}</td>
                    <td className="p-4"><p className="text-sm">{venue.email}</p><p className="text-xs text-gray-500">{venue.phone}</p></td>
                    <td className="p-4">{venue.city || "—"}</td>
                    <td className="p-4">
                      {editingId === venue.id ? (
                        <select
                          value={editForm.tier}
                          onChange={(e) => setEditForm({ ...editForm, tier: e.target.value })}
                          className="border rounded p-1 text-sm"
                        >
                          <option value="Basic">Basic</option>
                          <option value="Silver">Silver</option>
                          <option value="Gold">Gold</option>
                          <option value="Platinum">Platinum</option>
                          <option value="Diamond">Diamond</option>
                        </select>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{venue.tier || "Basic"}</span>
                      )}
                    </td>
                    <td className="p-4">
                      {editingId === venue.id ? (
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          className="border rounded p-1 text-sm"
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          venue.status === "active" ? "bg-green-100 text-green-700" :
                          venue.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                        }`}>{venue.status || "Pending"}</span>
                      )}
                    </td>
                    <td className="p-4">
                      {editingId === venue.id ? (
                        <input
                          type="number"
                          value={editForm.monthly_fee}
                          onChange={(e) => setEditForm({ ...editForm, monthly_fee: parseInt(e.target.value) })}
                          className="border rounded p-1 w-24 text-sm"
                        />
                      ) : (
                        <span>₹{venue.monthly_fee || 500}</span>
                      )}
                    </td>
                    <td className="p-4">
                      {editingId === venue.id ? (
                        <div className="flex gap-2">
                          <button onClick={() => updateVenue(venue.id)} disabled={saving} className="text-green-600 hover:bg-green-50 p-1 rounded">
                            <Save size={18} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(venue.id);
                            setEditForm({ tier: venue.tier || "Basic", status: venue.status || "pending", monthly_fee: venue.monthly_fee || 500 });
                          }}
                          className="text-orange-600 hover:bg-orange-50 p-1 rounded"
                        >
                          <Edit size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
