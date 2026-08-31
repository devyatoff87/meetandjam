import { z } from "zod";

export const emailField = z
  .string()
  .trim()
  .pipe(z.email({ message: "Email is not correct." }))
  .transform((val) => val.toLowerCase());

export const registerSchema = z.object({
  email: emailField,
  password: z
    .string()
    .min(8, { message: "Password must contain at least 8 characters." })
    .max(32),
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must contain at least 2 letters." })
    .max(32),
});
