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
  .pick({
    name: true,
    email: true,
    phone: true,
    role: true,
    isActive: true
  })
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

export const userListQuerySchema = z.object({
  query: z.object({
    search: z.string().trim().max(100).optional(),
    role: userRoleSchema.optional(),
    isActive: z.enum(["true", "false"]).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20)
  })
});
