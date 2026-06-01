"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Star, Trophy, Zap, Crown, Sparkles } from "lucide-react";

export default function VenuePlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch("/api/venue-plans");
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setPlans(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  const getIcon = (name: string) => {
    switch(name) {
      case "Basic": return <Star className="w-8 h-8 text-gray-400" />;
      case "Silver": return <Zap className="w-8 h-8 text-gray-500" />;
      case "Gold": return <Trophy className="w-8 h-8 text-yellow-500" />;
      case "Platinum": return <Sparkles className="w-8 h-8 text-cyan-400" />;
      case "Diamond": return <Crown className="w-8 h-8 text-purple-500" />;
      default: return <Star className="w-8 h-8 text-orange-400" />;
    }
  };

  const getGradient = (name: string) => {
    switch(name) {
      case "Basic": return "from-gray-100 to-gray-200";
      case "Silver": return "from-gray-200 to-gray-300";
      case "Gold": return "from-yellow-100 to-yellow-200";
      case "Platinum": return "from-cyan-100 to-cyan-200";
      case "Diamond": return "from-purple-100 to-purple-200";
      default: return "from-orange-100 to-orange-200";
    }
  };

  const getBorderColor = (name: string) => {
    switch(name) {
      case "Gold": return "border-yellow-400";
      case "Platinum": return "border-cyan-400";
      case "Diamond": return "border-purple-400";
      default: return "border-gray-200";
    }
  };

  if (loading) return <div className="p-6 text-center">Loading amazing plans...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  if (plans.length === 0) return <div className="p-6 text-center">No plans available.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-2 px-4 bg-orange-100 rounded-full text-orange-600 text-sm font-semibold mb-4">
            🚀 Partner With Us
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Choose Your <span className="text-orange-500">Venue Plan</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Select the perfect plan for your venue and start hosting amazing events
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {plans.map((plan: any) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${getBorderColor(plan.name)} relative`}
            >
              {plan.name === "Platinum" && (
                <div className="absolute top-4 right-4 bg-cyan-500 text-white text-xs px-2 py-1 rounded-full">Popular</div>
              )}
              {plan.name === "Diamond" && (
                <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">Best Value</div>
              )}
              
              <div className={`p-6 text-center bg-gradient-to-b ${getGradient(plan.name)}`}>
                <div className="flex justify-center mb-4">
                  {getIcon(plan.name)}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{plan.name}</h2>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-orange-600">₹{plan.monthly_fee}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Capacity: {plan.capacity_min} - {plan.capacity_max} pax</p>
              </div>
              
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-green-500" /> Create unlimited events
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-green-500" /> Manage bookings
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-green-500" /> View payouts
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-green-500" /> 20% platform commission
                </div>
                {plan.name !== "Basic" && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-500" /> Priority support
                  </div>
                )}
              </div>
              
              <div className="p-6 pt-0">
                <button
                  onClick={() => alert(`Selected ${plan.name} plan - ₹${plan.monthly_fee}/month. Payment integration coming soon.`)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                    plan.name === "Diamond" 
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700"
                      : plan.name === "Platinum"
                      ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  } shadow-md hover:shadow-lg`}
                >
                  Select Plan →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 text-sm text-gray-400">
          All plans include 20% platform commission. No hidden fees.
        </div>
      </div>
    </div>
  );
}
