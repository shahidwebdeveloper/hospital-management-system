import type { z } from "zod";

import type {
  appointmentStatusSchema,
  demoAppointmentSchema,
  demoDepartmentSchema,
  demoMetricSchema
} from "../schemas/demo.js";

export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;
export type DemoMetric = z.infer<typeof demoMetricSchema>;
export type DemoDepartment = z.infer<typeof demoDepartmentSchema>;
export type DemoAppointment = z.infer<typeof demoAppointmentSchema>;
