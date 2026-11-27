"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "@/lib/auth/token";
import { leaveEvent } from "../events.service";

export default function useLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId }: { eventId: string }) => {
      const token = getToken();
      if (!token) throw new Error("No token");
      return leaveEvent(eventId, token);
    },
    onSuccess: (_data, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["membership", eventId] });
      queryClient.invalidateQueries({ queryKey: ["participants", eventId] });
      queryClient.invalidateQueries({ queryKey: ["joined"] });
    },
  });
}
