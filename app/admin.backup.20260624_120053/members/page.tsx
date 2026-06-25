"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

// ✅ Define interfaces
interface UserRole {
  role: string;
  approved: boolean;
}

interface Member {
  id: string;
  email: string;
  name: string;
  phone: string;
  city: string;
  created_at: string;
  user_roles: UserRole[];
}

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data: users, error } = await supabase
        .from("users")
        .select(`
          id,
          email,
          name,
          phone,
          city,
          created_at,
          user_roles (
            role,
            approved
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMembers(users || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (id: string) => {
    // Placeholder: implement suspend logic if needed
    alert("Suspend functionality not implemented");
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Members Management</h1>
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.name || "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.phone || "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.city || "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.user_roles?.map(r => r.role).join(", ") || "User"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    member.user_roles?.some(r => r.approved === true)
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {member.user_roles?.some(r => r.approved === true) ? "Active" : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
