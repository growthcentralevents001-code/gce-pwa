"use client";

import { useState } from "react";
import { 
  Building2, Calendar, TrendingUp, CreditCard, Plus, Eye, 
  CheckCircle, AlertCircle, X, FileText, DollarSign, Tag, 
  Filter, Download, Send, Clock, Users, Award
} from "lucide-react";

interface Offer {
  id: number;
  name: string;
  type: string;
  discount: string;
  target: string[];
  redeemed: number;
  total: number;
  status: string;
  validTill: string;
}

interface Proposal {
  id: number;
  requestId: number;
  eventName: string;
  amount: string;
  venueOptions: string[];
  status: string;
  sentDate: string;
}

export default function EnterpriseDashboard() {
  const [activeTab, setActiveTab] = useState("requests");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [budgetFilter, setBudgetFilter] = useState("all");

  const interestOptions = [
    "Fintech", "SaaS", "D2C", "Healthtech", "Edtech", 
    "Marketing", "Sales", "HR", "Legal", "Networking", 
    "Comedy", "Live Music", "Wellness", "Workshops", "Wine"
  ];

  const [requests, setRequests] = useState([
    { id: 1, company: "TechCorp India", eventType: "Sales Training", cities: "Mumbai, Delhi", dates: "15-20 Jun 2025", budget: "₹15,00,000", status: "Pending" },
    { id: 2, company: "FinTech Solutions", eventType: "Leadership Offsite", cities: "Goa", dates: "5-7 Jul 2025", budget: "₹25,00,000", status: "Approved" },
    { id: 3, company: "SaaS Corp", eventType: "Product Launch", cities: "Mumbai, Pune, Bangalore", dates: "10 Jun 2025", budget: "₹20,00,000", status: "In Progress" },
  ]);

  const [proposals, setProposals] = useState<Proposal[]>([
    { id: 1, requestId: 1, eventName: "Sales Training", amount: "₹14,50,000", venueOptions: ["The Leela Mumbai", "JW Marriott Pune"], status: "Sent", sentDate: "22 May 2025" },
  ]);

  const [offers, setOffers] = useState<Offer[]>([
    { id: 1, name: "20% OFF on Business Events", type: "Discount", discount: "20%", target: ["Fintech", "SaaS"], redeemed: 45, total: 200, status: "Active", validTill: "30 Jun 2025" },
    { id: 2, name: "Buy 1 Get 1 Free", type: "Free Units", discount: "BOGO", target: ["All Members"], redeemed: 128, total: 500, status: "Pending", validTill: "15 Jul 2025" },
  ]);

  const [pastEvents] = useState([
    { id: 1, name: "AI Summit 2024", date: "15 Dec 2024", cities: "Mumbai, Bangalore", attendees: 450, revenue: "₹32,00,000" },
  ]);

  const [newRequest, setNewRequest] = useState({ company: "", eventType: "Sales Training", cities: "", dates: "", budget: "" });
  const [newOffer, setNewOffer] = useState({ name: "", type: "Discount", discount: "", target: [] as string[], validTill: "", total: 100 });
  const [newProposal, setNewProposal] = useState({ amount: "", venueOptions: "" });

  const filteredRequests = requests.filter(req => {
    if (budgetFilter === "all") return true;
    if (budgetFilter === "below10") return parseInt(req.budget.replace(/[^0-9]/g, '')) < 1000000;
    if (budgetFilter === "10to20") return parseInt(req.budget.replace(/[^0-9]/g, '')) >= 1000000 && parseInt(req.budget.replace(/[^0-9]/g, '')) < 2000000;
    if (budgetFilter === "above20") return parseInt(req.budget.replace(/[^0-9]/g, '')) >= 2000000;
    return true;
  });

  const stats = [
    { label: "Active Requests", value: requests.filter(r => r.status === "Pending").length.toString(), icon: FileText, color: "#f97316" },
    { label: "Approved Proposals", value: proposals.filter(p => p.status === "Accepted").length.toString(), icon: CheckCircle, color: "#22c55e" },
    { label: "Active Offers", value: offers.filter(o => o.status === "Active").length.toString(), icon: Tag, color: "#3b82f6" },
    { label: "Total Spent", value: "₹74,50,000", icon: DollarSign, color: "#8b5cf6" },
  ];

  const getStatusBadge = (status: string) => {
    if (status === "Pending") return { bg: "#fef3c7", color: "#92400e", icon: <Clock size={12} /> };
    if (status === "Approved" || status === "Active") return { bg: "#dcfce7", color: "#166534", icon: <CheckCircle size={12} /> };
    if (status === "Sent") return { bg: "#e0e7ff", color: "#3730a3", icon: <Send size={12} /> };
    if (status === "In Progress") return { bg: "#fef3c7", color: "#92400e", icon: <AlertCircle size={12} /> };
    return { bg: "#f1f5f9", color: "#475569", icon: null };
  };

  const handleAddRequest = () => {
    if (!newRequest.company || !newRequest.cities) { alert("Please fill company and cities"); return; }
    setRequests([...requests, { id: requests.length + 1, company: newRequest.company, eventType: newRequest.eventType, cities: newRequest.cities, dates: newRequest.dates || "TBD", budget: newRequest.budget || "TBD", status: "Pending" }]);
    setShowRequestModal(false);
    setNewRequest({ company: "", eventType: "Sales Training", cities: "", dates: "", budget: "" });
    alert("Event request submitted!");
  };

  const handleAddOffer = () => {
    if (!newOffer.name || !newOffer.discount) { alert("Please fill offer name and discount"); return; }
    setOffers([...offers, { id: offers.length + 1, name: newOffer.name, type: newOffer.type, discount: newOffer.discount, target: newOffer.target.length ? newOffer.target : ["All Members"], redeemed: 0, total: newOffer.total, status: "Pending", validTill: newOffer.validTill || "30 Jun 2025" }]);
    setShowOfferModal(false);
    setNewOffer({ name: "", type: "Discount", discount: "", target: [], validTill: "", total: 100 });
    alert("Offer created! Pending admin approval.");
  };

  const handleApproveOffer = (id: number) => {
    setOffers(offers.map(o => o.id === id ? { ...o, status: "Active" } : o));
    alert("Offer approved and live for members!");
  };

  const handleCreateProposal = (requestId: number) => {
    setSelectedRequestId(requestId);
    setShowProposalModal(true);
  };

  const handleAddProposal = () => {
    if (!newProposal.amount) { alert("Please enter amount"); return; }
    const request = requests.find(r => r.id === selectedRequestId);
    if (!request) return;
    const venueList = newProposal.venueOptions.split(",").map(v => v.trim());
    setProposals([...proposals, { id: proposals.length + 1, requestId: selectedRequestId!, eventName: request.eventType, amount: newProposal.amount, venueOptions: venueList, status: "Sent", sentDate: new Date().toLocaleDateString() }]);
    setShowProposalModal(false);
    setNewProposal({ amount: "", venueOptions: "" });
    alert("Proposal sent to client!");
  };

  const toggleInterest = (interest: string) => {
    setNewOffer(prev => ({
      ...prev,
      target: prev.target.includes(interest) ? prev.target.filter(i => i !== interest) : [...prev.target, interest]
    }));
  };

  const exportToCSV = () => {
    const headers = ["Company", "Event Type", "Cities", "Budget", "Status"];
    const rows = filteredRequests.map(r => [r.company, r.eventType, r.cities, r.budget, r.status]);
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "event-requests.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>Enterprise Dashboard</h1>
      <p style={{ color: "#64748b", marginBottom: "32px" }}>Manage event requests, proposals, and member offers with targeting</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: "24px", fontWeight: "800" }}>{stat.value}</div><div style={{ color: "#64748b", fontSize: "14px" }}>{stat.label}</div></div>
              <stat.icon size={28} style={{ color: stat.color, opacity: 0.7 }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid #e2e8f0", overflowX: "auto" }}>
          {["requests", "proposals", "offers", "pastevents"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "10px 20px", border: "none", background: "none", borderBottom: activeTab === tab ? "2px solid #f97316" : "none", color: activeTab === tab ? "#f97316" : "#64748b", fontWeight: "500", cursor: "pointer" }}>
              {tab === "requests" ? "Event Requests" : tab === "proposals" ? "Proposals" : tab === "offers" ? "My Offers" : "Past Events"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          {activeTab === "requests" && <button onClick={exportToCSV} style={{ background: "white", border: "1px solid #e2e8f0", padding: "8px 16px", borderRadius: "40px", cursor: "pointer" }}><Download size={16} /> Export</button>}
          <button onClick={() => setShowRequestModal(true)} style={{ background: "#f97316", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer" }}><Plus size={16} /> New Request</button>
        </div>
      </div>

      {/* Requests Tab with Budget Filter */}
      {activeTab === "requests" && (
        <div>
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center" }}>
            <Filter size={16} style={{ color: "#64748b" }} />
            <span style={{ fontSize: "14px", color: "#64748b" }}>Filter by Budget:</span>
            <select value={budgetFilter} onChange={(e) => setBudgetFilter(e.target.value)} style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid #e2e8f0", background: "white" }}>
              <option value="all">All</option>
              <option value="below10">Below ₹10L</option>
              <option value="10to20">₹10L - ₹20L</option>
              <option value="above20">Above ₹20L</option>
            </select>
          </div>
          <div style={{ background: "white", borderRadius: "20px", overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
              <thead><tr style={{ background: "#f8fafc", borderBottom: "1px solid #eef2ff" }}>
                <th style={{ padding: "16px", textAlign: "left" }}>Company</th><th>Event Type</th><th>Cities</th><th>Budget</th><th>Status</th><th>Actions</th>
             </tr></thead>
              <tbody>
                {filteredRequests.map(req => { const statusStyle = getStatusBadge(req.status);
                  return <tr key={req.id} style={{ borderBottom: "1px solid #eef2ff" }}>
                    <td style={{ padding: "16px" }}><div style={{ fontWeight: "600" }}>{req.company}</div><div style={{ fontSize: "12px", color: "#64748b" }}>{req.dates}</div></td>
                    <td style={{ padding: "16px" }}>{req.eventType}</td><td style={{ padding: "16px" }}>{req.cities}</td><td style={{ padding: "16px", fontWeight: "600", color: "#22c55e" }}>{req.budget}</td>
                    <td style={{ padding: "16px" }}><span style={{ background: statusStyle.bg, color: statusStyle.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>{statusStyle.icon} {req.status}</span></td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <button onClick={() => handleCreateProposal(req.id)} style={{ background: "#f97316", color: "white", border: "none", padding: "4px 12px", borderRadius: "20px", cursor: "pointer" }}>Create Proposal</button>
                    </td>
                   </tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Proposals Tab with Venue Options */}
      {activeTab === "proposals" && (
        <div style={{ background: "white", borderRadius: "20px", padding: "24px" }}>
          {proposals.map(prop => (
            <div key={prop.id} style={{ marginBottom: "20px", padding: "16px", border: "1px solid #eef2ff", borderRadius: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div><strong>{prop.eventName}</strong><br /><span style={{ fontSize: "13px", color: "#64748b" }}>Sent: {prop.sentDate}</span></div>
                <div><span style={{ fontSize: "18px", fontWeight: "700", color: "#22c55e" }}>{prop.amount}</span></div>
                <div><span style={{ background: "#e0e7ff", color: "#3730a3", padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>{prop.status}</span></div>
              </div>
              <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #eef2ff" }}>
                <div style={{ fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>📍 Venue Options:</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {prop.venueOptions.map((venue, idx) => <span key={idx} style={{ background: "#f1f5f9", padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>{venue}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Offers Tab with Interest Filters */}
      {activeTab === "offers" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
            <button onClick={() => setShowOfferModal(true)} style={{ background: "#f97316", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer" }}><Plus size={16} /> Create Offer</button>
          </div>
          <div style={{ background: "white", borderRadius: "20px", overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: "#f8fafc", borderBottom: "1px solid #eef2ff" }}>
                <th style={{ padding: "16px", textAlign: "left" }}>Offer Name</th><th>Discount</th><th>Target Interests</th><th>Redeemed</th><th>Valid Till</th><th>Status</th><th>Actions</th>
              </tr></thead>
              <tbody>{offers.map(offer => {
                const statusStyle = getStatusBadge(offer.status);
                return <tr key={offer.id} style={{ borderBottom: "1px solid #eef2ff" }}>
                  <td style={{ padding: "16px" }}><div style={{ fontWeight: "600" }}>{offer.name}</div><div style={{ fontSize: "12px", color: "#64748b" }}>{offer.type}</div></td>
                  <td style={{ padding: "16px", fontWeight: "600", color: "#f97316" }}>{offer.discount}</td>
                  <td style={{ padding: "16px" }}><div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>{offer.target.map(t => <span key={t} style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: "12px", fontSize: "11px" }}>{t}</span>)}</div></td>
                  <td style={{ padding: "16px" }}>{offer.redeemed} / {offer.total}</td>
                  <td style={{ padding: "16px" }}>{offer.validTill}</td>
                  <td style={{ padding: "16px" }}><span style={{ background: statusStyle.bg, color: statusStyle.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>{statusStyle.icon} {offer.status}</span></td>
                  <td style={{ padding: "16px" }}>{offer.status === "Pending" && <button onClick={() => handleApproveOffer(offer.id)} style={{ background: "#dcfce7", color: "#166534", border: "none", padding: "4px 12px", borderRadius: "20px", cursor: "pointer" }}>Activate</button>}</td>
                </tr>;
              })}</tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "pastevents" && (
        <div style={{ background: "white", borderRadius: "20px", overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr style={{ background: "#f8fafc", borderBottom: "1px solid #eef2ff" }}>
            <th style={{ padding: "16px" }}>Event Name</th><th>Date</th><th>Cities</th><th>Attendees</th><th>Revenue</th>
          </tr></thead>
          <tbody>{pastEvents.map(event => <tr key={event.id}><td style={{ padding: "16px" }}>{event.name}</td><td>{event.date}</td><td>{event.cities}</td><td>{event.attendees}</td><td style={{ fontWeight: "600", color: "#22c55e" }}>{event.revenue}</td></tr>)}</tbody></table>
        </div>
      )}

      {/* Proposal Modal */}
      {showProposalModal && (<div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
        <div style={{ background: "white", borderRadius: "24px", padding: "32px", maxWidth: "500px", width: "90%" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><h2>Create Proposal</h2><button onClick={() => setShowProposalModal(false)}><X size={24} /></button></div>
          <div style={{ margin: "16px 0" }}><input type="text" placeholder="Proposal Amount (e.g., ₹14,50,000)" value={newProposal.amount} onChange={(e) => setNewProposal({...newProposal, amount: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ccc" }} /></div>
          <div style={{ margin: "16px 0" }}><textarea placeholder="Venue Options (comma separated, e.g., The Leela Mumbai, JW Marriott Pune)" value={newProposal.venueOptions} onChange={(e) => setNewProposal({...newProposal, venueOptions: e.target.value})} rows={3} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ccc" }} /></div>
          <button onClick={handleAddProposal} style={{ background: "#f97316", color: "white", padding: "12px", borderRadius: "40px", width: "100%" }}>Send Proposal</button>
        </div>
      </div>)}

      {/* Request Modal */}
      {showRequestModal && (<div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
        <div style={{ background: "white", borderRadius: "24px", padding: "32px", maxWidth: "500px", width: "90%" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><h2>New Event Request</h2><button onClick={() => setShowRequestModal(false)}><X size={24} /></button></div>
          <input type="text" placeholder="Company Name" value={newRequest.company} onChange={(e) => setNewRequest({...newRequest, company: e.target.value})} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "12px", border: "1px solid #ccc" }} />
          <select value={newRequest.eventType} onChange={(e) => setNewRequest({...newRequest, eventType: e.target.value})} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "12px", border: "1px solid #ccc" }}><option>Sales Training</option><option>Leadership Offsite</option><option>Product Launch</option><option>Team Building</option></select>
          <input type="text" placeholder="Cities" value={newRequest.cities} onChange={(e) => setNewRequest({...newRequest, cities: e.target.value})} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "12px", border: "1px solid #ccc" }} />
          <input type="text" placeholder="Dates" value={newRequest.dates} onChange={(e) => setNewRequest({...newRequest, dates: e.target.value})} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "12px", border: "1px solid #ccc" }} />
          <input type="text" placeholder="Budget" value={newRequest.budget} onChange={(e) => setNewRequest({...newRequest, budget: e.target.value})} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "12px", border: "1px solid #ccc" }} />
          <button onClick={handleAddRequest} style={{ background: "#f97316", color: "white", padding: "12px", borderRadius: "40px", width: "100%", marginTop: "10px" }}>Submit Request</button>
        </div>
      </div>)}

      {/* Offer Modal with Interest Filters */}
      {showOfferModal && (<div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
        <div style={{ background: "white", borderRadius: "24px", padding: "32px", maxWidth: "550px", width: "90%", maxHeight: "80vh", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><h2>Create Offer for Members</h2><button onClick={() => setShowOfferModal(false)}><X size={24} /></button></div>
          <input type="text" placeholder="Offer Name" value={newOffer.name} onChange={(e) => setNewOffer({...newOffer, name: e.target.value})} style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "12px", border: "1px solid #ccc" }} />
          <div style={{ display: "flex", gap: "10px" }}><select value={newOffer.type} onChange={(e) => setNewOffer({...newOffer, type: e.target.value})} style={{ flex:1, padding: "12px", margin: "10px 0", borderRadius: "12px", border: "1px solid #ccc" }}><option>Discount</option><option>Free Units</option></select>
          <input type="text" placeholder="Discount (e.g., 20% or ₹100)" value={newOffer.discount} onChange={(e) => setNewOffer({...newOffer, discount: e.target.value})} style={{ flex:1, padding: "12px", margin: "10px 0", borderRadius: "12px", border: "1px solid #ccc" }} /></div>
          
          <div style={{ margin: "10px 0" }}>
            <label style={{ fontWeight: "500", marginBottom: "8px", display: "block" }}>Target Member Interests:</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {interestOptions.map(interest => (
                <button key={interest} type="button" onClick={() => toggleInterest(interest)} style={{ padding: "6px 12px", borderRadius: "20px", fontSize: "12px", border: "1px solid", background: newOffer.target.includes(interest) ? "#f97316" : "white", color: newOffer.target.includes(interest) ? "white" : "#64748b", borderColor: newOffer.target.includes(interest) ? "#f97316" : "#e2e8f0", cursor: "pointer" }}>
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}><input type="text" placeholder="Valid Till (e.g., 30 Jun 2025)" value={newOffer.validTill} onChange={(e) => setNewOffer({...newOffer, validTill: e.target.value})} style={{ flex:1, padding: "12px", margin: "10px 0", borderRadius: "12px", border: "1px solid #ccc" }} />
          <input type="number" placeholder="Total Units" value={newOffer.total} onChange={(e) => setNewOffer({...newOffer, total: parseInt(e.target.value)})} style={{ flex:1, padding: "12px", margin: "10px 0", borderRadius: "12px", border: "1px solid #ccc" }} /></div>
          <button onClick={handleAddOffer} style={{ background: "#f97316", color: "white", padding: "12px", borderRadius: "40px", width: "100%", marginTop: "10px" }}>Create Offer</button>
        </div>
      </div>)}
    </div>
  );
}
