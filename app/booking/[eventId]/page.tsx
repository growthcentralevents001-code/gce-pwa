"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Calendar, MapPin, Users, IndianRupee, Ticket, CreditCard, Clock, ChevronLeft, ChevronRight, MessageCircle, Shield, Sparkles } from "lucide-react";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.eventId as string;
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    if (eventId) {
      supabase.from("events").select("*").eq("id", eventId).single().then(({ data }) => {
        setEvent(data);
        if (data?.date) {
          const days = Math.ceil((new Date(data.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          setDaysLeft(days > 0 ? days : 0);
        }
        setLoading(false);
      });
    }
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [eventId]);

  const handleBooking = async () => {
    if (!user) {
      router.push(`/login?redirectTo=/booking/${eventId}`);
      return;
    }
    alert(`Booking ${tickets} ticket(s) for ${event?.title}. Total: ₹${event?.price * tickets}. Payment coming soon.`);
  };

  const shareOnWhatsApp = () => {
    const text = `Check out ${event?.title} at GCE Events! ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div><p className="mt-4 text-gray-500">Loading...</p></div>;
  if (!event) return <div className="min-h-screen flex items-center justify-center bg-white"><p className="text-gray-500">Event not found.</p></div>;

  const totalAmount = event.price * tickets;
  const progress = ((event.registered || 0) / event.capacity) * 100;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-orange-600 py-8 px-4 w-full">
        <div className="max-w-full mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1 mb-4"><Sparkles className="w-4 h-4 text-white" /><span className="text-white text-sm font-medium">Featured Event</span></div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{event.title}</h1>
          <div className="flex items-center justify-center gap-2 text-orange-100"><MapPin className="w-4 h-4" /> {event.city}</div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 py-8 md:py-12">
        <div className="bg-orange-50 rounded-2xl p-4 mb-8 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3"><div className="bg-white rounded-full p-2"><Clock className="w-5 h-5 text-orange-600" /></div><div><p className="text-xs text-gray-500">Event starts in</p><p className="font-bold text-gray-900">{daysLeft} days</p></div></div>
          <button onClick={shareOnWhatsApp} className="flex items-center gap-2 text-orange-600 hover:bg-white px-3 py-1 rounded-full"><MessageCircle className="w-4 h-4" /> Share</button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 p-6 bg-orange-50/30"><h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Calendar className="w-5 h-5 text-orange-600" /> Event Details</h2></div>
              <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="flex items-start gap-3"><div className="bg-orange-100 rounded-lg p-2"><Calendar className="w-4 h-4 text-orange-600" /></div><div><p className="text-xs text-gray-500">DATE & TIME</p><p className="font-semibold text-gray-900">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} • {event.time || "6:30 PM"}</p></div></div>
                  <div className="flex items-start gap-3"><div className="bg-orange-100 rounded-lg p-2"><MapPin className="w-4 h-4 text-orange-600" /></div><div><p className="text-xs text-gray-500">VENUE</p><p className="font-semibold text-gray-900">{event.venue}, {event.city}</p></div></div>
                  <div className="flex items-start gap-3"><div className="bg-orange-100 rounded-lg p-2"><Users className="w-4 h-4 text-orange-600" /></div><div><p className="text-xs text-gray-500">CAPACITY</p><p className="font-semibold text-gray-900">{event.registered || 0} / {event.capacity} attending</p><div className="w-32 mt-1 h-1.5 bg-gray-200 rounded-full"><div className="h-full bg-orange-500 rounded-full" style={{ width: `${progress}%` }}></div></div></div></div>
                  <div className="flex items-start gap-3"><div className="bg-orange-100 rounded-lg p-2"><IndianRupee className="w-4 h-4 text-orange-600" /></div><div><p className="text-xs text-gray-500">PRICE</p><p className="font-semibold text-gray-900">₹{event.price} per ticket</p></div></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 p-6 bg-orange-50/30"><h2 className="text-xl font-bold text-gray-900">📖 About This Event</h2></div>
              <div className="p-6"><p className="text-gray-600 leading-relaxed">{event.description || "Join us for an unforgettable experience! Network with industry leaders, gain valuable insights, and create lasting memories."}</p></div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-6 border border-orange-200">
              <div className="bg-orange-600 p-5 text-white"><h2 className="text-xl font-bold flex items-center gap-2"><Ticket className="w-5 h-5" /> Booking Summary</h2></div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b"><span className="text-gray-600">Ticket Price</span><span className="font-bold text-gray-900">₹{event.price}</span></div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setTickets(Math.max(1, tickets - 1))} className="w-8 h-8 bg-gray-100 rounded-full hover:bg-orange-100"><ChevronLeft className="w-4 h-4" /></button>
                    <span className="font-bold text-lg w-8 text-center">{tickets}</span>
                    <button onClick={() => setTickets(tickets + 1)} className="w-8 h-8 bg-gray-100 rounded-full hover:bg-orange-100"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="pt-2"><div className="flex justify-between items-center"><span className="text-lg font-bold text-gray-900">Total Amount</span><span className="text-2xl font-bold text-orange-600">₹{totalAmount}</span></div></div>
                <button onClick={handleBooking} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 mt-2"><CreditCard className="w-5 h-5" /> Proceed to Payment</button>
                <div className="flex items-center justify-center gap-3 text-xs text-gray-400"><Shield className="w-3 h-3" /> Secure payment • No hidden charges</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
