"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "@/lib/auth/token";
import { joinEvent } from "../events.service";
import { EventUserOperation } from "../types";

export default function useJoin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (props: { eventId: string; operation: EventUserOperation }) => {
      const { eventId, operation } = props;
      const token = getToken();
      if (!token) throw new Error("No token");
      return joinEvent(eventId, token, operation);
    },
    onSuccess: (data, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["membership", eventId] });
    },
  });
}
