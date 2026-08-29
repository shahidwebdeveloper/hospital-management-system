import { z } from "zod";

export const createDoctorSchema = z.object({
  userId: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().trim().min(1, "Phone is required"),
  specialization: z.string().trim().min(1, "Specialization is required"),
  department: z.string().trim().min(1, "Department is required"),
  licenseNumber: z.string().trim().min(1, "License number is required"),
  availableDays: z.array(z.string()).default([]),
  availableTime: z.string().trim().default("09:00-17:00"),
  status: z.enum(["available", "busy", "off_duty", "inactive"]).default("available")
});

export const updateDoctorSchema = z.object({
  userId: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().trim().optional(),
  specialization: z.string().trim().min(1).optional(),
  department: z.string().trim().min(1).optional(),
  licenseNumber: z.string().trim().min(1).optional(),
  availableDays: z.array(z.string()).optional(),
  availableTime: z.string().trim().default("09:00-17:00").optional(),
  status: z.enum(["available", "busy", "off_duty", "inactive"]).optional()
});

export const doctorIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Doctor ID is required")
  })
});
