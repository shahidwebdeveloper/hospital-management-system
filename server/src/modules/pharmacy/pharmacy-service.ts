import { Types } from "mongoose";
import { Medicine } from "./pharmacy-model.js";
import type { CreateMedicineInput, UpdateMedicineInput } from "./pharmacy-validation.js";
import { MedicineStatus } from "./pharmacy-types.js";

function getMedicineStatus(stock: number, expiryDate: Date, reorderLevel: number): MedicineStatus {
  const now = new Date();

  if (expiryDate < now) {
    return "expired";
  }

  if (stock <= 0) {
    return "out_of_stock";
  }

  if (stock <= reorderLevel) {
    return "low_stock";
  }

  return "in_stock";
}

type NormalizedMedicineInput = Omit<Partial<CreateMedicineInput>, "expiryDate"> & {
  expiryDate?: Date;
};

function normalizeMedicineInput(data: CreateMedicineInput | UpdateMedicineInput): NormalizedMedicineInput {
  return {
    ...data,
    expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined
  };
}

export class PharmacyService {
  static async createMedicine(data: CreateMedicineInput) {
    const normalized = normalizeMedicineInput(data);
    const stock = normalized.stock ?? 0;
    const expiryDate = normalized.expiryDate ?? new Date(data.expiryDate);
    const reorderLevel = normalized.reorderLevel ?? 0;
    const status = getMedicineStatus(stock, expiryDate, reorderLevel);

    return await Medicine.create({
      ...normalized,
      stock,
      expiryDate,
      reorderLevel,
      status,
      lastRestockedAt: new Date()
    });
  }

  static async getAllMedicines() {
    return await Medicine.find().sort({ name: 1 });
  }

  static async getMedicineById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid medicine id.");
    }

    return await Medicine.findById(id);
  }

  static async updateMedicine(id: string, data: UpdateMedicineInput) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid medicine id.");
    }

    const normalized = normalizeMedicineInput(data);
    const existing = await Medicine.findById(id);

    if (!existing) {
      return null;
    }

    const stock = normalized.stock ?? existing.stock;
    const expiryDate = normalized.expiryDate ?? existing.expiryDate;
    const reorderLevel = normalized.reorderLevel ?? existing.reorderLevel;
    const status = getMedicineStatus(stock, expiryDate, reorderLevel);

    return await Medicine.findByIdAndUpdate(
      id,
      {
        ...normalized,
        status,
        lastRestockedAt: normalized.stock !== undefined ? new Date() : existing.lastRestockedAt
      },
      {
        new: true,
        runValidators: true
      }
    );
  }

  static async deleteMedicine(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid medicine id.");
    }

    return await Medicine.findByIdAndDelete(id);
  }
}