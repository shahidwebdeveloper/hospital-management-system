import mongoose, { Schema, type InferSchemaType } from "mongoose";

const vitalSignsSchema = new Schema(
  {
    temperature: { type: Number },
    heartRate: { type: Number },
    bloodPressure: { type: String },
    oxygenSaturation: { type: Number },
    respiratoryRate: { type: Number },
    weight: { type: Number },
    height: { type: Number }
  },
  { _id: false }
);

const medicalRecordSchema = new Schema(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
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
    nurseNotes: {
      type: String,
      trim: true,
      default: ""
    },
    vitals: {
      type: vitalSignsSchema,
      default: undefined
    },
    followUpDate: {
      type: Date,
      index: true
    },
    status: {
      type: String,
      enum: ["draft", "active", "closed", "follow_up", "finalized"],
      default: "active",
      index: true
    },
    finalizedAt: {
      type: Date,
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
