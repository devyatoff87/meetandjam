import { getToken } from "@/lib/auth/token";
import { getMembership } from "../events.service";
import { useQuery } from "@tanstack/react-query";

export default function useMemmbership(eventId: string) {
  const token = getToken();
  return useQuery({
    queryKey: ["membership"],
    queryFn: () => {
      getMembership(eventId, token!);
    },
    enabled: !!token,
  });
}
