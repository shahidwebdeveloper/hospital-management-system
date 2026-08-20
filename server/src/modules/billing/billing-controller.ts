import type { Request, Response, NextFunction } from "express";

import { BillingService } from "./billing-service.js";
import { resourceScope } from "../../middlewares/authorize-resource.js";
import { createInvoiceSchema, updateInvoiceSchema, invoiceIdSchema } from "./billing-validation.js";

export class BillingController {
  static async createInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createInvoiceSchema.parse(req.body);
      const invoice = await BillingService.createInvoice(data);

      return res.status(201).json({
        success: true,
        message: "Invoice created successfully.",
        data: invoice
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllInvoices(_req: Request, res: Response, next: NextFunction) {
    try {
      const invoices = await BillingService.getAllInvoices(await resourceScope("invoice", _req.user!));
      return res.status(200).json({ success: true, data: invoices });
    } catch (error) {
      next(error);
    }
  }

  static async getInvoiceById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = invoiceIdSchema.parse({ params: req.params }).params.id;
      const invoice = await BillingService.getInvoiceById(id);

      if (!invoice) {
        return res.status(404).json({ success: false, message: "Invoice not found." });
      }

      return res.status(200).json({ success: true, data: invoice });
    } catch (error) {
      next(error);
    }
  }

  static async updateInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const id = invoiceIdSchema.parse({ params: req.params }).params.id;
      const data = updateInvoiceSchema.parse(req.body);
      const invoice = await BillingService.updateInvoice(id, data);

      if (!invoice) {
        return res.status(404).json({ success: false, message: "Invoice not found." });
      }

      return res.status(200).json({
        success: true,
        message: "Invoice updated successfully.",
        data: invoice
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const id = invoiceIdSchema.parse({ params: req.params }).params.id;
      const invoice = await BillingService.deleteInvoice(id);

      if (!invoice) {
        return res.status(404).json({ success: false, message: "Invoice not found." });
      }

      return res.status(200).json({ success: true, message: "Invoice deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
}
