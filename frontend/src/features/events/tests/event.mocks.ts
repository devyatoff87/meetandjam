import type { z } from "zod";
import type { eventSchema } from "../event.schema";
import { Event } from "../types";

type EventInput = z.input<typeof eventSchema>;

export const mockEventsSimple = {
  full: {
    title: "Jazz evening in the center",
    description: "Live jazz with local musicians. Cozy atmosphere.",
    address: "Bergmannstr. 10, 10961 Berlin",
    startsAt: "2026-09-20T19:00",
    category: "jam",
  },
  noTitle: {
    title: "",
    description: "Live jazz with local musicians. Cozy atmosphere.",
    address: "Bergmannstr. 10, 10961 Berlin",
    startsAt: "2026-09-20T19:00",
    category: "jam",
  },
  noDescription: {
    title: "Jazz evening in the center",
    description: "",
    address: "Bergmannstr. 10, 10961 Berlin",
    startsAt: "2026-09-20T19:00",
    category: "jam",
  },
  noAddress: {
    title: "Jazz evening in the center",
    description: "Live jazz with local musicians. Cozy atmosphere.",
    address: "",
    startsAt: "2026-09-20T19:00",
    category: "jam",
  },
  noDate: {
    title: "Jazz evening in the center",
    description: "Live jazz with local musicians. Cozy atmosphere.",
    address: "Bergmannstr. 10, 10961 Berlin",
    startsAt: "",
    category: "jam",
  },
} satisfies Record<string, EventInput>;

export const mockEventsDumb = {
  titleToShort: {
    title: "Jazz e",
    description: "Live jazz with local musicians. Cozy atmosphere.",
    address: "Bergmannstr. 10, 10961 Berlin",
    startsAt: "2026-09-20T19:00",
    category: "jam",
  },
  titleToLong: {
    title:
      "Jazz evening in the center Jazz evening in the center Jazz evening in the center Jazz evening in the center Jazz evening in the center",
    description: "Live jazz with local musicians. Cozy atmosphere.",
    address: "Bergmannstr. 10, 10961 Berlin",
    startsAt: "2026-09-20T19:00",
    category: "jam",
  },
  descriptionToShort: {
    title: "Jazz evening in the center",
    description: "Live ja",
    address: "Bergmannstr. 10, 10961 Berlin",
    startsAt: "2026-09-20T19:00",
    category: "jam",
  },
  descriptionToLong: {
    title: "Jazz evening in the center",
    description:
      "Live jazz with local musicians. Cozy atmosphere. Live jazz with local musicians. Cozy atmosphere. Live jazz with local musicians. Cozy atmosphere. Live jazz with local musicians. Cozy atmosphere. Live jazz with local musicians. Cozy atmosphere. Live jazz with local musicians. Cozy atmosphere. Live jazz with local musicians. Cozy atmosphere. Live jazz with local musicians. Cozy atmosphere. Live jazz with local musicians. Cozy atmosphere. Live jazz with local musicians. Cozy atmosphere. Live jazz with local musicians. Cozy atmosphere. Live jazz with local musicians. Cozy atmosphere. Live jazz with local musicians. Cozy atmosphere. Live jazz with local musicians. Cozy atmosphere. Live jazz with local musicians. Cozy atmosphere. Live jazz with local musicians. Cozy atmosphere.Live jazz with local musicians. Cozy atmosphere. Live jazz with local musicians. Cozy atmosphere. Live jazz with local musicians. Cozy atmosphere. Live jazz with local musicians. Cozy atmosphere.Live jazz with local musicians. Cozy atmosphere. Live jazz with local musicians. Cozy atmosphere. Live jazz with local musicians. Cozy atmosphere.",
    address: "Bergmannstr. 10, 10961 Berlin",
    startsAt: "2026-09-20T19:00",
    category: "jam",
  },

  addressToShort: {
    title: "Jazz evening in the center",
    description: "Live jazz with local musicians. Cozy atmosphere.",
    address: "Bergma",
    startsAt: "2026-09-20T19:00",
    category: "jam",
  },
  addressToLong: {
    title: "Jazz evening in the center",
    description: "Live jazz with local musicians. Cozy atmosphere.",
    address:
      "Bergma Bergmannstr. 10, 10961 Berlin Bergmannstr. 10, 10961 Berlin Bergmannstr. 10, 10961 Berlin Bergmannstr. 10, 10961 Berlin Bergma Bergmannstr. 10, 10961 Berlin Bergmannstr. 10, 10961 Berlin Bergmannstr. 10, 10961 Berlin Bergmannstr. 10, 10961 Berlin",
    startsAt: "2026-09-20T19:00",
    category: "jam",
  },
} satisfies Record<string, EventInput>;

export const mockEventDetails: Event = {
  id: "event-123",
  ownerId: "user-owner-123",
  title: "Jazz evening in the center",
  description: "Live jazz with local musicians. Cozy atmosphere.",
  address: "Bergmannstr. 10, 10961 Berlin",
  startsAt: "2026-09-20T19:00:00.000Z",
  category: "jam",
  maxParticipants: 20,
  contactInfo: "tg: @jazz_lover",
  entryPrice: 15,
  isDonationBased: false,
  donationInfo: null,
  createdAt: "2026-09-01T10:00:00.000Z",
  updatedAt: "2026-09-01T10:00:00.000Z",
};
