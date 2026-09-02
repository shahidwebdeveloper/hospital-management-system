import mongoose, { Schema, type InferSchemaType } from "mongoose";

const patientAssignmentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    nurseId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ["active", "inactive", "transferred"],
      default: "active",
      index: true
    },
    reason: {
      type: String,
      trim: true,
      default: ""
    },
    assignedAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    endedAt: {
      type: Date,
      index: true
    }
  },
  {
    timestamps: true
  }
);

patientAssignmentSchema.index({ patientId: 1, status: 1, assignedAt: -1 });
patientAssignmentSchema.index({ doctorId: 1, nurseId: 1, status: 1 });

export type PatientAssignment = InferSchemaType<typeof patientAssignmentSchema>;
export const PatientAssignmentModel = mongoose.model("PatientAssignment", patientAssignmentSchema);
