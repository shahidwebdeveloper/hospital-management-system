import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import { env } from "../config/env.js";
import { authDb, client } from "./database.js";

export const auth = betterAuth({
  database: mongodbAdapter(authDb, {
    client
  }),

  emailAndPassword: {
    enabled: true
  },

  trustedOrigins: [env.CLIENT_URL, "http://localhost:5173", "http://localhost:5174"],

  secret: env.BETTER_AUTH_SECRET,

  baseURL: env.BETTER_AUTH_URL,
  session: {
    expiresIn: 60 * 60 * 24 * 7
  },
  advanced: {
    useSecureCookies: env.NODE_ENV === "production" && env.SESSION_COOKIE_SECURE
  }
});
