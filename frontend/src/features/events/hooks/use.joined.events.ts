"use client";

import { useQuery } from "@tanstack/react-query";
import { getToken } from "@/lib/auth/token";
import { getJoinedEvents } from "../events.service";
import { Event } from "../types";

export default function useJoined() {
  return useQuery({
    queryKey: ["joined-events"],
    queryFn: () => {
      const token = getToken();
      if (!token) throw new Error("No token");
      return getJoinedEvents(token) as Promise<Event[]>;
    },
  });
}
