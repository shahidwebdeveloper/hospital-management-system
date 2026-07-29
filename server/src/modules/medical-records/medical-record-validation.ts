import { z } from "zod";

export const createMedicalRecordSchema = z.object({
  patientId: z.string().trim().min(1, "Patient is required"),
  appointmentId: z.string().trim().optional(),
  doctorId: z.string().trim().min(1, "Doctor is required"),
  diagnosis: z.string().trim().min(1, "Diagnosis is required"),
  symptoms: z.array(z.string()).default([]),
  treatmentPlan: z.string().trim().optional(),
  doctorNotes: z.string().trim().optional(),
  followUpDate: z.preprocess((value) => {
    if (typeof value === "string" && value.trim() !== "") {
      return new Date(value);
    }
    return value;
  }, z.date().optional()),
  status: z.enum(["draft", "active", "closed", "follow_up"]).default("active")
});

export const updateMedicalRecordSchema = z.object({
  patientId: z.string().trim().min(1).optional(),
  appointmentId: z.string().trim().optional(),
  doctorId: z.string().trim().min(1).optional(),
  diagnosis: z.string().trim().min(1).optional(),
  symptoms: z.array(z.string()).optional(),
  treatmentPlan: z.string().trim().optional(),
  doctorNotes: z.string().trim().optional(),
  followUpDate: z.preprocess((value) => {
    if (typeof value === "string" && value.trim() !== "") {
      return new Date(value);
    }
    return value;
  }, z.date().optional()),
  status: z.enum(["draft", "active", "closed", "follow_up"]).optional()
});

export const medicalRecordIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Medical record ID is required")
  })
});
