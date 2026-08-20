import { Router } from "express";

import { appRoles } from "@hms/contracts";

import { authorize, authorizePermission } from "../../middlewares/authorize.js";
import { authorizeResource } from "../../middlewares/authorize-resource.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import { PatientController } from "./patient-controller.js";
import { createPatientSchema, patientIdSchema, updatePatientSchema } from "./patient-validation.js";

export const patientRouter = Router();

patientRouter.get("/me", authorize(appRoles), (req, res, next) =>
  PatientController.getCurrentPatient(req, res, next)
);

patientRouter.post("/", authorizePermission("patients:create"), validateRequest(createPatientSchema), (req, res, next) =>
  PatientController.createPatient(req, res, next)
);

patientRouter.get("/", authorizePermission("patients:view"), (req, res, next) => PatientController.getPatients(req, res, next));

patientRouter.get("/:id", authorizePermission("patients:view"), validateRequest(patientIdSchema), authorizeResource("patient"), (req, res, next) =>
  PatientController.getPatientById(req, res, next)
);

patientRouter.patch(
  "/:id",
  authorizePermission("patients:update"),
  validateRequest(patientIdSchema),
  authorizeResource("patient"),
  validateRequest(updatePatientSchema),
  (req, res, next) => PatientController.updatePatient(req, res, next)
);

patientRouter.delete("/:id", authorizePermission("patients:delete"), validateRequest(patientIdSchema), authorizeResource("patient"), (req, res, next) =>
  PatientController.deletePatient(req, res, next)
);
