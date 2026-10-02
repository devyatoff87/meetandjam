import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Event } from "../events/types";

export function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2">{event.title}</CardTitle>
            {event.category && <Badge>{event.category}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p className="line-clamp-2">{event.description}</p>
          <p>{new Date(event.startsAt).toLocaleDateString()}</p>
          <p className="line-clamp-1">{event.address}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
