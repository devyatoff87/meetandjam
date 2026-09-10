import z from "zod";
import { CATEGORY_SLUGS } from "../../types/categories";

const startsAt = z
  .string()
  .refine((value) => !Number.isNaN(new Date(value).getDate()), {
    message: "Begin time must be a valid ISO date: YYYY-MM-DD",
  })
  .transform((value) => new Date(value))
  .optional();

export const createEventSchema = z.object({
  title: z.string().trim().min(8).max(128),
  description: z.string().trim().min(8).max(1024),
  maxParticipants: z.number().int().max(255).positive().optional(),
  address: z.string().trim().min(8).max(255),
  contactInfo: z.string().trim().max(255).optional(),
  startsAt: startsAt,
  entryPrice: z.number().max(255).optional(),
  isDonationBased: z.boolean().default(false).optional(),
  donationInfo: z.string().optional(),
  category: z.enum(CATEGORY_SLUGS),
});

export const updateEventSchema = z.object({
  title: z.string().trim().min(8).max(128).optional(),
  description: z.string().trim().min(8).max(1024).optional(),
  maxParticipants: z.number().int().max(255).positive().optional(),
  address: z.string().trim().min(8).max(255).optional(),
  contactInfo: z.string().trim().max(255).optional(),
  startsAt: startsAt,
  entryPrice: z.number().max(255).optional(),
  isDonationBased: z.boolean().optional(),
  donationInfo: z.string().optional(),
  category: z.enum(CATEGORY_SLUGS).optional(),
});

const uuidField = z.string().uuid({ message: "Invalid UUID format" });

export const uuidSchema = z.object({
  id: uuidField,
});

export const eventIdSchema = z.object({
  eventId: uuidField,
});

export const allEventsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional().default(""),
  category: z.enum(CATEGORY_SLUGS).optional(),
});
