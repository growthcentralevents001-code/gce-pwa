import { Suspense } from "react";
import EventsContent from "./EventsContent";

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center">Loading events...</div>}>
      <EventsContent />
    </Suspense>
  );
}
