"use client";

import { useState, useEffect } from "react";
import type { DataRow } from "@/types";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { 
  Building2, 
  FileText, 
  Megaphone, 
  Plus, 
  Calendar, 
  Users, 
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Briefcase
} from "lucide-react";

export default function EnterpriseDashboard() {
  const [requests, setRequests] = useState<DataRow[]>([]);
  const [proposals, setProposals] = useState<DataRow[]>([]);
  const [campaigns, setCampaigns] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("requests");

  const fetchData = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      const { data: requestsData } = await supabase
        .from("enterprise_requests")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      const { data: proposalsData } = await supabase
        .from("enterprise_proposals")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      const { data: campaignsData } = await supabase
        .from("enterprise_campaigns")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      setRequests(requestsData || []);
      setProposals(proposalsData || []);
      setCampaigns(campaignsData || []);
    } catch (error) {
      console.error("Error fetching enterprise data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "proposed": return "bg-blue-100 text-blue-700 border-blue-200";
      case "approved": return "bg-green-100 text-green-700 border-green-200";
      case "rejected": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "proposed": return <FileText className="w-4 h-4" />;
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center gap-3">
            <Briefcase className="text-orange-500" size={32} />
            Enterprise Dashboard
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Manage corporate event requests, proposals, and offer campaigns
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Requests</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{requests.length}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <FileText className="text-orange-500" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Proposals</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{proposals.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <FileText className="text-blue-500" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Active Campaigns</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{campaigns.length}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Megaphone className="text-green-500" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs & Create Button */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2 flex-wrap">
              {["requests", "proposals", "campaigns"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 text-sm font-medium rounded-full transition ${
                    activeTab === tab
                      ? "bg-orange-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab === "requests" ? "Event Requests" : 
                   tab === "proposals" ? "Proposals" : "Offer Campaigns"}
                </button>
              ))}
            </div>
            <Link
              href="/dashboard/enterprise/request"
              className="inline-flex items-center gap-2 px-5 py-2 bg-orange-600 text-white text-sm font-medium rounded-full hover:bg-orange-700 transition shadow-md"
            >
              <Plus size={18} /> New Event Request
            </Link>
          </div>

          <div className="p-6">
            {activeTab === "requests" && (
              <>
                {requests.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="mx-auto text-slate-300" size={48} />
                    <p className="text-slate-400 mt-2">No event requests yet</p>
                    <p className="text-sm text-slate-300">Create your first corporate event request</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requests.map((req) => (
                      <div key={req.id} className="bg-slate-50 rounded-xl p-4 hover:bg-white hover:shadow-md transition border border-transparent hover:border-orange-100">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-slate-800">{req.event_type || "Event"}</h4>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                            {getStatusIcon(req.status)}
                            {req.status || "Pending"}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-slate-500">
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-slate-400" />
                            <span>{req.guest_count || 0} guests</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <IndianRupee size={14} className="text-slate-400" />
                            <span>{req.budget_range || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-slate-400" />
                            <span>{req.dates || "Dates not specified"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building2 size={14} className="text-slate-400" />
                            <span>{req.city || "City not specified"}</span>
                          </div>
                        </div>
                        {req.proposal_text && (
                          <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500 line-clamp-2">
                            {req.proposal_text}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "proposals" && (
              <>
                {proposals.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="mx-auto text-slate-300" size={48} />
                    <p className="text-slate-400 mt-2">No proposals yet</p>
                    <p className="text-sm text-slate-300">Proposals will appear here once created</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {proposals.map((prop) => (
                      <div key={prop.id} className="bg-slate-50 rounded-xl p-4 hover:bg-white hover:shadow-md transition border border-transparent hover:border-orange-100">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-slate-800">{prop.title || "Proposal"}</h4>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(prop.status)}`}>
                            {getStatusIcon(prop.status)}
                            {prop.status || "Pending"}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-slate-500 line-clamp-2">
                          {prop.proposal_text || "No description"}
                        </div>
                        {prop.amount && (
                          <div className="mt-2 text-sm font-semibold text-slate-700">
                            ₹{prop.amount}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "campaigns" && (
              <>
                {campaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <Megaphone className="mx-auto text-slate-300" size={48} />
                    <p className="text-slate-400 mt-2">No campaigns yet</p>
                    <p className="text-sm text-slate-300">Create your first offer campaign</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {campaigns.map((camp) => (
                      <div key={camp.id} className="bg-slate-50 rounded-xl p-4 hover:bg-white hover:shadow-md transition border border-transparent hover:border-orange-100">
                        <h4 className="font-semibold text-slate-800">{camp.offer_type || "Campaign"}</h4>
                        <div className="mt-2 space-y-1 text-sm text-slate-500">
                          {camp.discount_percent && <p>{camp.discount_percent}% discount</p>}
                          {camp.free_units && <p>{camp.free_units} free units</p>}
                          {camp.interests && camp.interests.length > 0 && (
                            <p className="text-xs text-slate-400">Interests: {camp.interests.join(", ")}</p>
                          )}
                          {camp.valid_until && (
                            <p className="text-xs text-slate-400">Valid until: {new Date(camp.valid_until).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
