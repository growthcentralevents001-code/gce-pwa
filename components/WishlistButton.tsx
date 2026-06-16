"use client";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function WishlistButton({ eventId }: { eventId: string }) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSaved = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("wishlist_items")
        .select("id")
        .eq("user_id", user.id)
        .eq("event_id", eventId)
        .maybeSingle();
      setIsSaved(!!data);
    };
    checkSaved();
  }, [eventId]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please login to save events");
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    if (isSaved) {
      await supabase.from("wishlist_items").delete().eq("user_id", user.id).eq("event_id", eventId);
      setIsSaved(false);
    } else {
      await supabase.from("wishlist_items").insert({ user_id: user.id, event_id: eventId });
      setIsSaved(true);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className="p-1 rounded-full hover:bg-gray-100 transition z-10 relative"
    >
      <Heart size={20} className={isSaved ? "fill-red-500 text-red-500" : "text-gray-400"} />
    </button>
  );
}
