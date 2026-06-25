"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setUser(user);
    
    // Fetch additional user data from users table
    const { data } = await supabase.from("users").select("full_name, phone").eq("id", user.id).single();
    if (data) {
      setFullName(data.full_name || "");
      setPhone(data.phone || "");
    }
    setLoading(false);
  }

  async function saveProfile() {
    setSaving(true);
    await supabase.from("users").update({ full_name: fullName, phone }).eq("id", user.id);
    alert("Profile updated!");
    setSaving(false);
  }

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Email</label>
          <input type="email" value={user?.email || ""} disabled className="w-full border rounded-lg p-2 bg-gray-50" />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Full Name</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border rounded-lg p-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded-lg p-2" />
        </div>
        <button onClick={saveProfile} disabled={saving} className="bg-orange-600 text-white px-4 py-2 rounded-lg">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
