export type InvoiceStatus = "draft" | "unpaid" | "part_paid" | "paid" | "refunded" | "cancelled";

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  category?: string;
}

export interface Invoice {
  _id?: string;
  invoiceNumber: string;
  patientId: string;
  patientName?: string;
  items: InvoiceLineItem[];
  subtotal: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: InvoiceStatus;
  paymentMethod?: string;
  notes?: string;
  issuedAt?: string;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInvoice {
  invoiceNumber?: string;
  patientId: string;
  patientName?: string;
  items: InvoiceLineItem[];
  paidAmount: number;
  status: InvoiceStatus;
  paymentMethod?: string;
  notes?: string;
  dueDate?: string;
}

export type UpdateInvoice = Partial<CreateInvoice>;
