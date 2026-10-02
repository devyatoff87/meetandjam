import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(8).max(128),
  description: z.string().min(8).max(1024),
  address: z.string().min(8).max(128),
  startsAt: z.string().min(1),
  category: z.enum(["jam", "word", "theater", "standup", "dance", "another"]),
  maxParticipants: z.number().int().positive().max(255).optional(),
  contactInfo: z.string().max(255).optional(),
  entryPrice: z.number().max(255).optional(),
  isDonationBased: z.boolean().optional(),
  donationInfo: z.string().optional(),
});

export type EventFormValues = z.infer<typeof eventSchema>;
