import { Badge } from "@/components/ui/badge";
import { Event } from "@/lib/api/types";

export function EventDetails({ event }: { event: Event }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        {event.category && <Badge>{event.category}</Badge>}
      </div>

      <div className="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <p className="text-muted-foreground">When</p>
          <p>{new Date(event.startsAt).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Where</p>
          <p>{event.address}</p>
        </div>
        {event.entryPrice !== null && (
          <div>
            <p className="text-muted-foreground">Price</p>
            <p>{event.entryPrice} EUR</p>
          </div>
        )}
        {event.maxParticipants !== null && (
          <div>
            <p className="text-muted-foreground">Max participants</p>
            <p>{event.maxParticipants}</p>
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-muted-foreground">About</p>
        <p className="whitespace-pre-wrap">{event.description}</p>
      </div>

      {event.contactInfo && (
        <div>
          <p className="text-sm text-muted-foreground">Contact</p>
          <p>{event.contactInfo}</p>
        </div>
      )}
    </div>
  );
}
