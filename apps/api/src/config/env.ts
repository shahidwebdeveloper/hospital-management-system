import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  API_VERSION: z.string().default("v1"),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  MONGODB_URI: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).default(12)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid API environment variables", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid API environment variables");
}

export const env = parsed.data;
