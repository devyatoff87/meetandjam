import type { paths } from "./generated/schema";

// ============================================================
// AUTH
// ============================================================

export type AuthResponse =
  paths["/auth/login"]["post"]["responses"][200]["content"]["application/json"];

export type AuthUser = AuthResponse["user"];

export type Me = paths["/auth/me"]["get"]["responses"][200]["content"]["application/json"];

export type LoginInput = paths["/auth/login"]["post"]["requestBody"]["content"]["application/json"];

export type RegisterInput =
  paths["/auth/register"]["post"]["requestBody"]["content"]["application/json"];

// ============================================================
// EVENTS
// ============================================================

export type Event =
  paths["/events/"]["get"]["responses"][200]["content"]["application/json"]["events"][number];

export type PaginatedEvents =
  paths["/events/"]["get"]["responses"][200]["content"]["application/json"];

export type CreateEventInput =
  paths["/events/"]["post"]["requestBody"]["content"]["application/json"];

export type UpdateEventInput =
  paths["/events/{eventId}"]["patch"]["requestBody"]["content"]["application/json"];

export type EventsQuery = paths["/events/"]["get"]["parameters"]["query"];

export type EventCategory = NonNullable<Event["category"]>;

// ============================================================
// PARTICIPATION
// ============================================================

export type EventParticipant =
  paths["/events/join"]["post"]["responses"][201]["content"]["application/json"];

export type Participant =
  paths["/events/{eventId}/participants"]["get"]["responses"][200]["content"]["application/json"][number];

// ============================================================
// COMMON
// ============================================================

export type MessageResponse =
  paths["/events/leave"]["post"]["responses"][200]["content"]["application/json"];
