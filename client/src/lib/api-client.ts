import axios from "axios";

export function resolveApiBaseUrl() {
  const configured =
    typeof import.meta.env.VITE_API_BASE_URL === "string"
      ? import.meta.env.VITE_API_BASE_URL.trim()
      : "";

  if (configured) {
    const normalized = configured.replace(/\/+$/, "");
    return `${normalized}/api/v1`;
  }

  return "/api/v1";
}

export const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});
