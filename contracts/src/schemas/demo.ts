import { z } from "zod";

export const appointmentStatusSchema = z.enum([
  "scheduled",
  "checked-in",
  "in-progress",
  "completed"
]);

export const demoMetricSchema = z.object({
  label: z.string(),
  value: z.string(),
  trend: z.string()
});

export const demoDepartmentSchema = z.object({
  name: z.string(),
  doctors: z.number().int().nonnegative(),
  beds: z.number().int().nonnegative(),
  occupancy: z.number().min(0).max(100)
});

export const demoAppointmentSchema = z.object({
  patient: z.string(),
  doctor: z.string(),
  time: z.string(),
  status: appointmentStatusSchema
});
