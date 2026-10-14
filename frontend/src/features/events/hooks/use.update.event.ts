"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateEvent } from "../events.service";
import { getToken } from "@/lib/auth/token";
import type { UpdateEventInput } from "../types";

export function useUpdateEvent(eventId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateEventInput) => {
      const token = getToken();
      if (!token) throw new Error("No token");
      return updateEvent(eventId, input, token);
    },
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
      router.push(`/events/${event.id}`);
    },
  });
}
