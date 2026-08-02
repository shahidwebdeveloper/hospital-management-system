export type InvoiceStatus = "draft" | "unpaid" | "part_paid" | "paid" | "refunded" | "cancelled";

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  category?: string;
}
