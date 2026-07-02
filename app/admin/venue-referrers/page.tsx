"use client";

import { useState, useEffect } from "react";
import type { DataRow } from "@/types";
import { supabase } from "@/lib/supabaseClient";
import { 
  Users, Search, RefreshCw, Save, 
  UserCheck, UserPlus, XCircle, CheckCircle,
  MapPin, Building, User, Link2
} from "lucide-react";
import Link from "next/link";

export default function VenueReferrers() {
  const [venues, setVenues] = useState<DataRow[]>([]);
  const [referrers, setReferrers] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch venues
      const { data: venueData, error: venueError } = await supabase
        .from("venues")
        .select("id, name, city, referrer_id, referrer_type, referrer_code")
        .order("name", { ascending: true });

      if (venueError) throw venueError;
      setVenues(venueData || []);

      // Fetch referrers (ZBP + Affiliate)
      const { data: zbpData } = await supabase
        .from("user_roles")
        .select("user_id, users!inner(email, name)")
        .eq("role", "zbp")
        .eq("approved", true);

      const { data: affData } = await supabase
        .from("user_roles")
        .select("user_id, users!inner(email, name)")
        .eq("role", "affiliate")
        .eq("approved", true);

      const getUserInfo = (users: unknown) => {
        const user = Array.isArray(users) ? users[0] : users;
        return user as { email?: string; name?: string } | undefined;
      };

      const referrerList = [
        ...(zbpData || []).map((r) => {
          const user = getUserInfo(r.users);
          return {
            id: r.user_id,
            name: user?.name || user?.email || "Unknown",
            type: "zbp",
            label: `ZBP: ${user?.name || user?.email}`,
          };
        }),
        ...(affData || []).map((r) => {
          const user = getUserInfo(r.users);
          return {
            id: r.user_id,
            name: user?.name || user?.email || "Unknown",
            type: "affiliate",
            label: `Affiliate: ${user?.name || user?.email}`,
          };
        }),
      ];
      setReferrers(referrerList);

      // Initialize assignments with current referrers
      const initialAssignments: Record<string, string> = {};
      (venueData || []).forEach((v) => {
        initialAssignments[v.id] = v.referrer_id || "";
      });
      setAssignments(initialAssignments);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = (venueId: string, referrerId: string) => {
    setAssignments(prev => ({ ...prev, [venueId]: referrerId }));
  };

  const handleSave = async (venueId: string) => {
    const referrerId = assignments[venueId] || null;
    try {
      const { error } = await supabase
        .from("venues")
        .update({ referrer_id: referrerId })
        .eq("id", venueId);

      if (error) throw error;
      alert("Referrer assigned successfully!");
      fetchData();
    } catch (error) {
      console.error("Error saving assignment:", error);
      alert("Failed to assign referrer.");
    }
  };

  const getReferrerName = (venue: any) => {
    if (!venue.referrer_id) return "None";
    const referrer = referrers.find(r => r.id === venue.referrer_id);
    return referrer ? referrer.label : "Unknown";
  };

  const filteredVenues = venues.filter(v => {
    const search = searchTerm.toLowerCase();
    return v.name?.toLowerCase().includes(search) ||
           v.city?.toLowerCase().includes(search);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6 pb-4 border-b-4 border-orange-400">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl">
            <Link2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Venue Relationship Managers</h1>
            <p className="text-gray-500 text-sm">Assign ZBP or Affiliate as relationship manager to venues</p>
          </div>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="bg-white border border-orange-200 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-2.5 text-orange-400" />
              <input
                type="text"
                placeholder="Search by venue name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-orange-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-50 border-b border-orange-200">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Venue Name</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">City</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Current Manager</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Assign New</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVenues.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-400">No venues found</td>
                </tr>
              ) : (
                filteredVenues.map((venue) => (
                  <tr key={venue.id} className="border-b border-orange-50 hover:bg-orange-50/30 transition">
                    <td className="p-3 text-sm font-medium text-gray-700">{venue.name || "N/A"}</td>
                    <td className="p-3 text-sm text-gray-500">{venue.city || "—"}</td>
                    <td className="p-3 text-sm text-gray-500">
                      {getReferrerName(venue)}
                    </td>
                    <td className="p-3">
                      <select
                        value={assignments[venue.id] || ""}
                        onChange={(e) => handleAssign(venue.id, e.target.value)}
                        className="w-full px-3 py-1.5 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 bg-white text-sm"
                      >
                        <option value="">None</option>
                        {referrers.map((ref) => (
                          <option key={ref.id} value={ref.id}>
                            {ref.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleSave(venue.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm"
                      >
                        <Save size={16} /> Save
                      </button>
                    </td>
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
