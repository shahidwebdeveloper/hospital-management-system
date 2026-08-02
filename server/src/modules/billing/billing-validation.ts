import { z } from "zod";
import { InvoiceStatus } from "./billing-types.js";

export const invoiceLineItemSchema = z.object({
  description: z.string().trim().min(2, "Line item description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1").default(1),
  unitPrice: z.number().min(0, "Unit price must be at least 0"),
  amount: z.number().min(0, "Line total must be at least 0").optional(),
  category: z.string().trim().optional()
});

export const createInvoiceSchema = z.object({
  invoiceNumber: z.string().trim().optional(),
  patientId: z.string().trim().min(1, "Patient ID is required"),
  patientName: z.string().trim().optional(),
  items: z.array(invoiceLineItemSchema).min(1, "At least one line item is required"),
  paidAmount: z.number().min(0, "Paid amount must be at least 0").default(0),
  status: z
    .enum(["draft", "unpaid", "part_paid", "paid", "refunded", "cancelled"])
    .default("draft"),
  paymentMethod: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  dueDate: z.string().optional()
});

export const updateInvoiceSchema = createInvoiceSchema.partial();

export const invoiceIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Invoice ID is required")
  })
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
