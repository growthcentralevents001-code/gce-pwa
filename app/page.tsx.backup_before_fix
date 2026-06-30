"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Calendar, MapPin, Users, ArrowRight, Search, Music, Utensils, Dumbbell, Mic, Film } from "lucide-react";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true })
        .limit(6);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: "Music", icon: Music },
    { name: "Sports", icon: Dumbbell },
    { name: "Food & Drinks", icon: Utensils },
    { name: "Open Mics", icon: Mic },
    { name: "Comedy", icon: Film },
  ];

  const tabs = [
    { id: "all", label: "All Events" },
    { id: "connect", label: "GCE Connect" },
    { id: "marketplace", label: "GCE Marketplace" },
    { id: "enterprise", label: "GCE Enterprise" },
  ];

  const filteredEvents = activeTab === "all" 
    ? events 
    : events.filter(e => e.vertical === activeTab);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Amazing Events Near You
          </h1>
          <p className="text-lg text-orange-100 mb-6">
            Connect, learn, and grow with events that matter
          </p>
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search events, venues, or cities..."
              className="flex-1 px-5 py-3 rounded-full text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-full hover:bg-orange-50 transition shadow-md flex items-center justify-center gap-2">
              <Search size={20} /> Search
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 text-center">Explore Events</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat.name}
                className="flex flex-col items-center gap-2 px-6 py-4 bg-slate-50 rounded-2xl hover:bg-orange-50 transition border border-transparent hover:border-orange-200 min-w-[80px]"
              >
                <cat.icon size={24} className="text-orange-500" />
                <span className="text-sm font-medium text-slate-700">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Upcoming Events</h2>
            <Link href="/events" className="text-orange-600 hover:underline text-sm font-medium">
              View All →
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-orange-600 text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Event Cards Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <p className="text-center text-slate-400 py-12">No events found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition hover:border-orange-200">
                    <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center text-4xl">
                      🎉
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-800 group-hover:text-orange-600 transition line-clamp-1">
                        {event.title}
                      </h3>
                      <div className="mt-2 space-y-1.5 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-orange-400" />
                          <span>{event.date} at {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-orange-400" />
                          <span>{event.venue}, {event.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-orange-400" />
                          <span>{event.registered} / {event.capacity} attending</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xl font-bold text-orange-600">₹{event.price}</span>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 group-hover:underline">
                          View Details <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
