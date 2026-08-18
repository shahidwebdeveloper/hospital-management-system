import { Router } from "express";

import { appRoles } from "@hms/contracts";

import { authorize, authorizePermission } from "../../middlewares/authorize.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import { PatientController } from "./patient-controller.js";
import { createPatientSchema, patientIdSchema, updatePatientSchema } from "./patient-validation.js";

export const patientRouter = Router();

patientRouter.get("/me", authorize(appRoles), (req, res) =>
  PatientController.getCurrentPatient(req, res)
);

patientRouter.post("/", authorizePermission("patients:create"), validateRequest(createPatientSchema), (req, res) =>
  PatientController.createPatient(req, res)
);

patientRouter.get("/", authorizePermission("patients:view"), (req, res) => PatientController.getPatients(req, res));

patientRouter.get("/:id", authorizePermission("patients:view"), validateRequest(patientIdSchema), (req, res) =>
  PatientController.getPatientById(req, res)
);

patientRouter.patch(
  "/:id",
  authorizePermission("patients:update"),
  validateRequest(patientIdSchema),
  validateRequest(updatePatientSchema),
  (req, res) => PatientController.updatePatient(req, res)
);

patientRouter.delete("/:id", authorizePermission("patients:delete"), validateRequest(patientIdSchema), (req, res) =>
  PatientController.deletePatient(req, res)
);
