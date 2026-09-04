import z from "zod";

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
});
