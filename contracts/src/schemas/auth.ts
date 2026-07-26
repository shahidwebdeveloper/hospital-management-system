import { z } from "zod";

export const userRoleSchema = z.enum(["admin", "doctor", "nurse", "receptionist", "patient"]);

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  role: userRoleSchema.default("patient"),
  image: z.string().url().optional()
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(3, "Name must be at least 3 characters")
});
