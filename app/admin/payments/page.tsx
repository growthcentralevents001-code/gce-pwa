"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Wallet, TrendingUp, Clock, CheckCircle, IndianRupee } from "lucide-react";

export default function PaymentsManagement() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, thisMonth: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch from payments table if exists, else show 0
      const { data, error } = await supabase
        .from("payments")
        .select("amount, status, created_at");

      if (error) throw error;

      const total = data?.reduce((sum, p) => sum + p.amount, 0) || 0;
      const pending = data?.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0) || 0;
      const completed = data?.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0) || 0;
      const now = new Date();
      const thisMonth = data?.filter(p => {
        const d = new Date(p.created_at);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).reduce((sum, p) => sum + p.amount, 0) || 0;

      setStats({ total, pending, completed, thisMonth });
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6 pb-4 border-b-4 border-orange-400">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl">
            <Wallet size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Payments Management</h1>
            <p className="text-gray-500 text-sm">Manage payouts to venues, franchisees, and BDMs</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Total Payouts</p>
          <p className="text-2xl font-bold text-orange-700">₹{(stats.total / 100000).toFixed(2)}L</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">₹{(stats.pending / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-700">₹{(stats.completed / 100000).toFixed(2)}L</p>
        </div>
        <div className="bg-gradient-to-br from-orange-100 to-orange-200 border border-orange-300 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">This Month</p>
          <p className="text-2xl font-bold text-orange-800">₹{(stats.thisMonth / 100000).toFixed(2)}L</p>
        </div>
      </div>

      <div className="bg-white border border-orange-200 rounded-xl shadow-sm p-6 text-center">
        <p className="text-gray-400">No payments data available yet.</p>
        <p className="text-sm text-gray-300 mt-1">Payments will appear here once transactions are processed.</p>
      </div>
    </div>
  );
}
