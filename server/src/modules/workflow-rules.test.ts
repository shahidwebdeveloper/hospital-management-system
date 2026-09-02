import { describe, expect, it } from "vitest";

import { AppointmentService } from "./appointments/appointment-service.js";
import { MedicalRecordService } from "./medical-records/medical-record-service.js";
import { PrescriptionService } from "./prescriptions/prescription-service.js";

describe("clinical workflow rules", () => {
  it("detects overlapping appointment slots for the same doctor", () => {
    const candidateStart = new Date("2026-09-02T10:00:00Z");
    const existingStart = new Date("2026-09-02T09:45:00Z");

    expect(
      AppointmentService.hasSchedulingConflict({
        doctorId: "doctor-1",
        appointmentDate: candidateStart,
        existingStart: existingStart,
        existingEnd: new Date("2026-09-02T10:15:00Z")
      })
    ).toBe(true);

    expect(
      AppointmentService.hasSchedulingConflict({
        doctorId: "doctor-1",
        appointmentDate: candidateStart,
        existingStart: new Date("2026-09-02T10:30:00Z"),
        existingEnd: new Date("2026-09-02T11:00:00Z")
      })
    ).toBe(false);
  });

  it("prevents updating a finalized EMR", () => {
    expect(
      MedicalRecordService.canUpdateRecord({
        status: "finalized",
        isAdmin: false,
        isOwner: true
      })
    ).toBe(false);

    expect(
      MedicalRecordService.canUpdateRecord({
        status: "draft",
        isAdmin: false,
        isOwner: true
      })
    ).toBe(true);
  });

  it("locks prescription items once a prescription is issued or dispensed", () => {
    expect(
      PrescriptionService.canUpdateItems({
        status: "issued",
        hasItemsChange: true
      })
    ).toBe(false);

    expect(
      PrescriptionService.canUpdateItems({
        status: "draft",
        hasItemsChange: true
      })
    ).toBe(true);
  });
});
