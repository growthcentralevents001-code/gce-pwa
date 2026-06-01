"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

export default function PushNotification() {
  const [permission, setPermission] = useState("default");
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      alert("Notifications enabled! You'll receive event reminders.");
      // Register service worker and send token to backend
    }
  };

  if (!supported || permission === "granted") return null;

  return (
    <button 
      onClick={requestPermission}
      style={{ position: "fixed", bottom: "24px", right: "24px", background: "#f97316", color: "white", border: "none", borderRadius: "50%", width: "56px", height: "56px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 100 }}
    >
      <Bell size={24} />
    </button>
  );
}
