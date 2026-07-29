import { model, Schema } from "mongoose";
import type { ILaboratory } from "./laboratory-types.js";
import { LaboratoryPriority } from "./laboratory-types.js";
import { LaboratoryStatus } from "./laboratory-types.js";

const laboratorySchema = new Schema<ILaboratory>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },

    doctor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    testName: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    priority: {
      type: String,
      enum: LaboratoryPriority,
      default: "normal"
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
      default: "requested"
    },

    requestedAt: {
      type: Date,
      default: Date.now
    },

    sampleCollectedAt: {
      type: Date
    },

    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const Laboratory = model<ILaboratory>("Laboratory", laboratorySchema);
