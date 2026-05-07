'use client'
import { useState } from 'react'
import { Settings, CreditCard, Users, Mail, Bell, Shield, Save, Edit2, Plus, Trash2 } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Growth Central Events',
    siteEmail: 'admin@growthcentralevents.com',
    contactEmail: 'info@growthcentralevents.com',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
  })

  const [membershipPlans, setMembershipPlans] = useState([
    { id: 1, name: 'Individual', price: 100, features: ['View all events', 'Member discounts'] },
    { id: 2, name: 'Family', price: 200, features: ['Everything in Individual', '4 family members', 'Priority support'] },
    { id: 3, name: 'Business', price: 500, features: ['All Family benefits', 'Access to The Circle', 'Lead opportunities'] },
  ])

  const [commissionRates, setCommissionRates] = useState({
    bdmCommission: 12,
    partnerCommission: 10,
    offerCommission: 8,
  })

  const [general, setGeneral] = useState(generalSettings)

  const handleSaveGeneral = () => {
    setGeneralSettings(general)
    alert('Settings saved successfully!')
  }

  const handleSaveCommissions = () => {
    alert('Commission rates saved successfully!')
  }

  return (
    <div className="p-6">
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-800">Settings</h1><p className="text-gray-500 text-sm">Manage platform configuration</p></div>

      {/* Settings Tabs */}
      <div className="flex flex-wrap gap-2 border-b mb-6">
        <button onClick={() => setActiveTab('general')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'general' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'}`}><Settings size={16} className="inline mr-1" /> General</button>
        <button onClick={() => setActiveTab('membership')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'membership' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'}`}><CreditCard size={16} className="inline mr-1" /> Membership Plans</button>
        <button onClick={() => setActiveTab('commission')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'commission' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'}`}><Users size={16} className="inline mr-1" /> Commissions</button>
        <button onClick={() => setActiveTab('email')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'email' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'}`}><Mail size={16} className="inline mr-1" /> Email Templates</button>
        <button onClick={() => setActiveTab('security')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'security' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'}`}><Shield size={16} className="inline mr-1" /> Security</button>
      </div>

      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">General Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div><label className="block text-sm font-medium mb-1">Site Name</label><input type="text" value={general.siteName} onChange={(e) => setGeneral({...general, siteName: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Admin Email</label><input type="email" value={general.siteEmail} onChange={(e) => setGeneral({...general, siteEmail: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Contact Email</label><input type="email" value={general.contactEmail} onChange={(e) => setGeneral({...general, contactEmail: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Timezone</label><select value={general.timezone} onChange={(e) => setGeneral({...general, timezone: e.target.value})} className="w-full p-2 border rounded-lg"><option value="Asia/Kolkata">IST (Asia/Kolkata)</option><option value="Asia/Dubai">GST (Asia/Dubai)</option><option value="America/New_York">EST (America/New_York)</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Currency</label><select value={general.currency} onChange={(e) => setGeneral({...general, currency: e.target.value})} className="w-full p-2 border rounded-lg"><option value="INR">Indian Rupee (₹)</option><option value="USD">US Dollar ($)</option><option value="EUR">Euro (€)</option></select></div>
          </div>
          <button onClick={handleSaveGeneral} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"><Save size={16} /> Save Changes</button>
        </div>
      )}

      {/* Membership Plans Tab */}
      {activeTab === 'membership' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">Membership Plans</h3><button className="bg-primary text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"><Plus size={16} /> Add Plan</button></div>
          <div className="space-y-4">
            {membershipPlans.map(plan => (
              <div key={plan.id} className="border rounded-lg p-4"><div className="flex justify-between items-start"><div><h4 className="font-bold">{plan.name}</h4><p className="text-primary font-bold">₹{plan.price}/month</p><ul className="mt-2 space-y-1">{plan.features.map((f, i) => (<li key={i} className="text-sm text-gray-600">✓ {f}</li>))}</ul></div><div className="flex gap-2"><button className="text-orange-500"><Edit2 size={18} /></button><button className="text-red-500"><Trash2 size={18} /></button></div></div></div>
            ))}
          </div>
        </div>
      )}

      {/* Commission Rates Tab */}
      {activeTab === 'commission' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">Commission Rates</h3>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">BDM Commission (%)</label><input type="number" value={commissionRates.bdmCommission} onChange={(e) => setCommissionRates({...commissionRates, bdmCommission: parseInt(e.target.value)})} className="w-32 p-2 border rounded-lg" /><p className="text-xs text-gray-500 mt-1">Commission earned by BDMs on event revenue</p></div>
            <div><label className="block text-sm font-medium mb-1">Partner Commission (%)</label><input type="number" value={commissionRates.partnerCommission} onChange={(e) => setCommissionRates({...commissionRates, partnerCommission: parseInt(e.target.value)})} className="w-32 p-2 border rounded-lg" /><p className="text-xs text-gray-500 mt-1">Commission earned by partners on F&B</p></div>
            <div><label className="block text-sm font-medium mb-1">Offer Commission (%)</label><input type="number" value={commissionRates.offerCommission} onChange={(e) => setCommissionRates({...commissionRates, offerCommission: parseInt(e.target.value)})} className="w-32 p-2 border rounded-lg" /><p className="text-xs text-gray-500 mt-1">Commission earned by GCE on offer sales</p></div>
          </div>
          <button onClick={handleSaveCommissions} className="mt-4 bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"><Save size={16} /> Save Commission Rates</button>
        </div>
      )}

      {/* Email Templates Tab */}
      {activeTab === 'email' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">Email Templates</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded-lg"><div><p className="font-medium">Welcome Email</p><p className="text-sm text-gray-500">Sent when a new member joins</p></div><button className="text-primary text-sm">Edit Template</button></div>
            <div className="flex justify-between items-center p-3 border rounded-lg"><div><p className="font-medium">Event Registration Confirmation</p><p className="text-sm text-gray-500">Sent after event booking</p></div><button className="text-primary text-sm">Edit Template</button></div>
            <div className="flex justify-between items-center p-3 border rounded-lg"><div><p className="font-medium">Booking Confirmation (Advance)</p><p className="text-sm text-gray-500">Sent after ₹500 advance payment</p></div><button className="text-primary text-sm">Edit Template</button></div>
            <div className="flex justify-between items-center p-3 border rounded-lg"><div><p className="font-medium">Lead Verification Status</p><p className="text-sm text-gray-500">Sent to BDM when lead is approved/rejected</p></div><button className="text-primary text-sm">Edit Template</button></div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded-lg"><div><p className="font-medium">Two-Factor Authentication (2FA)</p><p className="text-sm text-gray-500">Add an extra layer of security to your account</p></div><button className="bg-gray-200 px-3 py-1 rounded-lg text-sm">Enable</button></div>
            <div className="flex justify-between items-center p-3 border rounded-lg"><div><p className="font-medium">Session Timeout</p><p className="text-sm text-gray-500">Automatically log out inactive users</p></div><select className="border rounded-lg px-2 py-1 text-sm"><option>30 minutes</option><option>1 hour</option><option>2 hours</option><option>Never</option></select></div>
            <div className="flex justify-between items-center p-3 border rounded-lg"><div><p className="font-medium">Login Alerts</p><p className="text-sm text-gray-500">Receive email when someone logs into your account</p></div><button className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm">Enabled</button></div>
            <div className="border-t pt-4"><button className="text-red-500 border border-red-500 px-4 py-2 rounded-lg">Clear All Cache</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
