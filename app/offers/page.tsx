"use client";

import { useState } from "react";
import { Percent, Gift, Clock, Filter } from "lucide-react";

export default function OffersPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  
  const offers = [
    { id: 1, name: "20% OFF on Business Events", discount: "20%", type: "Discount", validTill: "30 Jun 2025", code: "GCE20", usage: "All members", color: "#f97316" },
    { id: 2, name: "Flat ₹100 OFF", discount: "₹100", type: "Discount", validTill: "15 Jul 2025", code: "GCE100", usage: "New members only", color: "#22c55e" },
    { id: 3, name: "Buy 1 Get 1 Free", discount: "BOGO", type: "Free", validTill: "10 Jul 2025", code: "GCEBOGO", usage: "Premium members", color: "#8b5cf6" },
    { id: 4, name: "Free Drink with Ticket", discount: "1 Free Drink", type: "Free", validTill: "25 Jun 2025", code: "GCEFREE", usage: "All members", color: "#3b82f6" },
  ];

  const filteredOffers = activeFilter === "all" ? offers : offers.filter(o => o.type.toLowerCase() === activeFilter);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Code ${code} copied!`);
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>Exclusive Offers</h1>
        <p style={{ color: "#64748b" }}>Save on your next event with these special deals</p>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
        {["all", "discount", "free"].map(filter => (
          <button key={filter} onClick={() => setActiveFilter(filter)} style={{ padding: "8px 20px", borderRadius: "40px", border: "none", background: activeFilter === filter ? "#f97316" : "white", color: activeFilter === filter ? "white" : "#64748b", cursor: "pointer", fontWeight: "500" }}>
            {filter === "all" ? "All Offers" : filter === "discount" ? "Discounts" : "Free Offers"}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
        {filteredOffers.map(offer => (
          <div key={offer.id} style={{ background: "white", borderRadius: "20px", overflow: "hidden", border: "1px solid #eef2ff" }}>
            <div style={{ background: `linear-gradient(135deg, ${offer.color}20, ${offer.color}10)`, padding: "20px", textAlign: "center" }}>
              {offer.type === "Discount" ? <Percent size={40} style={{ color: offer.color }} /> : <Gift size={40} style={{ color: offer.color }} />}
              <div style={{ fontSize: "28px", fontWeight: "800", color: offer.color, marginTop: "8px" }}>{offer.discount}</div>
              <div style={{ fontSize: "14px", color: "#64748b" }}>{offer.name}</div>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", color: "#64748b" }}>Valid till {offer.validTill}</span>
                <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "12px", fontSize: "11px" }}>{offer.usage}</span>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => copyCode(offer.code)} style={{ flex: 1, background: "#f97316", color: "white", border: "none", padding: "10px", borderRadius: "40px", cursor: "pointer", fontWeight: "500" }}>Copy Code</button>
                <button style={{ background: "white", border: "1px solid #e2e8f0", padding: "10px", borderRadius: "40px", cursor: "pointer" }}>View Events</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
