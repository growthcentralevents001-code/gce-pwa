'use client'
import { useState } from 'react'
import { Target, Users, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react'

export default function BDMDashboard() {
  const [activeTab, setActiveTab] = useState('target')
  const [leads, setLeads] = useState([
    { id: 1, business: 'Tech Solutions', contact: 'Rajesh', source: 'Event', status: 'pending', date: '23 May 2025' },
    { id: 2, business: 'Digital Marketing Pro', contact: 'Neha', source: 'Referral', status: 'approved', date: '22 May 2025' },
    { id: 3, business: 'Event Planners Inc', contact: 'Amit', source: 'Website', status: 'rejected', date: '21 May 2025' },
  ])

  const zoneTarget = { north: 8500000, south: 7200000, east: 4800000, west: 11200000, center: 6100000 }
  const currentRevenue = { north: 45, south: 38, east: 25, west: 58, center: 32 } // percentage

  const [showLeadForm, setShowLeadForm] = useState(false)
  const [newLead, setNewLead] = useState({ business: '', contact: '', source: '' })

  const handleAddLead = () => {
    if (newLead.business && newLead.contact) {
      const lead = { id: leads.length + 1, business: newLead.business, contact: newLead.contact, source: newLead.source || 'Manual', status: 'pending', date: new Date().toLocaleDateString() }
      setLeads([lead, ...leads])
      setNewLead({ business: '', contact: '', source: '' })
      setShowLeadForm(false)
      alert('Lead added successfully!')
    }
  }

  const totalRevenue = 8250000
  const targetRevenue = 15000000
  const percentComplete = (totalRevenue / targetRevenue) * 100

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-orange-500 to-primary rounded-2xl p-6 mb-8 text-white"><h1 className="text-2xl font-bold">Franchise Dashboard</h1><p className="text-orange-100">Zone: Mumbai Central · Role: Regional BDM</p></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card"><h2 className="text-lg font-bold mb-2 flex items-center gap-2"><Target size={20} className="text-primary" /> Target (This Month)</h2><p className="text-3xl font-bold text-primary">₹{totalRevenue.toLocaleString()}</p><p className="text-sm text-gray-500">of ₹{targetRevenue.toLocaleString()} target</p><div className="mt-2 h-2 bg-gray-200 rounded-full"><div className="h-2 bg-primary rounded-full" style={{ width: `${percentComplete}%` }}></div></div><p className="text-sm mt-1">{percentComplete}% Achieved · 12 Days Remaining</p></div>
        <div className="card"><h2 className="text-lg font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} className="text-primary" /> Commission Summary</h2><p className="text-3xl font-bold text-primary">₹{Math.floor(totalRevenue * 0.12).toLocaleString()}</p><p className="text-sm text-gray-500">This month commission (12% of revenue)</p><p className="text-xs text-green-600 mt-1">↑ 15% vs last month</p></div>
      </div>

      <div className="flex gap-4 border-b mb-6"><button onClick={() => setActiveTab('target')} className={`pb-2 px-2 ${activeTab === 'target' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}>Target Tracker</button><button onClick={() => setActiveTab('leads')} className={`pb-2 px-2 ${activeTab === 'leads' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}>Leads Management</button><button onClick={() => setActiveTab('events')} className={`pb-2 px-2 ${activeTab === 'events' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}>Events Organized</button><button onClick={() => setActiveTab('zones')} className={`pb-2 px-2 ${activeTab === 'zones' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}>Zone Performance</button></div>

      {activeTab === 'target' && (<div><h3 className="font-bold mb-3">Zone-wise Target Performance</h3>{Object.entries(zoneTarget).map(([zone, target]) => (<div key={zone} className="mb-3"><div className="flex justify-between text-sm"><span className="capitalize">{zone} Zone</span><span>Target: ₹{(target/100000).toFixed(0)}L</span></div><div className="h-2 bg-gray-200 rounded-full"><div className="h-2 bg-primary rounded-full" style={{ width: `${currentRevenue[zone as keyof typeof currentRevenue]}%` }}></div></div></div>))}</div>)}

      {activeTab === 'leads' && (<div><div className="flex justify-between mb-4"><h3 className="font-bold">Leads Management</h3><button onClick={() => setShowLeadForm(!showLeadForm)} className="btn-primary text-sm px-3 py-1">+ Add Lead</button></div>{showLeadForm && (<div className="card bg-orange-50 mb-4"><input type="text" placeholder="Business Name" value={newLead.business} onChange={(e) => setNewLead({...newLead, business: e.target.value})} className="w-full p-2 border rounded mb-2" /><input type="text" placeholder="Contact Person" value={newLead.contact} onChange={(e) => setNewLead({...newLead, contact: e.target.value})} className="w-full p-2 border rounded mb-2" /><input type="text" placeholder="Source" value={newLead.source} onChange={(e) => setNewLead({...newLead, source: e.target.value})} className="w-full p-2 border rounded mb-2" /><div className="flex gap-2"><button onClick={handleAddLead} className="bg-primary text-white px-4 py-1 rounded">Save</button><button onClick={() => setShowLeadForm(false)} className="bg-gray-200 px-4 py-1 rounded">Cancel</button></div></div>)}<div className="space-y-3">{leads.map(lead => (<div key={lead.id} className="card flex justify-between items-center"><div><p className="font-bold">{lead.business}</p><p className="text-sm text-gray-500">{lead.contact} · {lead.source}</p><p className="text-xs text-gray-400">{lead.date}</p></div><div><span className={`px-2 py-1 rounded-full text-xs ${lead.status === 'approved' ? 'bg-green-100 text-green-700' : lead.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{lead.status === 'approved' ? 'Approved' : lead.status === 'rejected' ? 'Rejected' : 'Pending'}</span></div></div>))}</div></div>)}

      {activeTab === 'events' && (<div className="space-y-3"><div className="card flex justify-between items-center"><div><p className="font-bold">Startup Networking Meetup</p><p className="text-sm text-gray-500">WeWork, BKC · 24 May 2025</p><p className="text-sm">120 Attendees · ₹38,000 Revenue</p></div><span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Completed</span></div><div className="card flex justify-between items-center"><div><p className="font-bold">Digital Marketing Masterclass</p><p className="text-sm text-gray-500">Taj Lands End · 01 Jun 2025</p><p className="text-sm">85 Attendees · ₹24,500 Revenue</p></div><span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Upcoming</span></div></div>)}

      {activeTab === 'zones' && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="card"><p className="font-bold">Top Performing Zones</p><div className="mt-2"><p className="text-sm">🏆 West Zone - ₹58L (78% of target)</p><p className="text-sm">🥈 South Zone - ₹38L (53% of target)</p><p className="text-sm">🥉 North Zone - ₹45L (53% of target)</p></div></div><div className="card text-center"><p className="font-bold">Gold Franchise Benefits</p><p className="text-sm text-gray-600 mt-1">You are a Gold Partner! Keep growing and unlock more exciting rewards.</p><button className="btn-primary text-sm mt-2 px-4 py-1">View Benefits</button></div></div>)}
    </div>
  )
}
