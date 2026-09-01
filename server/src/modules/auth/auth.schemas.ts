import { z } from "zod";

export const emailField = z
  .string({ message: "Email is required" })
  .trim()
  .max(255, { message: "Email must not exceed 255 characters" })
  .pipe(z.email({ message: "Please provide a valid email address" }))
  .transform((val) => val.toLowerCase());

export const registerSchema = z.object({
  email: emailField,
  password: z
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
    }),
  name: z
    .string({ message: "Name is required" })
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(32, { message: "Name must not exceed 32 characters" })
    .regex(/^[a-zA-Zа-яА-ЯёЁ\s'-]+$/, {
      message: "Name contains invalid characters",
    }),
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, { message: "Password is required" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
