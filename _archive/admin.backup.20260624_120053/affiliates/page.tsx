"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

// ✅ Correct type: users is an array
interface Affiliate {
  id: string;
  user_id: string;
  approved: boolean;
  approved_at: string | null;
  created_at: string;
  users: {
    email: string;
    name: string;
    phone: string;
    created_at: string;
  }[] | null;  // ✅ Array
}

export default function AdminAffiliates() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      const { data, error } = await supabase
        .from("affiliate_profiles")
        .select(`
          id,
          user_id,
          approved,
          approved_at,
          created_at,
          users (
            email,
            name,
            phone,
            created_at
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAffiliates(data || []);
    } catch (error) {
      console.error("Error fetching affiliates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from("affiliate_profiles")
        .update({ approved: true, approved_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      fetchAffiliates();
    } catch (error) {
      console.error("Error approving affiliate:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from("affiliate_profiles")
        .update({ approved: false })
        .eq("id", id);

      if (error) throw error;
      fetchAffiliates();
    } catch (error) {
      console.error("Error rejecting affiliate:", error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Affiliate Management</h1>
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {affiliates.map((affiliate) => (
              <tr key={affiliate.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {affiliate.users?.[0]?.name || "N/A"}  {/* ✅ Array access */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {affiliate.users?.[0]?.email || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    affiliate.approved
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {affiliate.approved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {!affiliate.approved && (
                    <>
                      <button
                        onClick={() => handleApprove(affiliate.id)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(affiliate.id)}
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
