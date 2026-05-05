'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Package, Truck, CheckCircle } from 'lucide-react'

// Sample offers data
const allOffers = [
  { id: 1, code: 'GCE20', discount: '20% OFF', description: 'on all products', supplier: 'FreshMart Pvt Ltd', claimed: 4, limit: 10, expiry: '25 May 2025', category: 'Dining', image: '🛒' },
  { id: 2, code: 'TECH15', discount: '15% OFF', description: 'on gadgets', supplier: 'TechZone', claimed: 4, limit: 10, expiry: '28 May 2025', category: 'Electronics', image: '📱' },
  { id: 3, code: 'ORG10', discount: '10% OFF', description: 'on organic items', supplier: 'Organic Bazaar', claimed: 4, limit: 10, expiry: '31 May 2025', category: 'Grocery', image: '🥬' },
  { id: 4, code: 'FIT20', discount: '20% OFF', description: 'on fitness gear', supplier: 'FitLife Supplies', claimed: 4, limit: 10, expiry: '29 May 2025', category: 'Fitness', image: '💪' },
]

export default function OffersPage() {
  const [offers, setOffers] = useState(allOffers)
  const [myOrders, setMyOrders] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showToast, setShowToast] = useState('')

  useEffect(() => {
    const savedOrders = localStorage.getItem('gce_orders')
    if (savedOrders) setMyOrders(JSON.parse(savedOrders))
  }, [])

  const saveOrder = (order: any) => {
    const updatedOrders = [order, ...myOrders]
    setMyOrders(updatedOrders)
    localStorage.setItem('gce_orders', JSON.stringify(updatedOrders))
  }

  const handleClaim = (offer: any) => {
    // Check user login
    const user = localStorage.getItem('gce_user')
    if (!user) {
      setShowToast('Please login to claim offers!')
      setTimeout(() => setShowToast(''), 3000)
      return
    }

    // Create order
    const order = {
      id: 'ORD' + Date.now(),
      offerCode: offer.code,
      offerDiscount: offer.discount,
      supplier: offer.supplier,
      amount: 499,
      status: 'paid',
      statusDate: new Date().toLocaleDateString(),
      tracking: {
        paid: true,
        received: false,
        shipped: false
      }
    }
    saveOrder(order)
    setShowToast(`✅ ${offer.code} claimed successfully!`)
    setTimeout(() => setShowToast(''), 3000)
  }

  const getTrackingIcon = (status: string, isComplete: boolean) => {
    if (isComplete) return <CheckCircle size={20} className="text-green-500" />
    return status === 'paid' ? <Package size={20} className="text-gray-400" /> : 
           status === 'received' ? <Package size={20} className="text-orange-500" /> :
           <Truck size={20} className="text-gray-400" />
  }

  const filteredOffers = selectedCategory === 'All' ? offers : offers.filter(o => o.category === selectedCategory)
  const categories = ['All', 'Dining', 'Electronics', 'Grocery', 'Fitness']

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center text-primary mb-2">Exclusive Offers</h1>
      <p className="text-center text-gray-500 mb-6">Limited claims – grab them before they run out!</p>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1 rounded-full text-sm ${selectedCategory === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>{cat}</button>
        ))}
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {filteredOffers.map(offer => (
          <div key={offer.id} className="card bg-orange-50 border-orange-200 hover:shadow-lg transition">
            <div className="text-4xl mb-2">{offer.image}</div>
            <div className="flex justify-between items-start">
              <div><span className="text-2xl font-bold text-primary">{offer.code}</span><p className="text-lg font-semibold">{offer.discount}</p><p className="text-sm text-gray-600">{offer.description}</p></div>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{offer.claimed}/{offer.limit} claimed</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Supplier: {offer.supplier}</p>
            <p className="text-xs text-gray-400">Exp: {offer.expiry}</p>
            <button onClick={() => handleClaim(offer)} className="btn-primary w-full mt-3 text-sm py-2">Claim & Pay</button>
          </div>
        ))}
      </div>

      {/* My Orders Section */}
      {myOrders.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">My Orders (Order Tracking)</h2>
          <div className="space-y-4">
            {myOrders.map(order => (
              <div key={order.id} className="card bg-white">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div><p className="font-bold text-primary">{order.offerCode}</p><p className="text-sm">{order.offerDiscount}</p><p className="text-xs text-gray-500">Supplier: {order.supplier}</p></div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Order ID: {order.id}</span>
                </div>
                
                {/* Order Tracking Timeline */}
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col items-center text-center flex-1"><div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">{getTrackingIcon('paid', true)}</div><p className="text-xs mt-1 font-medium">Paid</p><p className="text-xs text-gray-400">{order.statusDate}</p></div>
                    <div className="flex-1 h-0.5 bg-gray-200 mx-1"></div>
                    <div className="flex flex-col items-center text-center flex-1"><div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">{getTrackingIcon('received', order.tracking?.received)}</div><p className="text-xs mt-1 font-medium">Received from Supplier</p><p className="text-xs text-gray-400">{order.tracking?.received ? order.statusDate : 'Pending'}</p></div>
                    <div className="flex-1 h-0.5 bg-gray-200 mx-1"></div>
                    <div className="flex flex-col items-center text-center flex-1"><div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">{getTrackingIcon('shipped', order.tracking?.shipped)}</div><p className="text-xs mt-1 font-medium">Shipped to Member</p><p className="text-xs text-gray-400">{order.tracking?.shipped ? order.statusDate : 'Pending'}</p></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">{showToast}</div>}
    </div>
  )
}
