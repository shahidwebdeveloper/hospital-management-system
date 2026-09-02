import { createAuthClient } from "better-auth/react";

export function resolveAuthBaseUrl() {
  const configured =
    typeof import.meta.env.VITE_AUTH_BASE_URL === "string"
      ? import.meta.env.VITE_AUTH_BASE_URL.trim()
      : "";

  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "http://localhost:5000";
}

export const authClient = createAuthClient({
  baseURL: resolveAuthBaseUrl()
});
