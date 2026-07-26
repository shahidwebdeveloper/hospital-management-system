import { createAuthClient } from "better-auth/react";

const authBaseUrl =
  typeof import.meta.env.VITE_AUTH_BASE_URL === "string"
    ? import.meta.env.VITE_AUTH_BASE_URL
    : "http://localhost:5000";

export const authClient = createAuthClient({
  baseURL: authBaseUrl
});
