import { getEvents } from "@/features/events/events.service";
import { EventList } from "@/features/components/event.list";
import type { EventCategory } from "@/features/events/types";

type SearchParams = {
  page?: string;
  category?: string;
  search?: string;
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  console.log(params);

  const page = Number(params.page ?? 1);
  const data = await getEvents({
    page,
    limit: 10,
    category: params.category as EventCategory | undefined,
    search: params.search,
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Events</h1>
      <EventList events={data.events} />
    </div>
  );
}
