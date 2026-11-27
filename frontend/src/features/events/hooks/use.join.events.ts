"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "@/lib/auth/token";
import { joinEvent } from "../events.service";

type UseJoin = {
  eventId: string;
  note: string;
};

export default function useJoin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (props: UseJoin) => {
      const { eventId, note } = props;
      const token = getToken();
      if (!token) throw new Error("No token");
      return joinEvent(eventId, note, token);
    },
    onSuccess: (_data, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["membership", eventId] });
      queryClient.invalidateQueries({ queryKey: ["participants", eventId] });
      queryClient.invalidateQueries({ queryKey: ["joined"] });
    },
  });
}
