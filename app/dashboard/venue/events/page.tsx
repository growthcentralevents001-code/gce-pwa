"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, Eye, Edit, Trash2, PlusCircle, DollarSign, TrendingUp } from "lucide-react";

export default function VenueEvents() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [venue, setVenue] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, live: 0, totalBookings: 0, totalRevenue: 0 });

  async function fetchVenueAndEvents() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    // Check if venue profile exists
    const { data: initialVenue, error: venueError } = await supabase
      .from("venues")
      .select("id, name")
      .eq("user_id", user.id)
      .maybeSingle();

    let venueData = initialVenue;

    // If no venue profile, create one automatically
    if (!venueData) {
      const { data: newVenue, error: insertError } = await supabase
        .from("venues")
        .insert({
          user_id: user.id,
          name: "My Venue",
          city: "Unknown",
          status: "active"
        })
        .select()
        .single();

      if (!insertError && newVenue) {
        venueData = newVenue;
      } else {
        console.error("Failed to create venue:", insertError);
        setLoading(false);
        return;
      }
    }

    setVenue(venueData);

    if (!venueData) {
      setLoading(false);
      return;
    }

    // Fetch events
    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .eq("venue_id", venueData.id)
      .order("date", { ascending: false });
    setEvents(eventsData || []);

    // Calculate stats
    const liveEvents = eventsData?.filter(e => e.status === "Live").length || 0;
    const totalBookings = eventsData?.reduce((sum, e) => sum + (e.registered || 0), 0) || 0;
    const totalRevenue = eventsData?.reduce((sum, e) => sum + ((e.price || 0) * (e.registered || 0)), 0) || 0;
    setStats({ total: eventsData?.length || 0, live: liveEvents, totalBookings, totalRevenue });
    setLoading(false);
  }

  useEffect(() => {
    fetchVenueAndEvents();
  }, []);

  async function deleteEvent(eventId: string) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    const { error } = await supabase.from("events").delete().eq("id", eventId);
    if (error) alert("Error: " + error.message);
    else fetchVenueAndEvents();
  }

  if (loading) return <div className="p-8 text-center">Loading events...</div>;
  if (!venue) return <div className="p-8 text-center">Unable to create venue profile. Please contact support.</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Events</h1>
          <p className="text-gray-500">Manage all your Marketplace events</p>
        </div>
        <button onClick={() => router.push("/dashboard/venue/create-event")} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"><PlusCircle size={18} /> Create New Event</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4 border-l-4 border-orange-500"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Total Events</p><p className="text-2xl font-bold">{stats.total}</p></div><Calendar className="text-orange-500" size={24} /></div></div>
        <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Live Events</p><p className="text-2xl font-bold">{stats.live}</p></div><TrendingUp className="text-green-500" size={24} /></div></div>
        <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Total Bookings</p><p className="text-2xl font-bold">{stats.totalBookings}</p></div><Users className="text-blue-500" size={24} /></div></div>
        <div className="bg-white rounded-xl shadow p-4 border-l-4 border-purple-500"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Revenue</p><p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p></div><DollarSign className="text-purple-500" size={24} /></div></div>
      </div>
      {events.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center"><p className="text-gray-500 mb-4">No events created yet.</p><button onClick={() => router.push("/dashboard/venue/create-event")} className="bg-orange-600 text-white px-4 py-2 rounded-lg">Create Your First Event</button></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center"><span className="text-4xl">🎉</span></div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{event.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${event.status === 'Live' ? 'bg-green-100 text-green-700' : event.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{event.status === 'Live' ? 'Live' : event.status === 'pending_approval' ? 'Pending' : event.status || 'Draft'}</span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><Calendar size={14} /> {new Date(event.date).toLocaleDateString()} at {event.time || "TBD"}</div>
                  <div className="flex items-center gap-2"><MapPin size={14} /> {venue.name}</div>
                  <div className="flex items-center gap-2"><Users size={14} /> {event.registered || 0} / {event.capacity} registered</div>
                  <div className="flex items-center gap-2"><DollarSign size={14} /> ₹{event.price} per person</div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex gap-2">
                    <button onClick={() => router.push(`/events/${event.id}`)} className="text-orange-600 hover:bg-orange-50 p-1 rounded"><Eye size={18} /></button>
                    <button onClick={() => router.push(`/dashboard/venue/events/edit/${event.id}`)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={18} /></button>
                    <button onClick={() => router.push(`/dashboard/venue/bookings?eventId=${event.id}`)} className="text-green-600 hover:bg-green-50 p-1 rounded"><Users size={18} /></button>
                    <button onClick={() => deleteEvent(event.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={18} /></button>
                  </div>
                  <span className="text-xl font-bold text-orange-600">₹{event.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
