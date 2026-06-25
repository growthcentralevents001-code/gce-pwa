"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Search } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  city: string;
  created_at: string;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMembers(members);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = members.filter(
        (m) =>
          m.name?.toLowerCase().includes(term) ||
          m.email?.toLowerCase().includes(term) ||
          m.phone?.toLowerCase().includes(term) ||
          m.city?.toLowerCase().includes(term)
      );
      setFilteredMembers(filtered);
    }
  }, [searchTerm, members]);

  async function fetchMembers() {
    setLoading(true);
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      setMembers(data);
      setFilteredMembers(data);
    }
    setLoading(false);
  }

  if (loading) return <div className="p-6 text-center">Loading members...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Members Management</h1>
      <p className="text-gray-500 mb-4">Manage all platform members, their memberships, and activity</p>

      {/* Search Bar */}
      <div className="mb-6 flex">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, phone or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No members found.</td></tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{member.name || "—"}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{member.phone || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {member.role === "gold" ? "Gold" : member.role === "silver" ? "Silver" : "Member"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {member.status || "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{member.city || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {member.created_at ? new Date(member.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">—</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
