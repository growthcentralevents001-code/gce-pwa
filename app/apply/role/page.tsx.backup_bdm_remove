"use client";
import { useRoles } from "@/context/RoleContext";
import Link from "next/link";

export default function ApplyRolePage() {
  const { roles } = useRoles();
  const existingRoles = new Set(roles);

  const availableRoles = [
    { key: "zbp", name: "Zonal Business Partner (ZBP)", path: "/zbp/apply", description: "Onboard venues, earn commission" },
    { key: "affiliate", name: "Affiliate", path: "/affiliate/signup", description: "Refer venues, earn commission" },
    { key: "venue", name: "Venue Partner", path: "/dashboard/venue", description: "List events, manage bookings" },
    { key: "bdm", name: "BDM", path: "/bdm/apply", description: "Manage leads, earn commission" },
    { key: "enterprise", name: "Enterprise Client", path: "/enterprise/signup", description: "Plan corporate events" },
  ];

  const pendingRoles = availableRoles.filter(r => !existingRoles.has(r.key));

  if (pendingRoles.length === 0) {
    return <div className="max-w-2xl mx-auto p-6 text-center">You have already applied for all available roles.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Apply for a Business Role</h1>
      <div className="space-y-4">
        {pendingRoles.map(role => (
          <div key={role.key} className="bg-white rounded-lg shadow p-4 border">
            <h2 className="text-xl font-semibold">{role.name}</h2>
            <p className="text-gray-500 mb-2">{role.description}</p>
            <Link href={role.path} className="inline-block bg-orange-600 text-white px-4 py-2 rounded-lg text-sm">
              Apply Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
