import type { NextFunction, Request, Response } from "express";

import { DoctorService } from "./doctor-service.js";
import { createDoctorSchema, updateDoctorSchema } from "./doctor-validation.js";

export class DoctorController {
  static async createDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createDoctorSchema.parse(req.validatedBody ?? req.body);
      const doctor = await DoctorService.createDoctor(validatedData);

      return res.status(201).json({
        success: true,
        message: "Doctor created successfully.",
        data: doctor
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDoctors(req: Request, res: Response, next: NextFunction) {
    try {
      const search = typeof req.query.search === "string" ? req.query.search : "";
      const doctors = await DoctorService.getDoctors(search);
      return res.status(200).json({ success: true, data: doctors });
    } catch (error) {
      next(error);
    }
  }

  static async getDoctorById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ success: false, message: "Invalid doctor id." });
      }

      const doctor = await DoctorService.getDoctorById(id);
      if (!doctor) {
        return res.status(404).json({ success: false, message: "Doctor not found." });
      }

      return res.status(200).json({ success: true, data: doctor });
    } catch (error) {
      next(error);
    }
  }

  static async updateDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ success: false, message: "Invalid doctor id." });
      }

      const validatedData = updateDoctorSchema.parse(req.validatedBody ?? req.body);
      const doctor = await DoctorService.updateDoctor(id, validatedData);

      if (!doctor) {
        return res.status(404).json({ success: false, message: "Doctor not found." });
      }

      return res
        .status(200)
        .json({ success: true, message: "Doctor updated successfully.", data: doctor });
    } catch (error) {
      next(error);
    }
  }

  static async deleteDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ success: false, message: "Invalid doctor id." });
      }

      const doctor = await DoctorService.deleteDoctor(id);
      if (!doctor) {
        return res.status(404).json({ success: false, message: "Doctor not found." });
      }

      return res.status(200).json({ success: true, message: "Doctor deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
}
