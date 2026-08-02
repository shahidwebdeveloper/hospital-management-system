import { Router } from "express";
import { BillingController } from "./billing-controller.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import { createInvoiceSchema, updateInvoiceSchema, invoiceIdSchema } from "./billing-validation.js";

export const billingRouter = Router();

billingRouter.post("/", validateRequest(createInvoiceSchema), (req, res, next) =>
  BillingController.createInvoice(req, res, next)
);

billingRouter.get("/", (req, res, next) => BillingController.getAllInvoices(req, res, next));

billingRouter.get("/:id", validateRequest(invoiceIdSchema), (req, res, next) =>
  BillingController.getInvoiceById(req, res, next)
);

billingRouter.patch(
  "/:id",
  validateRequest(invoiceIdSchema),
  validateRequest(updateInvoiceSchema),
  (req, res, next) => BillingController.updateInvoice(req, res, next)
);

billingRouter.delete("/:id", validateRequest(invoiceIdSchema), (req, res, next) =>
  BillingController.deleteInvoice(req, res, next)
);
