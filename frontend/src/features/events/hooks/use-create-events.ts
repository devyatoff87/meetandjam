"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createEvent } from "../events.service";
import { getToken } from "@/lib/auth/token";
import type { CreateEventInput } from "../types";

export function useCreateEvent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEventInput) => {
      const token = getToken();
      if (!token) throw new Error("No token");
      return createEvent(input, token);
    },
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
      router.push(`/events/${event.id}`);
    },
  });
}
