import type { Types } from "mongoose";

export const LaboratoryStatus = [
  "requested",
  "sample_collected",
  "processing",
  "completed",
  "cancelled"
] as const;

export type LaboratoryStatus = (typeof LaboratoryStatus)[number];

export const LaboratoryPriority = ["low", "normal", "high", "urgent"] as const;

export type LaboratoryPriority = (typeof LaboratoryPriority)[number];

export interface ILaboratory {
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  technicianId?: Types.ObjectId;

  testName: string;
  testType?: string;
  category: string;

  priority: LaboratoryPriority;

  clinicalNotes?: string;

  result?: string;

  referenceRange?: string;

  unit?: string;

  remarks?: string;

  status: LaboratoryStatus;
  sampleMetadata?: {
    sampleType?: string;
    accessionCode?: string;
    collectedBy?: string;
    collectionTime?: Date;
    container?: string;
    location?: string;
  };

  requestedAt: Date;

  sampleCollectedAt?: Date;

  completedAt?: Date;
  resultFinalizedAt?: Date;
}
