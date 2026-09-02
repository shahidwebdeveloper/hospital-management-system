import { describe, expect, it, vi } from "vitest";

import { authorize, authorizePermission } from "../middlewares/authorize.js";
import { canAccessResource } from "../middlewares/authorize-resource.js";
import { LaboratoryService } from "../modules/laboratory/laboratory-service.js";
import { validateProductionSecurity } from "../config/env.js";

describe("authorization hardening", () => {
  it("returns 401 when a session is missing", () => {
    const req = {} as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    } as any;
    const next = vi.fn();

    authorize(["doctor"])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when a role lacks a required permission", () => {
    const req = { user: { id: "user-1", email: "nurse@example.com", role: "nurse" } } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    } as any;
    const next = vi.fn();

    authorizePermission("patients:create")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("prevents patient cross-isolation for resource access", () => {
    const user = { id: "user-patient-1", email: "patient@example.com", role: "patient" as const };

    expect(
      canAccessResource(
        user,
        "patient",
        { _id: { toString: () => "patient-2" }, patientId: "patient-2" },
        "patient-1"
      )
    ).toBe(false);

    expect(
      canAccessResource(
        user,
        "patient",
        { _id: { toString: () => "patient-1" }, patientId: "patient-1" },
        "patient-1"
      )
    ).toBe(true);
  });
});

describe("laboratory finalization rules", () => {
  it("locks finalized laboratory results against overwrite", () => {
    expect(LaboratoryService.isResultFinalized("completed")).toBe(true);
    expect(LaboratoryService.isResultFinalized("processing")).toBe(false);
    expect(LaboratoryService.canTransitionStatus("completed", "completed")).toBe(false);
    expect(LaboratoryService.canTransitionStatus("processing", "completed")).toBe(true);
  });
});

describe("production security validation", () => {
  it("requires secure production configuration", () => {
    expect(
      validateProductionSecurity({
        NODE_ENV: "production",
        CLIENT_URL: "https://app.example.com",
        BETTER_AUTH_URL: "https://api.example.com",
        SESSION_COOKIE_SECURE: true,
        SESSION_COOKIE_SAME_SITE: "none"
      })
    ).toBe(true);

    expect(
      validateProductionSecurity({
        NODE_ENV: "production",
        CLIENT_URL: "http://app.example.com",
        BETTER_AUTH_URL: "http://api.example.com",
        SESSION_COOKIE_SECURE: false,
        SESSION_COOKIE_SAME_SITE: "lax"
      })
    ).toBe(false);
  });
});
