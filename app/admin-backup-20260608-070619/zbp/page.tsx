"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Star, Building2, MapPin, RefreshCw, Edit2, Trash2, X } from "lucide-react";

export default function AdminVenues() {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingVenue, setEditingVenue] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: "", city: "", address: "", capacity: "", type: "" });

  useEffect(() => { fetchVenues(); }, []);

  async function fetchVenues() {
    const { data } = await supabase.from("venues").select("*");
    if (data) setVenues(data);
    setLoading(false);
  }

  async function approveVenue(id: string) {
    const { error } = await supabase
      .from("venues")
      .update({ status: 'Active' })
      .eq("id", id);
    if (error) alert("Approval failed: " + error.message);
    else fetchVenues();
  }

  async function updateRating(id: string, rating: number) {
    setUpdatingId(id);
    let name = "Basic", fee = 500;
    if (rating === 5) { name = "Diamond"; fee = 5000; }
    else if (rating === 4) { name = "Platinum"; fee = 3000; }
    else if (rating === 3) { name = "Gold"; fee = 2000; }
    else if (rating === 2) { name = "Silver"; fee = 1000; }

    const { error } = await supabase
      .from("venues")
      .update({ rating, rating_name: name, monthly_fee: fee })
      .eq("id", id);
    if (error) alert("Update failed: " + error.message);
    else fetchVenues();
    setUpdatingId(null);
  }

  async function deleteVenue(id: string) {
    if (!confirm("Delete this venue permanently? This action cannot be undone.")) return;
    const { error } = await supabase.from("venues").delete().eq("id", id);
    if (error) alert("Delete failed: " + error.message);
    else fetchVenues();
  }

  async function updateVenueDetails() {
    if (!editingVenue) return;
    const updates: any = {};
    if (editForm.name !== editingVenue.name) updates.name = editForm.name;
    if (editForm.city !== editingVenue.city) updates.city = editForm.city;
    if (editForm.address !== editingVenue.address) updates.address = editForm.address;
    if (editForm.capacity) updates.capacity = parseInt(editForm.capacity);
    if (editForm.type) updates.type = editForm.type;

    if (Object.keys(updates).length === 0) {
      setEditingVenue(null);
      return;
    }
    const { error } = await supabase.from("venues").update(updates).eq("id", editingVenue.id);
    if (error) alert("Update failed: " + error.message);
    else fetchVenues();
    setEditingVenue(null);
  }

  const openEditModal = (venue: any) => {
    setEditingVenue(venue);
    setEditForm({
      name: venue.name || "",
      city: venue.city || "",
      address: venue.address || "",
      capacity: venue.capacity?.toString() || "",
      type: venue.type || "",
    });
  };

  const stats = {
    total: venues.length,
    premium: venues.filter(v => v.rating >= 4).length,
    totalFees: venues.reduce((sum, v) => sum + (v.monthly_fee || 0), 0),
    adjustable: venues.filter(v => v.fee_adjustable).length,
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
      <RefreshCw className="w-8 h-8 text-orange-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-semibold mb-2">Admin Panel</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Venue Rating Manager</h1>
          <p className="text-gray-500 mt-2">Set venue ratings – monthly fees update automatically (20% fixed commission)</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow p-4 border-l-4 border-orange-500">
            <div className="text-2xl font-bold text-orange-600">{stats.total}</div>
            <div className="text-sm text-gray-500">Total Venues</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-yellow-600">{stats.premium}</div>
            <div className="text-sm text-gray-500">Premium (4★+)</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-600">₹{stats.totalFees.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Total Monthly Fees</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 border-l-4 border-purple-500">
            <div className="text-2xl font-bold text-purple-600">{stats.adjustable}</div>
            <div className="text-sm text-gray-500">Fee Adjustable</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map(venue => {
            const rating = venue.rating || 1;
            const gradient = rating === 5 ? "from-purple-600 to-pink-500" : rating === 4 ? "from-cyan-600 to-blue-500" : rating === 3 ? "from-amber-500 to-orange-500" : "from-gray-500 to-gray-600";
            return (
              <div key={venue.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden">
                <div className={`bg-gradient-to-r ${gradient} p-4 text-white`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold">{venue.name}</h2>
                      <div className="flex items-center gap-1 text-sm opacity-90 mt-1"><MapPin size={14} /> {venue.city}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{venue.monthly_fee || 500}</div>
                      <div className="text-xs opacity-80">Monthly Fee</div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div className="text-xs text-gray-500">Current Rating</div>
                      <div className="flex items-center gap-1 mt-1">
                        {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s <= rating ? "#fbbf24" : "none"} stroke={s <= rating ? "#fbbf24" : "#d1d5db"} />)}
                        <span className="ml-2 text-sm font-semibold">{venue.rating_name}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEditModal(venue)} className="p-1 text-gray-500 hover:text-blue-600" title="Edit"><Edit2 size={16} /></button>
                      <button onClick={() => deleteVenue(venue.id)} className="p-1 text-gray-500 hover:text-red-600" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {venue.status !== 'Active' && (
                      <button onClick={() => approveVenue(venue.id)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Approve</button>
                    )}
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => updateRating(venue.id, s)} disabled={updatingId === venue.id} className={`px-3 py-1 rounded text-sm transition ${venue.rating === s ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                        {s}★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {venues.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No venues found.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Venue</h2>
              <button onClick={() => setEditingVenue(null)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Venue Name" className="w-full p-2 border rounded" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
              <input type="text" placeholder="City" className="w-full p-2 border rounded" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} />
              <input type="text" placeholder="Address" className="w-full p-2 border rounded" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} />
              <input type="number" placeholder="Capacity" className="w-full p-2 border rounded" value={editForm.capacity} onChange={e => setEditForm({...editForm, capacity: e.target.value})} />
              <select className="w-full p-2 border rounded" value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})}>
                <option value="">Select Type</option>
                <option>Restaurant</option><option>Banquet Hall</option><option>Hotel</option><option>Convention Center</option>
              </select>
              <button onClick={updateVenueDetails} className="w-full bg-orange-600 text-white py-2 rounded-lg">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
