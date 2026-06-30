'use client'
import { useState } from 'react'
import { Search, Eye, Edit, Trash2, Filter, Calendar, DollarSign, CheckCircle, Clock, X } from 'lucide-react'

export default function BookingsManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showViewModal, setShowViewModal] = useState<any>(null)

  const [bookings, setBookings] = useState([
    { id: 1, event: 'Corporate Offsite', customer: 'Rohan Sharma', email: 'rohan@gmail.com', phone: '9876543210', date: '20-22 Jun 2025', venue: 'The Serai, Coorg', advance: 500, finalBill: 12500, status: 'advance_paid', advanceDate: '15 May 2025' },
    { id: 2, event: 'Leadership Retreat', customer: 'Neha Kapoor', email: 'neha@gmail.com', phone: '9876543211', date: '11-13 Jul 2025', venue: 'Fragrant Nature, Munnar', advance: 500, finalBill: 0, status: 'advance_paid', advanceDate: '18 May 2025' },
    { id: 3, event: 'Birthday Party', customer: 'Vikram Singh', email: 'vikram@gmail.com', phone: '9876543212', date: '25 May 2025', venue: 'The Leela, Mumbai', advance: 500, finalBill: 8500, status: 'completed', advanceDate: '10 May 2025' },
    { id: 4, event: 'Product Launch', customer: 'Anjali Desai', email: 'anjali@gmail.com', phone: '9876543213', date: '05 Jun 2025', venue: 'Jio World Centre, Mumbai', advance: 500, finalBill: 0, status: 'advance_paid', advanceDate: '20 May 2025' },
  ])

  const handleUpdateStatus = (id: number, status: string, finalBill?: number) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status, finalBill: finalBill || b.finalBill } : b))
    alert(`Booking ${status === 'completed' ? 'completed successfully!' : 'cancelled!'}`)
  }

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customer.toLowerCase().includes(searchTerm.toLowerCase()) || b.event.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const colors = { advance_paid: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700' }
    const labels = { advance_paid: 'Advance Paid', completed: 'Completed' }
    return <span className={`px-2 py-1 rounded-full text-xs ${colors[status as keyof typeof colors]}`}>{labels[status as keyof typeof labels]}</span>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bookings Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-primary"><div className="flex items-center gap-3"><Calendar size={24} className="text-primary" /><div><p className="text-2xl font-bold">{bookings.length}</p><p className="text-sm">Total Bookings</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500"><div className="flex items-center gap-3"><Clock size={24} className="text-blue-500" /><div><p className="text-2xl font-bold">{bookings.filter(b => b.status === 'advance_paid').length}</p><p className="text-sm">Advance Paid</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500"><div className="flex items-center gap-3"><CheckCircle size={24} className="text-green-500" /><div><p className="text-2xl font-bold">{bookings.filter(b => b.status === 'completed').length}</p><p className="text-sm">Completed</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500"><div className="flex items-center gap-3"><DollarSign size={24} className="text-purple-500" /><div><p className="text-2xl font-bold">₹{bookings.reduce((s,b) => s + b.advance + b.finalBill, 0).toLocaleString()}</p><p className="text-sm">Total Revenue</p></div></div></div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded-lg"><option value="all">All Status</option><option value="advance_paid">Advance Paid</option><option value="completed">Completed</option></select>
          <button onClick={() => { setSearchTerm(''); setStatusFilter('all') }} className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"><Filter size={18} /> Clear</button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr><th className="p-3 text-left">Event</th><th className="p-3 text-left">GCE Enterpriseer</th><th className="p-3 text-left">Date</th><th className="p-3 text-left">Advance</th><th className="p-3 text-left">Final Bill</th><th className="p-3 text-left">Status</th><th className="p-3 text-center">Actions</th></tr>
            </thead>
            <tbody>
              {filteredBookings.map(b => (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="p-3"><div><p className="font-medium">{b.event}</p><p className="text-xs text-gray-400">{b.venue}</p></div></td>
                  <td className="p-3"><div><p>{b.customer}</p><p className="text-xs text-gray-400">{b.email}</p></div></td>
                  <td className="p-3">{b.date}</td>
                  <td className="p-3">₹{b.advance.toLocaleString()}<br /><span className="text-xs text-gray-400">Paid: {b.advanceDate}</span></td>
                  <td className="p-3">{b.finalBill > 0 ? `₹${b.finalBill.toLocaleString()}` : 'Pending'}</td>
                  <td className="p-3">{getStatusBadge(b.status)}</td>
                  <td className="p-3 text-center"><div className="flex justify-center gap-2"><button onClick={() => setShowViewModal(b)} className="text-blue-500"><Eye size={18} /></button>{b.status === 'advance_paid' && <button onClick={() => handleUpdateStatus(b.id, 'completed', 12500)} className="text-green-500"><CheckCircle size={18} /></button>}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t flex justify-between items-center"><p className="text-sm text-gray-500">Showing {filteredBookings.length} of {bookings.length} bookings</p><div className="flex gap-2"><button className="px-3 py-1 border rounded">Previous</button><button className="px-3 py-1 bg-primary text-white rounded">1</button><button className="px-3 py-1 border rounded">Next</button></div></div>
      </div>

      {/* View Booking Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Booking Details</h3><button onClick={() => setShowViewModal(null)}><X size={24} /></button></div>
            <div className="space-y-3">
              <div><p className="text-sm text-gray-500">Event</p><p className="font-medium">{showViewModal.event}</p></div>
              <div><p className="text-sm text-gray-500">GCE Enterpriseer</p><p>{showViewModal.customer}<br /><span className="text-sm text-gray-500">{showViewModal.email} | {showViewModal.phone}</span></p></div>
              <div><p className="text-sm text-gray-500">Venue</p><p>{showViewModal.venue}</p></div>
              <div><p className="text-sm text-gray-500">Date</p><p>{showViewModal.date}</p></div>
              <div className="border-t pt-3"><p className="text-sm text-gray-500">Advance Paid</p><p className="text-primary font-bold">₹{showViewModal.advance}</p><p className="text-xs text-gray-500">Paid on: {showViewModal.advanceDate}</p></div>
              <div><p className="text-sm text-gray-500">Final Bill Status</p><p>{showViewModal.finalBill > 0 ? `₹${showViewModal.finalBill} (Paid)` : 'Pending'}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
