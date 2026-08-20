import { describe, expect, it } from "vitest";

import { canAccessResource, type ResourceDocument } from "./authorize-resource.js";

const patientA = { id: "user-a", name: "Patient A", email: "a@example.test", role: "patient" as const };
const recordForPatientB: ResourceDocument = { _id: { toString: () => "patient-b" } };

describe("resource ownership", () => {
  it("does not allow patient A to access patient B", () => {
    expect(canAccessResource(patientA, "patient", recordForPatientB, "patient-a")).toBe(false);
  });

  it("allows a patient to access their own record", () => {
    const ownRecord: ResourceDocument = { _id: { toString: () => "patient-a" } };
    expect(canAccessResource(patientA, "patient", ownRecord, "patient-a")).toBe(true);
  });
});
