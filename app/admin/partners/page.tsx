"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Search, Filter, Download, Plus } from "lucide-react";

export default function PartnersManagement() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, elite: 0, events: 0 });
  const [partners, setPartners] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      
      const { count: total } = await supabase.from("venues").select("*", { count: 'exact', head: true });
      const { count: active } = await supabase.from("venues").select("*", { count: 'exact', head: true }).eq("status", "active");
      const { count: elite } = await supabase.from("venues").select("*", { count: 'exact', head: true }).eq("tier", "Elite");
      const { count: events } = await supabase.from("events").select("*", { count: 'exact', head: true });
      const { data: venues } = await supabase.from("venues").select("*");
      
      setStats({ total: total || 0, active: active || 0, elite: elite || 0, events: events || 0 });
      setPartners(venues || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading partners...</div>;

  const filtered = partners.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Partners Management</h1><p className="text-gray-500">Manage venue partners, approve applications, track performance</p></div>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow border-l-4 border-orange-500"><p className="text-sm text-gray-500">Total Partners</p><p className="text-2xl font-bold">{stats.total}</p></div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-green-500"><p className="text-sm text-gray-500">Active</p><p className="text-2xl font-bold">{stats.active}</p></div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-purple-500"><p className="text-sm text-gray-500">Elite Partners</p><p className="text-2xl font-bold">{stats.elite}</p></div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500"><p className="text-sm text-gray-500">Total Events</p><p className="text-2xl font-bold">{stats.events}</p></div>
      </div>
      
      <div className="bg-white p-4 rounded shadow flex gap-3">
        <div className="flex-1 relative"><Search className="absolute left-3 top-3 text-gray-400" size={18} /><input type="text" placeholder="Search by name, email or..." className="w-full pl-10 pr-4 py-2 border rounded-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        <select className="border rounded-lg px-4 py-2"><option>All Types</option></select>
        <select className="border rounded-lg px-4 py-2"><option>All Status</option></select>
        <button className="border rounded-lg px-4 py-2 flex gap-2"><Filter size={18} /> Filter</button>
        <button className="bg-orange-600 text-white rounded-lg px-4 py-2 flex gap-2"><Download size={18} /> Export CSV</button>
      </div>
      
      <div className="bg-white rounded shadow overflow-hidden">
        {filtered.map((p, i) => (
          <div key={i} className="p-4 border-b flex justify-between items-center hover:bg-gray-50">
            <div><p className="font-bold">{p.name}</p><p className="text-sm text-gray-500">Joined: {new Date(p.created_at).toLocaleDateString()}</p></div>
            <div><p className="text-sm">{p.email}</p><p className="text-sm">{p.phone}</p></div>
            <div><span className="px-2 py-1 bg-purple-100 rounded-full text-xs">{p.tier || 'Basic'}</span></div>
            <div><span className="px-2 py-1 bg-green-100 rounded-full text-xs">{p.status || 'Active'}</span></div>
            <div>{p.city || 'N/A'}</div>
            <div><p className="font-bold">0 events</p><p className="text-sm">₹0</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
