import { Router } from "express";

import { authorizePermission } from "../../middlewares/authorize.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import { BillingController } from "./billing-controller.js";
import { createInvoiceSchema, invoiceIdSchema, updateInvoiceSchema } from "./billing-validation.js";

export const billingRouter = Router();

billingRouter.post("/", authorizePermission("billing:create"), validateRequest(createInvoiceSchema), (req, res, next) =>
  BillingController.createInvoice(req, res, next)
);
billingRouter.get("/", authorizePermission("billing:view"), (req, res, next) =>
  BillingController.getAllInvoices(req, res, next)
);
billingRouter.get("/:id", authorizePermission("billing:view"), validateRequest(invoiceIdSchema), (req, res, next) =>
  BillingController.getInvoiceById(req, res, next)
);
billingRouter.patch(
  "/:id",
  authorizePermission("billing:update"),
  validateRequest(invoiceIdSchema),
  validateRequest(updateInvoiceSchema),
  (req, res, next) => BillingController.updateInvoice(req, res, next)
);
billingRouter.delete("/:id", authorizePermission("billing:delete"), validateRequest(invoiceIdSchema), (req, res, next) =>
  BillingController.deleteInvoice(req, res, next)
);
