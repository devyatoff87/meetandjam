import { z } from "zod";

// ===== BODY SCHEMAS =====

export const nameSchema = z
  .string({ message: "Name is required" })
  .trim()
  .min(2, { message: "Name must be at least 2 characters" })
  .max(32, { message: "Name must not exceed 32 characters" })
  .regex(/^[a-zA-Zа-яА-ЯёЁ\s'-]+$/, {
    message: "Name contains invalid characters",
  })
  .meta({ example: "John Doe" });

const passwordSchema = z
  .string({ message: "Password is required" })
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(32, { message: "Password must not exceed 32 characters" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one digit" })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character",
  })
  .meta({ example: "Password123!#" });

const emailSchema = z
  .string({ message: "Email is required" })
  .trim()
  .max(255, { message: "Email must not exceed 255 characters" })
  .pipe(z.email({ message: "Please provide a valid email address" }))
  .transform((val) => val.toLowerCase())
  .meta({ example: "users@email.me" });

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// ===== RESPONSE SCHEMAS =====

const emailResponseSchema = z.string().meta({ example: "users@email.me" });
const nameResponseSchema = z.string().meta({ example: "John Doe" });

export const userResponseSchema = z.object({
  id: z.uuid(),
  email: emailResponseSchema,
  name: nameResponseSchema,
});

export const authResponseSchema = z.object({
  token: z.string(),
  user: userResponseSchema,
});

export const meResponseSchema = z.object({
  id: z.uuid(),
  email: emailResponseSchema,
  name: nameResponseSchema,
  createdAt: z.string().meta({ example: "2026-09-12T14:35:22.123Z" }),
  updatedAt: z.string().meta({ example: "2026-09-12T14:35:22.123Z" }),
});

// ===== TYPES =====

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
