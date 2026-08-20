import { Router } from "express";

import { authorizePermission } from "../../middlewares/authorize.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import { PrescriptionController } from "./prescription-controller.js";
import {
  createPrescriptionSchema,
  prescriptionIdSchema,
  updatePrescriptionSchema
} from "./prescription-validation.js";

export const prescriptionRouter = Router();

prescriptionRouter.post("/", authorizePermission("prescriptions:create"), validateRequest(createPrescriptionSchema), (req, res, next) =>
  PrescriptionController.createPrescription(req, res, next)
);
prescriptionRouter.get("/", authorizePermission("prescriptions:view"), (req, res, next) =>
  PrescriptionController.getPrescriptions(req, res, next)
);
prescriptionRouter.get("/:id", authorizePermission("prescriptions:view"), validateRequest(prescriptionIdSchema), (req, res, next) =>
  PrescriptionController.getPrescriptionById(req, res, next)
);
prescriptionRouter.patch(
  "/:id",
  authorizePermission("prescriptions:update"),
  validateRequest(prescriptionIdSchema),
  validateRequest(updatePrescriptionSchema),
  (req, res, next) => PrescriptionController.updatePrescription(req, res, next)
);
prescriptionRouter.delete("/:id", authorizePermission("prescriptions:delete"), validateRequest(prescriptionIdSchema), (req, res, next) =>
  PrescriptionController.deletePrescription(req, res, next)
);
