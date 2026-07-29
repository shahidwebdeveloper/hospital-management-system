import { z } from "zod";

const appointmentStatus = z.enum([
  "scheduled",
  "checked_in",
  "in_progress",
  "completed",
  "cancelled",
  "no_show"
]);

export const createAppointmentSchema = z.object({
  patientId: z.string().trim().min(1, "Patient is required"),
  doctorId: z.string().trim().min(1, "Doctor is required"),
  appointmentDate: z.preprocess((value) => {
    if (typeof value === "string" && value.trim() !== "") {
      return new Date(value);
    }
    return value;
  }, z.date()),
  reason: z.string().trim().min(1, "Reason is required").default("General consultation"),
  status: appointmentStatus.default("scheduled")
});

export const updateAppointmentSchema = z.object({
  patientId: z.string().trim().min(1).optional(),
  doctorId: z.string().trim().min(1).optional(),
  appointmentDate: z
    .preprocess((value) => {
      if (typeof value === "string" && value.trim() !== "") {
        return new Date(value);
      }
      return value;
    }, z.date())
    .optional(),
  reason: z.string().trim().min(1).optional(),
  status: appointmentStatus.optional()
});

export const appointmentIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Appointment ID is required")
  })
});
