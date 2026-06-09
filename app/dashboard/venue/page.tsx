"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Plus, Calendar, MapPin, Users, IndianRupee, Edit2, Trash2 } from "lucide-react";

interface VenueProfile {
  id: string;
  name: string;
  city: string;
  status: string;
  rating_name: string;
  monthly_fee: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  price: number;
  registered: number;
  capacity: number;
}

export default function VenueDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<VenueProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({ name: "", city: "", address: "", capacity: "", type: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Get venue profile
    const { data: venue, error: venueError } = await supabase
      .from("venues")
      .select("id, name, city, status, rating_name, monthly_fee")
      .eq("user_id", user.id)
      .maybeSingle();

    if (venueError) {
      console.error(venueError);
    } else if (venue) {
      setProfile(venue);
      // Fetch events for this venue
      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .eq("venue_id", venue.id)
        .order("date", { ascending: false });
      if (eventsData) setEvents(eventsData);
    } else {
      setProfile(null);
    }
    setLoading(false);
  }

  async function createVenueProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    const { data: newVenue, error: insertError } = await supabase
      .from("venues")
      .insert({
        name: form.name,
        city: form.city,
        address: form.address,
        capacity: parseInt(form.capacity),
        type: form.type,
        user_id: user.id,
        status: "Pending",
        rating: 1,
        rating_name: "Basic",
        monthly_fee: 500,
        fee_adjustable: false,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
    } else {
      alert("Venue profile created! Please wait for admin approval.");
      fetchData(); // refresh dashboard
      setShowCreateForm(false);
      setForm({ name: "", city: "", address: "", capacity: "", type: "" });
    }
    setLoading(false);
  }

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  // If no venue profile, show creation form
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-4">Venue Profile Required</h1>
          <p className="text-gray-500 mb-6">Create your venue profile to start hosting events.</p>
          {!showCreateForm ? (
            <button onClick={() => setShowCreateForm(true)} className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus size={18} /> Create Venue Profile
            </button>
          ) : (
            <form onSubmit={createVenueProfile} className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <input type="text" placeholder="Venue Name *" className="w-full p-2 border rounded" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <input type="text" placeholder="City *" className="w-full p-2 border rounded" value={form.city} onChange={e => setForm({...form, city: e.target.value})} required />
              <input type="text" placeholder="Address" className="w-full p-2 border rounded" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              <input type="number" placeholder="Capacity" className="w-full p-2 border rounded" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} />
              <select className="w-full p-2 border rounded" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="">Select Type</option>
                <option>Restaurant</option><option>Banquet Hall</option><option>Hotel</option><option>Convention Center</option>
              </select>
              <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded">Create Venue</button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="w-full bg-gray-200 py-2 rounded">Cancel</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // If profile exists, show full dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Venue Dashboard</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6 border-l-4 border-orange-500">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div><p className="text-xs text-gray-500">Venue</p><p className="font-semibold">{profile.name}</p></div>
            <div><p className="text-xs text-gray-500">City</p><p className="font-semibold">{profile.city}</p></div>
            <div><p className="text-xs text-gray-500">Status</p><p className="font-semibold text-green-600">{profile.status}</p></div>
            <div><p className="text-xs text-gray-500">Rating</p><p className="font-semibold">{profile.rating_name}</p></div>
            <div><p className="text-xs text-gray-500">Monthly Fee</p><p className="font-semibold text-orange-600">₹{profile.monthly_fee}</p></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4 text-center"><div className="text-2xl font-bold text-orange-600">{events.length}</div><div className="text-sm text-gray-500">Total Events</div></div>
          <div className="bg-white rounded-xl shadow p-4 text-center"><div className="text-2xl font-bold text-orange-600">0</div><div className="text-sm text-gray-500">Total Bookings</div></div>
          <div className="bg-white rounded-xl shadow p-4 text-center"><div className="text-2xl font-bold text-orange-600">₹0</div><div className="text-sm text-gray-500">Total Revenue</div></div>
        </div>

        {/* Events Tab */}
        <div className="mb-4">
          <button onClick={() => router.push("/dashboard/venue/create-event")} className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18} /> Create New Event</button>
        </div>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Event Name</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Bookings</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {events.length === 0 && <tr><td colSpan={5} className="text-center py-4 text-gray-500">No events yet. Create your first event!</td></tr>}
              {events.map(event => (
                <tr key={event.id}>
                  <td className="px-4 py-2">{event.title}</td>
                  <td className="px-4 py-2">{event.date}</td>
                  <td className="px-4 py-2">₹{event.price}</td>
                  <td className="px-4 py-2">{event.registered || 0}/{event.capacity}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => router.push(`/admin/events/edit/${event.id}`)} className="text-blue-600 mr-2">Edit</button>
                    <button onClick={async () => { if (confirm("Delete?")) await supabase.from("events").delete().eq("id", event.id); fetchData(); }} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
