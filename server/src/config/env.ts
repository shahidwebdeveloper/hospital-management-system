import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  API_VERSION: z.string().default("v1"),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  MONGODB_URI: z.string().min(1),
  MONGODB_DB_NAME: z.string().default("hms"),
  BETTER_AUTH_SECRET: z.string().min(16),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:5000"),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).default(12)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid API environment variables", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid API environment variables");
}

export const env = parsed.data;
