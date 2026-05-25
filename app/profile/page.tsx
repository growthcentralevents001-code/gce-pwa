"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, MapPin, Heart, Calendar, Award, Edit2, Save, X, User } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    interests: [] as string[]
  });

  const [editForm, setEditForm] = useState(profile);

  // Load profile from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("gce_user");
    const storedProfile = localStorage.getItem("gce_profile");
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (storedProfile) {
        const savedProfile = JSON.parse(storedProfile);
        setProfile(savedProfile);
        setEditForm(savedProfile);
      } else {
        // Initialize from auth user
        const initialProfile = {
          name: user.name || "Rohan Mehta",
          email: user.email || "rohan@gmail.com",
          phone: "+91 98765 43210",
          city: "Mumbai",
          interests: ["Fintech", "Networking"]
        };
        setProfile(initialProfile);
        setEditForm(initialProfile);
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const stats = [
    { label: "Events Attended", value: "12", icon: Calendar },
    { label: "Saved Events", value: "5", icon: Heart },
    { label: "Referral Points", value: "150", icon: Award },
  ];

  const interestOptions = ["Fintech", "SaaS", "D2C", "Healthtech", "Edtech", "Networking", "Workshops", "Comedy", "Wellness", "Wine"];

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
    
    // Save to localStorage
    localStorage.setItem("gce_profile", JSON.stringify(editForm));
    
    // Update auth user name
    const storedUser = localStorage.getItem("gce_user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      user.name = editForm.name;
      localStorage.setItem("gce_user", JSON.stringify(user));
    }
    
    alert("Profile updated successfully!");
  };

  const toggleInterest = (interest: string) => {
    setEditForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest) 
        : [...prev.interests, interest]
    }));
  };

  if (!profile.name) {
    return <div style={{ textAlign: "center", padding: "48px" }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>My Profile</h1>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f97316", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer" }}>
            <Edit2 size={16} /> Edit Profile
          </button>
        ) : (
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={handleSave} style={{ background: "#22c55e", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer" }}>
              <Save size={16} /> Save
            </button>
            <button onClick={() => setIsEditing(false)} style={{ background: "#f1f5f9", color: "#64748b", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer" }}>
              <X size={16} /> Cancel
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>
        <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid #eef2ff" }}>
            <div style={{ width: "80px", height: "80px", background: "#f97316", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", color: "white" }}>
              {editForm.name.charAt(0).toUpperCase()}
            </div>
            <div>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                  style={{ fontSize: "22px", fontWeight: "700", padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0", width: "100%" }} 
                />
              ) : (
                <h2 style={{ fontSize: "22px", fontWeight: "700" }}>{profile.name}</h2>
              )}
              <p style={{ color: "#64748b" }}>Member since Jan 2025</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Mail size={18} style={{ color: "#f97316" }} />
              <div>{isEditing ? <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} style={{ padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0", width: "100%" }} /> : profile.email}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Phone size={18} style={{ color: "#f97316" }} />
              <div>{isEditing ? <input type="tel" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} style={{ padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0", width: "100%" }} /> : profile.phone}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <MapPin size={18} style={{ color: "#f97316" }} />
              <div>{isEditing ? <input type="text" value={editForm.city} onChange={(e) => setEditForm({...editForm, city: e.target.value})} style={{ padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0", width: "100%" }} /> : profile.city}</div>
            </div>
          </div>

          <div style={{ marginTop: "24px" }}>
            <h3 style={{ fontWeight: "600", marginBottom: "12px" }}>Your Interests</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {isEditing ? (
                interestOptions.map(interest => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      border: "1px solid",
                      background: editForm.interests.includes(interest) ? "#f97316" : "white",
                      color: editForm.interests.includes(interest) ? "white" : "#64748b",
                      borderColor: editForm.interests.includes(interest) ? "#f97316" : "#e2e8f0",
                      cursor: "pointer"
                    }}
                  >
                    {interest}
                  </button>
                ))
              ) : (
                profile.interests.map(interest => (
                  <span key={interest} style={{ background: "#f1f5f9", padding: "6px 12px", borderRadius: "20px", fontSize: "12px" }}>
                    {interest}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ background: "white", borderRadius: "16px", padding: "16px", border: "1px solid #eef2ff", display: "flex", alignItems: "center", gap: "12px" }}>
              <stat.icon size={24} style={{ color: "#f97316" }} />
              <div>
                <div style={{ fontSize: "20px", fontWeight: "700" }}>{stat.value}</div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
