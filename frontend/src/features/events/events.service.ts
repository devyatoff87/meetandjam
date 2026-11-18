import { apiFetch } from "@/lib/api/client";
import type {
  Event,
  PaginatedEvents,
  EventsQuery,
  CreateEventInput,
  UpdateEventInput,
  MessageResponse,
  MembershipResponse,
} from "@/lib/api/types";
import { log, queryParamsBuilder } from "../../lib/utils";
log;
export function getEvents(query: EventsQuery = {}) {
  const suffix = queryParamsBuilder(query);
  return apiFetch<PaginatedEvents>(`/events/${suffix}`);
}

export function getEvent(eventId: string) {
  return apiFetch<Event>(`/events/${eventId}`);
}

export function getMyEvents(token: string, query: EventsQuery = {}) {
  const suffix = queryParamsBuilder(query);
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

export function getMembership(eventId: string, token: string) {
  return apiFetch<MembershipResponse>(`/events/${eventId}/membership`, {
    token,
  });
}
