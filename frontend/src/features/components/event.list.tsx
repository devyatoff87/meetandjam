import { EventCard } from "./event.card";
import type { Event } from "../events/types";

export function EventList({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return <p className="py-12 text-center text-muted-foreground">No events found</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
