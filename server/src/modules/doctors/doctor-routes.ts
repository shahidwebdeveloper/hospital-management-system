import { Router } from "express";

import { authorizePermission } from "../../middlewares/authorize.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import { DoctorController } from "./doctor-controller.js";
import { createDoctorSchema, doctorIdSchema, updateDoctorSchema } from "./doctor-validation.js";

export const doctorRouter = Router();

doctorRouter.post("/", authorizePermission("doctors:create"), validateRequest(createDoctorSchema), (req, res, next) =>
  DoctorController.createDoctor(req, res, next)
);
doctorRouter.get("/", authorizePermission("doctors:view"), (req, res, next) => DoctorController.getDoctors(req, res, next));
doctorRouter.get("/:id", authorizePermission("doctors:view"), validateRequest(doctorIdSchema), (req, res, next) =>
  DoctorController.getDoctorById(req, res, next)
);
doctorRouter.patch(
  "/:id",
  authorizePermission("doctors:update"),
  validateRequest(doctorIdSchema),
  validateRequest(updateDoctorSchema),
  (req, res, next) => DoctorController.updateDoctor(req, res, next)
);
doctorRouter.delete("/:id", authorizePermission("doctors:delete"), validateRequest(doctorIdSchema), (req, res, next) =>
  DoctorController.deleteDoctor(req, res, next)
);
