import { z } from "zod";

import { userRoleSchema } from "../../constants/roles.js";

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),

  email: z.string().email("Please provide a valid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  phone: z.string().trim().optional(),

  role: userRoleSchema.default("patient"),

  isActive: z.boolean().default(true),

  isVerified: z.boolean().default(false)
});

export const updateUserSchema = createUserSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
    path: []
  });

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().trim().min(1, "User ID is required")
  })
});
