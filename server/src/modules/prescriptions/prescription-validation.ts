import { z } from "zod";

const prescriptionStatus = z.enum(["issued", "dispensed", "partially_dispensed", "cancelled"]);

const prescriptionItemSchema = z.object({
  medicineName: z.string().trim().min(1, "Medicine name is required"),
  dosage: z.string().trim().min(1, "Dosage is required"),
  duration: z.string().trim().min(1, "Duration is required"),
  instructions: z.string().trim().optional()
});

export const createPrescriptionSchema = z.object({
  patientId: z.string().trim().min(1, "Patient is required"),
  doctorId: z.string().trim().min(1, "Doctor is required"),
  appointmentId: z.string().trim().optional(),
  items: z.array(prescriptionItemSchema).default([]),
  status: prescriptionStatus.default("issued"),
  notes: z.string().trim().optional()
});

export const updatePrescriptionSchema = z.object({
  patientId: z.string().trim().min(1).optional(),
  doctorId: z.string().trim().min(1).optional(),
  appointmentId: z.string().trim().optional(),
  items: z.array(prescriptionItemSchema).optional(),
  status: prescriptionStatus.optional(),
  notes: z.string().trim().optional()
});

export const prescriptionIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Prescription ID is required")
  })
});
