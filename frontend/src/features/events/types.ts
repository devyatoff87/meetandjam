import type { Event, EventCategory, CreateEventInput, UpdateEventInput } from "@/lib/api/types";

export type { Event, EventCategory, CreateEventInput, UpdateEventInput };

export type EventsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: EventCategory;
};
