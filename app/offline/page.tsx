"use client";

export default function OfflinePage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>You are offline</h1>
      <p>Please check your internet connection and try again.</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
}
