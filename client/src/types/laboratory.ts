import type { Doctor } from "@/services/doctor-services";
import type { Patient } from "@/services/patient-services";

export type LaboratoryStatus =
  "requested" | "sample_collected" | "processing" | "completed" | "cancelled";

export type LaboratoryPriority = "low" | "normal" | "high" | "urgent";

export interface Laboratory {
  _id: string;

  patient: Patient | string;

  doctor: Doctor | string;

  testName: string;

  category: string;

  priority: LaboratoryPriority;

  clinicalNotes?: string;

  result?: string;

  referenceRange?: string;

  unit?: string;

  remarks?: string;

  status: LaboratoryStatus;

  requestedAt: string;

  sampleCollectedAt?: string;

  completedAt?: string;

  createdAt: string;

  updatedAt: string;
}

export interface CreateLaboratoryRequest {
  patient: string;

  doctor: string;

  testName: string;

  category: string;

  priority: LaboratoryPriority;

  clinicalNotes?: string;
}

export interface LaboratoryResultInput {
  result: string;

  referenceRange?: string;

  unit?: string;

  remarks?: string;
}

export interface UpdateLaboratoryStatus {
  status: LaboratoryStatus;
}
