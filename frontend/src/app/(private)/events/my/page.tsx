"use client";

import { EventCard } from "@/features/events/components/event.card";
import { useMyEvents } from "@/features/events/hooks/use.my.events";

export default function MyEvents() {
  const { data, isError, isLoading } = useMyEvents();
  const events = data?.events;

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-destructive">Failed to load your events</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">My events</h1>

      {!events || events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">You haven't created any events yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
