"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Users, Heart, ArrowLeft, Share2, Bell, Bookmark } from "lucide-react";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const eventId = params.id;

  useEffect(() => {
    if (eventId) fetchEvent();
  }, [eventId]);

  async function fetchEvent() {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();
    if (error) {
      console.error("Error fetching event:", error);
      setLoading(false);
      return;
    }
    setEvent(data);
    await checkWishlist();
    setLoading(false);
  }

  async function checkWishlist() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("saved_events")
      .select("event_id")
      .eq("user_id", user.id)
      .eq("event_id", eventId);
    if (data && data.length > 0) setWishlisted(true);
  }

  async function toggleWishlist() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("Please login to save wishlist"); return; }
    if (wishlisted) {
      const { error } = await supabase
        .from("saved_events")
        .delete()
        .eq("user_id", user.id)
        .eq("event_id", eventId);
      if (!error) {
        setWishlisted(false);
        alert("Removed from wishlist");
      } else {
        alert("Error: " + error.message);
      }
    } else {
      const { error } = await supabase
        .from("saved_events")
        .insert({ user_id: user.id, event_id: eventId });
      if (!error) {
        setWishlisted(true);
        alert("Added to wishlist!");
      } else {
        alert("Error: " + error.message);
      }
    }
  }

  if (loading) return <div className="max-w-4xl mx-auto p-6 text-center">Loading...</div>;
  if (!event) return <div className="max-w-4xl mx-auto p-6 text-center">Event not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-orange-600 mb-4">
        <ArrowLeft size={20} /> Back
      </button>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="h-64 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
          <span className="text-6xl">🎉</span>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <button onClick={toggleWishlist} className="p-2">
              <Heart className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} size={28} />
            </button>
          </div>
          <div className="mt-4 space-y-2 text-gray-600">
            <div className="flex items-center gap-2"><Calendar size={18} /> {new Date(event.date).toLocaleDateString()} at {event.time}</div>
            <div className="flex items-center gap-2"><MapPin size={18} /> {event.venue}, {event.city}</div>
            <div className="flex items-center gap-2"><Users size={18} /> {event.registered || 0} / {event.capacity} attending</div>
            <div className="text-2xl font-bold text-orange-600 mt-4">₹{event.price}</div>
          </div>
          {event.description && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold">About this event</h3>
              <p className="text-gray-600 mt-2">{event.description}</p>
            </div>
          )}
          <div className="mt-6 flex flex-wrap gap-4">
            <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700">Book Now</button>
            <button className="flex items-center gap-2 border px-4 py-2 rounded-lg"><Share2 size={18} /> Share</button>
            <button className="flex items-center gap-2 border px-4 py-2 rounded-lg"><Bell size={18} /> Remind</button>
            <button onClick={toggleWishlist} className="flex items-center gap-2 border px-4 py-2 rounded-lg">
              <Bookmark size={18} /> {wishlisted ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
