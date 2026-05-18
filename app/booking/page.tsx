"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, CheckCircle } from "lucide-react";

const bookingEvent = {
  id: "1",
  title: "Startup Founders Mixer",
  date: "24 May 2026",
  day: "Friday",
  time: "6:30 PM",
  venue: "The Leela, Mumbai",
  location: "Sahar, Mumbai",
  price: 399,
  originalPrice: 999,
  discount: "60% OFF",
  availableSeats: 45,
  totalSeats: 124,
};

export default function BookingPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [tickets, setTickets] = useState(1);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [bookingComplete, setBookingComplete] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const totalAmount = bookingEvent.price * tickets;
  const serviceFee = Math.round(totalAmount * 0.05);
  const gst = Math.round(totalAmount * 0.18);
  const grandTotal = totalAmount + serviceFee + gst;

  // FULL WIDTH - NO SIDE SPACE
  const containerStyle = {
    width: "100%",
    margin: "0",
    padding: isMobile ? "16px" : "24px",
    fontFamily: "'Inter', sans-serif",
    background: "#f8fafc",
    minHeight: "100vh"
  };

  const innerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%"
  };

  const cardStyle = {
    background: "white",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid #eef2ff",
    marginBottom: "24px"
  };

  if (bookingComplete) {
    return (
      <div style={containerStyle}>
        <div style={innerStyle}>
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "80px", marginBottom: "24px" }}>🎉</div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>Booking Confirmed!</h1>
            <p style={{ fontSize: "16px", color: "#666", marginBottom: "32px" }}>Your ticket has been booked successfully.</p>
            <Link href="/">
              <button style={{ background: "#f97316", color: "white", border: "none", borderRadius: "40px", padding: "12px 32px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>Back to Home</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#f97316", margin: 0 }}>GCE</h1>
          </Link>
          <Link href={`/events/${bookingEvent.id}`}>
            <button style={{ background: "white", border: "1px solid #ddd", borderRadius: "40px", padding: "8px 20px", fontSize: "13px", cursor: "pointer" }}>← Back to Event</button>
          </Link>
        </div>

        {/* Progress Steps */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px", gap: "16px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: step >= 1 ? "#f97316" : "#e2e8f0", color: step >= 1 ? "white" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>1</div>
            <div style={{ fontSize: "12px", color: step >= 1 ? "#f97316" : "#94a3b8" }}>Details</div>
          </div>
          <div style={{ width: "60px", height: "2px", background: step >= 2 ? "#f97316" : "#e2e8f0", marginTop: "20px" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: step >= 2 ? "#f97316" : "#e2e8f0", color: step >= 2 ? "white" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>2</div>
            <div style={{ fontSize: "12px", color: step >= 2 ? "#f97316" : "#94a3b8" }}>Payment</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr", gap: "24px" }}>
          
          {/* Left Column */}
          <div>
            {step === 1 && (
              <div style={cardStyle}>
                <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px" }}>Event Details</h2>
                
                <div style={{ display: "flex", gap: "16px", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid #eef2ff" }}>
                  <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", color: "white" }}>🚀</div>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>{bookingEvent.title}</h3>
                    <p style={{ fontSize: "12px", color: "#666" }}>📅 {bookingEvent.date}, {bookingEvent.day} • {bookingEvent.time}</p>
                    <p style={{ fontSize: "12px", color: "#666" }}>📍 {bookingEvent.venue}</p>
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>Number of Tickets</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <button onClick={() => setTickets(Math.max(1, tickets - 1))} style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid #e2e8f0", background: "white", cursor: "pointer" }}>-</button>
                    <span style={{ fontSize: "20px", fontWeight: "600", minWidth: "40px", textAlign: "center" }}>{tickets}</span>
                    <button onClick={() => setTickets(Math.min(bookingEvent.availableSeats, tickets + 1))} style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid #e2e8f0", background: "white", cursor: "pointer" }}>+</button>
                    <span style={{ fontSize: "13px", color: "#666" }}>{bookingEvent.availableSeats} seats left</span>
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>Your Details</label>
                  <input type="text" placeholder="Full Name" style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "12px" }} />
                  <input type="email" placeholder="Email Address" style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "12px" }} />
                  <input type="tel" placeholder="Phone Number" style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
                </div>

                <button onClick={() => setStep(2)} style={{ width: "100%", background: "#f97316", color: "white", border: "none", borderRadius: "40px", padding: "14px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>Continue →</button>
              </div>
            )}

            {step === 2 && (
              <div style={cardStyle}>
                <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px" }}>Payment Method</h2>
                
                <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
                  {[
                    { id: "card", label: "Credit/Debit Card", icon: "💳" },
                    { id: "upi", label: "UPI", icon: "📱" },
                    { id: "netbanking", label: "Net Banking", icon: "🏦" },
                  ].map((method) => (
                    <button key={method.id} onClick={() => setPaymentMethod(method.id)} style={{ flex: 1, padding: "12px", border: paymentMethod === method.id ? "2px solid #f97316" : "1px solid #e2e8f0", borderRadius: "12px", background: paymentMethod === method.id ? "#fff7ed" : "white", cursor: "pointer" }}>
                      <div style={{ fontSize: "24px", marginBottom: "4px" }}>{method.icon}</div>
                      <div style={{ fontSize: "12px", fontWeight: paymentMethod === method.id ? "600" : "400" }}>{method.label}</div>
                    </button>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div style={{ marginBottom: "24px" }}>
                    <input type="text" placeholder="Card Number" style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "12px" }} />
                    <div style={{ display: "flex", gap: "12px" }}>
                      <input type="text" placeholder="MM/YY" style={{ flex: 1, padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
                      <input type="text" placeholder="CVV" style={{ flex: 1, padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <input type="text" placeholder="UPI ID (e.g., name@okhdfcbank)" style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "24px" }} />
                )}

                <button onClick={() => setBookingComplete(true)} style={{ width: "100%", background: "#f97316", color: "white", border: "none", borderRadius: "40px", padding: "14px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>Pay ₹{grandTotal} →</button>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div style={{ ...cardStyle, position: "sticky", top: "20px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>Order Summary</h2>
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span style={{ color: "#666" }}>Ticket Price</span><span>₹{bookingEvent.price} × {tickets}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span style={{ color: "#666" }}>Service Fee (5%)</span><span>₹{serviceFee}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span style={{ color: "#666" }}>GST (18%)</span><span>₹{gst}</span></div>
              </div>
              <div style={{ borderTop: "1px solid #eef2ff", paddingTop: "16px", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "700" }}><span>Total</span><span style={{ color: "#f97316" }}>₹{grandTotal}</span></div>
              </div>
              <div style={{ background: "#f1f5f9", borderRadius: "12px", padding: "12px", fontSize: "12px", color: "#666" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}><CheckCircle size={14} style={{ color: "#22c55e" }} /><span>Free cancellation (24h before)</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle size={14} style={{ color: "#22c55e" }} /><span>Secure payment</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Nav - Mobile Only */}
        {isMobile && (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #eef2ff", padding: "12px 20px", marginTop: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Link href="/"><div style={{ fontSize: "22px" }}>🏠</div><div style={{ fontSize: "10px", color: "#64748b" }}>Home</div></Link>
              <Link href="/events"><div style={{ fontSize: "22px" }}>🔍</div><div style={{ fontSize: "10px", color: "#64748b" }}>Explore</div></Link>
              <Link href="/dashboard/user"><div style={{ fontSize: "22px" }}>👤</div><div style={{ fontSize: "10px", color: "#f97316", fontWeight: "600" }}>Profile</div></Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
