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

prescriptionRouter.post("/", authorizePermission("prescriptions:create"), validateRequest(createPrescriptionSchema), (req, res) =>
  PrescriptionController.createPrescription(req, res)
);
prescriptionRouter.get("/", authorizePermission("prescriptions:view"), (req, res) =>
  PrescriptionController.getPrescriptions(req, res)
);
prescriptionRouter.get("/:id", authorizePermission("prescriptions:view"), validateRequest(prescriptionIdSchema), (req, res) =>
  PrescriptionController.getPrescriptionById(req, res)
);
prescriptionRouter.patch(
  "/:id",
  authorizePermission("prescriptions:update"),
  validateRequest(prescriptionIdSchema),
  validateRequest(updatePrescriptionSchema),
  (req, res) => PrescriptionController.updatePrescription(req, res)
);
prescriptionRouter.delete("/:id", authorizePermission("prescriptions:delete"), validateRequest(prescriptionIdSchema), (req, res) =>
  PrescriptionController.deletePrescription(req, res)
);
