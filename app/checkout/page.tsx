"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, MapPin, CreditCard, Lock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/app/context/AuthContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [booking, setBooking] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState("");

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return;

    // If not logged in, redirect to login
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }

    // Load booking data
    const stored = localStorage.getItem("currentBooking");
    if (stored) {
      const bookingData = JSON.parse(stored);
      setBooking(bookingData);
      setFormData(prev => ({ 
        ...prev, 
        name: user.name || "", 
        email: user.email || "",
        phone: user.phone || ""
      }));
      setDebug(`User: ${user.name} (${user.id})`);
    } else {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill all required fields");
      return;
    }
    if (!user) {
      alert("Session expired. Please login again.");
      router.push("/login");
      return;
    }
    
    setLoading(true);
    
    try {
      const bookingId = "GCE" + Math.floor(Math.random() * 1000000);
      
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          event_id: booking.eventId,
          tickets: booking.tickets,
          total_amount: booking.total,
          status: 'confirmed',
          booking_date: new Date().toISOString()
        })
        .select();

      if (bookingError) throw bookingError;

      // Update event registered count
      const { data: eventData } = await supabase
        .from('events')
        .select('registered')
        .eq('id', booking.eventId)
        .single();

      const newRegistered = (eventData?.registered || 0) + booking.tickets;

      await supabase
        .from('events')
        .update({ registered: newRegistered })
        .eq('id', booking.eventId);

      const confirmationData = {
        ...booking,
        bookingId,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        bookingDate: new Date().toLocaleDateString(),
        bookingDbId: bookingData?.[0]?.id
      };
      localStorage.setItem("bookingConfirmation", JSON.stringify(confirmationData));
      localStorage.removeItem("currentBooking");
      
      router.push("/booking/confirmation");
    } catch (err: any) {
      console.error("Booking error:", err);
      alert("Something went wrong: " + (err.message || "Please try again"));
    } finally {
      setLoading(false);
    }
  };

  // Show loading while auth is initializing
  if (isLoading) {
    return <div style={{ textAlign: "center", padding: "48px" }}>Loading...</div>;
  }

  if (!user) {
    return <div style={{ textAlign: "center", padding: "48px" }}>Redirecting to login...</div>;
  }

  if (!booking) {
    return <div style={{ textAlign: "center", padding: "48px" }}>No booking found. <button onClick={() => router.push("/")}>Go Home</button></div>;
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>Checkout</h1>
        <p style={{ color: "#64748b" }}>Enter your details to complete booking</p>
        <p style={{ fontSize: "12px", color: "#22c55e" }}>✓ Logged in as: {user.name} ({user.email})</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Contact Information</h3>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Full Name *</label>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px" }}>
                <User size={18} style={{ color: "#94a3b8", marginRight: "12px" }} />
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ flex: 1, border: "none", outline: "none" }} />
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Email Address *</label>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px" }}>
                <Mail size={18} style={{ color: "#94a3b8", marginRight: "12px" }} />
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required style={{ flex: 1, border: "none", outline: "none" }} />
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Phone Number *</label>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px" }}>
                <Phone size={18} style={{ color: "#94a3b8", marginRight: "12px" }} />
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required style={{ flex: 1, border: "none", outline: "none" }} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Address (Optional)</label>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px" }}>
                <MapPin size={18} style={{ color: "#94a3b8", marginRight: "12px" }} />
                <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} style={{ flex: 1, border: "none", outline: "none" }} />
              </div>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Payment Details</h3>
            <div style={{ background: "#fef3c7", padding: "16px", borderRadius: "12px", marginBottom: "16px" }}>
              <p style={{ fontSize: "14px", color: "#92400e" }}>💡 Demo Mode: No actual payment will be processed</p>
            </div>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}><CreditCard size={16} style={{ color: "#f97316" }} /> <span style={{ fontWeight: "500" }}>Card Number</span></div>
              <input type="text" placeholder="4242 4242 4242 4242" style={{ width: "100%", border: "none", outline: "none" }} />
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 1, border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px" }}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>Expiry</span>
                <input type="text" placeholder="MM/YY" style={{ width: "100%", border: "none", outline: "none" }} />
              </div>
              <div style={{ flex: 1, border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px" }}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>CVV</span>
                <input type="text" placeholder="123" style={{ width: "100%", border: "none", outline: "none" }} />
              </div>
            </div>
          </div>
        </form>

        <div>
          <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Order Summary</h3>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span>{booking.tickets} x {booking.eventName}</span><span>₹{booking.ticketPrice * booking.tickets}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "#64748b" }}><span>Convenience Fee</span><span>₹{booking.convenienceFee}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "#64748b" }}><span>GST (18%)</span><span>₹{booking.gst}</span></div>
              <div style={{ borderTop: "1px solid #eef2ff", marginTop: "8px", paddingTop: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "18px" }}><span>Total</span><span style={{ color: "#f97316" }}>₹{booking.total}</span></div>
              </div>
            </div>
            <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", background: "#f97316", color: "white", border: "none", padding: "14px", borderRadius: "40px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              {loading ? "Processing..." : <><Lock size={16} /> Pay ₹{booking.total}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
