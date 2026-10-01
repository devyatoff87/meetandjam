import { apiFetch } from "@/lib/api/client";
import type {
  Event,
  PaginatedEvents,
  EventsQuery,
  CreateEventInput,
  UpdateEventInput,
  MessageResponse,
} from "@/lib/api/types";

export function getEvents(query: EventsQuery = {}) {
  const qs = new URLSearchParams();
  if (query.page) qs.set("page", String(query.page));
  if (query.limit) qs.set("limit", String(query.limit));
  if (query.search) qs.set("search", query.search);
  if (query.category) qs.set("category", query.category);

  const suffix = qs.toString() ? `?${qs}` : "";
  return apiFetch<PaginatedEvents>(`/events/${suffix}`);
}

export function getEvent(eventId: string) {
  return apiFetch<Event>(`/events/${eventId}`);
}

export function getMyEvents(token: string, query: EventsQuery = {}) {
  const qs = new URLSearchParams();
  if (query.page) qs.set("page", String(query.page));
  if (query.limit) qs.set("limit", String(query.limit));
  if (query.search) qs.set("search", query.search);
  if (query.category) qs.set("category", query.category);

  const suffix = qs.toString() ? `?${qs}` : "";
  return apiFetch<PaginatedEvents>(`/events/me${suffix}`, { token });
}

export function getJoinedEvents(token: string) {
  return apiFetch<Event[]>("/events/joined", { token });
}

export function createEvent(input: CreateEventInput, token: string) {
  return apiFetch<Event>("/events/", {
    method: "POST",
    body: input,
    token,
  });
}

export function updateEvent(eventId: string, input: UpdateEventInput, token: string) {
  return apiFetch<Event>(`/events/${eventId}`, {
    method: "PATCH",
    body: input,
    token,
  });
}

export function deleteEvent(eventId: string, token: string) {
  return apiFetch<MessageResponse>(`/events/${eventId}`, {
    method: "DELETE",
    token,
  });
}
