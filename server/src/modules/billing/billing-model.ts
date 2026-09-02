import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { InvoiceStatus } from "./billing-types.js";

const invoiceLineItemSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { _id: false }
);

const invoiceSchema = new Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true
    },
    patientName: {
      type: String,
      trim: true,
      default: ""
    },
    items: {
      type: [invoiceLineItemSchema],
      default: []
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    paidAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    balance: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    status: {
      type: String,
      enum: ["draft", "unpaid", "part_paid", "paid", "refunded", "cancelled"],
      default: "draft",
      index: true
    },
    paymentMethod: {
      type: String,
      trim: true,
      default: ""
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    },
    issuedAt: {
      type: Date,
      default: () => new Date(),
      index: true
    },
    dueDate: {
      type: Date,
      index: true
    }
  },
  {
    timestamps: true
  }
);

invoiceSchema.index({ patientId: 1, status: 1, dueDate: 1 });
invoiceSchema.index({ status: 1, issuedAt: -1 });

export type Invoice = InferSchemaType<typeof invoiceSchema>;
export const InvoiceModel = mongoose.model("Invoice", invoiceSchema);
