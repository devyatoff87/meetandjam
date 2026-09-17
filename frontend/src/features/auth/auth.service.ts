import { apiFetch } from "@/lib/api/client";
import type { AuthResponse, Me, LoginInput, RegisterInput } from "@/lib/api/types";

export function login(input: LoginInput) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: input,
  });
}

export function register(input: RegisterInput) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: input,
  });
}

export function me(token: string) {
  return apiFetch<Me>("/auth/me", { token });
}
