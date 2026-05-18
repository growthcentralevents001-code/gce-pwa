"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    setTimeout(() => {
      if (name && email && password) {
        router.push("/dashboard/user");
      } else {
        setError("Please fill all fields");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{ 
        maxWidth: "440px", 
        width: "100%", 
        background: "white", 
        borderRadius: "32px", 
        padding: "40px 32px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        border: "1px solid #fef3c7"
      }}>
        
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#f97316", margin: 0 }}>GCE</h1>
          <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>Growth Central Events</p>
        </div>

        {/* Title */}
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#1f2937", marginBottom: "8px" }}>Create account</h2>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>Join GCE to discover events and grow your network</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ background: "#fee2e2", color: "#dc2626", padding: "12px 16px", borderRadius: "12px", fontSize: "13px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
              Full Name
            </label>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #e5e7eb", borderRadius: "14px", padding: "12px 16px", background: "#fafafa" }}>
              <User size={18} style={{ color: "#9ca3af", marginRight: "10px" }} />
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: "14px" }}
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
              Email
            </label>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #e5e7eb", borderRadius: "14px", padding: "12px 16px", background: "#fafafa" }}>
              <Mail size={18} style={{ color: "#9ca3af", marginRight: "10px" }} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: "14px" }}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
              Password
            </label>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #e5e7eb", borderRadius: "14px", padding: "12px 16px", background: "#fafafa" }}>
              <Lock size={18} style={{ color: "#9ca3af", marginRight: "10px" }} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: "14px" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "#f97316",
              color: "white",
              border: "none",
              borderRadius: "40px",
              padding: "14px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginBottom: "24px",
              boxShadow: "0 4px 12px rgba(249,115,22,0.25)"
            }}
          >
            {loading ? "Creating account..." : "Sign Up →"}
          </button>
        </form>

        {/* Terms */}
        <p style={{ fontSize: "11px", color: "#9ca3af", textAlign: "center", marginBottom: "24px" }}>
          By signing up, you agree to our{" "}
          <Link href="/terms" style={{ color: "#f97316", textDecoration: "none" }}>Terms</Link> and{" "}
          <Link href="/privacy" style={{ color: "#f97316", textDecoration: "none" }}>Privacy Policy</Link>
        </p>

        {/* Sign In Link */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#f97316", fontWeight: "600", textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
