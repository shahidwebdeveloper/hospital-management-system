import { Router } from "express";

import { MedicalRecordController } from "./medical-record-controller.js";
import {
  createMedicalRecordSchema,
  medicalRecordIdSchema,
  updateMedicalRecordSchema
} from "./medical-record-validation.js";
import { validateRequest } from "../../middlewares/validate-request.js";

export const medicalRecordRouter = Router();

medicalRecordRouter.post("/", validateRequest(createMedicalRecordSchema), (req, res) =>
  MedicalRecordController.createMedicalRecord(req, res)
);
medicalRecordRouter.get("/", (req, res) => MedicalRecordController.getMedicalRecords(req, res));
medicalRecordRouter.get("/:id", validateRequest(medicalRecordIdSchema), (req, res) =>
  MedicalRecordController.getMedicalRecordById(req, res)
);
medicalRecordRouter.patch(
  "/:id",
  validateRequest(medicalRecordIdSchema),
  validateRequest(updateMedicalRecordSchema),
  (req, res) => MedicalRecordController.updateMedicalRecord(req, res)
);
medicalRecordRouter.delete("/:id", validateRequest(medicalRecordIdSchema), (req, res) =>
  MedicalRecordController.deleteMedicalRecord(req, res)
);
