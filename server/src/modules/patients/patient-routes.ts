import { Router } from "express";

import { PatientController } from "./patient-controller.js";

import { createPatientSchema, updatePatientSchema, patientIdSchema } from "./patient-validation.js";

import { validateRequest } from "../../middlewares/validate-request.js";

export const patientRouter = Router();

/**
 * Create Patient
 * POST /patients
 */
patientRouter.post("/", validateRequest(createPatientSchema), (req, res) =>
  PatientController.createPatient(req, res)
);

/**
 * Get All Patients
 * GET /patients
 */
patientRouter.get("/", (req, res) => PatientController.getPatients(req, res));

/**
 * Get Patient By ID
 * GET /patients/:id
 */
patientRouter.get("/:id", validateRequest(patientIdSchema), (req, res) =>
  PatientController.getPatientById(req, res)
);

/**
 * Update Patient
 * PATCH /patients/:id
 */
patientRouter.patch(
  "/:id",

  validateRequest(patientIdSchema),

  validateRequest(updatePatientSchema),

  (req, res) => PatientController.updatePatient(req, res)
);

/**
 * Delete Patient
 * DELETE /patients/:id
 */
patientRouter.delete(
  "/:id",

  validateRequest(patientIdSchema),

  (req, res) => PatientController.deletePatient(req, res)
);
