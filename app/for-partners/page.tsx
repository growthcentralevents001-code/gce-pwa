export default function ForPartnersPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-primary mb-2">For Partners</h1>
      <p className="text-center text-gray-500 mb-8">Partner with Growth Central Events</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center"><h3 className="text-xl font-bold text-primary">Basic</h3><p className="text-3xl font-bold">10%<span className="text-base"> discount</span></p><ul className="my-4 space-y-1"><li>✓ Basic listing</li><li>✓ Event posting</li></ul><button className="btn-primary w-full">Sign Up</button></div>
        <div className="card text-center border-primary ring-2 ring-primary"><span className="bg-primary text-white text-xs px-2 py-1 rounded-full">⭐ POPULAR</span><h3 className="text-xl font-bold text-primary mt-2">Silver</h3><p className="text-3xl font-bold">20%<span className="text-base"> discount</span></p><ul className="my-4 space-y-1"><li>✓ All Basic benefits</li><li>✓ Priority support</li><li>✓ Featured listing</li></ul><button className="btn-primary w-full">Sign Up</button></div>
        <div className="card text-center"><h3 className="text-xl font-bold text-primary">Gold</h3><p className="text-3xl font-bold">30%<span className="text-base"> discount</span></p><ul className="my-4 space-y-1"><li>✓ All Silver benefits</li><li>✓ Priority booking</li><li>✓ Dedicated manager</li></ul><button className="btn-primary w-full">Sign Up</button></div>
      </div>
      <div className="bg-orange-50 rounded-xl p-6"><h2 className="text-xl font-bold text-center text-primary mb-4">Become a Partner</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><input type="text" placeholder="Hotel/Restaurant Name" className="p-2 border rounded-lg" /><input type="text" placeholder="Contact Person" className="p-2 border rounded-lg" /><input type="email" placeholder="Email" className="p-2 border rounded-lg" /><input type="tel" placeholder="Phone" className="p-2 border rounded-lg" /></div><button className="btn-primary w-full mt-4">Submit Application</button></div>
    </div>
  )
}
