import { notFound } from "next/navigation";
import { getEvent } from "@/features/events/events.service";
import { EventDetails } from "./event.details";

export default async function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;

  try {
    const event = await getEvent(eventId);
    return (
      <div className="container mx-auto max-w-3xl p-4">
        <EventDetails event={event} />
      </div>
    );
  } catch {
    notFound();
  }
}
