import { z } from "zod";

export const createLaboratorySchema = z.object({
  patient: z.string().min(1, "Patient is required"),

  doctor: z.string().min(1, "Doctor is required"),

  testName: z.string().min(2, "Test name must be at least 2 characters").max(100),

  category: z.string().min(2, "Category is required").max(100),

  priority: z.enum(["low", "normal", "high", "urgent"]),

  clinicalNotes: z.string().max(1000).optional()
});

export const updateLaboratoryStatusSchema = z.object({
  status: z.enum(["requested", "sample_collected", "processing", "completed", "cancelled"])
});

export const laboratoryResultSchema = z.object({
  result: z.string().min(1, "Result is required").max(5000),

  referenceRange: z.string().max(200).optional(),

  unit: z.string().max(50).optional(),

  remarks: z.string().max(1000).optional()
});

export type CreateLaboratoryInput = z.infer<typeof createLaboratorySchema>;

export type UpdateLaboratoryStatusInput = z.infer<typeof updateLaboratoryStatusSchema>;

export type LaboratoryResultInput = z.infer<typeof laboratoryResultSchema>;
