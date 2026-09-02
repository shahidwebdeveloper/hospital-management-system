import { afterEach, describe, expect, it, vi } from "vitest";

import { resolveApiBaseUrl } from "./api-client";
import { resolveAuthBaseUrl } from "./auth-client";

describe("base URL resolution", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("appends the backend API path when an override is provided", () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://api.example.com");
    vi.stubEnv("VITE_AUTH_BASE_URL", "https://auth.example.com");

    expect(resolveApiBaseUrl()).toBe("https://api.example.com/api/v1");
    expect(resolveAuthBaseUrl()).toBe("https://auth.example.com");
  });

  it("falls back to the relative API root when no override exists", () => {
    vi.stubEnv("VITE_API_BASE_URL", "");
    vi.stubEnv("VITE_AUTH_BASE_URL", "");

    expect(resolveApiBaseUrl()).toBe("/api/v1");
    expect(resolveAuthBaseUrl()).toBe("http://localhost:5000");
  });
});
