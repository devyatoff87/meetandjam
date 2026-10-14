"use client";

import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../events.service";
import type { EventsQuery } from "../types";

export function useEvents(query: EventsQuery = {}) {
  return useQuery({
    queryKey: ["events", query],
    queryFn: () => getEvents(query),
  });
}
