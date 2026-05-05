export default function MembershipsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-primary mb-2">Membership Plans</h1>
      <p className="text-center text-gray-500 mb-8">Choose the perfect plan to grow your network</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center"><h2 className="text-2xl font-bold text-primary">Individual</h2><p className="text-3xl font-bold">₹100<span className="text-base">/month</span></p><ul className="my-4 space-y-1"><li>✓ Access to all events</li><li>✓ Member discounts</li></ul><button className="btn-primary w-full">Select Plan</button></div>
        <div className="card text-center border-primary ring-2 ring-primary"><span className="bg-primary text-white text-xs px-2 py-1 rounded-full">⭐ MOST POPULAR</span><h2 className="text-2xl font-bold text-primary mt-2">Family</h2><p className="text-3xl font-bold">₹200<span className="text-base">/month</span></p><ul className="my-4 space-y-1"><li>✓ All Individual benefits</li><li>✓ 4 family members</li><li>✓ Priority support</li></ul><button className="btn-primary w-full">Select Plan</button></div>
        <div className="card text-center"><h2 className="text-2xl font-bold text-primary">Business</h2><p className="text-3xl font-bold">₹500<span className="text-base">/month</span></p><ul className="my-4 space-y-1"><li>✓ All Family benefits</li><li>✓ Access to The Circle</li><li>✓ Lead opportunities</li></ul><button className="btn-primary w-full">Select Plan</button></div>
      </div>
      <div className="mt-8 bg-orange-50 p-4 rounded-xl text-center"><p className="font-semibold">✨ Gold members get priority booking and exclusive offers</p><button className="mt-2 bg-primary text-white px-4 py-1 rounded-full text-sm">Upgrade Now</button></div>
    </div>
  )
}
