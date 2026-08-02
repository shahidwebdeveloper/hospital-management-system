import { Types } from "mongoose";
import { InvoiceModel } from "./billing-model.js";
import type { CreateInvoiceInput, UpdateInvoiceInput } from "./billing-validation.js";
import { InvoiceStatus } from "./billing-types.js";

function calculateTotals(items: Array<{ quantity: number; unitPrice: number }>) {
  return items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
}

function buildLineItems(items: Array<Partial<CreateInvoiceInput["items"][number]>>) {
  return items.map((item) => {
    const quantity = item.quantity ?? 1;
    const unitPrice = item.unitPrice ?? 0;
    return {
      description: item.description ?? "",
      category: item.category ?? "",
      quantity,
      unitPrice,
      amount: quantity * unitPrice
    };
  });
}

function getDefaultStatus(status: InvoiceStatus, totalAmount: number, paidAmount: number) {
  if (status && status !== "draft") {
    return status;
  }

  if (paidAmount >= totalAmount && totalAmount > 0) {
    return "paid";
  }

  if (paidAmount > 0) {
    return "part_paid";
  }

  if (totalAmount > 0) {
    return "unpaid";
  }

  return "draft";
}

function normalizeInvoiceInput(data: CreateInvoiceInput | UpdateInvoiceInput) {
  return {
    ...data,
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    items: data.items ? buildLineItems(data.items) : undefined,
    paidAmount: data.paidAmount ?? 0
  };
}

export class BillingService {
  static async createInvoice(data: CreateInvoiceInput) {
    const normalized = normalizeInvoiceInput(data);
    const items = normalized.items ?? [];
    const subtotal = calculateTotals(items);
    const totalAmount = subtotal;
    const paidAmount = normalized.paidAmount ?? 0;
    const balance = Math.max(totalAmount - paidAmount, 0);
    const status = getDefaultStatus(normalized.status, totalAmount, paidAmount);

    return await InvoiceModel.create({
      invoiceNumber: normalized.invoiceNumber ?? `INV-${Date.now()}`,
      patientId: normalized.patientId,
      patientName: normalized.patientName ?? "",
      items,
      subtotal,
      totalAmount,
      paidAmount,
      balance,
      status,
      paymentMethod: normalized.paymentMethod ?? "",
      notes: normalized.notes ?? "",
      dueDate: normalized.dueDate,
      issuedAt: new Date()
    });
  }

  static async getAllInvoices() {
    return await InvoiceModel.find().sort({ createdAt: -1 });
  }

  static async getInvoiceById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid invoice id.");
    }

    return await InvoiceModel.findById(id);
  }

  static async updateInvoice(id: string, data: UpdateInvoiceInput) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid invoice id.");
    }

    const existing = await InvoiceModel.findById(id);

    if (!existing) {
      return null;
    }

    const normalized = normalizeInvoiceInput(data);
    const items = normalized.items ?? existing.items;
    const subtotal = calculateTotals(items);
    const totalAmount = subtotal;
    const paidAmount = normalized.paidAmount ?? existing.paidAmount;
    const balance = Math.max(totalAmount - paidAmount, 0);
    const status = getDefaultStatus(normalized.status ?? existing.status, totalAmount, paidAmount);

    return await InvoiceModel.findByIdAndUpdate(
      id,
      {
        invoiceNumber: normalized.invoiceNumber ?? existing.invoiceNumber,
        patientId: normalized.patientId ?? existing.patientId,
        patientName: normalized.patientName ?? existing.patientName,
        items,
        subtotal,
        totalAmount,
        paidAmount,
        balance,
        status,
        paymentMethod: normalized.paymentMethod ?? existing.paymentMethod,
        notes: normalized.notes ?? existing.notes,
        dueDate: normalized.dueDate ?? existing.dueDate
      },
      {
        new: true,
        runValidators: true
      }
    );
  }

  static async deleteInvoice(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid invoice id.");
    }

    return await InvoiceModel.findByIdAndDelete(id);
  }
}
