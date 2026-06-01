"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Ticket, Download, AlertCircle, Clock } from "lucide-react";

type BookingStatus = "confirmed" | "cancelled" | "completed";

interface Booking {
  id: string;
  eventId: string;
  eventName: string;
  date: string;
  time: string;
  venue: string;
  tickets: number;
  totalAmount: number;
  status: BookingStatus;
  bookingDate: string;
}

const isUpcomingEvent = (eventDateStr: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(eventDateStr);
  return eventDate >= today;
};

const getRefundAmount = (eventDate: string, totalAmount: number): { refund: number; policy: string } => {
  const today = new Date();
  const event = new Date(eventDate);
  const daysUntilEvent = Math.ceil((event.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilEvent > 7) return { refund: totalAmount, policy: "100% refund (More than 7 days before event)" };
  if (daysUntilEvent >= 3) return { refund: Math.round(totalAmount * 0.5), policy: "50% refund (3-7 days before event)" };
  if (daysUntilEvent >= 1) return { refund: Math.round(totalAmount * 0.25), policy: "25% refund (1-3 days before event)" };
  return { refund: 0, policy: "No refund (Less than 24 hours before event)" };
};

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<Booking | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("userBookings");
    if (stored) {
      setBookings(JSON.parse(stored));
    } else {
      const mockBookings: Booking[] = [
        {
          id: "GCE123456",
          eventId: "1",
          eventName: "Startup Founders Mixer",
          date: "24 May 2025",
          time: "6:30 PM",
          venue: "The Leela, Mumbai",
          tickets: 2,
          totalAmount: 3198,
          status: "confirmed",
          bookingDate: "20 May 2025"
        },
        {
          id: "GCE789012",
          eventId: "3",
          eventName: "Fintech Leadership Summit",
          date: "30 May 2025",
          time: "10:00 AM",
          venue: "Taj Lands End, Mumbai",
          tickets: 1,
          totalAmount: 5099,
          status: "confirmed",
          bookingDate: "22 May 2025"
        },
        {
          id: "GCE345678",
          eventId: "6",
          eventName: "AI & Future of Work",
          date: "10 Jun 2025",
          time: "9:30 AM",
          venue: "WeWork, BKC",
          tickets: 3,
          totalAmount: 10497,
          status: "confirmed",
          bookingDate: "23 May 2025"
        }
      ];
      setBookings(mockBookings);
      localStorage.setItem("userBookings", JSON.stringify(mockBookings));
    }
    setLoading(false);
  }, []);

  const handleCancelBooking = (booking: Booking) => {
    setShowCancelModal(booking);
  };

  const confirmCancel = () => {
    if (!showCancelModal) return;
    
    setCancellingId(showCancelModal.id);
    const refundInfo = getRefundAmount(showCancelModal.date, showCancelModal.totalAmount);
    
    setTimeout(() => {
      const updatedBookings: Booking[] = bookings.map(b =>
        b.id === showCancelModal.id ? { ...b, status: "cancelled" as BookingStatus } : b
      );
      setBookings(updatedBookings);
      localStorage.setItem("userBookings", JSON.stringify(updatedBookings));
      setCancellingId(null);
      setShowCancelModal(null);
      alert(`Booking cancelled!\n${refundInfo.policy}\nRefund Amount: ₹${refundInfo.refund}`);
    }, 1000);
  };

  const handleDownloadTicket = (booking: Booking) => {
    alert(`Download ticket for ${booking.eventName} (Coming soon)`);
  };

  const upcomingBookings = bookings.filter(b => b.status === "confirmed" && isUpcomingEvent(b.date));
  const pastBookings = bookings.filter(b => b.status === "confirmed" && !isUpcomingEvent(b.date));
  const cancelledBookings = bookings.filter(b => b.status === "cancelled");

  if (loading) {
    return <div style={{ textAlign: "center", padding: "48px" }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>My Bookings</h1>
        <p style={{ color: "#64748b" }}>View and manage all your event bookings</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "16px", border: "1px solid #eef2ff", textAlign: "center" }}>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#f97316" }}>{upcomingBookings.length}</div>
          <div style={{ color: "#64748b" }}>Upcoming</div>
        </div>
        <div style={{ background: "white", borderRadius: "16px", padding: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#22c55e" }}>{pastBookings.length}</div>
          <div style={{ color: "#64748b" }}>Past Events</div>
        </div>
        <div style={{ background: "white", borderRadius: "16px", padding: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#ef4444" }}>{cancelledBookings.length}</div>
          <div style={{ color: "#64748b" }}>Cancelled</div>
        </div>
      </div>

      {upcomingBookings.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>📅 Upcoming Events</h2>
          {upcomingBookings.map(booking => (
            <div key={booking.id} style={{ background: "white", borderRadius: "20px", padding: "20px", marginBottom: "16px", border: "1px solid #eef2ff", display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
              <div>
                <div><strong>{booking.eventName}</strong></div>
                <div style={{ fontSize: "14px", color: "#64748b" }}>{booking.date} at {booking.time} · {booking.venue}</div>
                <div style={{ fontSize: "14px", color: "#64748b" }}>{booking.tickets} tickets · ₹{booking.totalAmount}</div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button onClick={() => handleDownloadTicket(booking)} style={{ background: "white", border: "1px solid #ccc", padding: "6px 12px", borderRadius: "20px", cursor: "pointer" }}><Download size={14} /> Ticket</button>
                <button onClick={() => handleCancelBooking(booking)} disabled={cancellingId === booking.id} style={{ background: "#fee2e2", color: "#991b1b", border: "none", padding: "6px 12px", borderRadius: "20px", cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pastBookings.length > 0 && (
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>✅ Past Events</h2>
          {pastBookings.map(booking => (
            <div key={booking.id} style={{ background: "#f8fafc", borderRadius: "16px", padding: "16px", marginBottom: "12px", border: "1px solid #eef2ff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <div><strong>{booking.eventName}</strong></div>
                <div style={{ fontSize: "14px", color: "#64748b" }}>{booking.date} · {booking.venue}</div>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ background: "#dcfce7", color: "#166534", padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>Completed</span>
                <button onClick={() => handleDownloadTicket(booking)} style={{ background: "none", border: "none", cursor: "pointer" }}><Download size={18} style={{ color: "#f97316" }} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cancelledBookings.length > 0 && (
        <div style={{ marginTop: "32px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>❌ Cancelled</h2>
          {cancelledBookings.map(booking => (
            <div key={booking.id} style={{ background: "#fef2f2", borderRadius: "16px", padding: "16px", marginBottom: "12px", border: "1px solid #fee2e2" }}>
              <div><strong>{booking.eventName}</strong></div>
              <div style={{ fontSize: "14px", color: "#64748b" }}>{booking.date} · {booking.venue}</div>
            </div>
          ))}
        </div>
      )}

      {bookings.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <h3>No bookings yet</h3>
          <button onClick={() => router.push("/")} style={{ background: "#f97316", color: "white", border: "none", padding: "10px 20px", borderRadius: "40px", marginTop: "16px", cursor: "pointer" }}>Explore Events</button>
        </div>
      )}

      {showCancelModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "24px", padding: "32px", maxWidth: "450px", width: "90%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <AlertCircle size={24} style={{ color: "#f97316" }} />
              <h2 style={{ fontSize: "22px", fontWeight: "700" }}>Cancel Booking?</h2>
            </div>
            <p style={{ color: "#64748b", marginBottom: "16px" }}>Are you sure you want to cancel <strong>{showCancelModal.eventName}</strong>?</p>
            
            <div style={{ background: "#f1f5f9", padding: "16px", borderRadius: "12px", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Clock size={16} style={{ color: "#f97316" }} />
                <span style={{ fontWeight: "500" }}>Refund Policy</span>
              </div>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px" }}>
                {getRefundAmount(showCancelModal.date, showCancelModal.totalAmount).policy}
              </p>
              <p style={{ fontSize: "16px", fontWeight: "600", color: "#f97316" }}>
                Refund: ₹{getRefundAmount(showCancelModal.date, showCancelModal.totalAmount).refund}
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={confirmCancel} style={{ flex: 1, background: "#ef4444", color: "white", border: "none", padding: "12px", borderRadius: "40px", cursor: "pointer" }}>Yes, Cancel</button>
              <button onClick={() => setShowCancelModal(null)} style={{ flex: 1, background: "#f1f5f9", color: "#64748b", border: "none", padding: "12px", borderRadius: "40px", cursor: "pointer" }}>Go Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
