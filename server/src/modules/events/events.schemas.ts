import z from "zod";
import { CATEGORY_SLUGS } from "../../types/categories";
import { nameSchema } from "../auth/auth.schemas";

// ===== FIELD SCHEMAS =====

const titleSchema = z
  .string({ message: "Title is required" })
  .trim()
  .min(8, { message: "Title must be at least 8 characters" })
  .max(128, { message: "Title must not exceed 128 characters" })
  .meta({ example: "Jazz evening in the center" });

const descriptionSchema = z
  .string({ message: "Description is required" })
  .trim()
  .min(8, { message: "Description must be at least 8 characters" })
  .max(1024, { message: "Description must not exceed 1024 characters" })
  .meta({ example: "Live jazz with local musicians. Cozy atmosphere." });

const maxParticipantsSchema = z
  .number({ message: "Max participants must be a number" })
  .int({ message: "Max participants must be an integer" })
  .max(255, { message: "Max participants must not exceed 255" })
  .positive({ message: "Max participants must be positive" })
  .optional()
  .meta({ example: 50 });

const addressSchema = z
  .string({ message: "Address is required" })
  .trim()
  .min(8, { message: "Address must be at least 8 characters" })
  .max(255, { message: "Address must not exceed 255 characters" })
  .meta({ example: "Bergmannstr. 10, 10961 Berlin" });

const contactInfoSchema = z
  .string()
  .trim()
  .max(255, { message: "Contact info must not exceed 255 characters" })
  .optional()
  .meta({ example: "telegram: @jazz_organizer" });

const startsAtSchema = z
  .string()
  .refine((value) => !Number.isNaN(new Date(value).getDate()), {
    message: "Begin time must be a valid ISO date: YYYY-MM-DD",
  })
  .transform((value) => new Date(value))
  .meta({ example: "2026-09-15T19:00:00+02:00" });

const entryPriceSchema = z
  .number({ message: "Entry price must be a number" })
  .max(255, { message: "Entry price must not exceed 255" })
  .optional()
  .meta({ example: 10 });

const isDonationBasedSchema = z
  .boolean()
  .default(false)
  .meta({ example: false });

const donationInfoSchema = z
  .string()
  .optional()
  .meta({ example: "Minimum donation: 5 EUR" });

const categorySchema = z.enum(CATEGORY_SLUGS).meta({ example: "jazz" });

// ===== BODY SCHEMAS =====

export const createEventSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  maxParticipants: maxParticipantsSchema,
  address: addressSchema,
  contactInfo: contactInfoSchema,
  startsAt: startsAtSchema,
  entryPrice: entryPriceSchema,
  isDonationBased: isDonationBasedSchema.optional(),
  donationInfo: donationInfoSchema,
  category: categorySchema,
});

export const updateEventSchema = z.object({
  title: titleSchema.optional(),
  description: descriptionSchema.optional(),
  maxParticipants: maxParticipantsSchema,
  address: addressSchema.optional(),
  contactInfo: contactInfoSchema,
  startsAt: startsAtSchema.optional(),
  entryPrice: entryPriceSchema,
  isDonationBased: isDonationBasedSchema.optional(),
  donationInfo: donationInfoSchema,
  category: categorySchema.optional(),
});

// ===== PARAMS SCHEMAS =====

const uuidField = z
  .string()
  .uuid({ message: "Invalid UUID format" })
  .meta({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" });

export const uuidSchema = z.object({
  id: uuidField,
});

export const eventIdSchema = z.object({
  eventId: uuidField,
});

// ===== QUERY SCHEMAS =====

export const allEventsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).meta({ example: 1 }),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10)
    .meta({ example: 10 }),
  search: z.string().optional().default("").meta({ example: "jazz" }),
  category: categorySchema.optional(),
});

// ===== RESPONSE SCHEMAS =====

export const eventResponseSchema = z.object({
  id: uuidField,
  title: titleSchema,
  description: descriptionSchema,
  maxParticipants: maxParticipantsSchema.nullable(),
  contactInfo: contactInfoSchema.nullable(),
  entryPrice: entryPriceSchema.nullable(),
  isDonationBased: isDonationBasedSchema,
  donationInfo: donationInfoSchema.nullable(),
  address: addressSchema,
  startsAt: z.string().meta({ example: "2026-09-15T19:00:00.000Z" }),
  category: categorySchema,
  ownerId: uuidField,
  createdAt: z.string().meta({ example: "2026-09-12T14:35:22.123Z" }),
  updatedAt: z.string().meta({ example: "2026-09-12T14:35:22.123Z" }),
});

export const eventsListResponseSchema = z.object({
  events: z.array(eventResponseSchema),
  total: z.number().meta({ example: 30 }),
  page: z.number().meta({ example: 1 }),
  limit: z.number().meta({ example: 10 }),
  totalPages: z.number().meta({ example: 3 }),
});

export const participantResponseSchema = z.object({
  id: uuidField,
  name: nameSchema.meta({ example: "Jazz Fan" }),
  email: z.string().meta({ example: "jazzfan@berlin.de" }),
  joinedAt: z.string().meta({ example: "2026-09-12T14:35:22.123Z" }),
});

export const participantsListResponseSchema = z.array(
  participantResponseSchema,
);

export const messageResponseSchema = z.object({
  message: z.string().meta({ example: "Event deleted" }),
});

export const joinedEventsResponseSchema = z.array(eventResponseSchema);
