import { z } from "zod";

const dateOfBirthSchema = z.preprocess(
  (value) => {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();

      if (trimmed === "") {
        return undefined;
      }

      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return new Date(`${trimmed}T00:00:00.000Z`);
      }

      return trimmed;
    }

    return value;
  },
  z
    .union([
      z
        .string()
        .datetime({ offset: true })
        .transform((value) => new Date(value)),
      z.date()
    ])
    .optional()
);

const emergencyContactSchema = z
  .object({
    name: z.string().trim().min(1, "Emergency contact name is required"),

    phone: z.string().trim().min(1, "Emergency contact phone is required"),

    relationship: z.string().trim().min(1, "Relationship is required")
  })
  .nullable()
  .optional();

export const createPatientSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),

  phone: z.string().trim().min(1, "Phone is required"),

  email: z.string().trim().email("Invalid email").optional(),

  gender: z.enum(["male", "female", "other"]),

  dateOfBirth: dateOfBirthSchema,

  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),

  address: z.string().trim().optional(),

  emergencyContact: emergencyContactSchema.optional(),

  allergies: z.array(z.string()).default([]),

  medicalHistory: z.array(z.string()).default([]),

  status: z.enum(["registered", "admitted", "discharged"]).default("registered")
});

export const updatePatientSchema = z.object({
  name: z.string().trim().min(1).optional(),

  phone: z.string().trim().optional(),

  email: z.string().trim().email("Invalid email").optional(),

  gender: z.enum(["male", "female", "other"]).optional(),

  dateOfBirth: dateOfBirthSchema,

  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),

  address: z.string().trim().optional(),

  emergencyContact: emergencyContactSchema.optional(),

  allergies: z.array(z.string()).optional(),

  medicalHistory: z.array(z.string()).optional(),

  status: z.enum(["registered", "admitted", "discharged"]).optional()
});

export const patientIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Patient ID is required")
  })
});
