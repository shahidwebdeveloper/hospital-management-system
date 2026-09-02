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
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      index: true
    },
    items: {
      type: [prescriptionItemSchema],
      default: []
    },
    status: {
      type: String,
      enum: ["issued", "dispensed", "partially_dispensed", "cancelled"],
      default: "issued",
      index: true
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

prescriptionSchema.index({ patientId: 1, status: 1, createdAt: -1 });
prescriptionSchema.index({ doctorId: 1, patientId: 1, createdAt: -1 });

export type Prescription = InferSchemaType<typeof prescriptionSchema>;
export const PrescriptionModel = mongoose.model("Prescription", prescriptionSchema);
