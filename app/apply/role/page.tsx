"use client";
import { useRoles } from "@/context/RoleContext";
import Link from "next/link";
import { Users, Building, Briefcase, Award, ArrowRight, Sparkles } from "lucide-react";

export default function ApplyRolePage() {
  const { roles } = useRoles();
  const existingRoles = new Set(roles);

  const availableRoles = [
    { 
      key: "zbp", 
      name: "Zonal Business Partner (ZBP)", 
      path: "/zbp/apply", 
      description: "Onboard venues, earn commission",
      icon: Award,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200"
    },
    { 
      key: "venue", 
      name: "Venue Partner", 
      path: "/venue/apply", 
      description: "List events, manage bookings",
      icon: Building,
      color: "from-green-500 to-green-600",
      bg: "bg-green-50",
      border: "border-green-200"
    },
    { 
      key: "enterprise", 
      name: "Enterprise Client", 
      path: "/enterprise/signup", 
      description: "Plan corporate events",
      icon: Briefcase,
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200"
    },
  ];

  const pendingRoles = availableRoles.filter(r => !existingRoles.has(r.key));

  if (pendingRoles.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">You're All Set!</h2>
          <p className="text-gray-500 mt-2">You have already applied for all available roles.</p>
          <Link href="/dashboard" className="inline-block mt-4 text-orange-600 hover:text-orange-700 font-medium">
            Go to Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-medium mb-3">
            <Sparkles size={16} />
            Apply for a Business Role
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Join the GCE Ecosystem
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Choose a role that fits your skills and start growing with India's first three-vertical event platform.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pendingRoles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.key}
                className={`group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border ${role.border} hover:border-orange-300 flex flex-col p-6`}
              >
                <div className={`w-14 h-14 rounded-xl ${role.bg} flex items-center justify-center mb-4 group-hover:scale-105 transition`}>
                  <Icon size={28} className={`text-${role.color.split('-')[1]}-600`} />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">{role.name}</h2>
                <p className="text-sm text-gray-500 mb-6 flex-1">{role.description}</p>
                <Link
                  href={role.path}
                  className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors shadow-sm hover:shadow"
                >
                  Apply Now <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-400 mt-10">
        </p>
      </div>
    </div>
  );
}
