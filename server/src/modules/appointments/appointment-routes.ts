import { Router } from "express";

import { authorizePermission } from "../../middlewares/authorize.js";
import { authorizeResource } from "../../middlewares/authorize-resource.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import { AppointmentController } from "./appointment-controller.js";
import {
  appointmentIdSchema,
  createAppointmentSchema,
  updateAppointmentSchema
} from "./appointment-validation.js";

export const appointmentRouter = Router();

appointmentRouter.post("/", authorizePermission("appointments:create"), validateRequest(createAppointmentSchema), (req, res, next) =>
  AppointmentController.createAppointment(req, res, next)
);
appointmentRouter.get("/", authorizePermission("appointments:view"), (req, res, next) =>
  AppointmentController.getAppointments(req, res, next)
);
appointmentRouter.get("/:id", authorizePermission("appointments:view"), validateRequest(appointmentIdSchema), authorizeResource("appointment"), (req, res, next) =>
  AppointmentController.getAppointmentById(req, res, next)
);
appointmentRouter.patch(
  "/:id",
  authorizePermission("appointments:update"),
  validateRequest(appointmentIdSchema),
  authorizeResource("appointment"),
  validateRequest(updateAppointmentSchema),
  (req, res, next) => AppointmentController.updateAppointment(req, res, next)
);
appointmentRouter.delete("/:id", authorizePermission("appointments:delete"), validateRequest(appointmentIdSchema), authorizeResource("appointment"), (req, res, next) =>
  AppointmentController.deleteAppointment(req, res, next)
);
