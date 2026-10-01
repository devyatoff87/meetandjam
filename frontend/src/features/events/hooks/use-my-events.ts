"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyEvents } from "../events.service";
import { getToken } from "@/lib/auth/token";
import type { EventsQuery } from "../types";

export function useMyEvents(query: EventsQuery = {}) {
  return useQuery({
    queryKey: ["my-events", query],
    queryFn: () => {
      const token = getToken();
      if (!token) throw new Error("No token");
      return getMyEvents(token, query);
    },
    retry: false,
  });
}
