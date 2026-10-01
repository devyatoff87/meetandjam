"use client";

import { useQuery } from "@tanstack/react-query";
import { getEvent } from "../events.service";

export function useEvent(eventId: string) {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEvent(eventId),
    enabled: !!eventId,
  });
}
