import mongoose, { Schema, type InferSchemaType } from "mongoose";

const medicalRecordSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      index: true
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    diagnosis: {
      type: String,
      required: true,
      trim: true,
      index: true
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
      type: Date,
      index: true
    },
    status: {
      type: String,
      enum: ["draft", "active", "closed", "follow_up"],
      default: "active",
      index: true
    }
  },
  {
    timestamps: true
  }
);

medicalRecordSchema.index({ patientId: 1, status: 1, updatedAt: -1 });
medicalRecordSchema.index({ doctorId: 1, patientId: 1, createdAt: -1 });

export type MedicalRecord = InferSchemaType<typeof medicalRecordSchema>;

export const MedicalRecordModel = mongoose.model("MedicalRecord", medicalRecordSchema);
