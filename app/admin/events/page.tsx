"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  Calendar, MapPin, IndianRupee, Users, CheckCircle, 
  XCircle, AlertCircle, Edit2, Trash2, Save, X 
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  vertical: string;
  date: string;
  venue: string;
  city: string;
  price: number;
  registered: number;
  capacity: number;
  status: string;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching events:", error);
    } else if (data) {
      setEvents(data as Event[]);
    }
    setLoading(false);
  }

  async function handleStatusChange(id: string, newStatus: string) {
    const { error } = await supabase
      .from("events")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert("Error updating event: " + error.message);
    } else {
      fetchEvents();
      alert(`Event marked as ${newStatus}!`);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to permanently delete this event?")) {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) {
        alert("Error deleting event: " + error.message);
      } else {
        fetchEvents();
        alert("Event deleted successfully!");
      }
    }
  }

  async function handleEdit(id: string) {
    if (editingId === id) {
      // Save the edited title
      const { error } = await supabase
        .from("events")
        .update({ title: editingTitle })
        .eq("id", id);
      if (error) {
        alert("Error updating event: " + error.message);
      } else {
        fetchEvents();
      }
      setEditingId(null);
      setEditingTitle("");
    } else {
      // Start editing
      const event = events.find(e => e.id === id);
      if (event) {
        setEditingId(id);
        setEditingTitle(event.title);
      }
    }
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: events.length,
    live: events.filter(e => e.status === "Live").length,
    pending: events.filter(e => e.status === "Pending").length,
    attendees: events.reduce((sum, e) => sum + (e.registered || 0), 0),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Live":
        return { icon: <CheckCircle size={14} />, text: "Live", bg: "bg-green-100", textColor: "text-green-700" };
      case "Pending":
        return { icon: <AlertCircle size={14} />, text: "Pending", bg: "bg-yellow-100", textColor: "text-yellow-700" };
      case "Draft":
        return { icon: <XCircle size={14} />, text: "Draft", bg: "bg-gray-100", textColor: "text-gray-700" };
      default:
        return { icon: null, text: status, bg: "bg-gray-100", textColor: "text-gray-700" };
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading events...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Event Management</h1>
          <p className="text-gray-500 mt-1">Manage all events across your platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Events</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Calendar className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Live Events</p>
                <p className="text-3xl font-bold text-green-600">{stats.live}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Events</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <AlertCircle className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Attendees</p>
                <p className="text-3xl font-bold text-purple-600">{stats.attendees}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search events by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Status</option>
                <option value="Live">Live</option>
                <option value="Pending">Pending</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-500">No events found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const statusStyle = getStatusBadge(event.status);
              const progress = (event.registered / event.capacity) * 100;
              return (
                <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.textColor}`}>
                          {statusStyle.icon} {statusStyle.text}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {event.vertical || "General"}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(event.id)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit Event Title"
                        >
                          {editingId === event.id ? <Save size={16} /> : <Edit2 size={16} />}
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {editingId === event.id ? (
                      <div className="mb-3">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-bold"
                          autoFocus
                        />
                        <button
                          onClick={() => handleEdit(event.id)}
                          className="mt-2 text-sm text-green-600 hover:text-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="mt-2 ml-2 text-sm text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{event.title}</h3>
                    )}

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        <span>{event.venue}, {event.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IndianRupee size={14} className="text-gray-400" />
                        <span className="font-medium text-orange-600">₹{event.price}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-gray-400" />
                          <span>{event.registered || 0} / {event.capacity} registered</span>
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {event.status === "Pending" && (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleStatusChange(event.id, "Live")}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(event.id, "Draft")}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {event.status === "Live" && (
                      <div className="mt-4">
                        <button
                          onClick={() => handleStatusChange(event.id, "Draft")}
                          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg transition-colors"
                        >
                          Move to Draft
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
