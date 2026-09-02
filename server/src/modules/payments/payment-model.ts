import mongoose, { Schema, type InferSchemaType } from "mongoose";

const paymentSchema = new Schema(
  {
    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
      index: true
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    method: {
      type: String,
      enum: ["cash", "card", "bank_transfer", "insurance", "wallet"],
      default: "cash",
      index: true
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true
    },
    referenceNumber: {
      type: String,
      trim: true,
      default: "",
      index: true
    },
    paidAt: {
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

paymentSchema.index({ invoiceId: 1, status: 1, paidAt: -1 });
paymentSchema.index({ patientId: 1, status: 1, createdAt: -1 });

export type Payment = InferSchemaType<typeof paymentSchema>;
export const PaymentModel = mongoose.model("Payment", paymentSchema);
