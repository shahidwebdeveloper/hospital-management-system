import mongoose, { Schema, type InferSchemaType } from "mongoose";

const medicalRecordSchema = new Schema(
  {
    patientId: {
      type: String,
      required: true,
      trim: true
    },
    appointmentId: {
      type: String,
      trim: true
    },
    doctorId: {
      type: String,
      required: true,
      trim: true
    },
    diagnosis: {
      type: String,
      required: true,
      trim: true
    },
    symptoms: {
      type: [String],
      default: []
    },
    treatmentPlan: {
      type: String,
      trim: true,
      default: ""
    },
    doctorNotes: {
      type: String,
      trim: true,
      default: ""
    },
    followUpDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ["draft", "active", "closed", "follow_up"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

export type MedicalRecord = InferSchemaType<typeof medicalRecordSchema>;

export const MedicalRecordModel = mongoose.model("MedicalRecord", medicalRecordSchema);
