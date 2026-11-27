"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "@/lib/auth/token";
import { joinEvent } from "../events.service";
import { EventUserOperation } from "../types";

type UseJoin = {
  eventId: string;
  note: string;
  operation: EventUserOperation;
};

export default function useJoin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (props: UseJoin) => {
      const { eventId, operation, note } = props;
      const token = getToken();
      if (!token) throw new Error("No token");
      return joinEvent(eventId, note, token, operation);
    },
    onSuccess: (data, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["membership", eventId] });
    },
  });
}
