import { Router } from "express";

import { AppointmentController } from "./appointment-controller.js";
import {
  appointmentIdSchema,
  createAppointmentSchema,
  updateAppointmentSchema
} from "./appointment-validation.js";
import { validateRequest } from "../../middlewares/validate-request.js";

export const appointmentRouter = Router();

appointmentRouter.post("/", validateRequest(createAppointmentSchema), (req, res) =>
  AppointmentController.createAppointment(req, res)
);
appointmentRouter.get("/", (req, res) => AppointmentController.getAppointments(req, res));
appointmentRouter.get("/:id", validateRequest(appointmentIdSchema), (req, res) =>
  AppointmentController.getAppointmentById(req, res)
);
appointmentRouter.patch(
  "/:id",
  validateRequest(appointmentIdSchema),
  validateRequest(updateAppointmentSchema),
  (req, res) => AppointmentController.updateAppointment(req, res)
);
appointmentRouter.delete("/:id", validateRequest(appointmentIdSchema), (req, res) =>
  AppointmentController.deleteAppointment(req, res)
);
