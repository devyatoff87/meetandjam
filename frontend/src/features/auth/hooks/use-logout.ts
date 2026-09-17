"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth/token";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    clearToken();
    queryClient.clear();
    router.push("/login");
  };
}
