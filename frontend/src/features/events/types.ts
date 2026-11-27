import type {
  Event,
  EventCategory,
  CreateEventInput,
  UpdateEventInput,
  Participant,
} from "@/lib/api/types";

export type { Event, EventCategory, CreateEventInput, UpdateEventInput, Participant };

export type EventsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: EventCategory;
};

export type EventUserOperation = "join" | "leave";
