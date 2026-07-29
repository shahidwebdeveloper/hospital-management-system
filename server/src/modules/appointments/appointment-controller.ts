import type { Request, Response } from "express";

import { AppointmentService } from "./appointment-service.js";
import { createAppointmentSchema, updateAppointmentSchema } from "./appointment-validation.js";

export class AppointmentController {
  static async createAppointment(req: Request, res: Response) {
    try {
      const validatedData = createAppointmentSchema.parse(req.validatedBody ?? req.body);
      const appointment = await AppointmentService.createAppointment(validatedData);

      return res
        .status(201)
        .json({ success: true, message: "Appointment created successfully.", data: appointment });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to create appointment.", error });
    }
  }

  static async getAppointments(_req: Request, res: Response) {
    try {
      const appointments = await AppointmentService.getAppointments();
      return res.status(200).json({ success: true, data: appointments });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch appointments.", error });
    }
  }

  static async getAppointmentById(req: Request, res: Response) {
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
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch appointment.", error });
    }
  }

  static async updateAppointment(req: Request, res: Response) {
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
      return res
        .status(500)
        .json({ success: false, message: "Failed to update appointment.", error });
    }
  }

  static async deleteAppointment(req: Request, res: Response) {
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
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete appointment.", error });
    }
  }
}
