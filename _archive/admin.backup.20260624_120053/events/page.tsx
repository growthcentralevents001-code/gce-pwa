"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

// ✅ Define Event interface
interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  price: number;
  capacity: number;
  registered: number;
  status: string;
  vertical: string;
  category: string;
  created_at: string;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from("events")
        .update({ status: "approved" })
        .eq("id", id);
      if (error) throw error;
      fetchEvents();
    } catch (error) {
      console.error("Error approving event:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from("events")
        .update({ status: "rejected" })
        .eq("id", id);
      if (error) throw error;
      fetchEvents();
    } catch (error) {
      console.error("Error rejecting event:", error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Events</h1>
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.venue}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    event.status === "approved" || event.status === "live"
                      ? "bg-green-100 text-green-800"
                      : event.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {event.status || "pending"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {event.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(event.id)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(event.id)}
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
