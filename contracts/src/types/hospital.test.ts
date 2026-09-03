import { describe, expect, it } from "vitest";

import { hasPermission } from "./hospital.js";

describe("hospital permission matrix", () => {
  it("keeps clinical administration separate from hospital administration", () => {
    expect(hasPermission("admin", "users:create")).toBe(true);
    expect(hasPermission("admin", "medical-records:create")).toBe(false);
    expect(hasPermission("admin", "prescriptions:create")).toBe(false);
    expect(hasPermission("admin", "laboratory:enter_result")).toBe(false);
    expect(hasPermission("doctor", "prescriptions:create")).toBe(true);
  });

  it("assigns workflow permissions to the responsible roles", () => {
    expect(hasPermission("pharmacist", "pharmacy:dispense")).toBe(true);
    expect(hasPermission("lab_technician", "laboratory:enter_result")).toBe(true);
    expect(hasPermission("doctor", "laboratory:enter_result")).toBe(false);
    expect(hasPermission("receptionist", "appointments:create")).toBe(true);
  });

  it("does not grant patients cross-record administrative permissions", () => {
    expect(hasPermission("patient", "patients:view")).toBe(true);
    expect(hasPermission("patient", "patients:update")).toBe(false);
    expect(hasPermission("patient", "users:assign_role")).toBe(false);
  });
});
