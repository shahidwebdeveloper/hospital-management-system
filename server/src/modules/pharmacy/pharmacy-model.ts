import { model, Schema } from "mongoose";
import type { IMedicine } from "./pharmacy-types.js";
import { MedicineStatus } from "./pharmacy-types.js";

const medicineSchema = new Schema<IMedicine>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    supplier: {
      type: String,
      required: true,
      trim: true
    },
    expiryDate: {
      type: Date,
      required: true
    },
    reorderLevel: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    status: {
      type: String,
      enum: MedicineStatus,
      default: "in_stock"
    },
    lastRestockedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const Medicine = model<IMedicine>("Medicine", medicineSchema);
