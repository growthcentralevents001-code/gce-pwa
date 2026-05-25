"use client";
import { useEffect } from "react";

export default function EventsAdmin() {
  useEffect(() => {
    window.location.href = "/events.html";
  }, []);
  return <div>Loading Events Page...</div>;
}
