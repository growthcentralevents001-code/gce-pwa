"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, Minus, Plus, CreditCard, Wallet } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<any>(null);
  const [tickets, setTickets] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState("razorpay");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/booking/" + eventId);
      return;
    }

    async function fetchEvent() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (!error && data) {
        setEvent(data);
      }
      setLoading(false);
    }
    fetchEvent();
  }, [user, router, eventId]);

  const handleProceed = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    const ticketPrice = event?.price || 0;
    const convenienceFee = 99;
    const gst = Math.round((ticketPrice * tickets + convenienceFee) * 0.18);
    const total = ticketPrice * tickets + convenienceFee + gst;

    const bookingData = {
      eventId: event?.id,
      eventName: event?.title,
      date: event?.date,
      time: event?.time || "6:30 PM",
      venue: event?.venue,
      tickets,
      ticketPrice,
      convenienceFee,
      gst,
      total,
      paymentMethod: selectedPayment,
      userId: user?.id,
      userName: user?.name,
      userEmail: user?.email
    };
    localStorage.setItem("currentBooking", JSON.stringify(bookingData));
    router.push("/checkout");
  };

  if (loading) return <div style={{ textAlign: "center", padding: "48px" }}>Loading...</div>;
  if (!event) return <div style={{ textAlign: "center", padding: "48px" }}>Event not found</div>;
  if (!user) return <div style={{ textAlign: "center", padding: "48px" }}>Redirecting to login...</div>;

  const ticketPrice = event.price;
  const convenienceFee = 99;
  const gst = Math.round((ticketPrice * tickets + convenienceFee) * 0.18);
  const total = ticketPrice * tickets + convenienceFee + gst;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>Book Your Tickets</h1>
        <p style={{ color: "#64748b" }}>Complete your booking in few easy steps</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px" }}>
        <div>
          <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff", marginBottom: "24px", display: "flex", gap: "16px" }}>
            <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>🎉</div>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "700" }}>{event.title}</h2>
              <div style={{ fontSize: "13px", color: "#64748b", display: "flex", gap: "16px", marginTop: "4px", flexWrap: "wrap" }}>
                <span><Calendar size={12} style={{ display: "inline", marginRight: "4px" }} /> {event.date} at {event.time || "6:30 PM"}</span>
                <span><MapPin size={12} style={{ display: "inline", marginRight: "4px" }} /> {event.venue}</span>
              </div>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Select Tickets</h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #eef2ff" }}>
              <div>
                <div style={{ fontWeight: "500" }}>Regular Ticket</div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>Includes event access + refreshments</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontWeight: "600", color: "#f97316" }}>₹{ticketPrice}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button onClick={() => setTickets(Math.max(1, tickets - 1))} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #e2e8f0", background: "white", cursor: "pointer" }}><Minus size={14} /></button>
                  <span style={{ width: "40px", textAlign: "center", fontWeight: "500" }}>{tickets}</span>
                  <button onClick={() => setTickets(tickets + 1)} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #e2e8f0", background: "white", cursor: "pointer" }}><Plus size={14} /></button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Payment Method</h3>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px", border: selectedPayment === "razorpay" ? "2px solid #f97316" : "1px solid #e2e8f0", borderRadius: "12px", cursor: "pointer", background: selectedPayment === "razorpay" ? "#fef3c7" : "white" }}>
                <input type="radio" name="payment" value="razorpay" checked={selectedPayment === "razorpay"} onChange={(e) => setSelectedPayment(e.target.value)} style={{ accentColor: "#f97316" }} />
                <CreditCard size={18} style={{ color: "#f97316" }} /> Razorpay
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px", border: selectedPayment === "wallet" ? "2px solid #f97316" : "1px solid #e2e8f0", borderRadius: "12px", cursor: "pointer", background: selectedPayment === "wallet" ? "#fef3c7" : "white" }}>
                <input type="radio" name="payment" value="wallet" checked={selectedPayment === "wallet"} onChange={(e) => setSelectedPayment(e.target.value)} style={{ accentColor: "#f97316" }} />
                <Wallet size={18} style={{ color: "#f97316" }} /> GCE Wallet (₹1,250)
              </label>
            </div>
          </div>
        </div>

        <div>
          <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff", position: "sticky", top: "20px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Order Summary</h3>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}><span style={{ color: "#64748b" }}>Ticket Price ({tickets} x ₹{ticketPrice})</span><span>₹{ticketPrice * tickets}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}><span style={{ color: "#64748b" }}>Convenience Fee</span><span>₹{convenienceFee}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}><span style={{ color: "#64748b" }}>GST (18%)</span><span>₹{gst}</span></div>
              <div style={{ borderTop: "1px solid #eef2ff", marginTop: "12px", paddingTop: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "18px" }}><span>Total</span><span style={{ color: "#f97316" }}>₹{total}</span></div>
              </div>
            </div>
            <button onClick={handleProceed} style={{ width: "100%", background: "#f97316", color: "white", border: "none", padding: "14px", borderRadius: "40px", cursor: "pointer", fontWeight: "600", fontSize: "16px" }}>Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
