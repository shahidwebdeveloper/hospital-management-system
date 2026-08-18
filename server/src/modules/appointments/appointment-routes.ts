import { Router } from "express";

import { authorizePermission } from "../../middlewares/authorize.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import { AppointmentController } from "./appointment-controller.js";
import {
  appointmentIdSchema,
  createAppointmentSchema,
  updateAppointmentSchema
} from "./appointment-validation.js";

export const appointmentRouter = Router();

appointmentRouter.post("/", authorizePermission("appointments:create"), validateRequest(createAppointmentSchema), (req, res) =>
  AppointmentController.createAppointment(req, res)
);
appointmentRouter.get("/", authorizePermission("appointments:view"), (req, res) =>
  AppointmentController.getAppointments(req, res)
);
appointmentRouter.get("/:id", authorizePermission("appointments:view"), validateRequest(appointmentIdSchema), (req, res) =>
  AppointmentController.getAppointmentById(req, res)
);
appointmentRouter.patch(
  "/:id",
  authorizePermission("appointments:update"),
  validateRequest(appointmentIdSchema),
  validateRequest(updateAppointmentSchema),
  (req, res) => AppointmentController.updateAppointment(req, res)
);
appointmentRouter.delete("/:id", authorizePermission("appointments:delete"), validateRequest(appointmentIdSchema), (req, res) =>
  AppointmentController.deleteAppointment(req, res)
);
