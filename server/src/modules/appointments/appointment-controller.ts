import type { NextFunction, Request, Response } from "express";

import { AppointmentService } from "./appointment-service.js";
import { resourceScope } from "../../middlewares/authorize-resource.js";
import { createAppointmentSchema, updateAppointmentSchema } from "./appointment-validation.js";

export class AppointmentController {
  static async createAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createAppointmentSchema.parse(req.validatedBody ?? req.body);
      const appointment = await AppointmentService.createAppointment(validatedData);

      return res
        .status(201)
        .json({ success: true, message: "Appointment created successfully.", data: appointment });
    } catch (error) {
      next(error);
    }
  }

  static async getAppointments(_req: Request, res: Response, next: NextFunction) {
    try {
      const appointments = await AppointmentService.getAppointments(await resourceScope("appointment", _req.user!));
      return res.status(200).json({ success: true, data: appointments });
    } catch (error) {
      next(error);
    }
  }

  static async getAppointmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ success: false, message: "Invalid appointment id." });
      }

      const appointment = await AppointmentService.getAppointmentById(id);
      if (!appointment) {
        return res.status(404).json({ success: false, message: "Appointment not found." });
      }

      return res.status(200).json({ success: true, data: appointment });
    } catch (error) {
      next(error);
    }
  }

  static async updateAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ success: false, message: "Invalid appointment id." });
      }

      const validatedData = updateAppointmentSchema.parse(req.validatedBody ?? req.body);
      const appointment = await AppointmentService.updateAppointment(id, validatedData);

      if (!appointment) {
        return res.status(404).json({ success: false, message: "Appointment not found." });
      }

      return res
        .status(200)
        .json({ success: true, message: "Appointment updated successfully.", data: appointment });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ success: false, message: "Invalid appointment id." });
      }

      const appointment = await AppointmentService.deleteAppointment(id);
      if (!appointment) {
        return res.status(404).json({ success: false, message: "Appointment not found." });
      }

      return res.status(200).json({ success: true, message: "Appointment deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
}
