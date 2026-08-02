import type { Types } from "mongoose";

export const MedicineStatus = ["in_stock", "low_stock", "out_of_stock", "expired"] as const;

export type MedicineStatus = (typeof MedicineStatus)[number];

export interface IMedicine {
  name: string;
  category: string;
  stock: number;
  price: number;
  supplier: string;
  expiryDate: Date;
  reorderLevel: number;
  status: MedicineStatus;
  lastRestockedAt?: Date;
}
