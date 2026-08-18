import { Router } from "express";

import { authorizePermission } from "../../middlewares/authorize.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import { DoctorController } from "./doctor-controller.js";
import { createDoctorSchema, doctorIdSchema, updateDoctorSchema } from "./doctor-validation.js";

export const doctorRouter = Router();

doctorRouter.post("/", authorizePermission("doctors:create"), validateRequest(createDoctorSchema), (req, res) =>
  DoctorController.createDoctor(req, res)
);
doctorRouter.get("/", authorizePermission("doctors:view"), (req, res) => DoctorController.getDoctors(req, res));
doctorRouter.get("/:id", authorizePermission("doctors:view"), validateRequest(doctorIdSchema), (req, res) =>
  DoctorController.getDoctorById(req, res)
);
doctorRouter.patch(
  "/:id",
  authorizePermission("doctors:update"),
  validateRequest(doctorIdSchema),
  validateRequest(updateDoctorSchema),
  (req, res) => DoctorController.updateDoctor(req, res)
);
doctorRouter.delete("/:id", authorizePermission("doctors:delete"), validateRequest(doctorIdSchema), (req, res) =>
  DoctorController.deleteDoctor(req, res)
);
