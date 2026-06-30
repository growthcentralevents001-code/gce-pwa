"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CheckCircle, XCircle, MapPin, Building2, Clock, Award, TrendingUp } from "lucide-react";

export default function AdminZBPApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [assignData, setAssignData] = useState({ zone: "", city: "" });
  const zones = ["North", "South", "East", "West", "Central"];
  const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Goa", "Chennai", "Kolkata", "Hyderabad"];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("zbp_partners")
      .select("*, users!left(name, email)")
      .eq("status", "Pending")
      .order("applied_at", { ascending: false });

    if (!error && data) {
      setApplications(data);
    }
    setLoading(false);
  };

  const handleApprove = async () => {
    if (!selectedApp || !assignData.zone || !assignData.city) {
      alert("Please select zone and city");
      return;
    }

    const { error } = await supabase
      .from("zbp_partners")
      .update({ status: "Active", zone: assignData.zone, city: assignData.city, approved_at: new Date().toISOString() })
      .eq("id", selectedApp.id);

    if (error) {
      setMessage({ text: "Error approving application", type: "error" });
    } else {
      setMessage({ text: "Application approved successfully!", type: "success" });
      setShowModal(false);
      fetchApplications();
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleReject = async (id: string) => {
    if (confirm("Are you sure?")) {
      const { error } = await supabase.from("zbp_partners").update({ status: "Rejected" }).eq("id", id);
      if (!error) {
        setMessage({ text: "Application rejected", type: "error" });
        fetchApplications();
      }
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Calculate unique zones without Set iteration issue
  const zoneList = applications.map(a => a.zone).filter(Boolean);
  const uniqueZonesCount = zoneList.filter((v, i, a) => a.indexOf(v) === i).length;

  const stats = [
    { label: "Total Applications", value: applications.length },
    { label: "Pending Review", value: applications.filter(a => a.status === "Pending").length },
    { label: "Zones Applied", value: uniqueZonesCount },
  ];

  if (loading) return <div style={{ padding: "48px", textAlign: "center" }}>Loading applications...</div>;

  return (
    <div style={{ background: "linear-gradient(135deg, #fff5eb 0%, #fff 100%)", minHeight: "100vh", padding: "32px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {message && (
          <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000, background: message.type === "success" ? "#22c55e" : "#ef4444", color: "white", padding: "12px 24px", borderRadius: "40px" }}>
            {message.text}
          </div>
        )}

        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "800", background: "linear-gradient(135deg, #f97316, #ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ZBP Applications</h1>
          <p style={{ color: "#64748b" }}>Review and manage Zonal Business Partner applications</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ background: "white", borderRadius: "24px", padding: "24px", border: "1px solid #ffe8d9" }}>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "#f97316" }}>{stat.value}</div>
              <div style={{ color: "#64748b" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {applications.length === 0 ? (
          <div style={{ background: "white", borderRadius: "24px", padding: "60px", textAlign: "center" }}>
            <CheckCircle size={48} style={{ color: "#22c55e", marginBottom: "16px" }} />
            <h2>No Pending Applications</h2>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))", gap: "24px" }}>
            {applications.map((app) => (
              <div key={app.id} style={{ background: "white", borderRadius: "28px", border: "1px solid #ffe8d9", overflow: "hidden" }}>
                <div style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", padding: "20px", color: "white" }}>
                  <h2 style={{ fontSize: "20px", fontWeight: "700" }}>{app.users?.name || "Unknown User"}</h2>
                  <p style={{ fontSize: "13px", opacity: 0.9 }}>{app.users?.email || "No email"}</p>
                </div>
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
                    <div><MapPin size={14} style={{ color: "#f97316" }} /> <strong>Zone:</strong> {app.zone || "Not assigned"}</div>
                    <div><Clock size={14} style={{ color: "#f97316" }} /> <strong>Applied:</strong> {new Date(app.applied_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => { setSelectedApp(app); setAssignData({ zone: app.zone || "", city: app.city || "" }); setShowModal(true); }} style={{ flex: 1, background: "#f97316", color: "white", border: "none", padding: "10px", borderRadius: "40px", cursor: "pointer" }}>Approve</button>
                    <button onClick={() => handleReject(app.id)} style={{ flex: 1, background: "white", color: "#ef4444", border: "1px solid #fee2e2", padding: "10px", borderRadius: "40px", cursor: "pointer" }}>Reject</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "white", borderRadius: "24px", padding: "32px", maxWidth: "450px", width: "90%" }}>
              <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "16px" }}>Assign Zone & City</h2>
              <select value={assignData.zone} onChange={(e) => setAssignData({ ...assignData, zone: e.target.value })} style={{ width: "100%", padding: "12px", marginBottom: "16px", borderRadius: "12px", border: "1px solid #ccc" }}>
                <option value="">Select Zone</option>
                {zones.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
              <select value={assignData.city} onChange={(e) => setAssignData({ ...assignData, city: e.target.value })} style={{ width: "100%", padding: "12px", marginBottom: "24px", borderRadius: "12px", border: "1px solid #ccc" }}>
                <option value="">Select City</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={handleApprove} style={{ flex: 1, background: "#22c55e", color: "white", border: "none", padding: "12px", borderRadius: "40px", cursor: "pointer" }}>Confirm</button>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, background: "#f1f5f9", color: "#64748b", border: "none", padding: "12px", borderRadius: "40px", cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
