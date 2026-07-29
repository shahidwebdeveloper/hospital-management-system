import mongoose, { Schema, type InferSchemaType } from "mongoose";

const labRequestSchema = new Schema(
  {
    patientId: {
      type: String,
      required: true,
      trim: true
    },
    doctorId: {
      type: String,
      required: true,
      trim: true
    },
    appointmentId: {
      type: String,
      trim: true
    },
    testName: {
      type: String,
      required: true,
      trim: true
    },
    sampleType: {
      type: String,
      trim: true,
      default: "blood"
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    },
    result: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: ["requested", "sample_collected", "processing", "completed", "cancelled"],
      default: "requested"
    }
  },
  {
    timestamps: true
  }
);

export type LabRequest = InferSchemaType<typeof labRequestSchema>;
export const LabRequestModel = mongoose.model("LabRequest", labRequestSchema);
