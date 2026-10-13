import { getEvent } from "@/features/events/events.service";
import { UpdateEventForm } from "./update.event.form";

export default async function UpdateFormPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = await getEvent(eventId);

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-3xl font-bold">Update event</h1>
      <UpdateEventForm event={event} />
    </div>
  );
}
