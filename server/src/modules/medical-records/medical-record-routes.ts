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

medicalRecordRouter.post("/", authorizePermission("medical-records:create"), validateRequest(createMedicalRecordSchema), (req, res, next) =>
  MedicalRecordController.createMedicalRecord(req, res, next)
);
medicalRecordRouter.get("/", authorizePermission("medical-records:view"), (req, res, next) =>
  MedicalRecordController.getMedicalRecords(req, res, next)
);
medicalRecordRouter.get("/:id", authorizePermission("medical-records:view"), validateRequest(medicalRecordIdSchema), (req, res, next) =>
  MedicalRecordController.getMedicalRecordById(req, res, next)
);
medicalRecordRouter.patch(
  "/:id",
  authorizePermission("medical-records:update"),
  validateRequest(medicalRecordIdSchema),
  validateRequest(updateMedicalRecordSchema),
  (req, res, next) => MedicalRecordController.updateMedicalRecord(req, res, next)
);
medicalRecordRouter.delete("/:id", authorizePermission("medical-records:delete"), validateRequest(medicalRecordIdSchema), (req, res, next) =>
  MedicalRecordController.deleteMedicalRecord(req, res, next)
);
