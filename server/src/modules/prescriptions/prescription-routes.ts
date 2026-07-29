import { Router } from "express";

import { PrescriptionController } from "./prescription-controller.js";
import {
  createPrescriptionSchema,
  prescriptionIdSchema,
  updatePrescriptionSchema
} from "./prescription-validation.js";
import { validateRequest } from "../../middlewares/validate-request.js";

export const prescriptionRouter = Router();

prescriptionRouter.post("/", validateRequest(createPrescriptionSchema), (req, res) =>
  PrescriptionController.createPrescription(req, res)
);
prescriptionRouter.get("/", (req, res) => PrescriptionController.getPrescriptions(req, res));
prescriptionRouter.get("/:id", validateRequest(prescriptionIdSchema), (req, res) =>
  PrescriptionController.getPrescriptionById(req, res)
);
prescriptionRouter.patch(
  "/:id",
  validateRequest(prescriptionIdSchema),
  validateRequest(updatePrescriptionSchema),
  (req, res) => PrescriptionController.updatePrescription(req, res)
);
prescriptionRouter.delete("/:id", validateRequest(prescriptionIdSchema), (req, res) =>
  PrescriptionController.deletePrescription(req, res)
);
