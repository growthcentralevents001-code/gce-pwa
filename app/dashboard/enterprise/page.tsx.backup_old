"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RefreshCw, Plus, Users, IndianRupee, MapPin, CheckCircle, XCircle } from "lucide-react";

export default function EnterpriseDashboard() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("requests");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    event_type: "",
    guest_count: "",
    budget_range: "",
    city: "",
    preferred_dates: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    setUser(user);

    // Fetch enterprise requests
    const { data: reqData } = await supabase
      .from("enterprise_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setRequests(reqData || []);

    // Fetch proposals with request details
    const { data: propData } = await supabase
      .from("enterprise_proposals")
      .select("*, enterprise_requests(event_type, city)")
      .in("request_id", (reqData || []).map(r => r.id));
    setProposals(propData || []);

    setLoading(false);
  }

  async function createRequest(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("enterprise_requests").insert({
      user_id: user.id,
      event_type: requestForm.event_type,
      guest_count: parseInt(requestForm.guest_count),
      budget_range: requestForm.budget_range,
      city: requestForm.city,
      preferred_dates: requestForm.preferred_dates,
      status: "pending",
    });
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Request submitted!");
      setShowRequestForm(false);
      setRequestForm({
        event_type: "",
        guest_count: "",
        budget_range: "",
        city: "",
        preferred_dates: "",
      });
      fetchData();
    }
  }

  async function updateProposalStatus(proposalId: string, newStatus: string, requestId: string) {
    // Update proposal status
    const { error: propError } = await supabase
      .from("enterprise_proposals")
      .update({ status: newStatus })
      .eq("id", proposalId);
    if (propError) {
      alert("Error updating proposal: " + propError.message);
      return;
    }

    // If accepted, also update the request status to 'approved'
    if (newStatus === "accepted") {
      const { error: reqError } = await supabase
        .from("enterprise_requests")
        .update({ status: "approved" })
        .eq("id", requestId);
      if (reqError) alert("Error updating request status: " + reqError.message);
    }

    fetchData(); // refresh all data
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-orange-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Enterprise Dashboard</h1>
        <p className="text-gray-500 mb-6">
          Manage corporate event requests, proposals, and offer campaigns
        </p>

        <div className="flex gap-2 border-b mb-6">
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 ${
              activeTab === "requests"
                ? "border-b-2 border-orange-600 text-orange-600"
                : "text-gray-500"
            }`}
          >
            Event Requests
          </button>
          <button
            onClick={() => setActiveTab("proposals")}
            className={`px-4 py-2 ${
              activeTab === "proposals"
                ? "border-b-2 border-orange-600 text-orange-600"
                : "text-gray-500"
            }`}
          >
            Proposals
          </button>
          <button
            onClick={() => setActiveTab("campaigns")}
            className={`px-4 py-2 ${
              activeTab === "campaigns"
                ? "border-b-2 border-orange-600 text-orange-600"
                : "text-gray-500"
            }`}
          >
            Offer Campaigns
          </button>
        </div>

        {activeTab === "requests" && (
          <div>
            <button
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-4"
            >
              <Plus size={18} /> New Event Request
            </button>
            {showRequestForm && (
              <form onSubmit={createRequest} className="bg-white p-4 rounded-xl shadow mb-6 space-y-3">
                <input
                  type="text"
                  placeholder="Event Type"
                  className="w-full p-2 border rounded"
                  value={requestForm.event_type}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, event_type: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Expected Guest Count"
                  className="w-full p-2 border rounded"
                  value={requestForm.guest_count}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, guest_count: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Budget Range (e.g., ₹5L – ₹10L)"
                  className="w-full p-2 border rounded"
                  value={requestForm.budget_range}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, budget_range: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  className="w-full p-2 border rounded"
                  value={requestForm.city}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, city: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Preferred Dates"
                  className="w-full p-2 border rounded"
                  value={requestForm.preferred_dates}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, preferred_dates: e.target.value })
                  }
                  required
                />
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
                  Submit Request
                </button>
              </form>
            )}
            <div className="grid gap-4">
              {requests.length === 0 && <p className="text-gray-500">No event requests yet.</p>}
              {requests.map((req) => (
                <div key={req.id} className="bg-white rounded-xl shadow p-4 border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{req.event_type}</h3>
                      <p className="text-sm text-gray-600">
                        <Users size={14} className="inline mr-1" /> {req.guest_count} guests ·{" "}
                        <IndianRupee size={14} className="inline mr-1" /> {req.budget_range} ·{" "}
                        <MapPin size={14} className="inline mr-1" /> {req.city}
                      </p>
                      <p className="text-xs text-gray-400">Dates: {req.preferred_dates}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        req.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : req.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "proposals" && (
          <div>
            {proposals.length === 0 && (
              <p className="text-gray-500">No proposals yet. GCE team will create proposals for your requests.</p>
            )}
            {proposals.map((prop) => {
              const isCounter = prop.admin_notes && prop.status === "counter_proposed";
              return (
                <div key={prop.id} className="bg-white rounded-xl shadow p-4 mb-3 border">
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold">{prop.enterprise_requests?.event_type}</h3>
                      <p className="text-sm text-gray-600">City: {prop.enterprise_requests?.city}</p>
                      <p className="text-sm">Proposal: {prop.proposal_text}</p>
                      <p className="text-orange-600 font-bold">₹{prop.amount}</p>

                      {isCounter && (
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs font-semibold text-blue-700">📩 Admin Counter-Proposal:</p>
                          <p className="text-sm text-gray-700">{prop.admin_notes}</p>
                          {prop.final_budget && (
                            <p className="text-sm font-medium text-orange-600">
                              Revised Budget: ₹{prop.final_budget}
                            </p>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-gray-400 mt-1">
                        Status:{" "}
                        <span
                          className={`font-medium ${
                            prop.status === "accepted"
                              ? "text-green-600"
                              : prop.status === "rejected"
                              ? "text-red-600"
                              : prop.status === "counter_proposed"
                              ? "text-blue-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {prop.status}
                        </span>
                      </p>
                    </div>

                    {prop.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateProposalStatus(prop.id, "accepted", prop.request_id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                        >
                          <CheckCircle size={14} /> Accept
                        </button>
                        <button
                          onClick={() => updateProposalStatus(prop.id, "rejected", prop.request_id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    )}

                    {prop.status === "counter_proposed" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateProposalStatus(prop.id, "accepted", prop.request_id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                        >
                          <CheckCircle size={14} /> Accept
                        </button>
                        <button
                          onClick={() => updateProposalStatus(prop.id, "rejected", prop.request_id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                        <span className="text-xs text-blue-600 self-center">📩 Counter-proposal received</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "campaigns" && (
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Offer campaigns feature coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
