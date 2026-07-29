import mongoose, { Schema, type InferSchemaType } from "mongoose";

const prescriptionItemSchema = new Schema(
  {
    medicineName: {
      type: String,
      required: true,
      trim: true
    },
    dosage: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: String,
      required: true,
      trim: true
    },
    instructions: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { _id: false }
);

const prescriptionSchema = new Schema(
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
    items: {
      type: [prescriptionItemSchema],
      default: []
    },
    status: {
      type: String,
      enum: ["issued", "dispensed", "partially_dispensed", "cancelled"],
      default: "issued"
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export type Prescription = InferSchemaType<typeof prescriptionSchema>;
export const PrescriptionModel = mongoose.model("Prescription", prescriptionSchema);
