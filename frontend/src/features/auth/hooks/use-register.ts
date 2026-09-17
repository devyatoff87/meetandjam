"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { register } from "../auth.service";
import { setToken } from "@/lib/auth/token";

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.setQueryData(["me"], data.user);
      router.push("/me");
    },
  });
}
