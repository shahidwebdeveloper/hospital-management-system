import { z } from "zod";
import { MedicineStatus } from "./pharmacy-types.js";

export const createMedicineSchema = z.object({
  name: z.string().trim().min(2, "Medicine name is required"),
  category: z.string().trim().min(2, "Category is required"),
  stock: z.number().min(0, "Stock must be at least 0"),
  price: z.number().min(0, "Price must be at least 0"),
  supplier: z.string().trim().min(2, "Supplier is required"),
  expiryDate: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Expiry date must be a valid date"
  }),
  reorderLevel: z.number().min(0, "Reorder level must be at least 0")
});

export const updateMedicineSchema = createMedicineSchema.partial();

export const medicineIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Medicine ID is required")
  })
});

export type CreateMedicineInput = z.infer<typeof createMedicineSchema>;
export type UpdateMedicineInput = z.infer<typeof updateMedicineSchema>;
