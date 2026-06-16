"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Users, DollarSign, CheckCircle, XCircle } from "lucide-react";

export default function VenueBookings() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventIdFilter = searchParams.get("eventId");
  const [bookings, setBookings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState(eventIdFilter || "");

  useEffect(() => {
    fetchVenueAndData();
  }, [selectedEventId]);

  async function fetchVenueAndData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: venueData } = await supabase.from("venues").select("id").eq("user_id", user.id).maybeSingle();
    if (!venueData) { setLoading(false); return; }

    const { data: eventsData } = await supabase.from("events").select("id, title").eq("venue_id", venueData.id);
    setEvents(eventsData || []);

    if (!selectedEventId && eventsData?.length) setSelectedEventId(eventsData[0].id);
    if (!selectedEventId) { setBookings([]); setLoading(false); return; }

    const { data: bookingsData } = await supabase
      .from("bookings")
      .select(`id, user_id, total_amount, status, created_at, users(email, full_name)`)
      .eq("event_id", selectedEventId)
      .order("created_at", { ascending: false });
    setBookings(bookingsData || []);
    setLoading(false);
  }

  if (loading) return <div className="p-8 text-center">Loading bookings...</div>;
  if (events.length === 0) return <div className="p-8 text-center">No events found. Create events first.</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Event Bookings</h1>
        <select className="border rounded-lg p-2" value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)}>
          {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
        </select>
      </div>
      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">No bookings for this event yet.</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th></tr></thead>
            <tbody>{bookings.map(b => (<tr key={b.id} className="hover:bg-gray-50"><td className="px-6 py-4"><div>{b.users?.full_name || b.users?.email}</div><div className="text-xs text-gray-500">{b.users?.email}</div></td><td className="px-6 py-4">₹{b.total_amount || 0}</td><td className="px-6 py-4"><span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${b.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{b.status || 'Pending'}</span></td><td className="px-6 py-4">{new Date(b.created_at).toLocaleDateString()}</td></tr>))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
