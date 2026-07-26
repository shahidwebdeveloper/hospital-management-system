import type { z } from "zod";

import type { loginSchema, registerSchema, userRoleSchema, userSchema } from "../schemas/auth.js";

export type UserRole = z.infer<typeof userRoleSchema>;
export type HmsUser = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
