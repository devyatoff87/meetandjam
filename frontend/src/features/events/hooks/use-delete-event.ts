"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteEvent } from "../events.service";
import { getToken } from "@/lib/auth/token";

export function useDeleteEvent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => {
      const token = getToken();
      if (!token) throw new Error("No token");
      return deleteEvent(eventId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
      router.push("/events");
    },
  });
}
