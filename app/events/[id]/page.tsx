"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Calendar, Clock, MapPin, Users, Share2, Bell, Heart, ArrowLeft } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  price: number;
  capacity: number;
  registered: number;
  vertical: string;
  image_url?: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reminderSet, setReminderSet] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    fetchEvent(params.id as string);
  }, [params?.id]);

  async function fetchEvent(eventId: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (error) {
      console.error("Error fetching event:", error);
      setError("Event not found or failed to load.");
      setLoading(false);
      return;
    }
    setEvent(data as Event);
    setLoading(false);
  }

  const handleWhatsAppShare = () => {
    const url = `${window.location.origin}/events/${params?.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent("Check out this event: " + event?.title + " " + url)}`, '_blank');
  };

  const handleAddToCalendar = () => {
    if (!event) return;
    const start = new Date(`${event.date}T${event.time || "18:00"}`);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${event.title}&dates=${start.toISOString().replace(/-|:|\./g, '')}/${end.toISOString().replace(/-|:|\./g, '')}&details=${event.description}&location=${event.venue}`;
    window.open(googleUrl, '_blank');
    alert("Event added to your Google Calendar!");
  };

  const handleRemindMe = () => {
    setReminderSet(true);
    localStorage.setItem(`reminder_${params?.id}`, "true");
    alert("Reminder set! We'll notify you 2 hours before the event.");
  };

  const toggleWishlist = () => {
    const newState = !wishlist;
    setWishlist(newState);
    if (newState) {
      localStorage.setItem(`wishlist_${params?.id}`, "true");
      alert("Event saved to your wishlist!");
    } else {
      localStorage.removeItem(`wishlist_${params?.id}`);
      alert("Removed from wishlist.");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading event details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!event) return <div className="p-8 text-center">Event not found.</div>;

  const formattedDate = new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const attendeesPercent = Math.min(100, (event.registered / event.capacity) * 100);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-gray-600 hover:text-orange-600">
        <ArrowLeft size={18} /> Back
      </button>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1"><Calendar size={14} /> {formattedDate}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {event.time || "TBD"}</span>
              <span className="flex items-center gap-1"><MapPin size={14} /> {event.venue}, {event.city}</span>
            </div>
            <div className="bg-orange-50 text-orange-700 inline-block px-3 py-1 rounded-full text-xs mb-4">{event.vertical}</div>
            <p className="text-gray-700 leading-relaxed">{event.description || "No description provided."}</p>
          </div>
        </div>

        {/* Sidebar - Booking card */}
        <div>
          <div className="bg-white rounded-2xl shadow p-6 sticky top-4">
            <div className="text-3xl font-bold text-orange-600 mb-2">₹{event.price}</div>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span><Users size={14} className="inline mr-1" /> {event.registered} / {event.capacity} attending</span>
              <span className="text-green-600">{Math.round(attendeesPercent)}% full</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${attendeesPercent}%` }}></div>
            </div>

            <button className="w-full bg-orange-600 text-white py-2 rounded-full font-semibold hover:bg-orange-700 transition mb-4">
              Book Now
            </button>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button onClick={handleWhatsAppShare} className="flex items-center justify-center gap-1 bg-green-500 text-white text-sm py-2 rounded-full hover:bg-green-600">📱 Share</button>
              <button onClick={handleAddToCalendar} className="flex items-center justify-center gap-1 border border-gray-300 text-gray-700 text-sm py-2 rounded-full hover:bg-gray-50">📅 Add</button>
              <button onClick={handleRemindMe} disabled={reminderSet} className={`flex items-center justify-center gap-1 text-sm py-2 rounded-full ${reminderSet ? 'bg-gray-100 text-gray-500' : 'border border-gray-300 hover:bg-gray-50'}`}>🔔 {reminderSet ? "Reminder Set" : "Remind Me"}</button>
              <button onClick={toggleWishlist} className={`flex items-center justify-center gap-1 text-sm py-2 rounded-full ${wishlist ? 'bg-orange-100 text-orange-600' : 'border border-gray-300 hover:bg-gray-50'}`}>❤️ {wishlist ? "Saved" : "Save"}</button>
            </div>

            <div className="text-center text-xs text-gray-400 pt-4 border-t">
              Organised by GCE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
