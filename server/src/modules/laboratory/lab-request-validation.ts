import { z } from "zod";

const labStatus = z.enum(["requested", "sample_collected", "processing", "completed", "cancelled"]);

export const createLabRequestSchema = z.object({
  patientId: z.string().trim().min(1, "Patient is required"),
  doctorId: z.string().trim().min(1, "Doctor is required"),
  appointmentId: z.string().trim().optional(),
  testName: z.string().trim().min(1, "Test name is required"),
  sampleType: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  result: z.string().trim().optional(),
  status: labStatus.default("requested")
});

export const updateLabRequestSchema = z.object({
  patientId: z.string().trim().min(1).optional(),
  doctorId: z.string().trim().min(1).optional(),
  appointmentId: z.string().trim().optional(),
  testName: z.string().trim().min(1).optional(),
  sampleType: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  result: z.string().trim().optional(),
  status: labStatus.optional()
});

export const labRequestIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Lab request ID is required")
  })
});
