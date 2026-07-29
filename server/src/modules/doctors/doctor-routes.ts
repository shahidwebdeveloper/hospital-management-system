import { Router } from "express";

import { DoctorController } from "./doctor-controller.js";
import { createDoctorSchema, doctorIdSchema, updateDoctorSchema } from "./doctor-validation.js";
import { validateRequest } from "../../middlewares/validate-request.js";

export const doctorRouter = Router();

doctorRouter.post("/", validateRequest(createDoctorSchema), (req, res) =>
  DoctorController.createDoctor(req, res)
);
doctorRouter.get("/", (req, res) => DoctorController.getDoctors(req, res));
doctorRouter.get("/:id", validateRequest(doctorIdSchema), (req, res) =>
  DoctorController.getDoctorById(req, res)
);
doctorRouter.patch(
  "/:id",
  validateRequest(doctorIdSchema),
  validateRequest(updateDoctorSchema),
  (req, res) => DoctorController.updateDoctor(req, res)
);
doctorRouter.delete("/:id", validateRequest(doctorIdSchema), (req, res) =>
  DoctorController.deleteDoctor(req, res)
);
