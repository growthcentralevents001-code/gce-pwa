"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";

export default function TicketsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchBookings() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("bookings")
        .select("id, event_id, status, events(title, date, venue)")
        .eq("user_id", user.id);

      setBookings(data || []);
      setLoading(false);
    }
    fetchBookings();
  }, []);

  const generateQR = async (bookingId: string, eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const ticketData = `${bookingId}|${eventId}|${user?.id}|${Date.now()}`;
    const qr = await QRCode.toDataURL(ticketData);
    setQrCodes(prev => ({ ...prev, [bookingId]: qr }));
  };

  if (loading) return <div className="p-8 text-center">Loading tickets...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Tickets</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No tickets found. Book an event first.</p>
      ) : (
        bookings.map((b: any) => (
          <div key={b.id} className="bg-white rounded-lg shadow p-4 mb-4">
            <h3 className="font-bold">{b.events?.title}</h3>
            <p>{b.events?.date} • {b.events?.venue}</p>
            {!qrCodes[b.id] ? (
              <button onClick={() => generateQR(b.id, b.event_id)} className="mt-2 px-4 py-2 bg-orange-600 text-white rounded">
                Generate Ticket
              </button>
            ) : (
              <img src={qrCodes[b.id]} className="mt-2 w-32 h-32" alt="QR" />
            )}
          </div>
        ))
      )}
    </div>
  );
}
