"use client";

import { useMe } from "@/features/auth/hooks/use-me";
import { EventList } from "@/features/events/components/event.list";
import { Event } from "@/lib/api/types";

export function EventsListWrapper({ events }: { events: Event[] }) {
  const { data: me } = useMe();
  if (!me) {
    return <EventList events={events} />;
  }

  return (
    <div>
      Here will appear a checkbox, to switch only on YOUR Events in case you're authorized
      <div>
        <EventList events={events} />
      </div>
    </div>
  );
}
