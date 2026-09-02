import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const sessionCookieSameSiteSchema = z.enum(["lax", "strict", "none"]);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  API_VERSION: z.string().default("v1"),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  MONGODB_URI: z.string().min(1).default("mongodb://127.0.0.1:27017/hms"),
  MONGODB_DB_NAME: z.string().default("hms"),
  MONGODB_AUTH_DB_NAME: z.string().default("hms_auth"),
  BETTER_AUTH_SECRET: z.string().min(16).default("development-secret-key-change-me"),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:5000"),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).default(12),
  SESSION_COOKIE_SECURE: z.coerce.boolean().default(false),
  SESSION_COOKIE_SAME_SITE: sessionCookieSameSiteSchema.default("lax")
});

export function validateProductionSecurity(
  config: Partial<z.infer<typeof envSchema>> = process.env
) {
  const values = {
    NODE_ENV: config.NODE_ENV ?? "development",
    CLIENT_URL: config.CLIENT_URL ?? "http://localhost:5173",
    BETTER_AUTH_URL: config.BETTER_AUTH_URL ?? "http://localhost:5000",
    SESSION_COOKIE_SECURE: config.SESSION_COOKIE_SECURE ?? false,
    SESSION_COOKIE_SAME_SITE: config.SESSION_COOKIE_SAME_SITE ?? "lax"
  };

  if (values.NODE_ENV !== "production") {
    return true;
  }

  const isHttps = (value: string) => /^https:\/\//i.test(value);
  const validClient =
    isHttps(values.CLIENT_URL) && !/localhost|127\.0\.0\.1/i.test(values.CLIENT_URL);
  const validAuth =
    isHttps(values.BETTER_AUTH_URL) && !/localhost|127\.0\.0\.1/i.test(values.BETTER_AUTH_URL);

  return (
    validClient &&
    validAuth &&
    values.SESSION_COOKIE_SECURE === true &&
    values.SESSION_COOKIE_SAME_SITE === "none"
  );
}

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid API environment variables", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid API environment variables");
}

if (!validateProductionSecurity(parsed.data)) {
  throw new Error(
    "Production security validation failed. Set secure HTTPS origins and secure cookies."
  );
}

export const env = parsed.data;
