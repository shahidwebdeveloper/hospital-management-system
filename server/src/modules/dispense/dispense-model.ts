import mongoose, { Schema, type InferSchemaType } from "mongoose";

const dispenseSchema = new Schema(
  {
    prescriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Prescription",
      required: true,
      index: true
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true
    },
    pharmacistId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    medicineName: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    dosage: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    status: {
      type: String,
      enum: ["pending", "dispensed", "partial", "cancelled"],
      default: "pending",
      index: true
    },
    dispensedAt: {
      type: Date,
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

dispenseSchema.index({ patientId: 1, status: 1, dispensedAt: -1 });
dispenseSchema.index({ pharmacistId: 1, status: 1, createdAt: -1 });

export type Dispense = InferSchemaType<typeof dispenseSchema>;
export const DispenseModel = mongoose.model("Dispense", dispenseSchema);
