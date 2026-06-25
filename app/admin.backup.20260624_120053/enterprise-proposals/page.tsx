"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

// ✅ Define proper interface
interface EnterpriseRequest {
  id: string;
  company_name: string;
  event_type: string;
  guest_count: number;
  budget_range: string;
  city: string;
  status: string;
  created_at: string;
  user_id: string;
  proposal_text?: string;
  amount?: number;
}

export default function AdminEnterpriseProposals() {
  const [requests, setRequests] = useState<EnterpriseRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("enterprise_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching enterprise requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from("enterprise_requests")
        .update({ status: "approved" })
        .eq("id", id);

      if (error) throw error;
      fetchRequests();
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from("enterprise_requests")
        .update({ status: "rejected" })
        .eq("id", id);

      if (error) throw error;
      fetchRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Enterprise Proposals</h1>
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((req) => (
              <tr key={req.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.company_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.event_type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.guest_count}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.budget_range}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.city}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    req.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : req.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {req.status || "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {req.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
