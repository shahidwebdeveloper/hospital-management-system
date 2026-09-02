import { model, Schema } from "mongoose";
import type { ILaboratory } from "./laboratory-types.js";
import { LaboratoryPriority } from "./laboratory-types.js";
import { LaboratoryStatus } from "./laboratory-types.js";

const sampleMetadataSchema = new Schema(
  {
    sampleType: { type: String, trim: true },
    accessionCode: { type: String, trim: true },
    collectedBy: { type: String, trim: true },
    collectionTime: { type: Date },
    container: { type: String, trim: true },
    location: { type: String, trim: true }
  },
  { _id: false }
);

const laboratorySchema = new Schema<ILaboratory>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true
    },

    doctor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    technicianId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true
    },

    testName: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    testType: {
      type: String,
      enum: ["blood", "urine", "microbiology", "pathology", "imaging", "other"],
      default: "other",
      index: true
    },

    category: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    priority: {
      type: String,
      enum: LaboratoryPriority,
      default: "normal",
      index: true
    },

    clinicalNotes: {
      type: String,
      trim: true
    },

    result: {
      type: String,
      trim: true
    },

    referenceRange: {
      type: String,
      trim: true
    },

    unit: {
      type: String,
      trim: true
    },

    remarks: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: LaboratoryStatus,
      default: "requested",
      index: true
    },

    sampleMetadata: {
      type: sampleMetadataSchema,
      default: undefined
    },

    requestedAt: {
      type: Date,
      default: Date.now,
      index: true
    },

    sampleCollectedAt: {
      type: Date,
      index: true
    },

    completedAt: {
      type: Date,
      index: true
    },

    resultFinalizedAt: {
      type: Date,
      index: true
    }
  },
  {
    timestamps: true
  }
);

laboratorySchema.index({ patient: 1, status: 1, requestedAt: -1 });
laboratorySchema.index({ technicianId: 1, status: 1, requestedAt: 1 });

export const Laboratory = model<ILaboratory>("Laboratory", laboratorySchema);
