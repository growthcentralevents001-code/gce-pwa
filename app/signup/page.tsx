"use client";
import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [referralId, setReferralId] = useState<string | null>(null);

  // Capture referral parameter from URL
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setReferralId(ref);
      localStorage.setItem("affiliate_ref", ref);
    } else {
      const stored = localStorage.getItem("affiliate_ref");
      if (stored) setReferralId(stored);
    }
  }, [searchParams]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // If referral exists, track it (optional: call API to create association)
    if (referralId && data.user) {
      await fetch("/api/affiliate/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ affiliateId: referralId, newUserId: data.user.id })
      });
    }
    alert("Signup successful! Please check your email to confirm.");
    router.push("/");
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Create Account</h1>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" required />
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 pr-10" required minLength={6} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition">{loading ? "Creating account..." : "Sign Up"}</button>
        </form>
        <div className="mt-6">
          <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div></div>
          <button onClick={handleGoogleSignup} className="mt-4 w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition">Google</button>
        </div>
        <p className="text-center text-sm mt-6 text-gray-600">Already have an account? <a href="/login" className="text-orange-600 font-semibold">Login</a></p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
