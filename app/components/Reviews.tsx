"use client";

import { useState } from "react";
import { Star, User, Calendar, ThumbsUp, Flag } from "lucide-react";

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  eventName: string;
}

export default function Reviews({ eventId, eventName }: { eventId: string; eventName: string }) {
  const [reviews, setReviews] = useState<Review[]>([
    { id: 1, userName: "Rohan Mehta", rating: 5, comment: "Amazing event! Great networking opportunities.", date: "25 May 2025", helpful: 12, eventName: eventName },
    { id: 2, userName: "Neha Kapoor", rating: 4, comment: "Well organized, but could be longer.", date: "24 May 2025", helpful: 8, eventName: eventName },
    { id: 3, userName: "Vikram Singh", rating: 5, comment: "Met some great founders! Worth it.", date: "23 May 2025", helpful: 15, eventName: eventName },
  ]);
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmitReview = () => {
    if (!newComment.trim()) return;
    const newReview: Review = {
      id: reviews.length + 1,
      userName: "You",
      rating: newRating,
      comment: newComment,
      date: new Date().toLocaleDateString(),
      helpful: 0,
      eventName: eventName
    };
    setReviews([newReview, ...reviews]);
    setShowReviewForm(false);
    setNewComment("");
    setNewRating(5);
    alert("Review submitted successfully!");
  };

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div style={{ marginTop: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: "700" }}>Reviews & Ratings</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              {[1,2,3,4,5].map(star => (
                <Star key={star} size={18} fill={star <= Math.round(averageRating) ? "#f97316" : "none"} stroke="#f97316" />
              ))}
            </div>
            <span style={{ fontWeight: "600" }}>{averageRating.toFixed(1)}</span>
            <span style={{ fontSize: "13px", color: "#64748b" }}>({reviews.length} reviews)</span>
          </div>
        </div>
        <button onClick={() => setShowReviewForm(!showReviewForm)} style={{ background: "#f97316", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer" }}>Write a Review</button>
      </div>

      {showReviewForm && (
        <div style={{ background: "#f8fafc", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ marginBottom: "8px", fontWeight: "500" }}>Your Rating</div>
            <div style={{ display: "flex", gap: "4px" }}>
              {[1,2,3,4,5].map(star => (
                <Star 
                  key={star} 
                  size={24} 
                  fill={star <= (hoverRating || newRating) ? "#f97316" : "none"} 
                  stroke="#f97316" 
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setNewRating(star)}
                />
              ))}
            </div>
          </div>
          <textarea 
            placeholder="Share your experience..." 
            value={newComment} 
            onChange={(e) => setNewComment(e.target.value)} 
            rows={3} 
            style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "12px" }}
          />
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={handleSubmitReview} style={{ background: "#f97316", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer" }}>Submit</button>
            <button onClick={() => setShowReviewForm(false)} style={{ background: "#f1f5f9", color: "#64748b", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {reviews.map(review => (
          <div key={review.id} style={{ background: "white", borderRadius: "16px", padding: "16px", border: "1px solid #eef2ff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <div style={{ width: "32px", height: "32px", background: "#fef3c7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "600", color: "#92400e" }}>
                    {review.userName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: "600" }}>{review.userName}</div>
                    <div style={{ fontSize: "11px", color: "#64748b", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Calendar size={10} /> {review.date}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "2px" }}>
                {[1,2,3,4,5].map(star => (
                  <Star key={star} size={14} fill={star <= review.rating ? "#f97316" : "none"} stroke="#f97316" />
                ))}
              </div>
            </div>
            <p style={{ fontSize: "14px", color: "#0f172a", marginBottom: "12px" }}>{review.comment}</p>
            <div style={{ display: "flex", gap: "16px" }}>
              <button style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", fontSize: "12px", color: "#64748b", cursor: "pointer" }}><ThumbsUp size={12} /> Helpful ({review.helpful})</button>
              <button style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", fontSize: "12px", color: "#64748b", cursor: "pointer" }}><Flag size={12} /> Report</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
