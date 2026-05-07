'use client'
import { useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, Filter, ChevronDown } from 'lucide-react'

export default function PaymentsRevenue() {
  const [dateRange, setDateRange] = useState('this-month')

  const stats = {
    totalRevenue: 8250000,
    membershipFees: 3500000,
    eventRevenue: 2800000,
    bookingAdvances: 14000,
    offerCommission: 450000,
    bdmCommission: 1250000,
    partnerCommission: 825000,
    netProfit: 5376000,
  }

  const recentTransactions = [
    { id: 1, type: 'Membership', user: 'Rohan Mehta', amount: 500, date: '23 May 2025', status: 'completed' },
    { id: 2, type: 'Event Booking', user: 'Neha Kapoor', amount: 699, date: '22 May 2025', status: 'completed' },
    { id: 3, type: 'Booking Advance', user: 'Vikram Singh', amount: 500, date: '21 May 2025', status: 'completed' },
    { id: 4, type: 'Offer Claim', user: 'Anjali Desai', amount: 499, date: '20 May 2025', status: 'completed' },
    { id: 5, type: 'BDM Commission', user: 'Amit Verma', amount: 984000, date: '20 May 2025', status: 'paid' },
    { id: 6, type: 'Partner Commission', user: 'WeWork India', amount: 125000, date: '19 May 2025', status: 'pending' },
  ]

  const revenueByZone = [
    { zone: 'North', amount: 2800000, percentage: 34 },
    { zone: 'South', amount: 2200000, percentage: 27 },
    { zone: 'West', amount: 1900000, percentage: 23 },
    { zone: 'East', amount: 1350000, percentage: 16 },
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-bold text-gray-800">Payments & Revenue</h1><p className="text-gray-500 text-sm">Financial overview and transaction history</p></div>
        <div className="flex gap-3"><button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-sm"><Download size={16} /> Export Report</button></div>
      </div>

      {/* Main Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-primary"><div className="flex items-center gap-3"><DollarSign size={24} className="text-primary" /><div><p className="text-2xl font-bold">₹{(stats.totalRevenue/100000).toFixed(1)}L</p><p className="text-sm text-gray-500">Total Revenue</p><p className="text-xs text-green-600">↑ 15% vs last month</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500"><div className="flex items-center gap-3"><TrendingUp size={24} className="text-blue-500" /><div><p className="text-2xl font-bold">₹{(stats.membershipFees/100000).toFixed(1)}L</p><p className="text-sm text-gray-500">Membership Fees</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500"><div className="flex items-center gap-3"><TrendingUp size={24} className="text-green-500" /><div><p className="text-2xl font-bold">₹{(stats.eventRevenue/100000).toFixed(1)}L</p><p className="text-sm text-gray-500">Event Revenue</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500"><div className="flex items-center gap-3"><TrendingUp size={24} className="text-purple-500" /><div><p className="text-2xl font-bold">₹{(stats.offerCommission/100000).toFixed(1)}L</p><p className="text-sm text-gray-500">Offer Commission</p></div></div></div>
      </div>

      {/* Commission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm"><div className="flex justify-between items-center"><div><p className="text-sm text-gray-500">BDM Commission Payable</p><p className="text-xl font-bold">₹{(stats.bdmCommission/100000).toFixed(1)}L</p></div><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">15%</span></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm"><div className="flex justify-between items-center"><div><p className="text-sm text-gray-500">Partner Commission Payable</p><p className="text-xl font-bold">₹{(stats.partnerCommission/100000).toFixed(1)}L</p></div><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">10%</span></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-primary"><div className="flex justify-between items-center"><div><p className="text-sm text-gray-500">GCE Net Profit</p><p className="text-2xl font-bold text-primary">₹{(stats.netProfit/100000).toFixed(1)}L</p></div><span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">↑ 18%</span></div></div>
      </div>

      {/* Revenue by Zone */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <h3 className="font-bold text-gray-800 mb-3">Revenue by Zone</h3>
        <div className="space-y-3">
          {revenueByZone.map(zone => (
            <div key={zone.zone}><div className="flex justify-between text-sm"><span>{zone.zone} Zone</span><span>₹{(zone.amount/100000).toFixed(1)}L ({zone.percentage}%)</span></div><div className="h-2 bg-gray-200 rounded-full mt-1"><div className="h-2 bg-primary rounded-full" style={{ width: `${zone.percentage}%` }}></div></div></div>
          ))}
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b flex justify-between items-center"><h3 className="font-bold text-gray-800">Recent Transactions</h3><select className="text-sm border rounded-lg px-2 py-1"><option>Last 30 days</option><option>Last 90 days</option><option>Last 12 months</option></select></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr><th className="p-3 text-left">Type</th><th className="p-3 text-left">User</th><th className="p-3 text-left">Amount</th><th className="p-3 text-left">Date</th><th className="p-3 text-left">Status</th></tr>
            </thead>
            <tbody>
              {recentTransactions.map(t => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{t.type}</td>
                  <td className="p-3">{t.user}</td>
                  <td className="p-3 font-medium">₹{t.amount.toLocaleString()}</td>
                  <td className="p-3">{t.date}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${t.status === 'completed' ? 'bg-green-100 text-green-700' : t.status === 'paid' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t flex justify-between items-center"><p className="text-sm text-gray-500">Showing 6 of 156 transactions</p><div className="flex gap-2"><button className="px-3 py-1 border rounded">Previous</button><button className="px-3 py-1 bg-primary text-white rounded">1</button><button className="px-3 py-1 border rounded">Next</button></div></div>
      </div>
    </div>
  )
}
