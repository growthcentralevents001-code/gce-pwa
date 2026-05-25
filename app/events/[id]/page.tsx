"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Calendar, Clock, MapPin, Users, Share2, Bell, 
  UserPlus, CheckCircle, MessageCircle, Heart, 
  ArrowLeft, Star, Award, TrendingUp, Bookmark,
  Mic, FileText, Link2, Download, Mail
} from "lucide-react";

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reminderSet, setReminderSet] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showSurvey, setShowSurvey] = useState(false);
  
  useEffect(() => {
    // Mock API call
    setTimeout(() => {
      setEvent({
        id: parseInt(id as string),
        name: "Startup Founders Mixer",
        vertical: "Connect",
        date: "2025-05-24",
        time: "18:30",
        venue: "The Leela, Mumbai",
        price: "₹1,500",
        description: "Join us for an evening of networking with top founders and investors. Share ideas, build connections, and grow your business.",
        agenda: [
          { time: "6:30 PM - 7:00 PM", title: "Registration & Networking", speaker: "Host" },
          { time: "7:00 PM - 7:30 PM", title: "Keynote: Future of Startups", speaker: "Rahul Sharma, VC Partner" },
          { time: "7:30 PM - 8:30 PM", title: "Panel Discussion", speaker: "3 Founders" },
          { time: "8:30 PM - 9:30 PM", title: "Open Networking & Dinner", speaker: "All" }
        ],
        speakers: [
          { name: "Rahul Sharma", role: "VC Partner at Accel", image: "RS" },
          { name: "Priya Mehta", role: "Founder of TechNova", image: "PM" },
          { name: "Amit Kumar", role: "Angel Investor", image: "AK" }
        ],
        totalAttendees: 124,
        capacity: 200,
        organizer: "GCE Admin",
        endTime: "2025-05-24T21:30:00",
        image: "🎉",
        venueMap: "https://maps.google.com/?q=The+Leela+Mumbai"
      });
      setLoading(false);
    }, 500);

    // Load wishlist from localStorage
    const saved = localStorage.getItem(`wishlist_${id}`);
    if (saved) setWishlist(true);
  }, [id]);

  // Check if event ended (for survey) - after event loaded
  useEffect(() => {
    if (event && new Date(event.endTime) < new Date()) {
      setShowSurvey(true);
    }
  }, [event]);

  const connectionsAttending = [
    { id: 1, name: "Rohan Mehta", avatar: "RM", type: "Gold Member" },
    { id: 2, name: "Neha Kapoor", avatar: "NK", type: "Silver Member" },
  ];

  const relatedEvents = [
    { id: 2, name: "Fintech Summit 2025", date: "30 May", price: "₹4,000" },
    { id: 3, name: "Women in Tech", date: "5 Jun", price: "₹2,500" },
  ];

  const handleWhatsAppShare = () => {
    const url = `https://dev.growthcentralevents.com/events/${id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent("Check out this event: " + event?.name + " " + url)}`, '_blank');
  };

  const handleAddToCalendar = () => {
    const start = new Date(`${event.date}T${event.time}`);
    const end = new Date(start.getTime() + 3*60*60*1000);
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${event.name}&dates=${start.toISOString().replace(/-|:|\./g, '')}/${end.toISOString().replace(/-|:|\./g, '')}&details=${event.description}&location=${event.venue}`;
    window.open(googleUrl, '_blank');
    alert("Event added to your Google Calendar!");
  };

  const handleRemindMe = () => {
    setReminderSet(true);
    localStorage.setItem(`reminder_${id}`, "true");
    alert("Reminder set! We'll notify you 2 hours before the event.");
  };

  const toggleWishlist = () => {
    const newState = !wishlist;
    setWishlist(newState);
    if (newState) {
      localStorage.setItem(`wishlist_${id}`, "true");
      alert("Event saved to your wishlist!");
    } else {
      localStorage.removeItem(`wishlist_${id}`);
      alert("Removed from wishlist.");
    }
  };

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your feedback!");
    setShowSurvey(false);
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "48px" }}>Loading event details...</div>;
  }

  if (!event) return <div>Event not found</div>;

  const formattedDate = new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const isEventEnded = new Date(event.endTime) < new Date();

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", background: "#f8fafc", minHeight: "100vh" }}>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px" }}>
        {/* LEFT COLUMN */}
        <div>
          {/* Hero */}
          <div style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "24px", padding: "40px", textAlign: "center", marginBottom: "24px" }}>
            <span style={{ fontSize: "64px" }}>{event.image}</span>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "white", marginTop: "16px" }}>{event.name}</h1>
            <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "20px", fontSize: "14px", color: "white", display: "inline-block" }}>{event.vertical}</span>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid #e2e8f0", marginBottom: "20px", overflowX: "auto" }}>
            {["details", "agenda", "speakers", "venue"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "10px 20px", background: "none", border: "none", borderBottom: activeTab === tab ? "2px solid #f97316" : "none", color: activeTab === tab ? "#f97316" : "#64748b", fontWeight: "500", cursor: "pointer" }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "details" && (
            <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>About this event</h2>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>{event.description}</p>
            </div>
          )}
          {activeTab === "agenda" && (
            <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>Event Agenda</h2>
              {event.agenda.map((item: any, idx: number) => (
                <div key={idx} style={{ padding: "12px 0", borderBottom: idx < event.agenda.length-1 ? "1px solid #eef2ff" : "none" }}>
                  <div style={{ fontWeight: "600" }}>{item.time}</div>
                  <div style={{ fontWeight: "500" }}>{item.title}</div>
                  <div style={{ fontSize: "13px", color: "#64748b" }}>Speaker: {item.speaker}</div>
                </div>
              ))}
            </div>
          )}
          {activeTab === "speakers" && (
            <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>Speakers</h2>
              {event.speakers.map((speaker: any, idx: number) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px 0", borderBottom: idx < event.speakers.length-1 ? "1px solid #eef2ff" : "none" }}>
                  <div style={{ width: "48px", height: "48px", background: "#e0e7ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{speaker.image}</div>
                  <div>
                    <div style={{ fontWeight: "600" }}>{speaker.name}</div>
                    <div style={{ fontSize: "13px", color: "#64748b" }}>{speaker.role}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === "venue" && (
            <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>Venue Information</h2>
              <p><strong>Address:</strong> {event.venue}</p>
              <a href={event.venueMap} target="_blank" rel="noopener noreferrer" style={{ color: "#f97316", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "12px" }}><MapPin size={16} /> Open in Google Maps</a>
            </div>
          )}

          {/* Network Attending */}
          <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Users size={18} style={{ color: "#f97316" }} /> Your Network Attending
            </h2>
            {connectionsAttending.map(conn => (
              <div key={conn.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", background: "#f8fafc", borderRadius: "16px", marginBottom: "8px" }}>
                <div style={{ width: "36px", height: "36px", background: "#e0e7ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{conn.avatar}</div>
                <div><div style={{ fontWeight: "500" }}>{conn.name}</div><div style={{ fontSize: "12px", color: "#64748b" }}>{conn.type}</div></div>
              </div>
            ))}
          </div>

          {/* Related Events */}
          <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>You might also like</h2>
            {relatedEvents.map(rel => (
              <div key={rel.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #eef2ff" }}>
                <div>
                  <div style={{ fontWeight: "500" }}>{rel.name}</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>{rel.date}</div>
                </div>
                <button onClick={() => router.push(`/events/${rel.id}`)} style={{ background: "#f97316", color: "white", border: "none", padding: "4px 12px", borderRadius: "20px", cursor: "pointer" }}>View</button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN - Booking Card */}
        <div>
          <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff", position: "sticky", top: "20px" }}>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#f97316" }}>{event.price}</div>
            <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "16px" }}><Calendar size={14} style={{ display: "inline", marginRight: "4px" }} /> {formattedDate} at {event.time}</div>
            
            {/* Live Attendance Counter */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748b", marginBottom: "4px" }}>
                <span><Users size={14} style={{ display: "inline", marginRight: "4px" }} /> {event.totalAttendees} / {event.capacity} attending</span>
                <span style={{ color: "#22c55e" }}>🔥 {Math.round((event.totalAttendees/event.capacity)*100)}% full</span>
              </div>
              <div style={{ width: "100%", background: "#e2e8f0", borderRadius: "10px", height: "6px" }}>
                <div style={{ width: `${(event.totalAttendees/event.capacity)*100}%`, background: "#f97316", height: "6px", borderRadius: "10px" }}></div>
              </div>
            </div>

            <button style={{ width: "100%", background: "#f97316", color: "white", border: "none", padding: "12px", borderRadius: "40px", fontWeight: "600", cursor: "pointer", marginBottom: "16px" }}>
              Book Now
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <button onClick={handleWhatsAppShare} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "#25D366", color: "white", border: "none", padding: "8px", borderRadius: "40px", cursor: "pointer", fontSize: "13px" }}><Share2 size={14} /> Share</button>
              <button onClick={handleAddToCalendar} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "white", border: "1px solid #e2e8f0", padding: "8px", borderRadius: "40px", cursor: "pointer", fontSize: "13px" }}><Calendar size={14} /> Add to Calendar</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <button onClick={handleRemindMe} disabled={reminderSet} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: reminderSet ? "#dcfce7" : "white", border: "1px solid #e2e8f0", padding: "8px", borderRadius: "40px", cursor: reminderSet ? "default" : "pointer", fontSize: "13px" }}><Bell size={14} /> {reminderSet ? "Reminder Set" : "Remind Me"}</button>
              <button onClick={toggleWishlist} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: wishlist ? "#fef3c7" : "white", border: "1px solid #e2e8f0", padding: "8px", borderRadius: "40px", cursor: "pointer", fontSize: "13px" }}><Heart size={14} color={wishlist ? "#f97316" : "#64748b"} /> {wishlist ? "Saved" : "Save"}</button>
            </div>

            <div style={{ fontSize: "12px", color: "#94a3b8", textAlign: "center", borderTop: "1px solid #eef2ff", paddingTop: "16px", marginTop: "8px" }}>
              Organized by {event.organizer}
            </div>
          </div>
        </div>
      </div>

      {/* Post-Event Survey */}
      {showSurvey && !isEventEnded && (
        <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff", marginTop: "24px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>How was the event?</h3>
          <form onSubmit={handleSurveySubmit}>
            <select required style={{ width: "100%", padding: "10px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "12px" }}>
              <option value="">Rate your experience</option>
              <option>Excellent ⭐⭐⭐⭐⭐</option>
              <option>Good ⭐⭐⭐⭐</option>
              <option>Average ⭐⭐⭐</option>
              <option>Poor ⭐⭐</option>
            </select>
            <textarea placeholder="Any feedback?" rows={2} style={{ width: "100%", padding: "10px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "12px" }}></textarea>
            <button type="submit" style={{ background: "#f97316", color: "white", border: "none", padding: "10px 20px", borderRadius: "40px", cursor: "pointer" }}>Submit Feedback</button>
          </form>
        </div>
      )}
    </div>
  );
}
