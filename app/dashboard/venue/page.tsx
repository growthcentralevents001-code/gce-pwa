"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface VenueProfile {
  id: string;
  name: string;
  city: string;
  subscription_status: string;
  rating: number;
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
  status: string;
}

interface Booking {
  id: string;
  event_id: string;
  tickets: number;
  amount: number;
  created_at: string;
  event_title?: string;
}

interface Payout {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function VenueDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<VenueProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("events");
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    setLoading(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Get venue profile
    const { data: venue, error: venueError } = await supabase
      .from("venues")
      .select("id, name, city, subscription_status, rating, rating_name, monthly_fee")
      .eq("user_id", user.id)
      .maybeSingle();

    if (venueError) {
      setError("Error fetching venue: " + venueError.message);
    } else if (!venue) {
      setError("No venue profile found. Please contact admin.");
    } else {
      setProfile(venue);
    }

    // Get events
    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });
    if (eventsData) setEvents(eventsData as Event[]);

    // Get bookings for these events
    if (eventsData && eventsData.length > 0) {
      const eventIds = eventsData.map(e => e.id);
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select("*, events(title)")
        .in("event_id", eventIds);
      if (bookingsData) {
        const enriched = bookingsData.map((b: any) => ({
          ...b,
          event_title: b.events?.title
        }));
        setBookings(enriched);
      }
    }

    // Get payouts for this venue
    if (profile?.id) {
      const { data: payoutsData } = await supabase
        .from("payouts")
        .select("*")
        .eq("venue_id", profile.id)
        .order("created_at", { ascending: false });
      if (payoutsData) setPayouts(payoutsData);
    }

    setLoading(false);
  }

  async function deleteEvent(id: string) {
    if (confirm("Delete this event permanently?")) {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (!error) fetchAllData();
      else alert("Delete failed: " + error.message);
    }
  }

  async function startEdit(event: Event) {
    setEditingEventId(event.id);
    setEditTitle(event.title);
  }

  async function saveEdit(id: string) {
    const { error } = await supabase.from("events").update({ title: editTitle }).eq("id", id);
    if (!error) {
      setEditingEventId(null);
      fetchAllData();
    } else {
      alert("Update failed: " + error.message);
    }
  }

  const stats = {
    totalEvents: events.length,
    totalBookings: bookings.reduce((sum, b) => sum + b.tickets, 0),
    totalRevenue: bookings.reduce((sum, b) => sum + b.amount, 0),
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error}</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center">No venue profile found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Venue Dashboard</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Venue Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div><p className="text-xs text-gray-500">Venue Name</p><p className="font-medium">{profile.name}</p></div>
            <div><p className="text-xs text-gray-500">City</p><p className="font-medium">{profile.city}</p></div>
            <div><p className="text-xs text-gray-500">Status</p><p className="font-medium text-green-600">{profile.subscription_status}</p></div>
            <div><p className="text-xs text-gray-500">Rating</p><p className="font-medium">{profile.rating_name}</p></div>
            <div><p className="text-xs text-gray-500">Monthly Fee</p><p className="font-medium text-orange-600">₹{profile.monthly_fee}</p></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 text-center"><div className="text-2xl font-bold text-orange-600">{stats.totalEvents}</div><div className="text-sm text-gray-600">Total Events</div></div>
          <div className="bg-white rounded-xl shadow p-4 text-center"><div className="text-2xl font-bold text-orange-600">{stats.totalBookings}</div><div className="text-sm text-gray-600">Total Bookings</div></div>
          <div className="bg-white rounded-xl shadow p-4 text-center"><div className="text-2xl font-bold text-orange-600">₹{stats.totalRevenue}</div><div className="text-sm text-gray-600">Total Revenue</div></div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-4 flex flex-wrap gap-2">
          {["events", "bookings", "payouts"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? "border-b-2 border-orange-500 text-orange-600" : "text-gray-500 hover:text-gray-700"}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Events Tab */}
        {activeTab === "events" && (
          <div>
            <button onClick={() => router.push("/dashboard/venue/create-event")} className="mb-4 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition">+ Create New Event</button>
            {events.length === 0 ? <p className="text-gray-500 text-center py-8">No events yet.</p> : events.map(event => (
              <div key={event.id} className="bg-white rounded-lg shadow p-4 mb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                {editingEventId === event.id ? (
                  <div className="flex flex-wrap gap-2 w-full">
                    <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="flex-1 border rounded px-3 py-1" />
                    <button onClick={() => saveEdit(event.id)} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                    <button onClick={() => setEditingEventId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                  </div>
                ) : (
                  <>
                    <div><div className="font-semibold">{event.title}</div><div className="text-sm text-gray-500">{event.date} | ₹{event.price} | {event.registered}/{event.capacity} booked</div></div>
                    <div className="flex gap-2"><button onClick={() => startEdit(event)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Edit</button><button onClick={() => deleteEvent(event.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button></div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>{bookings.length === 0 ? <p className="text-gray-500 text-center py-8">No bookings yet.</p> : bookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-lg shadow p-4 mb-3"><div className="font-semibold">{booking.event_title}</div><div>Tickets: {booking.tickets} | Amount: ₹{booking.amount}</div><div className="text-xs text-gray-400">{new Date(booking.created_at).toLocaleString()}</div></div>
          ))}</div>
        )}

        {/* Payouts Tab */}
        {activeTab === "payouts" && (
          <div>{payouts.length === 0 ? <p className="text-gray-500 text-center py-8">No payouts yet.</p> : payouts.map(payout => (
            <div key={payout.id} className="bg-white rounded-lg shadow p-4 mb-3 flex justify-between items-center"><div>₹{payout.amount}</div><div className={payout.status === "paid" ? "text-green-600 font-medium" : "text-yellow-600"}>{payout.status}</div><div className="text-xs text-gray-400">{new Date(payout.created_at).toDateString()}</div></div>
          ))}</div>
        )}
      </div>
    </div>
  );
}
