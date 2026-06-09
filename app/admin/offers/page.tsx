"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";

export default function OffersManagement() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      
      // Sample offers data (since offers table might be empty)
      const sampleOffers = [
        { id: 1, name: "Flat ₹100 OFF", type: "Discount", discount: "20%", vertical: "Connect", valid_till: "30 Jun 2025", redeemed: "45/200", status: "Active" },
        { id: 2, name: "Summer Sale", type: "Discount", discount: "15%", vertical: "Marketplace", valid_till: "15 Jul 2025", redeemed: "120/500", status: "Active" },
        { id: 3, name: "New User Offer", type: "Free Units", discount: "₹500", vertical: "Enterprise", valid_till: "31 Aug 2025", redeemed: "89/300", status: "Pending" },
      ];
      
      setOffers(sampleOffers);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>;

  const filteredOffers = offers.filter(offer =>
    offer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation
  const totalOffers = offers.length;
  const activeOffers = offers.filter(o => o.status === "Active").length;
  const pendingOffers = offers.filter(o => o.status === "Pending").length;
  const totalRedeems = offers.reduce((sum, o) => sum + parseInt(o.redeemed?.split('/')[0] || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Offers Management</h1>
        <p className="text-gray-500">Manage discounts, promotions, and enterprise offers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <p className="text-sm text-gray-500">Total Offers</p>
          <p className="text-2xl font-bold text-gray-800">{totalOffers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Active Offers</p>
          <p className="text-2xl font-bold text-gray-800">{activeOffers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">Pending Approval</p>
          <p className="text-2xl font-bold text-gray-800">{pendingOffers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Total Redeems</p>
          <p className="text-2xl font-bold text-gray-800">{totalRedeems}</p>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search offers..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-orange-700 transition">
            <Plus size={16} /> Create Offer
          </button>
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Offer Name</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Type</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Discount</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Vertical</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Valid Till</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Redeemed</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOffers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-gray-500">No offers found. Create your first offer!</td>
                </tr>
              ) : (
                filteredOffers.map((offer, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{offer.name}</p>
                      <p className="text-xs text-gray-500">by GCE Admin</p>
                    </td>
                    <td className="p-4"><span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{offer.type}</span></td>
                    <td className="p-4 font-semibold text-gray-900">{offer.discount}</td>
                    <td className="p-4 text-sm">{offer.vertical}</td>
                    <td className="p-4 text-sm">{offer.valid_till}</td>
                    <td className="p-4 text-sm">{offer.redeemed}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        offer.status === 'Active' ? 'bg-green-100 text-green-700' : 
                        offer.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {offer.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Eye size={16} /></button>
                        <button className="p-1 text-orange-600 hover:bg-orange-50 rounded"><Edit size={16} /></button>
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                      </div>
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
