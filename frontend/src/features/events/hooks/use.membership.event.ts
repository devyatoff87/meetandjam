"use client";

import { getToken } from "@/lib/auth/token";
import { getMembership } from "../events.service";
import { useQuery } from "@tanstack/react-query";

export default function useMembership(eventId: string) {
  const token = getToken();
  return useQuery({
    queryKey: ["membership", eventId],
    queryFn: () => {
      return getMembership(eventId, token!);
    },
    enabled: !!token,
  });
}
