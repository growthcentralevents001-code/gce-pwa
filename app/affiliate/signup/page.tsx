"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useRoles } from "@/context/RoleContext";

export default function AffiliateSignup() {
  const router = useRouter();
  const { refetch } = useRoles();
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    social_handle: "",
    follower_range: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alreadyAffiliate, setAlreadyAffiliate] = useState(false);

  useEffect(() => {
    async function checkExisting() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirectTo=/affiliate/signup");
        return;
      }
      const { data: existing } = await supabase
        .from("marketplace_affiliates")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (existing) {
        setAlreadyAffiliate(true);
        setTimeout(() => router.push("/dashboard/affiliate"), 2000);
      }
    }
    checkExisting();
  }, []);

  const getCommissionRate = (range: string) => {
    if (range === "<10k") return 15;
    if (range === "10k-50k") return 20;
    if (range === "50k+") return 30;
    return 15;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?redirectTo=/affiliate/signup");
      return;
    }

    const commissionRate = getCommissionRate(formData.follower_range);

    // 1. Insert into affiliate_applications
    const { error: appError } = await supabase
      .from("affiliate_applications")
      .insert({
        user_id: user.id,
        full_name: formData.full_name,
        phone: formData.phone,
        social_handle: formData.social_handle,
        follower_range: formData.follower_range,
        status: "approved",
      });
    if (appError) {
      alert("Application insert failed: " + appError.message);
      setLoading(false);
      return;
    }

    // 2. Insert into marketplace_affiliates
    const { error: affError } = await supabase
      .from("marketplace_affiliates")
      .upsert({
        user_id: user.id,
        name: formData.full_name,
        commission_rate: commissionRate,
        status: "Approved",
      }, { onConflict: "user_id" });
    if (affError) {
      alert("Marketplace affiliate insert failed: " + affError.message);
      setLoading(false);
      return;
    }

    // 3. Add role
    const { error: roleError } = await supabase.rpc("add_user_role", {
      p_user_id: user.id,
      p_role_name: "affiliate",
    });
    if (roleError) {
      alert("Role assign failed: " + roleError.message);
      setLoading(false);
      return;
    }

    await refetch();
    alert("Affiliate registration successful!");
    window.location.href = "/dashboard/affiliate";
    setLoading(false);
  };

  if (alreadyAffiliate) {
    return <div className="max-w-2xl mx-auto p-6 text-center">Already an Affiliate. Redirecting...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Affiliate Signup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label>Full Name</label><input type="text" required className="w-full border rounded p-2" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} /></div>
        <div><label>Phone Number</label><input type="tel" required className="w-full border rounded p-2" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
        <div><label>Social Media Handle</label><input type="text" required className="w-full border rounded p-2" value={formData.social_handle} onChange={e => setFormData({...formData, social_handle: e.target.value})} /></div>
        <div><label>Follower Count</label><select required className="w-full border rounded p-2" value={formData.follower_range} onChange={e => setFormData({...formData, follower_range: e.target.value})}>
          <option value="">Select range</option>
          <option value="<10k">&lt; 10k followers (15% commission)</option>
          <option value="10k-50k">10k-50k followers (20% commission)</option>
          <option value="50k+">50k+ followers (30% commission)</option>
        </select></div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="bg-orange-600 text-white px-4 py-2 rounded w-full">{loading ? "Submitting..." : "Submit Application"}</button>
      </form>
    </div>
  );
}
