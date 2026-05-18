"use client";

import {
  Bell,
  Calendar,
  Compass,
  Heart,
  Home,
  MapPin,
  Search,
  SlidersHorizontal,
  User,
  Users,
  Briefcase,
} from "lucide-react";

const trendingEvents = [
  {
    title: "Fintech Leaders Roundtable",
    category: "BUSINESS",
    date: "24 May • 6:30 PM",
    venue: "The Leela, Mumbai",
    people: "12 going",
    price: "₹399",
    color: "bg-blue-600",
  },
  {
    title: "Bollywood Night Party",
    category: "SOCIAL",
    date: "25 May • 9:00 PM",
    venue: "Juhu, Mumbai",
    people: "28 going",
    price: "₹799",
    color: "bg-pink-500",
  },
  {
    title: "Brewery Tour Experience",
    category: "FOOD",
    date: "25 May • 9:00 PM",
    venue: "Andheri, Mumbai",
    people: "18 going",
    price: "₹699",
    color: "bg-green-500",
  },
];

const weekendPicks = [
  { title: "Stand-up Comedy Live", date: "25 May • 8:00 PM", price: "₹499" },
  { title: "Wellness & Yoga Session", date: "26 May • 7:00 AM", price: "₹299" },
  { title: "Art & Wine Evening", date: "26 May • 6:00 PM", price: "₹599" },
  { title: "Live Music Night", date: "26 May • 9:00 PM", price: "₹449" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fafafa] pb-28">
      <div className="mx-auto max-w-md px-4 pt-4">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[#f97316]">GCE</h1>
            <p className="-mt-1 text-sm font-semibold text-[#f97316]">Growth Central Events</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <MapPin className="h-4 w-4 text-[#f97316]" />
              <span className="text-sm font-semibold text-gray-800">Mumbai</span>
            </button>
            <button className="relative rounded-full bg-white p-3 shadow-sm">
              <Bell className="h-5 w-5 text-gray-700" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#f97316] text-xs font-bold text-white">3</span>
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-6 flex items-center rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
          <Search className="mr-3 h-5 w-5 text-gray-400" />
          <input type="text" placeholder="Search events, venues, people..." className="flex-1 bg-transparent text-sm text-gray-700 outline-none" />
          <SlidersHorizontal className="h-5 w-5 text-gray-500" />
        </div>

        {/* CATEGORY TABS */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-3xl bg-[#f97316] p-4 text-white shadow-lg shadow-orange-200">
            <Users className="mb-3 h-6 w-6" />
            <h3 className="text-sm font-bold">GCE Connect</h3>
            <p className="mt-1 text-xs leading-5 text-orange-100">Networking & Business Events</p>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
            <Compass className="mb-3 h-6 w-6 text-[#f97316]" />
            <h3 className="text-sm font-bold text-gray-900">GCE Marketplace</h3>
            <p className="mt-1 text-xs leading-5 text-gray-500">Venue Hosted Experiences</p>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
            <Briefcase className="mb-3 h-6 w-6 text-[#f97316]" />
            <h3 className="text-sm font-bold text-gray-900">GCE Enterprise</h3>
            <p className="mt-1 text-xs leading-5 text-gray-500">Corporate & B2B Solutions</p>
          </div>
        </div>

        {/* FEATURED BANNER - No image */}
        <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-orange-500 to-orange-600 p-6 shadow-2xl">
          <div className="absolute right-4 top-4">
            <Heart className="h-5 w-5 text-white/80" />
          </div>
          <div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">FEATURED</span>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white">Startup Founders Mixer</h2>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/90">
              <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />24 May, 6:30 PM</div>
              <div className="flex items-center gap-1"><MapPin className="h-4 w-4" />The Leela, Mumbai</div>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  <div className="h-9 w-9 rounded-full border-2 border-white bg-gray-300" />
                  <div className="h-9 w-9 rounded-full border-2 border-white bg-gray-400" />
                  <div className="h-9 w-9 rounded-full border-2 border-white bg-gray-500" />
                </div>
                <span className="text-sm text-white">124 people going</span>
              </div>
              <button className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-orange-600 shadow-lg">Book Now</button>
            </div>
          </div>
        </div>

        {/* TRENDING EVENTS */}
        <section className="mb-8 mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Trending Events</h2>
            <button className="text-sm font-semibold text-[#f97316]">View all</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {trendingEvents.map((event, index) => (
              <div key={index} className="min-w-[260px] overflow-hidden rounded-[28px] bg-white shadow-sm">
                <div className={`h-32 ${event.color} flex items-center justify-center text-white text-4xl`}>📷</div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">{event.category}</span>
                    <button><Heart className="h-4 w-4 text-gray-400" /></button>
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-gray-900">{event.title}</h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-500">
                    <div className="flex items-center gap-2"><Calendar className="h-3 w-3" />{event.date}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-3 w-3" />{event.venue}</div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-2">
                        <div className="h-6 w-6 rounded-full border-2 border-white bg-gray-300" />
                        <div className="h-6 w-6 rounded-full border-2 border-white bg-gray-400" />
                      </div>
                      <span className="text-xs text-gray-500">{event.people}</span>
                    </div>
                    <span className="text-xl font-bold text-[#f97316]">{event.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WEEKEND PICKS */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">This Weekend Picks</h2>
            <button className="text-sm font-semibold text-[#f97316]">View all</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {weekendPicks.map((item, index) => (
              <div key={index} className="overflow-hidden rounded-[24px] bg-white shadow-sm">
                <div className="h-24 bg-gradient-to-r from-orange-200 to-orange-300 flex items-center justify-center text-2xl">📷</div>
                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-xs text-gray-500">{item.date}</p>
                  <p className="mt-2 text-lg font-bold text-[#f97316]">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* OFFERS */}
        <section className="rounded-[30px] border border-orange-100 bg-orange-50 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f97316] text-3xl font-bold text-white">%</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Exclusive Offers</h3>
                <p className="mt-1 text-sm text-gray-600">Flat ₹100 OFF on all Business Events</p>
                <div className="mt-2 inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-[#f97316]">GCE100</div>
              </div>
            </div>
            <button className="rounded-2xl border-2 border-[#f97316] px-4 py-2 text-sm font-bold text-[#f97316]">View Offers</button>
          </div>
        </section>
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center justify-around px-4 py-3">
          <button className="flex flex-col items-center gap-0.5 text-[#f97316]"><Home className="h-5 w-5 fill-[#f97316]" /><span className="text-[10px] font-semibold">Home</span></button>
          <button className="flex flex-col items-center gap-0.5 text-gray-400"><Compass className="h-5 w-5" /><span className="text-[10px]">Explore</span></button>
          <button className="flex flex-col items-center gap-0.5 text-gray-400"><Calendar className="h-5 w-5" /><span className="text-[10px]">My Events</span></button>
          <button className="flex flex-col items-center gap-0.5 text-gray-400"><Users className="h-5 w-5" /><span className="text-[10px]">Circle</span></button>
          <button className="flex flex-col items-center gap-0.5 text-gray-400"><User className="h-5 w-5" /><span className="text-[10px]">Profile</span></button>
        </div>
      </div>
    </main>
  );
}
