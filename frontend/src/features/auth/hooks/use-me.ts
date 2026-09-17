"use client";

import { useQuery } from "@tanstack/react-query";
import { me } from "../auth.service";
import { getToken } from "@/lib/auth/token";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => {
      const token = getToken();
      if (!token) throw new Error("No token");
      return me(token);
    },
    retry: false,
  });
}
