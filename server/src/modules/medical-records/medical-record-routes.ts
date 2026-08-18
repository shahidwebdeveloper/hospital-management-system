import { Router } from "express";

import { authorizePermission } from "../../middlewares/authorize.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import { MedicalRecordController } from "./medical-record-controller.js";
import {
  createMedicalRecordSchema,
  medicalRecordIdSchema,
  updateMedicalRecordSchema
} from "./medical-record-validation.js";

export const medicalRecordRouter = Router();

medicalRecordRouter.post("/", authorizePermission("medical-records:create"), validateRequest(createMedicalRecordSchema), (req, res) =>
  MedicalRecordController.createMedicalRecord(req, res)
);
medicalRecordRouter.get("/", authorizePermission("medical-records:view"), (req, res) =>
  MedicalRecordController.getMedicalRecords(req, res)
);
medicalRecordRouter.get("/:id", authorizePermission("medical-records:view"), validateRequest(medicalRecordIdSchema), (req, res) =>
  MedicalRecordController.getMedicalRecordById(req, res)
);
medicalRecordRouter.patch(
  "/:id",
  authorizePermission("medical-records:update"),
  validateRequest(medicalRecordIdSchema),
  validateRequest(updateMedicalRecordSchema),
  (req, res) => MedicalRecordController.updateMedicalRecord(req, res)
);
medicalRecordRouter.delete("/:id", authorizePermission("medical-records:delete"), validateRequest(medicalRecordIdSchema), (req, res) =>
  MedicalRecordController.deleteMedicalRecord(req, res)
);
