import { useQuery } from "@tanstack/react-query";
import { getParticipants } from "../events.service";

export default function useParticipants(eventId: string) {
  return useQuery({
    queryKey: ["participants", eventId],
    queryFn: () => {
      return getParticipants(eventId);
    },
  });
}
