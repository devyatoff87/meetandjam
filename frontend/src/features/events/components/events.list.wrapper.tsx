"use client";

import { useMe } from "@/features/auth/hooks/use-me";
import { EventList } from "@/features/events/components/event.list";
import { Event } from "@/lib/api/types";
import { useState } from "react";
import useJoined from "../hooks/use.joined.events";

export function EventsListWrapper({ events }: { events: Event[] }) {
  const [checked, setChecked] = useState<boolean>(false);
  const { data: me } = useMe();
  const { data: joinedEvents } = useJoined();
  if (!me) {
    return <EventList events={events} />;
  }

  const onChangeYourEventsHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setChecked(isChecked);
  };

  return (
    <div>
      <form>
        <label htmlFor="your-events">
          Joined events
          <input
            onChange={onChangeYourEventsHandle}
            type="checkbox"
            name="your-events"
            id="your-events"
          />
        </label>
      </form>
      <div>
        <EventList
          events={checked ? joinedEvents! : events}
          noEventsMsg="You did not create an event yet."
        />
      </div>
    </div>
  );
}
